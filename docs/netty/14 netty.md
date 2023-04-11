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
