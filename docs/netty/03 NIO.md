::: tip

NIO 库是在 JDK 1.4 中引入的。NIO 弥补了原来的 BIO 的不足，它在标准 Java 代码中提供了高速的、面向块的 I/O。NIO被称为 no-blocking io 或者 new io都说得通

:::



## NIO与BIO的主要区别

### 面向流和面向缓冲区

Java NIO和IO之间第一个最大的区别是，IO是面向流的，NIO是面向缓冲区的。 Java IO面向流意味着每次从流中读一个或多个字节，直至读取所有字节，它们没有被缓存在任何地方。此外，它不能前后移动流中的数据。如果需要前后移动从流中读取的数据，需要先将它缓存到一个缓冲区。 Java NIO的缓冲导向方法略有不同。数据读取到一个它稍后处理的缓冲区，需要时可在缓冲区中前后移动。这就增加了处理过程中的灵活性。但是，还需要检查是否该缓冲区中包含所有需要处理的数据。而且，需确保当更多的数据读入缓冲区时，不要覆盖缓冲区里尚未处理的数据



### **阻塞与非阻塞IO**

Java IO的各种流是阻塞的。这意味着，当一个线程调用read() 或 write()时，该线程被阻塞，直到有一些数据被读取，或数据完全写入。该线程在此期间不能再干任何事情了。

 Java NIO的非阻塞模式，使一个线程从某通道发送请求读取数据，但是它仅能得到目前可用的数据，如果目前没有数据可用时，就什么都不会获取。而不是保持线程阻塞，所以直至数据变的可以读取之前，该线程可以继续做其他的事情。 非阻塞写也是如此。一个线程请求写入一些数据到某通道，但不需要等待它完全写入，这个线程同时可以去做别的事情。 线程通常将非阻塞IO的空闲时间用于在其它通道上执行IO操作，所以一个单独的线程现在可以管理多个输入和输出通道（channel）。



## NIO之Reactor

“反应”即“倒置”，“控制逆转”,具体事件处理程序不调用反应器，而向反应器注册一个事件处理器，表示自己对某些事件感兴趣，有时间来了，具体事件处理程序通过事件处理器对某个指定的事件发生做出反应

> 路人甲就是具体事件处理程序，大堂经理就是所谓的反应器



