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

![Promise](/images/concurrency/Promise.png)



