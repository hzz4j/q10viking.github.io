---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /netty/
typora-root-url: ..\.vuepress\public
---



![image-20230411214539451](/images/netty/image-20230411214539451.png)



- EventLoopGroup持有多个EventLoop数组，每个EventLoop如NioEventLoop继承SingleThreadLoop在继承SingleThreadEventExecutor.
- SingleThreadEventExecutor里面持有一个executor为ThreadExecutorMap内部类的Executor,这个内部类包裹着一个ThreadPerTaskExecutor
- 这个ThreadPerTaskExecutor在MultithreadEventExecutorGroup构造函数中创建，最后传递到NioEventLoop中。

```java
/*************************MultithreadEventExecutorGroup构造函数********************************************/
executor = new ThreadPerTaskExecutor(newDefaultThreadFactory())  // DefaultThreadFactory
/*********************************************************************/
    
public final class ThreadPerTaskExecutor implements Executor {
    private final ThreadFactory threadFactory;

    public ThreadPerTaskExecutor(ThreadFactory threadFactory) {
        if (threadFactory == null) {
            throw new NullPointerException("threadFactory");
        }
        this.threadFactory = threadFactory;
    }

    @Override
    public void execute(Runnable command) {
        threadFactory.newThread(command).start();	// 启动了一个线程
    }
}
```

4. 上面的代码最终启动了一个线程，这个线程从DefaultThreadFactory来，创建的是一个FastThreadLocalThread，这个线程继承Thread。



## 模仿实现

```java
// 注册
SingleThreadEventExecutor#execute
    
    doStartThread		注意 SingleThreadEventExecutor.this.run();
    inEventLoop
```

[线程关系| ProcessOn免费在线作图,在线流程图,在线思维导图](https://www.processon.com/view/link/6436d71340a0dd65f6a207f6)

<common-progresson-snippet src="https://www.processon.com/view/link/6436d71340a0dd65f6a207f6"/>

![线程关系](/images/concurrency/线程关系.png)





> 在源码过程中发现一个netty使用的是无锁队列MpscUnboundedArrayQueue



[原理剖析（第 012 篇）Netty之无锁队列MpscUnboundedArrayQueue原理分析 - 简书 (jianshu.com)](https://www.jianshu.com/p/119a03332619)

[JCTools | Java Concurrency Tools](http://jctools.github.io/JCTools/)





## Netty是如何启动线程的

1. netty ServerBootstrap在bind的时候，会创建一个ServerSocketChannel.然后注册到其中一个NioEventLoop中。
2. 就在注册的过程中启动了线程startThread()

```java
SingleThreadEventExecutor#startThread
ThreadExecutorMap.Executor.execute 
ThreadPerTaskExecutor.execute
    从线程工厂拿出一个线程执行
```





## 线程分配

服务于Channel 的I/O 和事件的EventLoop 包含在EventLoopGroup 中。

异步传输实现只使用了少量的EventLoop（以及和它们相关联的Thread），而且在当前的线程模型中，它们可能会被多个Channel 所共享。这使得可以通过尽可能少量的Thread 来支撑大量的Channel，而不是每个Channel 分配一个Thread。EventLoopGroup 负责为每个新创建的Channel 分配一个EventLoop。在当前实现中，使用顺序循环（round-robin）的方式进行分配以获取一个均衡的分布，并且相同的EventLoop可能会被分配给多个Channel。

一旦一个Channel 被分配给一个EventLoop，它将在它的整个生命周期中都使用这个EventLoop（以及相关联的Thread）。

​    ![0](/images/netty/10093.png)



> 如下面的例子给server的workEventLoopGroup设置为线程数量为3，然后启动三个客户端去连接
>
> 就会观察到服务端处理第一个client和第三个client的线程是同一个

```java
09:22:17.188 [nioEventLoopGroup-2-1] o.h.e.EchoServerHandler - channelActive - INFO  连接： /127.0.0.1:6108
09:22:17.188 [nioEventLoopGroup-2-1] o.h.e.EchoServerHandler - channelActive - INFO  channelActive: nioEventLoopGroup-2-1
09:22:17.211 [nioEventLoopGroup-2-1] o.h.e.EchoServerHandler - channelRead - INFO  channelRead: nioEventLoopGroup-2-1
09:22:26.004 [nioEventLoopGroup-2-2] o.h.e.EchoServerHandler - channelActive - INFO  连接： /127.0.0.1:6167
09:22:26.004 [nioEventLoopGroup-2-2] o.h.e.EchoServerHandler - channelActive - INFO  channelActive: nioEventLoopGroup-2-2
09:22:26.027 [nioEventLoopGroup-2-2] o.h.e.EchoServerHandler - channelRead - INFO  channelRead: nioEventLoopGroup-2-2
09:22:33.354 [nioEventLoopGroup-2-1] o.h.e.EchoServerHandler - channelActive - INFO  连接： /127.0.0.1:6221
09:22:33.354 [nioEventLoopGroup-2-1] o.h.e.EchoServerHandler - channelActive - INFO  channelActive: nioEventLoopGroup-2-1
09:22:33.374 [nioEventLoopGroup-2-1] o.h.e.EchoServerHandler - channelRead - INFO  channelRead: nioEventLoopGroup-2-1
```

## 线程管理

在内部，当提交任务到如果**（**当前）调用线程正是支撑EventLoop 的线程，那么所提交的代码块将会被（直接）执行。否则，EventLoop 将调度该任务以便稍后执行，并将它放入到内部队列中。当EventLoop下次处理它的事件时，它会执行队列中的那些任务/事件

![img](/images/netty/10094.png)
