---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /gRPC/
typora-root-url: ..\.vuepress\public
---



## Java视角的RPC

>  对于Java程序员而言，RPC就是**远程方法调用**。

**远程方法调用**和**本地方法调用**是相对的两个概念，本地方法调用指的是进程内部的方法调用，而远程方法调用指的是两个进程内的方法相互调用。

如果实现远程方法调用，基本的就是通过网络，通过传输数据来进行调用。

所以就有了：

1. RPC over Http：基于Http协议来传输数据
2. PRC over Tcp：基于Tcp协议来传输数据



对于所传输的数据，可以交由RPC的双方来协商定义，但基本都会包括：

1. 调用的是哪个类或接口
2. 调用的是哪个方法，方法名和方法参数类型（考虑方法重载）
3. 调用方法的入参



所以，我们其实可以看到RPC的自定义性是很高的，各个公司内部都可以实现自己的一套RPC框架，而**Dubbo**就是阿里所开源出来的一套RPC框架。

![image-20230418230939356](/images/grpc/image-20230418230939356.png)





## RPC

RPC（Remote Procedure Call ——远程过程调用），它是一种通过网络从远程计算机程序上请求服务，而不需要了解底层网络的技术

![image.png](/images/grpc/1636005393447-e99f770f-eeb6-40a5-a604-7284833901a9.png)

