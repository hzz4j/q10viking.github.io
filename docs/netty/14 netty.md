---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /netty/
typora-root-url: ..\.vuepress\public
---



## 第一个Netty程序

### server

:::: code-group
::: code-group-item EchoServer

```java
public class EchoServer {
    private static final Logger LOG = LoggerFactory.getLogger(EchoServer.class);

    private final int port;

    public EchoServer(int port) {
        this.port = port;
    }

    public static void main(String[] args) throws InterruptedException {
        int port = 9998;
        EchoServer echoServer = new EchoServer(port);
        LOG.info("服务器即将启动");
        echoServer.start();
        LOG.info("服务器关闭");
    }

    private void start() throws InterruptedException {
        EventLoopGroup eventLoopGroup = new NioEventLoopGroup();
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        ServerBootstrap serverBootstrap = new ServerBootstrap();
//        EchoServerHandler echoServerHandler = new EchoServerHandler();
        try {
            serverBootstrap
                    .group(bossGroup,eventLoopGroup)
//                    .localAddress(new InetSocketAddress(port))
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) throws Exception {
                            ch.pipeline().addLast(new EchoServerHandler());
                        }
                    });
            /**绑定多个端口，同步等待成功*/
            ChannelFuture channelFuture1 = serverBootstrap.bind(new InetSocketAddress(10000)).sync();
            ChannelFuture channelFuture2 = serverBootstrap.bind(new InetSocketAddress(10001)).sync();
            ChannelFuture channelFuture3 = serverBootstrap.bind(new InetSocketAddress(10002)).sync();
            LOG.info(channelFuture1.channel().localAddress().toString());
            /*阻塞当前线程，直到服务器的ServerChannel被关闭*/
            channelFuture2.channel().closeFuture().sync();
            channelFuture3.channel().closeFuture().sync();
            channelFuture1.channel().closeFuture().sync();
            LOG.info("服务器关闭");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            eventLoopGroup.shutdownGracefully().sync();
        }

    }
}

```
:::
::: code-group-item EchoServerHandler

```java
public class EchoServerHandler extends ChannelInboundHandlerAdapter {
    private static final Logger LOG = LoggerFactory.getLogger(EchoServerHandler.class);
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        ByteBuf buf = (ByteBuf)msg;
        ctx.writeAndFlush(buf);
        ctx.close();
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();
    }

//    @Override
//    public void channelActive(ChannelHandlerContext ctx) throws Exception {
//        ctx.writeAndFlush(Unpooled.copiedBuffer("server active", CharsetUtil.UTF_8));
//    }


    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        LOG.info("连接： "+ctx.channel().remoteAddress().toString());
        super.channelActive(ctx);
    }
}
```
:::
::::





### client

:::: code-group
::: code-group-item EchoClient

```java
public class EchoClient {
    private static final Logger LOG = LoggerFactory.getLogger(EchoClient.class);
    private final int port;
    private final String host;

    public EchoClient(int port, String host) {
        this.port = port;
        this.host = host;
    }

    public static void main(String[] args) throws InterruptedException {
        new EchoClient(10000,"127.0.0.1").start();
    }

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
            ChannelFuture f = bootstrap.connect().sync();
            f.channel().closeFuture().sync();
        }finally {
            eventLoopGroup.shutdownGracefully().sync();
        }


    }
}

```
:::
::: code-group-item EchoClientHandler

```java
public class EchoClientHandler extends SimpleChannelInboundHandler<ByteBuf> {
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
        System.out.println("client Accept: "+msg.toString(CharsetUtil.UTF_8));
        ctx.close();
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        ctx.writeAndFlush(Unpooled.copiedBuffer("Hello,Netty",CharsetUtil.UTF_8));
    }
}
```
:::
::::





## 核心概念

- Bootstrap是Netty框架的启动类和主入口类，分为客户端类Bootstrap和服务器类ServerBootstrap两种
- Channel 是Java NIO 的一个基本构造:它代表一个到实体（如一个硬件设备、一个文件、一个网络套接字或者一个能够执行一个或者多个不同的I/O操作的程序组件）的开放连接，如读操作和写操作。目前，可以把Channel 看作是传入（入站）或者传出（出站）数据的载体。因此，它可以被打开或者被关闭，连接或者断开连接
- EventLoop暂时可以看成一个线程、EventLoopGroup自然就可以看成线程组

![image-20230411214325436](/images/netty/image-20230411214325436.png)



## Channel

基本的I/O 操作（bind()、connect()、read()和write()）依赖于底层网络传输所提供的原语。在基于Java 的网络编程中，其基本的构造是类Socket。Netty 的Channel 接口所提供的API，被用于所有的I/O 操作。大大地降低了直接使用Socket 类的复杂性。此外，Channel 也是拥有许多预定义的、专门化实现的广泛类层次结构的根。

由于Channel 是独一无二的，所以为了保证顺序将Channel 声明为java.lang.Comparable 的一个子接口。因此，如果两个不同的Channel 实例都返回了相同的散列码，那么AbstractChannel 中的compareTo()方法的实现将会抛出一个Error

