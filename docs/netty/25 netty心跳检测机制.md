---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /netty/
typora-root-url: ..\.vuepress\public
---



## 心跳机制介绍



所谓心跳, 即在 TCP 长连接中, 客户端和服务器之间定期发送的一种特殊的数据包, 通知对方自己还在线, 以确保 TCP 连接的有效性.

是在应用层面上的服务端与客户端的交互。主要在服务端实现

在 Netty 中, 实现心跳机制的关键是 IdleStateHandler, 看下它的构造器

```java
public IdleStateHandler(int readerIdleTimeSeconds, int writerIdleTimeSeconds, int allIdleTimeSeconds) {
    this((long)readerIdleTimeSeconds, (long)writerIdleTimeSeconds, (long)allIdleTimeSeconds, TimeUnit.SECONDS);
}
```

这里解释下三个参数的含义：

- readerIdleTimeSeconds: 读超时. 即当在指定的时间间隔内没有从 Channel 读取到数据时, 会触发一个 READER_IDLE 的 IdleStateEvent 事件.
- writerIdleTimeSeconds: 写超时. 即当在指定的时间间隔内没有数据写入到 Channel 时, 会触发一个 WRITER_IDLE 的 IdleStateEvent 事件.
- allIdleTimeSeconds: 读/写超时. 即当在指定的时间间隔内没有读或写操作时, 会触发一个 ALL_IDLE 的 IdleStateEvent 事件.

注：这三个参数默认的时间单位是秒。若需要指定其他时间单位，可以使用另一个构造方法

## 实现