![https://note.youdao.com/yws/public/resource/8ef33654f746921ad769ad9fe91a4c8f/xmlnote/OFFICEAF0884A80A934CE9BEB3C1AF9E19E873/10070](/images/grpc/10070.png)



### RPC同步调用流程

![image.png](/images/grpc/1636005446499-9ec54ff2-4072-47e4-b862-9bf984fd8ba0.png)



核心 RPC 框架的重要组成：

1. 客户端(Client)：服务调用方。
2. 客户端存根(Client Stub)：存放服务端地址信息，将客户端的请求参数数据信息打包成网络消息，再通过网络传输发送给服务端。
3. 服务端存根(Server Stub)：接收客户端发送过来的请求消息并进行解包，然后再调用本地服务进行处理。
4. 服务端(Server)：服务的真正提供者。
5. Network Service：底层传输，可以是 TCP 或 HTTP。

一次 RPC 调用流程如下：

1. 服务消费者(Client 客户端)通过本地调用的方式调用服务。
2. 客户端存根(Client Stub)接收到调用请求后负责将方法、入参等信息序列化(组装)成能够进行网络传输的消息体。
3. 客户端存根(Client Stub)找到远程的服务地址，并且将消息通过网络发送给服务端。
4. 服务端存根(Server Stub)收到消息后进行解码(反序列化操作)。
5. 服务端存根(Server Stub)根据解码结果调用本地的服务进行相关处理
6. 服务端(Server)本地服务业务处理。
7. 处理结果返回给服务端存根(Server Stub)。
8. 服务端存根(Server Stub)序列化结果。
9. 服务端存根(Server Stub)将结果通过网络发送至消费方。
10. 客户端存根(Client Stub)接收到消息，并进行解码(反序列化)。
11. 服务消费方得到最终结果

> RPC框架的目标就是要中间步骤都封装起来，让我们进行远程方法调用的时候感觉到就像在本地方法调用一样。



## RPC与HTTP

rpc字面意思就是远程过程调用，只是对不同应用间相互调用的一种描述，一种思想。具体怎么调用？

实现方式可以是最直接的tcp通信，也可以是http方式,在很多的消息中间件的技术书籍里，甚至还有使用消息中间件来实现RPC调用的，我们知道的dubbo是基于tcp通信的，gRPC是Google公布的开源软件，基于最新的HTTP2.0协议，底层使用到了Netty框架的支持。所以总结来说，rpc和http是完全两个不同层级的东西，他们之间并没有什么可比性



## 实现RPC框架

> RPC调用更重要的是体现在调用方，发起连接

[Source Code](https://github.com/Q10Viking/learncode/tree/main/rpc/rpc)

> 实现rpc要解决核心问题

### 代理问题

代理本质上是要解决什么问题？要解决的是被调用的服务本质上是远程的服务，但是调用者不知道也不关心，调用者只要结果，具体的事情由代理的那个对象来负责这件事。既然是远程代理，当然是要用代理模式了。

代理(Proxy)是一种设计模式,即通过代理对象访问目标对象.这样做的好处是:可以在目标对象实现的基础上,增强额外的功能操作,即扩展目标对象的功能。那我们这里额外的功能操作是干什么，通过网络访问远程服务。

jdk的代理有两种实现方式：静态代理和动态代理。



### 序列化

序列化问题在计算机里具体是什么？我们的方法调用，有方法名，方法参数，这些可能是字符串，可能是我们自己定义的java的类，但是在网络上传输或者保存在硬盘的时候，网络或者硬盘并不认得什么字符串或者javabean，它只认得二进制的01串，怎么办？要进行序列化，网络传输后要进行实际调用，就要把二进制的01串变回我们实际的java的类，这个叫反序列化。java里已经为我们提供了相关的机制Serializable。



### 通信问题

我们在用序列化把东西变成了可以在网络上传输的二进制的01串，但具体如何通过网络传输？使用JDK为我们提供的BIO



### **登记的服务实例化**

登记的服务有可能在我们的系统中就是一个名字，怎么变成实际执行的对象实例，当然是使用反射机制。





## BIO实现RPC

[Source Code](https://github.com/Q10Viking/learncode/tree/main/rpc/rpc)

![image-20230419102621533](/images/grpc/image-20230419102621533.png)



### 注册中心

```java
/**
 * 类说明：服务注册中心，服务提供者在启动时需要在注册中心登记自己的信息
 */
@Service
public class RegisterCenter {
    /*key表示服务名，value代表服务提供者地址的集合*/
    private static final Map<String, Set<RegisterServiceVo>> serviceHolder
            = new HashMap<>();

    /*注册服务的端口号*/
    private int port;

    /*服务注册，考虑到可能有多个提供者同时注册，进行加锁*/
    private static synchronized void registerService(String serviceName,
                                String host,int port){
        //获得当前服务的已有地址集合
        Set<RegisterServiceVo> serviceVoSet = serviceHolder.get(serviceName);
        if(serviceVoSet==null){
            //已有地址集合为空，新增集合
            serviceVoSet = new HashSet<>();
            serviceHolder.put(serviceName,serviceVoSet);
        }
        //将新的服务提供者加入集合
        serviceVoSet.add(new RegisterServiceVo(host,port));
        System.out.println("服务已注册["+serviceName+"]，" +
                "地址["+host+"]，端口["+port+"]");
    }

    /*取出服务提供者*/
    private static Set<RegisterServiceVo> getService(String serviceName){
        return serviceHolder.get(serviceName);
    }

    /*处理服务请求的任务，其实无非就是两种服务：
    1、服务注册服务
    2、服务查询服务
    */
    private static class ServerTask implements Runnable{
        private Socket client = null;

        public ServerTask(Socket client){
            this.client = client;
        }

        public void run() {

            try(ObjectInputStream inputStream =
                        new ObjectInputStream(client.getInputStream());
                ObjectOutputStream outputStream =
                        new ObjectOutputStream(client.getOutputStream())){

                /*检查当前请求是注册服务还是获得服务*/
                boolean isGetService = inputStream.readBoolean();
                /*服务查询服务，获得服务提供者*/
                if(isGetService){
                    String serviceName = inputStream.readUTF();
                    /*取出服务提供者集合*/
                    Set<RegisterServiceVo> result = getService(serviceName);
                    /*返回给客户端*/
                    outputStream.writeObject(result);
                    outputStream.flush();
                    System.out.println("将已注册的服务["+serviceName+"提供给客户端");
                }
                /*服务注册服务*/
                else{
                    /*取得新服务提供方的ip和端口*/
                    String serviceName = inputStream.readUTF();
                    String host = inputStream.readUTF();
                    int port = inputStream.readInt();
                    /*在注册中心保存*/
                    registerService(serviceName,host,port);
                    outputStream.writeBoolean(true);
                    outputStream.flush();
                }
            }catch(Exception e){
                e.printStackTrace();
            }finally {
                try {
                    client.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /*启动注册服务*/
    public void startService() throws IOException {
        ServerSocket serverSocket = new ServerSocket();
        serverSocket.bind(new InetSocketAddress(port));
        System.out.println("服务注册中心 on:"+port+":运行");
        try{
            while(true){
                new Thread(new ServerTask(serverSocket.accept())).start();
            }
        }finally {
            serverSocket.close();
        }
    }

    @PostConstruct
    public void init() {
        this.port = 9999;
        new Thread(new Runnable() {
            public void run() {
                try{
                    startService();
                }catch(IOException e){
                    e.printStackTrace();
                }
            }
        }).start();
    }
}
```



### 服务注册

![image-20230419110545677](/images/grpc/image-20230419110545677.png)

> 如stock服务

```java
@Service
public class RegisterServiceWithRegCenter {

    /*本地可提供服务的一个名单，用缓存实现*/
    private static final Map<String,Class> serviceCache
            = new ConcurrentHashMap<>();

    /*往远程注册服务器注册本服务*/
    public void regRemote(String serviceName, String host, int port, Class impl)
            throws Throwable{
        //登记到注册中心
        Socket socket = null;
        ObjectOutputStream output = null;
        ObjectInputStream input = null;

        try{
            socket = new Socket();
            socket.connect(new InetSocketAddress("127.0.0.1",9999));

            output = new ObjectOutputStream(socket.getOutputStream());
            //注册服务
            output.writeBoolean(false);
            //提供的服务名
            output.writeUTF(serviceName);
            //服务提供方的IP
            output.writeUTF(host);
            //服务提供方的端口
            output.writeInt(port);
            output.flush();

            input = new ObjectInputStream(socket.getInputStream());
            if(input.readBoolean()){
                System.out.println("服务["+serviceName+"]注册成功!");
            }

            //可提供服务放入缓存
            serviceCache.put(serviceName,impl);

        } catch (IOException e) {
            e.printStackTrace();
        }  finally{
            if (socket!=null) socket.close();
            if (output!=null) output.close();
            if (input!=null) input.close();
        }
    }

    public Class getLocalService(String serviceName) {
        return serviceCache.get(serviceName);
    }

}
```



### 服务调用

> 客户端调用

```java
/**
 *类说明：rpc框架的客户端代理部分
 */
@Service
public class RpcClientFrame {

    /*远程服务的代理对象，参数为客户端要调用的的服务*/
    public static<T> T getRemoteProxyObject(final Class<?> serviceInterface) throws Exception {
        /*获得远程服务的一个网络地址*/
        InetSocketAddress addr = 
           getService(serviceInterface.getName());

        /*拿到一个代理对象，由这个代理对象通过网络进行实际的服务调用*/
        return (T)Proxy.newProxyInstance(serviceInterface.getClassLoader(),
                new Class<?>[]{serviceInterface},
                new DynProxy(serviceInterface,addr));
    }


    /*动态代理，实现对远程服务的访问*/
    private static class DynProxy implements InvocationHandler{
        private Class<?> serviceInterface;
        private InetSocketAddress addr;

        public DynProxy(Class<?> serviceInterface, InetSocketAddress addr) {
            this.serviceInterface = serviceInterface;
            this.addr = addr;
        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args)
                throws Throwable {
            Socket socket = null;
            ObjectInputStream inputStream = null;
            ObjectOutputStream outputStream = null;
            try{
                socket = new Socket();
                socket.connect(addr); // 连接到服务
                outputStream = new ObjectOutputStream(socket.getOutputStream());

                //方法所在类名接口名
                outputStream.writeUTF(serviceInterface.getName());
                //方法的名字
                outputStream.writeUTF(method.getName());
                //方法的入参类型
                outputStream.writeObject(method.getParameterTypes());
                //方法入参的值
                outputStream.writeObject(args);

                outputStream.flush();

                inputStream = new ObjectInputStream(socket.getInputStream());
                /*接受服务器的输出*/
                System.out.println(serviceInterface+" remote exec success!");
                return inputStream.readObject();

            }finally {
                if(socket!=null) socket.close();
                if(outputStream!=null) outputStream.close();
                if(inputStream!=null) inputStream.close();

            }
        }
    }



    /*----------------以下和动态获得服务提供者有关------------------------------*/

    private static Random r = new Random();

    /*获得远程服务的地址*/
    private static InetSocketAddress getService(String serviceName)
            throws Exception {
        //获得服务提供者的地址列表
        List<InetSocketAddress> serviceVoList = getServiceList(serviceName);
        InetSocketAddress addr
                = serviceVoList.get(r.nextInt(serviceVoList.size()));
        System.out.println("本次选择了服务器："+addr);
        return addr;
    }

    /*获得服务提供者的地址*/
    private static List<InetSocketAddress> getServiceList(String serviceName)
            throws Exception {
        Socket socket = null;
        ObjectOutputStream output = null;
        ObjectInputStream input = null;

        try{
            socket = new Socket();
            socket.connect(new InetSocketAddress("127.0.0.1",9999));

            output = new ObjectOutputStream(socket.getOutputStream());
            //需要获得服务提供者
            output.writeBoolean(true);
            //告诉注册中心服务名
            output.writeUTF(serviceName);
            output.flush();

            input = new ObjectInputStream(socket.getInputStream());
            Set<RegisterServiceVo> result
                    = (Set<RegisterServiceVo>)input.readObject();
            List<InetSocketAddress> services = new ArrayList<>();
            for(RegisterServiceVo serviceVo : result){
                String host = serviceVo.getHost();//获得服务提供者的IP
                int port = serviceVo.getPort();//获得服务提供者的端口号
                InetSocketAddress serviceAddr = new InetSocketAddress(host,port);
                services.add(serviceAddr);
            }
            System.out.println("获得服务["+serviceName
                    +"]提供者的地址列表["+services+"]，准备调用.");
            return services;
        }finally{
            if (socket!=null) socket.close();
            if (output!=null) output.close();
            if (input!=null) input.close();
        }

    }

}
```

> 服务提供方接收到信息，反射执行方法

```java
@Service
public class RpcServerFrame {

    @Autowired
    private RegisterServiceWithRegCenter registerServiceWithRegCenter;

    //服务的端口号
    private int port;

    //处理服务请求任务
    private static class ServerTask implements Runnable{

        private Socket client;
        private RegisterServiceWithRegCenter registerServiceWithRegCenter;

        public ServerTask(Socket client,
                          RegisterServiceWithRegCenter registerServiceWithRegCenter){
            this.client = client;
            this.registerServiceWithRegCenter = registerServiceWithRegCenter;
        }

        public void run() {

            try(ObjectInputStream inputStream =
                        new ObjectInputStream(client.getInputStream());
                ObjectOutputStream outputStream =
                        new ObjectOutputStream(client.getOutputStream())){

                //方法所在类名接口名
                String serviceName = inputStream.readUTF();
                //方法的名字
                String methodName = inputStream.readUTF();
                //方法的入参类型
                Class<?>[] parmTypes = (Class<?>[]) inputStream.readObject();
                //方法入参的值
                Object[] args = (Object[]) inputStream.readObject();

                //从容器中拿到服务的Class对象
                Class serviceClass = registerServiceWithRegCenter.getLocalService(serviceName);
                if (serviceClass == null){
                    throw new ClassNotFoundException(serviceName+" Not Found");
                }

                //通过反射，执行实际的服务
                Method method = serviceClass.getMethod(methodName,parmTypes);
                Object result = method.invoke(serviceClass.newInstance(),args);

                //将服务的执行结果通知调用者
                outputStream.writeObject(result);
                outputStream.flush();

            }catch(Exception e){
                e.printStackTrace();
            }finally {
                try {
                    client.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }


    public void startService(String serviceName, String host, int port, Class impl) throws Throwable{
        ServerSocket serverSocket = new ServerSocket();
        serverSocket.bind(new InetSocketAddress(port));
        System.out.println("RPC server on:"+port+":运行");
        registerServiceWithRegCenter.regRemote(serviceName,host,port,impl);
        try{
            while(true){
                new Thread(new ServerTask(serverSocket.accept(),
                        registerServiceWithRegCenter)).start();
            }
        }finally {
            serverSocket.close();
        }
    }

}
```

>  服务方的启动

```java
@Service
public class StockRpcServer {

    @Autowired
    private RpcServerFrame rpcServerFrame;

    @PostConstruct
    public void server() throws Throwable {
        Random r = new Random();
        int port = r.nextInt(100)+7778;
        rpcServerFrame.startService(StockService.class.getName(),
                "127.0.0.1",port,StockServiceImpl.class);

    }

}
```



## Netty实现RPC

[Source Code](https://github.com/Q10Viking/learncode/tree/main/rpc/rpc)

![image-20230419111539960](/images/grpc/image-20230419111539960.png)

### 客户端调用

> 客户端

```java
/**
 *类说明：rpc框架的客户端代理部分,交给Spring 托管
 * 1、动态代理的实现中，不再连接服务器，而是直接发送请求
 * 2、客户端网络部分的主体，包括Netty组件的初始化，连接服务器等
 */
@Service
public class RpcClientFrame implements Runnable{

    private static final Log LOG = LogFactory.getLog(RpcClientFrame.class);

    private ScheduledExecutorService executor = Executors
            .newScheduledThreadPool(1);
    private Channel channel;
    private EventLoopGroup group = new NioEventLoopGroup();

    /*是否用户主动关闭连接的标志值*/
    private volatile boolean userClose = false;
    /*连接是否成功关闭的标志值*/
    private volatile boolean connected = false;

    @Autowired
    private ClientInit clientInit;
    @Autowired
    private ClientBusiHandler clientBusiHandler;

    /*远程服务的代理对象，参数为客户端要调用的的服务*/
    public <T> T getRemoteProxyObject(final Class<?> serviceInterface) throws Exception {

        /*拿到一个代理对象，由这个代理对象通过网络进行实际的服务调用*/
        return (T)Proxy.newProxyInstance(serviceInterface.getClassLoader(),
                new Class<?>[]{serviceInterface},
                new DynProxy(serviceInterface,clientBusiHandler));
    }

    /*动态代理，实现对远程服务的访问*/
    private static class DynProxy implements InvocationHandler{
        private Class<?> serviceInterface;
        private ClientBusiHandler clientBusiHandler;

        public DynProxy(Class<?> serviceInterface, ClientBusiHandler clientBusiHandler) {
            this.serviceInterface = serviceInterface;
            this.clientBusiHandler = clientBusiHandler;
        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args)
                throws Throwable {
            Map<String,Object> content = new HashMap<>();
            content.put("siName",serviceInterface.getName());
            content.put("methodName",method.getName());
            content.put("paraTypes",method.getParameterTypes());
            content.put("args",args);
            return clientBusiHandler.send(content);
        }
    }

    public boolean isConnected() {
        return connected;
    }

    /*连接服务器*/
    public void connect(int port, String host) throws Exception {

        try {
            Bootstrap b = new Bootstrap();
            b.group(group).channel(NioSocketChannel.class)
                    .option(ChannelOption.TCP_NODELAY, true)
                    .handler(clientInit);
            // 发起异步连接操作
            ChannelFuture future = b.connect(
                    new InetSocketAddress(host, port)).sync();
            channel = future.sync().channel();
            /*连接成功后通知等待线程，连接已经建立*/
            synchronized (this){
                this.connected = true;
                this.notifyAll();
            }
            future.channel().closeFuture().sync();
        } finally {
            if(!userClose){/*非用户主动关闭，说明发生了网络问题，需要进行重连操作*/
                System.out.println("发现异常，可能发生了服务器异常或网络问题，" +
                        "准备进行重连.....");
                //再次发起重连操作
                executor.execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            TimeUnit.SECONDS.sleep(1);
                            try {
                                // 发起重连操作
                                connect(NettyConstant.REMOTE_PORT,
                                        NettyConstant.REMOTE_IP);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                });
            }else{/*用户主动关闭，释放资源*/
                channel = null;
                group.shutdownGracefully().sync();
                connected = false;
//                synchronized (this){
//                    this.connected = false;
//                    this.notifyAll();
//                }
            }
        }
    }

    @Override
    public void run() {
        try {
            connect(NettyConstant.REMOTE_PORT, NettyConstant.REMOTE_IP);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void close() {
        userClose = true;
        channel.close();
    }

    @PostConstruct
    public void startNet() throws InterruptedException {
        new Thread(this).start();
        while(!this.isConnected()){
            synchronized (this){
                this.wait();
            }
        }
        LOG.info("网络通信已准备好，可以进行业务操作了........");
    }

    @PreDestroy
    public void stopNet(){
        close();
    }

}
```

>发送请求: 注意这里是RPC与Netty的结合

```java
@Service
@ChannelHandler.Sharable
public class ClientBusiHandler extends SimpleChannelInboundHandler<MyMessage> {

    private static final Log LOG = LogFactory.getLog(ClientBusiHandler.class);
    private ChannelHandlerContext ctx;
    private final ConcurrentHashMap<Long, BlockingQueue<Object>> responseMap
            = new ConcurrentHashMap<Long, BlockingQueue<Object>>();

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
        super.handlerAdded(ctx);
        this.ctx = ctx;
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, MyMessage msg) throws Exception {
        if (msg.getMyHeader() != null
                && msg.getMyHeader().getType() == MessageType.SERVICE_RESP
                .value()) {
            long sessionId = msg.getMyHeader().getSessionID();
            boolean result =  (boolean)msg.getBody();
            BlockingQueue<Object> msgQueue = responseMap.get(sessionId);
            msgQueue.put(result);
        }
    }

    public Object send(Object message) throws InterruptedException {
        if(ctx.channel()==null||!ctx.channel().isActive()){
            throw new IllegalStateException("和服务器还未未建立起有效连接！" +
                    "请稍后再试！！");
        }
        MyMessage msg = new MyMessage();
        MyHeader myHeader = new MyHeader();
        Random r = new Random();
        long sessionId = r.nextLong()+1;
        myHeader.setSessionID(sessionId);
        myHeader.setType(MessageType.SERVICE_REQ.value());
        msg.setMyHeader(myHeader);
        msg.setBody(message);
        BlockingQueue<Object> msgQueue = new ArrayBlockingQueue<>(1);
        responseMap.put(sessionId,msgQueue);
        ctx.writeAndFlush(msg);
        Object result =  msgQueue.take();
        LOG.info("获取到服务端的处理结果"+result);
        return result;
    }
}
```



### 服务端处理

启动服务注册类

```java
@Service
public class RpcServerFrame implements Runnable{

    @Autowired
    private RegisterService registerService;
    @Autowired
    private ServerInit serverInit;

	private static final Log LOG = LogFactory.getLog(RpcServerFrame.class);
    private EventLoopGroup bossGroup = new NioEventLoopGroup();
    private EventLoopGroup workerGroup = new NioEventLoopGroup();

    public void bind() throws Exception {
        ServerBootstrap b = new ServerBootstrap();
        b.group(bossGroup, workerGroup).channel(NioServerSocketChannel.class)
            .option(ChannelOption.SO_BACKLOG, 1024)
            .childHandler(serverInit);

        // 绑定端口，同步等待成功
        b.bind(NettyConstant.REMOTE_PORT).sync();
        LOG.info("网络服务已准备好，可以进行业务操作了....... : "
            + (NettyConstant.REMOTE_IP + " : "
                + NettyConstant.REMOTE_PORT));
    }

    @PostConstruct
    public void startNet() throws Exception {
        // 注册映射关系
        registerService.regService(SendSms.class.getName(), SendSmsImpl.class);
        new Thread(this).start();
    }

    @PreDestroy
    public void stopNet() throws InterruptedException {
        bossGroup.shutdownGracefully().sync();
        workerGroup.shutdownGracefully().sync();
    }

    @Override
    public void run() {
        try {
            bind();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

> Handler中处理调用

```java
@Service
@ChannelHandler.Sharable
public class ServerBusiHandler
        extends SimpleChannelInboundHandler<MyMessage> {
    private static final Log LOG
            = LogFactory.getLog(ServerBusiHandler.class);

    @Autowired
    private RegisterService registerService;

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, MyMessage msg)
            throws Exception {
        LOG.info(msg);
        MyMessage message = new MyMessage();
        MyHeader myHeader = new MyHeader();
        myHeader.setSessionID(msg.getMyHeader().getSessionID());
        myHeader.setType(MessageType.SERVICE_RESP.value());
        message.setMyHeader(myHeader);
        Map<String,Object> content = (HashMap<String,Object>)msg.getBody();
        /*方法所在类名接口名*/
        String serviceName = (String) content.get("siName");
        /*方法的名字*/
        String methodName = (String) content.get("methodName");
        /*方法的入参类型*/
        Class<?>[] paramTypes = (Class<?>[]) content.get("paraTypes");
        /*方法的入参的值*/
        Object[] args = (Object[]) content.get("args");
        /*从容器中拿到服务的Class对象*/
        Class serviceClass = registerService.getLocalService(serviceName);
        if(serviceClass == null){
            throw new ClassNotFoundException(serviceName+ " not found");
        }

        /*通过反射，执行实际的服务*/
        Method method = serviceClass.getMethod(methodName, paramTypes);
        boolean result  = (boolean)method.invoke(serviceClass.newInstance(),args);
        message.setBody(result);
        ctx.writeAndFlush(message);
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx)
            throws Exception {
        LOG.info(ctx.channel().remoteAddress()+" 主动断开了连接!");
    }

}
```