![https://note.youdao.com/yws/public/resource/8ef33654f746921ad769ad9fe91a4c8f/xmlnote/OFFICE6710DCE147214EFCB60F0E475BBF7B3B/10071](/images/netty/10071.png)



## NIO三大组件

> 1. Selector
> 2. Channel
> 3. Buffer

### Selector

Java NIO的选择器允许一个单独的线程来监视多个输入通道，你可以注册多个通道使用一个选择器(Selectors)，然后使用一个单独的线程来操作这个选择器，进而“选择”通道：这些通道里已经有可以处理的输入，或者选择已准备写入的通道。这种选择机制，使得一个单独的线程很容易来管理多个通道。

应用程序将向Selector对象注册需要它关注的Channel，以及具体的某一个Channel会对哪些IO事件感兴趣。Selector中也会维护一个“已经注册的Channel”的容器。

### Channel

通道，被建立的一个应用程序和操作系统交互事件、传递内容的渠道（注意是连接到操作系统）。那么既然是和操作系统进行内容的传递，那么说明应用程序可以通过通道读取数据，也可以通过通道向操作系统写数据，而且可以同时进行读写。

- 所有被Selector（选择器）注册的通道，只能是继承了SelectableChannel类的子类。
- ServerSocketChannel：应用服务器程序的监听通道。只有通过这个通道，应用程序才能向操作系统注册支持“多路复用IO”的端口监听。同时支持UDP协议和TCP协议。
- ScoketChannel：TCP Socket套接字的监听通道，一个Socket套接字对应了一个客户端IP：端口 到 服务器IP：端口的通信连接。

通道中的数据总是要先读到一个Buffer，或者总是要从一个Buffer中写入。

### Buffer

JDK NIO是面向缓冲的。Buffer就是这个缓冲，用于和NIO通道进行交互。数据是从通道读入缓冲区，从缓冲区写入到通道中的。以写为例，应用程序都是将数据写入缓冲，再通过通道把缓冲的数据发送出去，读也是一样，数据总是先从通道读到缓冲，应用程序再读缓冲的数据。

缓冲区本质上是一块可以写入数据，然后可以从中读取数据的内存（其实就是数组）。这块内存被包装成NIO Buffer对象，并提供了一组方法，用来方便的访问该块内存。



![https://note.youdao.com/yws/public/resource/8ef33654f746921ad769ad9fe91a4c8f/xmlnote/OFFICEC226BF21871B4E32B06A57F9E239AD3B/10072](/images/netty/10072.png)





## NIO实现

[Source Code](https://github.com/Q10Viking/learncode/tree/main/Netty/NIO/nio)

> server



:::: code-group
::: code-group-item NioServer

```java
public class NioServer {
    private ServerHandler serverHandler;

    public NioServer() {
        serverHandler = new ServerHandler(DEFAULT_PORT);
    }

    public void start(){
        new Thread(serverHandler,"Server").start();
    }

    public static void main(String[] args) {
        new NioServer().start();
    }
}
/**
 * 四月 09, 2023 8:22:22 下午 org.hzz.server.ServerHandler <init>
 * 信息: 服务器已启动，端口号：8080
 * 四月 09, 2023 8:22:33 下午 org.hzz.server.ServerHandler handleInput
 * 信息: 接受到新的连接：/127.0.0.1:14804
 * 四月 09, 2023 8:22:52 下午 org.hzz.server.ServerHandler handleInput
 * 信息: 接受到消息：你好
 */
```

:::
::: code-group-item ServerHandler

```java
public class ServerHandler implements Runnable {
    private static Logger logger = Logger.getLogger(ServerHandler.class.getName());
    private volatile boolean started;
    private final int port;
    private Selector selector;
    private ServerSocketChannel serverSocketChannel;

    public ServerHandler(int port) {
        this.port = port;
        try {
            /*创建选择器的实例*/
            selector = Selector.open();
            /*创建ServerSocketChannel的实例*/
            serverSocketChannel = ServerSocketChannel.open();
            /*设置通道为非阻塞模式*/
            serverSocketChannel.configureBlocking(false);
            /*绑定端口*/
            serverSocketChannel.socket().bind(new InetSocketAddress(port));
            /*注册事件，表示关心客户端连接*/
            serverSocketChannel.register(selector, SelectionKey.OP_ACCEPT);
            logger.info("服务器已启动，端口号：" + port);
            started = true;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void run() {
        while (started) {
            try {
                /*阻塞等待就绪的Channel*/
                selector.select();
                /*获取事件的集合*/
                Set<SelectionKey> selectionKeys = selector.selectedKeys();
                Iterator<SelectionKey> iterator = selectionKeys.iterator();
                while (iterator.hasNext()) {
                    SelectionKey key = iterator.next();
                    iterator.remove();
                    /*处理事件*/
                    try {
                        handleInput(key);
                    } catch (Exception e) {
                        if (key != null) {
                            /*取消特定的注册关系*/
                            key.cancel();
                            if (key.channel() != null) {
                                key.channel().close();
                            }
                        }
                    }
                }
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private void handleInput(SelectionKey key) throws IOException {
        if (key.isValid()) {
            /*处理新接入的请求消息*/
            if (key.isAcceptable()) {
                /*获取关心当前事件的Channel*/
                ServerSocketChannel ssc = (ServerSocketChannel) key.channel();
                /*接受连接*/
                SocketChannel sc = ssc.accept();
                logger.info("接受到新的连接：" + sc.getRemoteAddress());
                /*设置为非阻塞模式*/
                sc.configureBlocking(false);
                /*注册读事件*/
                sc.register(selector, SelectionKey.OP_READ);
            }
            /*读消息*/
            if (key.isReadable()) {
                SocketChannel sc = (SocketChannel) key.channel();
                /*创建ByteBuffer，开辟一个缓冲区*/
                ByteBuffer buffer = ByteBuffer.allocate(1024);
                int readBytes = sc.read(buffer);
                if (readBytes > 0) {
                    /*将缓冲区当前的limit设置为position=0，用于后续对缓冲区的读取操作*/
                    buffer.flip();
                    /*根据缓冲区可读字节数创建字节数组*/
                    byte[] bytes = new byte[buffer.remaining()];
                    /*将缓冲区可读字节数组复制到新建的数组中*/
                    buffer.get(bytes);
                    String msg = new String(bytes, "UTF-8");
                    logger.info("接受到消息：" + msg);
                    /*回复消息*/
                    String response = "Hello," + msg + ",Now is " + LocalDateTime.now();
                    doWrite(sc, response);
                }
            }
        }
    }

    private void doWrite(SocketChannel channel, String response) throws IOException {
        /*将消息编码为字节数组*/
        byte[] bytes = response.getBytes();
        /*根据数组容量创建ByteBuffer*/
        ByteBuffer writeBuffer = ByteBuffer.allocate(bytes.length);
        /*将字节数组复制到缓冲区*/
        writeBuffer.put(bytes);
        /*flip操作*/
        writeBuffer.flip();
        /*发送缓冲区的字节数组*/
        channel.write(writeBuffer);
    }

    public void stop() {
        started = false;
    }
}
```

:::
::::



> 客户端



:::: code-group
::: code-group-item NioClient

```java
public class NioClient {
    private ClientHandler clientHandler;
    public NioClient() {
        clientHandler = new ClientHandler(DEFAULT_SERVER_IP,DEFAULT_PORT);
    }

    public void start(){
        new Thread(clientHandler,"Client").start();
    }

    public boolean sendMsg(String msg){
        return clientHandler.sendMsg(msg);
    }

    public static void main(String[] args) throws IOException {
        NioClient nioClient = new NioClient();
        nioClient.start();
        Scanner scanner = new Scanner(System.in);
        while (nioClient.sendMsg(scanner.nextLine()));
    }
}
/**
 * 四月 09, 2023 8:22:33 下午 org.hzz.client.ClientHandler doConnect
 * 信息: doConnect 连接失败 注册OP_CONNECT
 * 四月 09, 2023 8:22:33 下午 org.hzz.client.ClientHandler handleInput
 * 信息: handleInput 连接成功
 * 四月 09, 2023 8:22:33 下午 org.hzz.client.ClientHandler handleInput
 * 信息: true
 * 你好
 * 四月 09, 2023 8:22:52 下午 org.hzz.client.ClientHandler doWrite
 * 信息: 客户端发送消息成功：你好
 * 四月 09, 2023 8:22:52 下午 org.hzz.client.ClientHandler handleInput
 * 信息: 客户端收到消息：Hello,你好,Now is 2023-04-09T20:22:52.181
 */
```
:::
::: code-group-item ClientHandler

```java

public class ClientHandler implements Runnable{
    private static Logger logger = Logger.getLogger(ClientHandler.class.getName());
    private final String ip;
    private final int port;
    private Selector selector;
    private SocketChannel socketChannel;
    private volatile boolean started;

    public ClientHandler(String ip, int port) {
        this.ip = ip;
        this.port = port;
        try {
            selector = Selector.open();
            socketChannel = SocketChannel.open();
            socketChannel.configureBlocking(false);
            started = true;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void run() {
        doConnect();

        while (started){
            try {
                selector.select();
                Set<SelectionKey> selectionKeys = selector.selectedKeys();
                Iterator<SelectionKey> iterator = selectionKeys.iterator();
                while(iterator.hasNext()){
                    SelectionKey key = iterator.next();
                    /*我们必须首先将处理过的 SelectionKey 从选定的键集合中删除。
                    如果我们没有删除处理过的键，那么它仍然会在主集合中以一个激活
                    的键出现，这会导致我们尝试再次处理它。*/
                    iterator.remove();
                    handleInput(key);
                }
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private void handleInput(SelectionKey key) throws IOException {
        if (key.isValid()){
            SocketChannel sc = (SocketChannel) key.channel();
            if (key.isConnectable()){
                if (sc.finishConnect()){
                    //TODO
                    logger.info("handleInput 连接成功");
                    logger.info(String.valueOf(sc == socketChannel));
                    sc.register(selector, SelectionKey.OP_READ);
                }else {
                    System.exit(1);
                }
            } else if (key.isReadable()) {
                ByteBuffer readBuffer = ByteBuffer.allocate(1024);
                int readBytes = sc.read(readBuffer);
                if (readBytes > 0) {
                    readBuffer.flip();
                    byte[] bytes = new byte[readBuffer.remaining()];
                    readBuffer.get(bytes);
                    String body = new String(bytes, "UTF-8");
                    logger.info("客户端收到消息：" + body);
                } else if (readBytes < 0) {
                    key.cancel();
                    sc.close();
                } else {
                    //读到0字节，忽略
                }
            }
        }
    }

    private void doConnect() {
        try {
            if (socketChannel.connect(new InetSocketAddress(ip, port))) {
                logger.info("doConnect 连接成功");
                socketChannel.register(selector, SelectionKey.OP_READ);
            } else {
                logger.info("doConnect 连接失败 注册OP_CONNECT");
                socketChannel.register(selector, SelectionKey.OP_CONNECT);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void doWrite(SocketChannel channel, String request) throws IOException {
        byte[] bytes = request.getBytes();
        ByteBuffer writeBuffer = ByteBuffer.allocate(bytes.length);
        writeBuffer.put(bytes);
        writeBuffer.flip();
        channel.write(writeBuffer);
        if (!writeBuffer.hasRemaining()) {
            logger.info("客户端发送消息成功：" + request);
        }
    }

    //写数据对外暴露的API
    public boolean sendMsg(String msg)  {
        try {
            doWrite(socketChannel,msg);
            return true;
        } catch (IOException e) {
            logger.info("客户端发送消息失败：" + msg);
            return false;
        }
    }
}

```
:::
::::