### channel的生命周期

- ChannelUnregistered ：Channel 已经被创建，但还未注册到EventLoop
- ChannelRegistered ：Channel 已经被注册到了EventLoop
- ChannelActive ：Channel 处于活动状态（已经连接到它的远程节点）。它现在可以接收和发送数据了
- ChannelInactive ：Channel 没有连接到远程节点

当这些状态发生改变时，将会生成对应的事件。这些事件将会被转发给ChannelPipeline 中的ChannelHandler，其可以随后对它们做出响应。在我们的编程中，关注ChannelActive 和ChannelInactive 会更多一些。



### 重要的方法

- eventLoop： 返回分配给Channel 的EventLoop
- pipeline： 返回Channel 的ChannelPipeline，也就是说每个Channel 都有自己的ChannelPipeline。
- isActive： 如果Channel 是活动的，则返回true。活动的意义可能依赖于底层的传输。例如，一个Socket 传输一旦连接到了远程节点便是活动的，而一个Datagram 传输一旦被打开便是活动的。
- localAddress： 返回本地的SokcetAddress
- remoteAddress： 返回远程的SocketAddress
- write： 将数据写到远程节点，注意，这个写只是写往Netty内部的缓存，还没有真正写往socket。
- flush： 将之前已写的数据冲刷到底层socket进行传输。
- writeAndFlush： 一个简便的方法，等同于调用write()并接着调用flush()



## ChannelPipeline和ChannelHandlerContext

### ChannelPipeline

当Channel 被创建时，它将会被自动地分配一个新的ChannelPipeline，每个Channel 都有自己的ChannelPipeline。这项关联是永久性的。在Netty 组件的生命周期中，这是一项固定的操作，不需要开发人员的任何干预。

ChannelPipeline 提供了ChannelHandler 链的容器，并定义了用于在该链上传播**入站（也就是从网络到业务处理）**和 出站（也就是从业务处理到网络），各种事件流的API，我们代码中的ChannelHandler 都是放在ChannelPipeline 中的。

使得事件流经ChannelPipeline 是ChannelHandler 的工作，它们是在应用程序的初始化或者引导阶段被安装的。这些ChannelHandler 对象接收事件、执行它们所实现的处理逻辑，并将数据传递给链中的下一个ChannelHandler，而且ChannelHandler 对象也完全可以拦截事件不让事件继续传递。它们的执行顺序是由它们被添加的顺序所决定的。

