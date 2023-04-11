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





## Netty是如何启动线程的

1. netty ServerBootstrap在bind的时候，会创建一个ServerSocketChannel.然后注册到其中一个NioEventLoop中。
2. 就在注册的过程中启动了线程startThread()

```java
SingleThreadEventExecutor#startThread
ThreadExecutorMap.Executor.execute 
ThreadPerTaskExecutor.execute
    从线程工厂拿出一个线程执行
```





### 代码模拟







