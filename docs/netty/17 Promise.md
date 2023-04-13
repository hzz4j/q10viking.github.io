---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /netty/
typora-root-url: ..\.vuepress\public
---



::: tip

JDK中提供了一个FutureTask,但是Netty自己又重新写了一个Promise来处理异步获取结果.Promise功能更加强大,他能添加监听器.

并且Promise和FutureTask的线程唤醒机制不同,前者时wait()和notifyall,后者时通过LockSupport.park和LockSupport.unpark.

[FutureTask源码研究](https://q10viking.github.io/concurrency/57%20Future.html)

:::

> 源码研究的部分,看看Promise在Netty的应用.



下面这段代码是netty开发的客户端连接服务器的过程.在connnect的过程中就先直接返回了一个Promise了,

- 这个Promise我们拿到之后,可以添加事件,然后执行sync等待连接成功await

- 然后这个Promise在NioEventLoop中线程中,当监听到连接OP_CONNECT事件的时,处理这个Promise,notiyAll唤醒所有的等待的线程,并设置结果,执行监听器
- 



```java
private void start() throws InterruptedException {
        EventLoopGroup eventLoopGroup = new NioEventLoopGroup();
        EchoClientHandler handler = new EchoClientHandler();
        try{
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(eventLoopGroup)
                    .channel(NioSocketChannel.class)
                    .remoteAddress(new InetSocketAddress(host,port))
                    .handler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) throws Exception {
                            ch.pipeline().addLast(handler);
                        }
                    });
            /**--------------- 源码研究的部分---------------------------*/
            ChannelFuture connect = bootstrap.connect();
            connect.addListener(new GenericFutureListener<Future<? super Void>>() {
                @Override
                public void operationComplete(Future<? super Void> future) throws Exception {
                    System.out.println("Hello World");
                }
            });
            ChannelFuture f = connect.sync();  // 阻塞,研究如何被唤醒
            /**--------------- 源码研究的部分---------------------------*/
            f.channel().closeFuture().sync();
            LOG.info("客户端关闭");
        }finally {
            eventLoopGroup.shutdownGracefully().sync();
        }
    }
```



![image-20230412124136650](/images/netty/image-20230412124136650.png)



## 检测到socket关闭

调试代码channelInactive





## Promise的阻塞与唤醒

```java
synchronized (this) {
    while (!isDone()) {
        incWaiters();
        try {
            wait();
        } finally {
            decWaiters();
        }
    }
}
```

```java
private synchronized boolean checkNotifyWaiters() {
    if (waiters > 0) {
        notifyAll();
    }
    return listeners != null;
}
```



## Promise在Netty线程中的流转

[link](https://www.processon.com/view/link/6436b4ac24c38d10f2ddec56)

<common-progresson-snippet src="https://www.processon.com/view/link/6436b4ac24c38d10f2ddec56"/>

![Promise](/images/concurrency/Promise.png)



## 实现简单的Promise❤️

1. sync等待方法有值直接返回，没有则等待
2. get也是阻塞但是要处理中断
3. 等待过程中的中断处理

### 同步

> 抛出中断异常

```java
 private void await() throws InterruptedException {
        synchronized (this){
            while(!isDone()){
                incWaiters();
                try {
                    wait();
                } finally {
                    decWaiters();
                }
            }
        }
    }
```

> 不抛异常的中断处理

```java
private void awaitUninterruptibly(){
    boolean interrupted = false;
    try {
        synchronized (this){
            while(!isDone()){
                incWaiters();
                try {
                    wait();
                } catch (InterruptedException e){
                    interrupted = true;
                } finally {
                    decWaiters();
                }
            }
        }
    }finally {
        if(interrupted){
            Thread.currentThread().interrupt();
        }
    }
}
```



### 唤醒

```java
    private synchronized boolean checkNotifyWaiters(){
        if(waiters>0){
            notifyAll();
        }
        return listeners != null;
    }
```



### 超时等待

> 获取结果，指定超时时间实现

```java
@Override
public V get(long timeout, TimeUnit unit) throws InterruptedException, TimeoutException {
    if(!isDone()){
        if(!await(timeout,unit)){ // 等待超时还没有获得结果
            throw new TimeoutException(toString());
        }
    }
    if(result == SUCCESS){
        return null;
    }
    return (V)result;
}
```

```java
private boolean await(long timeout, TimeUnit unit ) throws InterruptedException {
    return await0(unit.toMillis(timeout), true);
}

/**
     *
     * @param timeout
     * @param interruptable 是否允许中断异常抛出 为true那么wait过程中被中断就直接抛异常，否则继续等待直到时间耗尽
     * @return
     * @throws InterruptedException
     */
private boolean await0(long timeout, boolean interruptable) throws InterruptedException {
    long startTime = System.currentTimeMillis();
    long waitTime = timeout;

    if(interruptable && Thread.interrupted())
        throw new InterruptedException(toString());
    boolean interrupted = false;
    try {
        for (;;) {
            synchronized (this) {
                if (isDone()) return true;
                try {
                    incWaiters();
                    wait(waitTime);
                } catch (InterruptedException e) {
                    if (interruptable) throw e;
                    else interruptable = true;
                } finally {
                    decWaiters();
                }
            }
            if (isDone()) {
                return true;
            } else {
                // 由于被唤醒或者中断需要继续
                waitTime = timeout - (System.currentTimeMillis() - startTime);
                if(waitTime<=0) // 等待时间耗尽
                    return isDone();
            }

        }
    }finally {
        // 确保中断标志被恢复
        if (interrupted) {
            Thread.currentThread().interrupt();
        }
    }
}
```