![https://note.youdao.com/yws/public/resource/f71d324d40f6c4bfb67e419a8fb42862/xmlnote/OFFICEDC0ADE705AF64A3CA6E8FBA958B3FAF0/10096](/images/netty/10096.png)

![https://note.youdao.com/yws/public/resource/b8970e44473486a48178193d68929008/xmlnote/B401EBCE53ED4A959BDD4CC702D70B6E/85302](/images/netty/85302.png)

#### **ChannelPipeline上的方法**

既然ChannelPipeline以双向链表的形式进行维护管理Handler，自然也提供了对应的方法在ChannelPipeline中增加或者删除、替换Handler。

- **addFirst、addBefore、addAfter、addLast** 将一个ChannelHandler 添加到ChannelPipeline 中
- **remove** 将一个ChannelHandler 从ChannelPipeline 中移除
- **replace** 将ChannelPipeline 中的一个ChannelHandler 替换为另一个ChannelHandler
- **get** 通过类型或者名称返回ChannelHandler
- **context** 返回和ChannelHandler 绑定的ChannelHandlerContext
- **names** 返回ChannelPipeline 中所有ChannelHandler 的名称

ChannelPipeline 的API 公开了用于调用入站和出站操作的附加方





## ChannelHandlerContext

- **alloc** 返回和这个实例相关联的Channel 所配置的ByteBufAllocator
- **bind** 绑定到给定的SocketAddress，并返回ChannelFuture
- **channel** 返回绑定到这个实例的Channel
- **close** 关闭Channel，并返回ChannelFuture
- **connect** 连接给定的SocketAddress，并返回ChannelFuture
- **deregister** 从之前分配的EventExecutor 注销，并返回ChannelFuture
- **disconnect** 从远程节点断开，并返回ChannelFuture
- **executor** 返回调度事件的EventExecutor
- **fireChannelActive** 触发对下一个ChannelInboundHandler 上的channelActive()方法（已连接）的调用
- **fireChannelInactive** 触发对下一个ChannelInboundHandler 上的channelInactive()方法（已关闭）的调用
- **fireChannelRead** 触发对下一个ChannelInboundHandler 上的channelRead()方法（已接收的消息）的调用
- **fireChannelReadComplete** 触发对下一个ChannelInboundHandler 上的channelReadComplete()方法的调用
- **fireChannelRegistered** 触发对下一个ChannelInboundHandler 上的fireChannelRegistered()方法的调用
- **fireChannelUnregistered** 触发对下一个ChannelInboundHandler 上的fireChannelUnregistered()方法的调用
- **fireChannelWritabilityChanged** 触发对下一个ChannelInboundHandler 上的fireChannelWritabilityChanged()方法的调用

- **fireExceptionCaught** 触发对下一个ChannelInboundHandler 上的fireExceptionCaught(Throwable)方法的调用

- **fireUserEventTriggered** 触发对下一个ChannelInboundHandler 上的fireUserEventTriggered(Object evt)方法的调用

- **handler** 返回绑定到这个实例的ChannelHandler

- **isRemoved** 如果所关联的ChannelHandler 已经被从ChannelPipeline中移除则返回true

- **name** 返回这个实例的唯一名称

- **pipeline** 返回这个实例所关联的ChannelPipeline

- **read** 将数据从Channel读取到第一个入站缓冲区；如果读取成功则触发一个channelRead事件，并（在最后一个消息被读取完成后）通知ChannelInboundHandler 的channelReadComplete(ctx)方法

- **write** 通过这个实例写入消息并经过ChannelPipeline

- **writeAndFlush** 通过这个实例写入并冲刷消息并经过ChannelPipeline





### channelhandler生命周期

在ChannelHandler被添加到ChannelPipeline 中或者被从ChannelPipeline 中移除时会调用下面这些方法。这些方法中的每一个都接受一个ChannelHandlerContext 参数。

- **handlerAdded** 当把ChannelHandler 添加到ChannelPipeline 中时被调用

- **handlerRemoved** 当从ChannelPipeline 中移除ChannelHandler 时被调用

- **exceptionCaught** 当处理过程中在ChannelPipeline 中有错误产生时被调用



## write事件传播❤️

比如服务器收到对端发过来的报文，解压后需要进行解密，结果解密失败，要给对端一个应答。

如果发现解密失败原因是服务器和对端的加密算法不一致，应答报文只能以明文的压缩格式发送，就可以在解密handler中直接使用ctx.write给对端应答，这样应答报文就只经过压缩Handler就发往了对端；

其他情况下，应答报文要以加密和压缩格式发送，就可以在解密handler中使用channel.write()或者channelpipeline.write()给对端应答，这样应答报文就会流经整个出站处理过程

![img](/images/netty/10107.png)

```
channel.write
pipeline.write
ctx.write
```

通过看源码，发现channel.write与pipeline.write都是从尾部开始

```java
    @Override
    public final ChannelFuture write(Object msg) {
        return tail.write(msg);
    }
```

ctx.write它会去找前一个outbound

```java
private AbstractChannelHandlerContext findContextOutbound(int mask) {
    AbstractChannelHandlerContext ctx = this;
    do {
        ctx = ctx.prev;
    } while ((ctx.executionMask & mask) == 0);
    return ctx;
}
```





## **ChannelInboundHandler** 

这些方法将会在数据被接收时或者与其对应的Channel 状态发生改变时被调用。正如我们前面所提到的，这些方法和Channel 的生命周期密切相关。

- **channelRegistered** 当Channel 已经注册到它的EventLoop 并且能够处理I/O 时被调用
- **channelUnregistered** 当Channel 从它的EventLoop 注销并且无法处理任何I/O 时被调用
- **channelActive** 当Channel 处于活动状态时被调用；Channel 已经连接/绑定并且已经就绪
- **channelInactive** 当Channel 离开活动状态并且不再连接它的远程节点时被调用
- **channelReadComplete** 当Channel上的一个读操作完成时被调用
- **channelRead** 当从Channel 读取数据时被调用

>channelReadComplete与channelRead的区别

```sh
channelReadComplete() is triggered once there is no more data to read from the underlying transport. When talking about SocketChannels this would be either of these two cases:

read(...) returns 0
read(...) got a buffer passed to it that has 1024 bytes to fill, but less than 1024 are filled.
```

- **userEventTriggered** 当ChannelnboundHandler.fireUserEventTriggered()方法被调用时被调用





## ChannelOutboundHandler 

出站操作和数据将由ChannelOutboundHandler 处理。它的方法将被Channel、Channel-Pipeline 以及ChannelHandlerContext 调用。

所有由ChannelOutboundHandler 本身所定义的方法：

- **bind(ChannelHandlerContext,SocketAddress,ChannelPromise)**当请求将Channel 绑定到本地地址时被调用

- **connect(ChannelHandlerContext,SocketAddress,SocketAddress,ChannelPromise)**当请求将Channel 连接到远程节点时被调用

- **disconnect(ChannelHandlerContext,ChannelPromise)**当请求将Channel 从远程节点断开时被调用

- **close(ChannelHandlerContext,ChannelPromise)** 当请求关闭Channel 时被调用

- **deregister(ChannelHandlerContext,ChannelPromise)**当请求将Channel 从它的EventLoop 注销时被调用

- **read(ChannelHandlerContext)** 当请求从Channel 读取更多的数据时被调用

- **flush(ChannelHandlerContext)** 当请求通过Channel 将入队数据冲刷到远程节点时被调用

- **write(ChannelHandlerContext,Object,ChannelPromise)** 当请求通过Channel 将数据写到远程节点时被调用
