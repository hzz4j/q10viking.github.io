---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /netty/
typora-root-url: ..\.vuepress\public
---



::: tip

BIO，意为Blocking I/O，即阻塞的I/O

:::



## BIO

[Source Code]()

在BIO中类ServerSocket负责绑定IP地址，启动监听端口，等待客户连接；客户端Socket类的实例发起连接操作，ServerSocket接受连接后产生一个新的服务端socket实例负责和客户端socket实例通过输入和输出流进行通信。

![https://note.youdao.com/yws/public/resource/8ef33654f746921ad769ad9fe91a4c8f/xmlnote/OFFICE88A3FA3542E34ED69248469B582308CB/10065](/images/netty/10065.png)

> bio的阻塞，主要体现在两个地方

1. 若一个服务器启动就绪，那么主线程就一直在等待着客户端的连接，这个等待过程中主线程就一直在阻塞
2. 在连接建立之后，在读取到socket信息之前，线程也是一直在等待，一直处于阻塞的状态下的



### 实现

::: tip

在这个实现中，服务端只有一个线程来负责监听和读写客户端，每次都是只有一个线程在处理

:::

> 服务端

```java
public class SingleServer {
    private static Logger logger = Logger.getLogger("SingleServer");
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket();
        serverSocket.bind(new InetSocketAddress(8080));
        logger.info("服务器启动成功");
        int count = 0;
        try{
            while(true) {
                // 等待客户端链接
                Socket socket = serverSocket.accept();
                logger.info("客户端链接成功");

                try(
                        ObjectInputStream inputStream = new ObjectInputStream(socket.getInputStream());
                        ObjectOutputStream outputStream = new ObjectOutputStream(socket.getOutputStream());
                        ){
                    // 读取客户端发送的数据
                    String username = inputStream.readUTF();
                    logger.info("客户端发送的数据为：" + username);

                    // 向客户端发送数据
                    outputStream.writeUTF("hello " + username);
                    outputStream.flush();
                }finally {
                    socket.close();
                }
            }
        }finally {
            serverSocket.close();
        }

    }
}
```



> 客户端

```java
public class Client {
    private static Logger logger = Logger.getLogger("Client");
    public static void main(String[] args) throws IOException {
        //客户端启动必备
        Socket socket = null;
        //实例化与服务端通信的输入输出流
        ObjectOutputStream output = null;
        ObjectInputStream input = null;
        //服务器的通信地址
        InetSocketAddress addr
                = new InetSocketAddress("127.0.0.1",8080);

        try{
            socket = new Socket();
            socket.connect(addr);//连接服务器
            logger.info("Connect Server success!!");
            output = new ObjectOutputStream(socket.getOutputStream());
            input = new ObjectInputStream(socket.getInputStream());
            logger.info("Ready send message.....");
            /*向服务器输出请求*/
            output.writeUTF("Q10Viking");
            output.flush();

            //接收服务器的输出
            logger.info(input.readUTF());
        }finally{
            if (socket!=null) socket.close();
            if (output!=null) output.close();
            if (input!=null) input.close();

        }

    }
}

```



## BIO通信模型

::: tip

传统BIO通信模型：采用BIO通信模型的服务端，通常由一个独立的Acceptor线程负责监听客户端的连接，它接收到客户端连接请求之后为每个客户端创建一个新的线程进行链路处理，处理完成后，通过输出流返回应答给客户端，线程销毁。即典型的一请求一应答模型，同时数据的读取写入也必须阻塞在一个线程内等待其完成。

:::



![https://note.youdao.com/yws/public/resource/8ef33654f746921ad769ad9fe91a4c8f/xmlnote/OFFICE267FBCB86CFB4C8DAF0AF3FB3ACA0BC4/10066](/images/netty/10066.png)



该模型最大的问题就是缺乏弹性伸缩能力，当客户端并发访问量增加后，服务端的线程个数和客户端并发访问数呈1:1的正比关系，Java中的线程也是比较宝贵的系统资源，线程数量快速膨胀后，系统的性能将急剧下降，随着访问量的继续增大，系统最终就**死-掉-了**。

### 实现

```java
public class ThreadServer {
    private static Logger logger = Logger.getLogger("ThreadServer");
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(8080);
        Thread acceptThread = new Thread(new AcceptThread(serverSocket));
        acceptThread.start();
    }

    static class AcceptThread implements Runnable{
        private ServerSocket serverSocket;
        public AcceptThread(ServerSocket serverSocket) {
            this.serverSocket = serverSocket;
        }

        @Override
        public void run() {
            while(true){
                try {
                    new Thread(new ServerTask(serverSocket.accept())).start();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    static class ServerTask implements Runnable{
        private Socket socket;
        public ServerTask(Socket socket) {
            this.socket = socket;
        }

        @Override
        public void run() {
            logger.info(Thread.currentThread().getName()+"客户端链接成功");
            try(
                    ObjectInputStream inputStream = new ObjectInputStream(socket.getInputStream());
                    ObjectOutputStream outputStream = new ObjectOutputStream(socket.getOutputStream());
                    ){
                // 读取客户端发送的数据
                String username = inputStream.readUTF();
                System.out.println("客户端发送的数据为：" + username);

                // 向客户端发送数据
                outputStream.writeUTF("hello " + username);
                outputStream.flush();
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }
}
/**
 * 四月 09, 2023 5:23:14 下午 org.hzz.server.ThreadServer$ServerTask run
 * 信息: Thread-2客户端链接成功
 * 客户端发送的数据为：Q10Viking
 * 四月 09, 2023 5:24:01 下午 org.hzz.server.ThreadServer$ServerTask run
 * 信息: Thread-3客户端链接成功
 * 客户端发送的数据为：Q10Viking
 * 四月 09, 2023 5:24:28 下午 org.hzz.server.ThreadServer$ServerTask run
 * 信息: Thread-4客户端链接成功
 * 客户端发送的数据为：Q10Viking
 */
```



## BIO线程池模型

为了改进这种一连接一线程的模型，我们可以使用线程池来管理这些线程，实现1个或多个线程处理N个客户端的模型（但是底层还是使用的同步阻塞I/O），通常被称为“伪异步I/O模型“。

我们知道，如果使用CachedThreadPool线程池（不限制线程数量），其实除了能自动帮我们管理线程（复用），看起来也就像是1:1的客户端：线程数模型，而使用FixedThreadPool我们就有效的控制了线程的最大数量，保证了系统有限的资源的控制，实现了N:M的伪异步I/O模型。

![https://note.youdao.com/yws/public/resource/8ef33654f746921ad769ad9fe91a4c8f/xmlnote/OFFICE1197A20649594EBFAA120924538DD2BE/10067](/images/netty/10067.png)



正因为限制了线程数量，如果发生读取数据较慢时（比如数据量大、网络传输慢等），大量并发的情况下，其他接入的消息，只能一直等待，这就是最大的弊端

### 实现

```java
public class ThreadPoolServer {
    private static Logger logger = Logger.getLogger("ThreadPoolServer");

    public static void main(String[] args) throws Exception{
        ServerSocket serverSocket = new ServerSocket(8080);
        Thread acceptThread = new Thread(new AcceptThread(serverSocket));
        acceptThread.start();
    }

    static class AcceptThread implements Runnable{
        private static ExecutorService executorService = Executors.newFixedThreadPool(
                Runtime.getRuntime().availableProcessors() * 2
        );

        private ServerSocket serverSocket;
        public AcceptThread(ServerSocket serverSocket) {
            this.serverSocket = serverSocket;
        }
        @Override
        public void run() {
            while(true){
                try {
                    // 线程池提交任务
                    executorService.execute(new ServerTask(serverSocket.accept()));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    static class ServerTask implements Runnable{
        private Socket socket;
        public ServerTask(Socket socket) {
            this.socket = socket;
        }

        @Override
        public void run() {
            logger.info(Thread.currentThread().getName()+"客户端链接成功");
            try(
                    ObjectInputStream inputStream = new ObjectInputStream(socket.getInputStream());
                    ObjectOutputStream outputStream = new ObjectOutputStream(socket.getOutputStream());
            ){
                // 读取客户端发送的数据
                String username = inputStream.readUTF();
                System.out.println("客户端发送的数据为：" + username);

                // 向客户端发送数据
                outputStream.writeUTF("hello " + username);
                outputStream.flush();
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }
}
/**
 * 四月 09, 2023 5:33:26 下午 org.hzz.server.ThreadPoolServer$ServerTask run
 * 信息: pool-1-thread-1客户端链接成功
 * 客户端发送的数据为：Q10Viking
 * 四月 09, 2023 5:34:02 下午 org.hzz.server.ThreadPoolServer$ServerTask run
 * 信息: pool-1-thread-2客户端链接成功
 * 客户端发送的数据为：Q10Viking
 */
```















## 