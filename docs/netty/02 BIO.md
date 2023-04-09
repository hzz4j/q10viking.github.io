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



## BIO通信模型



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