[Source Code](https://github.com/Q10Viking/learncode/tree/main/Netty/HelloWorld/src/main/java/org/hzz/idlestate)

[心跳机制| ProcessOn免费在线作图,在线流程图,在线思维导图](https://www.processon.com/view/link/643aacca52b63f1f044e8022)

![心跳机制](/images/netty/心跳机制.png)

> 服务端

:::: code-group
::: code-group-item HeartBeatServerHandler

```java
@Slf4j
public class HeartBeatServerHandler extends SimpleChannelInboundHandler<String> {
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) throws Exception {
        System.out.println("收到客户端消息：" + msg);
        if ("HeartBeat Packet".equals(msg)) {
            ctx.writeAndFlush("Server OK");
        }else{
            log.info("收到客户端消息：" + msg);
        }

    }

    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {

        if (evt instanceof IdleStateEvent) {
            IdleStateEvent event = (IdleStateEvent) evt;
            switch (event.state()) {
                case READER_IDLE:
                    log.info("读空闲, 关闭连接");
                    closeChannel(ctx);
                case WRITER_IDLE:
                    log.info("写空闲");
                    break;
                case ALL_IDLE:
                    log.info("读写空闲");
                    break;
            }
        }
    }

    private void closeChannel(ChannelHandlerContext ctx){
        SocketAddress loc = ctx.channel().localAddress();
        SocketAddress rem = ctx.channel().remoteAddress();
        ctx.writeAndFlush("idle close");
        ctx.channel().close().addListener(future -> {
            if (future.isSuccess()) {
                log.info("关闭连接成功: loc={}, rem={}", loc, rem);
            } else {
                log.info("关闭连接失败: loc={}, rem={}", loc, rem);
            }
        });
    }
}
```
:::
::: code-group-item HeartBeatServer

```java
@Slf4j
public class HeartBeatServer {
    public static void main(String[] args) {
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        EventLoopGroup workerGroup = new NioEventLoopGroup();

        try{
            ServerBootstrap serverBootstrap = new ServerBootstrap();
            serverBootstrap.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ServerChannelInitializer());

            ChannelFuture bindFuture = serverBootstrap.bind(new InetSocketAddress(8080));
            bindFuture.addListener(future -> {
                if (future.isSuccess()) {
                    log.info("端口绑定成功,port:{}",((InetSocketAddress)bindFuture.channel().localAddress()).getPort());
                } else {
                    log.info("端口绑定失败");
                }
            });
            bindFuture.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }

    private static class ServerChannelInitializer extends ChannelInitializer<SocketChannel> {
        @Override
        protected void initChannel(SocketChannel ch) throws Exception {
            ch.pipeline()
                    .addLast(new StringEncoder())
                    .addLast(new StringDecoder())
                    .addLast(new IdleStateHandler(3, 0, 0, TimeUnit.SECONDS))
                    .addLast(new HeartBeatServerHandler());
        }
    }
}
```
:::
::::



> 客户端

:::: code-group
::: code-group-item HeartBeatClientHandler

```java
public class HeartBeatClientHandler extends SimpleChannelInboundHandler<String> {
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) throws Exception {
        if (msg != null && msg.equals("idle close")) {
            ctx.channel().close().addListener(future -> {
                if (future.isSuccess()) {
                    log.info("服务器主动关闭连接,客户端也关闭连接");
                } else {
                    log.info("关闭连接失败");
                }
            });
        }
    }
}
```

:::
::: code-group-item HeartBeatClient

```java
@Slf4j
public class HeartBeatClient {
    public static void main(String[] args) {
        Bootstrap bootstrap = new Bootstrap();
        try{
            bootstrap.group(new NioEventLoopGroup())
                    .channel(NioSocketChannel.class)
                    .remoteAddress("localhost", 8080)
                    .handler(new ClientChannelInitializer());
            ChannelFuture connect = bootstrap.connect();
            connect.addListener(future -> {
                if (future.isSuccess()) {
                    log.info("连接成功");
                } else {
                    log.info("连接失败");
                }
            });
            connect.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            bootstrap.group().shutdownGracefully();
        }
    }

    private static class ClientChannelInitializer extends ChannelInitializer<SocketChannel> {
        @Override
        protected void initChannel(SocketChannel ch) throws Exception {
            ch.pipeline()
                    .addLast(new StringEncoder())
                    .addLast(new StringDecoder())
                    .addLast(new HeartBeatClientHandler());
        }
    }
}

```

:::
::::



> 测试



```sh
# 服务端
21:32:36.774 [nioEventLoopGroup-2-1] o.h.i.HeartBeatServer - lambda$main$0 - INFO  端口绑定成功,port:8080
21:32:51.082 [nioEventLoopGroup-3-1] o.h.i.HeartBeatServerHandler - userEventTriggered - INFO  读空闲, 关闭连接
21:32:51.104 [nioEventLoopGroup-3-1] o.h.i.HeartBeatServerHandler - lambda$closeChannel$0 - INFO  关闭连接成功: loc=/127.0.0.1:8080, rem=/127.0.0.1:12480
```

```sh
#客户端
21:32:48.080 [nioEventLoopGroup-2-1] o.h.i.HeartBeatClient - lambda$main$0 - INFO  连接成功
21:32:51.119 [nioEventLoopGroup-2-1] o.h.i.HeartBeatClientHandler - lambda$channelRead0$0 - INFO  服务器主动关闭连接,客户端也关闭连接
```



## IdleStateHandler底层原理

- 它是入站和出站的handler

![image-20230415222513592](/images/netty/image-20230415222513592.png)

[idlesate以及定时执行任务分析| ProcessOn免费在线作图,在线流程图,在线思维导图](https://www.processon.com/view/link/643ad31dcbedfb624bef258f)

<common-progresson-snippet src="https://www.processon.com/view/link/643ad31dcbedfb624bef258f"/>



### 定时任务分析

> 定时任务的执行核心逻辑: 从优先级队列（底层是最小堆）中取出第一个任务
>
> 然后比较现在时间是否已经大于了延迟时间，比如现在是12点，延迟时间是11点，那么就取出该任务执行。

[静默のBlog 堆排序](https://q10viking.github.io/Algorithm/十大排序算法.html#堆排序❤️)

> 核心模板

```java
protected boolean runAllTasks() {
    assert inEventLoop();
    boolean fetchedAll;
    boolean ranAtLeastOne = false;

    // 这里的循环是确保取所有到期的任务执行。因为取出来要放到另外一个队列
    // 因为另外一个队列可能有任务积压，取出来放不进去，所以又退回到了优先级队列。
    // 等待另外一个普通队列任务执行完，再去优先级任务中获取
    do {												
        fetchedAll = fetchFromScheduledTaskQueue();
        if (runAllTasksFrom(taskQueue)) {  // 执行队列任务
            ranAtLeastOne = true;
        }
    } while (!fetchedAll); // keep on processing until we fetched all scheduled tasks.
    return ranAtLeastOne;
}
```

```java
private boolean fetchFromScheduledTaskQueue() {
    if (scheduledTaskQueue == null || scheduledTaskQueue.isEmpty()) {
        return true;
    }
    long nanoTime = AbstractScheduledEventExecutor.nanoTime();
    for (;;) {
        Runnable scheduledTask = pollScheduledTask(nanoTime);
        if (scheduledTask == null) {
            return true;
        }
        if (!taskQueue.offer(scheduledTask)) { // 添加不进去，可能现在任务队列满了，需要先把队列挤压的任务执行
            // No space left in the task queue add it back to the scheduledTaskQueue so we pick it up again.
            scheduledTaskQueue.add((ScheduledFutureTask<?>) scheduledTask);
            return false;
        }
    }
}
```

```java
    protected final Runnable pollScheduledTask(long nanoTime) {
        assert inEventLoop();

        Queue<ScheduledFutureTask<?>> scheduledTaskQueue = this.scheduledTaskQueue;
        // 核心逻辑
        ScheduledFutureTask<?> scheduledTask = scheduledTaskQueue == null ? null : scheduledTaskQueue.peek();
        // 取出任务看看是否到了可执行的时机
        if (scheduledTask == null || scheduledTask.deadlineNanos() - nanoTime > 0) {
            return null;
        }
        scheduledTaskQueue.remove();
        return scheduledTask;
    }
```









