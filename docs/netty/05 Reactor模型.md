---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /netty/
typora-root-url: ..\.vuepress\public
---



## **单线程Reactor模式流程**

> Basic Reactor Design

- 服务器端的Reactor是一个线程对象，该线程会启动事件循环，并使用Selector(选择器)来实现IO的多路复用。注册一个Acceptor事件处理器到Reactor中，Acceptor事件处理器所关注的事件是ACCEPT事件，这样Reactor会监听客户端向服务器端发起的连接请求事件(ACCEPT事件)
- 客户端向服务器端发起一个连接请求，Reactor监听到了该ACCEPT事件的发生并将该ACCEPT事件派发给相应的Acceptor处理器来进行处理。Acceptor处理器通过accept()方法得到与这个客户端对应的连接(SocketChannel)，然后将该连接所关注的READ事件以及对应的READ事件处理器注册到Reactor中，这样一来Reactor就会监听该连接的READ事件了。
- 当Reactor监听到有读或者写事件发生时，将相关的事件派发给对应的处理器进行处理。比如，读处理器会通过SocketChannel的read()方法读取数据，此时read()操作可以直接读取到数据，而不会堵塞与等待可读的数据到来。
- 每当处理完所有就绪的感兴趣的I/O事件后，Reactor线程会再次执行select()阻塞等待新的事件就绪并将其分派给对应处理器进行处理

> 注意，Reactor的单线程模式的单线程主要是针对于I/O操作而言，也就是所有的I/O的accept()、read()、write()以及connect()操作都在一个线程上完成的

但在目前的单线程Reactor模式中，不仅I/O操作在该Reactor线程上，连非I/O的业务操作也在该线程上进行处理了，这可能会大大延迟I/O请求的响应。所以我们应该将非I/O的业务逻辑操作从Reactor线程上卸载，以此来加速Reactor线程对I/O请求的响应

![https://note.youdao.com/yws/public/resource/8ef33654f746921ad769ad9fe91a4c8f/xmlnote/OFFICED5F6435B59444264B2E0B3F4A9FE3468/10075](/images/netty/10075.png)



```java
public class Reactor implements Runnable{
    protected static Logger logger = Logger.getLogger("Reactor");
    private final static int MAXIN = 65535;
    private final static int MAXOUT = 65535;
    final int port;
    final Selector selector;
    final ServerSocketChannel serverSocketChannel;

    public Reactor(int port) throws IOException {
        this.port = port;
        this.selector = Selector.open();
        this.serverSocketChannel = ServerSocketChannel.open();
        this.serverSocketChannel.socket().bind(new InetSocketAddress(port));
        this.serverSocketChannel.configureBlocking(false);
        SelectionKey key = serverSocketChannel.register(selector, 0);
        key.interestOps(SelectionKey.OP_ACCEPT);
        key.attach(new Acceptor());
        logger.info("Reactor started on port "+port);
    }
    @Override
    public void run() {     // normally in a new Thread
        try {
            while (!Thread.interrupted()) {
                selector.select();
                // ... deal with selected keys ...
                Set<SelectionKey> selectionKeys = selector.selectedKeys();
                if(selectionKeys.isEmpty()){
                    logger.info(Thread.currentThread().getName()+": selectionKeys is empty");
                    continue;
                }
                logger.info(Thread.currentThread().getName()+": selectionKeys size is "+selectionKeys.size());
                Iterator<SelectionKey> iterator = selectionKeys.iterator();
                while(iterator.hasNext()){
                    dispatch(iterator.next());
                    //iterator.remove();
                }
                selectionKeys.clear();

            }
        } catch (IOException ex) { /* ... */ }

    }

    void dispatch(SelectionKey key){
        Runnable r = (Runnable) key.attachment(); // Accept or Handler 都实现了Runnable接口
        if(r != null){
            r.run();
        }
    }

    class Acceptor implements Runnable{
        @Override
        public void run() {
            try {
                SocketChannel socketChannel = serverSocketChannel.accept();
                if(socketChannel != null){
                    logger.info("accept a new connection"+socketChannel.getRemoteAddress());
                    new Handler(selector, socketChannel);
                }
            } catch (IOException e) {/*...*/}
        }
    }

    final class Handler implements Runnable{
        static final int READING = 0, SENDING = 1;
        int state = READING;
        final SocketChannel socketChannel;
        final SelectionKey selectionKey;
        ByteBuffer input = ByteBuffer.allocate(MAXIN);
        ByteBuffer output = ByteBuffer.allocate(MAXOUT);

        Handler(Selector selector, SocketChannel socketChannel) throws IOException {
            this.socketChannel = socketChannel;
            socketChannel.configureBlocking(false);
            selectionKey = socketChannel.register(selector, 0);
            selectionKey.attach(this);
            selectionKey.interestOps(SelectionKey.OP_READ);
            selector.wakeup();
        }
        @Override
        public void run() {
            try {
                if (state == READING) read();
                else if (state == SENDING) send();
            } catch (IOException ex) { /* ... */ }
        }

        void read() throws IOException {
            // ... read data ...
            socketChannel.read(input);
            if(isInputComplete()){
                process();
                state = SENDING;
                selectionKey.interestOps(SelectionKey.OP_WRITE);
            }
        }

        void send() throws IOException {
            // ... send data ...
            output.put("hello client".getBytes(StandardCharsets.UTF_8));
            output.flip();
            socketChannel.write(output);
            state = READING;
            selectionKey.interestOps(SelectionKey.OP_READ);
            if(isOutputComplete()){
                logger.info(Thread.currentThread().getName()+"关闭"+socketChannel.getRemoteAddress());
                selectionKey.cancel();
                socketChannel.close();
            }
        }

        boolean isInputComplete(){
            return true;
        }
        boolean isOutputComplete(){
            return true;
        }
        void process() throws IOException {
            // ... process data ...
            if(input.position() > 0){
                input.flip();
                byte[] bytes = new byte[input.limit()];
                input.get(bytes);
                logger.info(Thread.currentThread().getName()+": read data is "+new String(bytes, StandardCharsets.UTF_8));
                input.clear();
            }
        }
    }
}

```



> 重构版

:::: code-group
::: code-group-item BasicReactor

```java
/**
 * Basic Reactor Design
 */
public class BasicReactor extends Reactor{
    final ServerSocketChannel serverSocketChannel;
    private volatile boolean started = false;
    public BasicReactor(int port) throws IOException {
        serverSocketChannel = ServerSocketChannel.open();
        serverSocketChannel.bind(new InetSocketAddress(port));
        serverSocketChannel.configureBlocking(false);
        serverSocketChannel.register(selector,
                SelectionKey.OP_ACCEPT,
                getAcceptor());
        started = true;
        logger.info("Server started at port: "+port);
    }

    public Acceptor getAcceptor(){
        return new Acceptor();
    }

    public static void main(String[] args) throws IOException{
        new BasicReactor(8080).run();
    }


    class Acceptor implements Runnable{
        @Override
        public void run() {
            try{
                SocketChannel socketChannel = serverSocketChannel.accept();
                logger.info("客户端连接"+socketChannel.getRemoteAddress());
                getHandler(socketChannel);
            }catch (IOException e){}

        }

        Handler getHandler(SocketChannel socketChannel) throws IOException {
            return new Handler(socketChannel);
        }
    }


    class Handler implements Runnable{
        protected final static int MAXIN = 65535;
        protected final static int MAXOUT = 65535;
        static final int READING = 0, SENDING = 1;
        protected final SocketChannel socketChannel;
        protected final SelectionKey selectionKey;
        ByteBuffer input = ByteBuffer.allocate(MAXIN);
        ByteBuffer output = ByteBuffer.allocate(MAXOUT);
        int state = READING;
        public Handler(SocketChannel socketChannel) throws IOException{
            this.socketChannel = socketChannel;
            this.socketChannel.configureBlocking(false);
            selectionKey = this.socketChannel.register(selector, 0);
            registerHandler();
        }

        void registerHandler(){
            selectionKey.interestOps(SelectionKey.OP_READ);
            selectionKey.attach(this);
            selector.wakeup();
        }

        @Override
        public void run() {
            try{
                if (state == READING) read();
                else if(state == SENDING) send();
            }catch (IOException e){}
        }

        void read() throws IOException{
            // ... read data ...
            socketChannel.read(input);
            if(isInputComplete()){
                process();
                state = SENDING;
                selectionKey.interestOps(SelectionKey.OP_WRITE);
            }
        }

        void send() throws IOException{
            // ... send data ...
            output.put("hello client".getBytes(StandardCharsets.UTF_8));
            output.flip();
            socketChannel.write(output);
            state = READING;
            selectionKey.interestOps(SelectionKey.OP_READ);
            if(isOutputComplete()){
                logger.info(Thread.currentThread().getName()+"关闭"+socketChannel.getRemoteAddress());
                output.clear();
                selectionKey.cancel();
                socketChannel.close();
            }
        }

        boolean isInputComplete(){
            return true;
        }
        boolean isOutputComplete(){
            return true;
        }

        void process() throws IOException {
            // ... process data ...
            if(input.position() > 0){
                input.flip();
                byte[] bytes = new byte[input.limit()];
                input.get(bytes);
                logger.info(Thread.currentThread().getName()+": read data is "+new String(bytes, StandardCharsets.UTF_8));
                input.clear();
            }
        }
    }
}
```
:::
::: code-group-item Reactor

```java
public abstract class Reactor implements Runnable{
    protected static Logger logger = Logger.getLogger(Reactor.class.getName());
    protected Selector selector;

    public Reactor() throws IOException {
        this.selector = Selector.open();
    }
    @Override
    public void run() {
        try {
            while (!Thread.interrupted()) {
                doSelect();
                Iterator<SelectionKey> iterator = selector.selectedKeys().iterator();
                while (iterator.hasNext()){
                    SelectionKey key = iterator.next();
                    iterator.remove();
                    dispatch(key);
                }

            }
        }catch (IOException e){
            e.printStackTrace();
        }

    }

    protected int doSelect() throws IOException{
        return selector.select();
    }

    protected void dispatch(SelectionKey key){
        Runnable task = (Runnable) key.attachment();
        if(task != null) task.run();
    }
}
```
:::
::::



## **单线程Reactor，工作者线程池**

> WorkerThread Pools

单线程Reactor模式不同的是，添加了一个工作者线程池，并将非I/O操作从Reactor线程中移出转交给工作者线程池来执行。这样能够提高Reactor线程的I/O响应，不至于因为一些耗时的业务逻辑而延迟对后面I/O请求的处理

![https://note.youdao.com/yws/public/resource/8ef33654f746921ad769ad9fe91a4c8f/xmlnote/OFFICE4A2F9D2C8A8F4220BB69B68DC0E3AFCD/10076](/images/netty/10076)

> 多线程应用的位置主要体现在读取完一个客户端的完整请求之后，将这个请求任务提交给线程池去处理

```java
class Handler implements Runnable {
    // uses util.concurrent thread pool
    static PooledExecutor pool = new PooledExecutor(...);
    static final int PROCESSING = 3;
    // ...
    synchronized void read() { // ...
        socket.read(input);
        if (inputIsComplete()) {
            state = PROCESSING;
            pool.execute(new Processer());
        }
    }
    synchronized void processAndHandOff() {
        process();
        state = SENDING; // or rebind attachment
        sk.interest(SelectionKey.OP_WRITE);
    }
    class Processer implements Runnable {
        public void run() { processAndHandOff(); }
    }
}
```



> 实现: 注意主线成在处理完读之后就回到了selector.select()的阻塞状态。当线程池处理完请求之后，在改变selectionkey的感兴趣的事件的时候，selector是不会响应的，需要wakeup



:::: code-group
::: code-group-item WorkerThreadPoolRector

```java
public class WorkerThreadPoolRector extends BasicReactor{
    private static ExecutorService threadPools = Executors.newFixedThreadPool(
            Runtime.getRuntime().availableProcessors() * 4
    );
    public WorkerThreadPoolRector(int port) throws IOException {
        super(port);
    }

    @Override
    public Acceptor getAcceptor() {
        return new Acceptor();
    }

    public static void main(String[] args) throws IOException {
        new Thread(new WorkerThreadPoolRector(8080)).start();
    }

    class Acceptor extends BasicReactor.Acceptor{
        @Override
        public Handler getHandler(SocketChannel socketChannel) throws IOException {
            return new Handler(socketChannel);
        }
    }

    class Handler extends BasicReactor.Handler{
        public Handler(SocketChannel socketChannel) throws IOException {
            super(socketChannel);
        }

        synchronized void processAndHandOff() {
            super.process();
            setState(SENDING);
            selectionKey.interestOps(SelectionKey.OP_WRITE);
            // 唤醒selector,让其处理发送事件,不然的话，selector一直处于阻塞状态。上面的是select已经阻塞了
            // 而线程池处理到这里的时候,才刚刚注册OP_WRITE,selector还是阻塞的，所以需要唤醒
            selector.wakeup();
        }

        @Override
        void onInputComplete() {
            setState(PROCESSING);
            // 读取完毕，交给线程池处理
            threadPools.execute(new Processer());
        }

        class Processer implements Runnable{
            @Override
            public void run() {processAndHandOff();}
        }
    }
}
```
:::
::: code-group-item BasicReactor

```java
/**
 * Basic Reactor Design
 */
public class BasicReactor extends Reactor{
    final ServerSocketChannel serverSocketChannel;
    private volatile boolean started = false;
    public BasicReactor(int port) throws IOException {
        serverSocketChannel = ServerSocketChannel.open();
        serverSocketChannel.bind(new InetSocketAddress(port));
        serverSocketChannel.configureBlocking(false);
        serverSocketChannel.register(selector,
                SelectionKey.OP_ACCEPT,
                getAcceptor());
        started = true;
        logger.info("Server started at port: "+port);
    }

    public Acceptor getAcceptor(){
        return new Acceptor();
    }

    public static void main(String[] args) throws IOException{
        new BasicReactor(8080).run();
    }


    class Acceptor implements Runnable{
        @Override
        public void run() {
            try{
                SocketChannel socketChannel = serverSocketChannel.accept();
                logger.info("客户端连接"+socketChannel.getRemoteAddress());
                getHandler(socketChannel);
            }catch (IOException e){}

        }

        Handler getHandler(SocketChannel socketChannel) throws IOException {
            return new Handler(socketChannel);
        }
    }


    class Handler implements Runnable{
        protected final static int MAXIN = 65535;
        protected final static int MAXOUT = 65535;
        static final int READING = 0, SENDING = 1, PROCESSING = 2;
        protected final SocketChannel socketChannel;
        protected final SelectionKey selectionKey;
        ByteBuffer input = ByteBuffer.allocate(MAXIN);
        ByteBuffer output = ByteBuffer.allocate(MAXOUT);
        volatile int state = READING;
        public Handler(SocketChannel socketChannel) throws IOException{
            this.socketChannel = socketChannel;
            this.socketChannel.configureBlocking(false);
            selectionKey = this.socketChannel.register(selector, 0);
            registerHandler();
        }

        void registerHandler(){
            selectionKey.interestOps(SelectionKey.OP_READ);
            selectionKey.attach(this);
            selector.wakeup();
        }

        @Override
        public void run() {
            try{
                if (state == READING) read();
                else if(state == SENDING) send();
            }catch (IOException e){}
        }

        void read() throws IOException{
            // ... read data ...
            socketChannel.read(input);
            if(isInputComplete()){
                onInputComplete();
            }
        }

        void onInputComplete() throws IOException {
            // ... do something ...
            process();
            setState(SENDING);
            selectionKey.interestOps(SelectionKey.OP_WRITE);
        }

        void send() throws IOException{
            // ... send data ...
            output.put("hello client".getBytes(StandardCharsets.UTF_8));
            output.flip();
            socketChannel.write(output);
            setState(READING);
            selectionKey.interestOps(SelectionKey.OP_READ);
            if(isOutputComplete()){
                logger.info(Thread.currentThread().getName()+"关闭"+socketChannel.getRemoteAddress());
                output.clear();
                selectionKey.cancel();
                socketChannel.close();
            }
        }

        boolean isInputComplete(){
            return true;
        }
        boolean isOutputComplete(){
            return true;
        }


        void process() {
            // ... process data ...
            if(input.position() > 0){
                input.flip();
                byte[] bytes = new byte[input.limit()];
                input.get(bytes);
                logger.info(Thread.currentThread().getName()+": read data is "+new String(bytes, StandardCharsets.UTF_8));
                input.clear();
            }
        }

        void setState(int state){
            this.state = state;
        }
    }
}

```
:::
::::





> 当NIO线程负载过重之后，处理速度将变慢，这会导致大量客户端连接超时，超时之后往往会进行重发，这更加重了NIO线程的负载，最终会导致大量消息积压和处理超时，成为系统的性能瓶颈

## **多线程主从Reactor模式**

> Using Multiple Reactors

> mainReactor可以只有一个，但subReactor一般会有多个。mainReactor线程主要负责接收客户端的连接请求，然后将接收到的SocketChannel传递给subReactor，由subReactor来完成和客户端的通信

![https://note.youdao.com/yws/public/resource/8ef33654f746921ad769ad9fe91a4c8f/xmlnote/OFFICE051C61BA01BD49428FE89212C4FABA34/10077](/images/netty/10077.png)

1. 注册一个Acceptor事件处理器到mainReactor中，Acceptor事件处理器所关注的事件是ACCEPT事件，这样mainReactor会监听客户端向服务器端发起的连接请求事件(ACCEPT事件)。启动mainReactor的事件循环
2. 客户端向服务器端发起一个连接请求，mainReactor监听到了该ACCEPT事件并将该ACCEPT事件派发给Acceptor处理器来进行处理。Acceptor处理器通过accept()方法得到与这个客户端对应的连接(SocketChannel)，然后将这个SocketChannel传递给subReactor线程池。
3. subReactor线程池分配一个subReactor线程给这个SocketChannel，即，将SocketChannel关注的READ事件以及对应的READ事件处理器注册到subReactor线程中。当然你也注册WRITE事件以及WRITE事件处理器到subReactor线程中以完成I/O写操作。**Reactor线程池中的每一Reactor线程都会有自己的Selector、线程和分发的循环逻辑**
4. 当有I/O事件就绪时，相关的subReactor就将事件派发给响应的处理器处理。注意，这里subReactor线程只负责完成I/O的read()操作，在读取到数据后将业务逻辑的处理放入到线程池中完成，若完成业务逻辑后需要返回数据给客户端，则相关的I/O的write操作还是会被提交回subReactor线程来完成。

> 多Reactor线程模式将“接受客户端的连接请求”和“与该客户端的通信”分在了两个Reactor线程来完成。mainReactor完成接收客户端连接请求的操作，它不负责与客户端的通信，而是将建立好的连接转交给subReactor线程来完成与客户端的通信，这样一来就不会因为read()数据量太大而导致后面的客户端连接请求得不到即时处理的情况。并且多Reactor线程模式在海量的客户端并发请求的情况下，还可以通过实现subReactor线程池来将海量的连接分发给多个subReactor线程，在多核的操作系统中这能大大提升应用的负载和吞吐量







## 参考

[Java NIO与Reactor – Heart.Think.Do (heartthinkdo.com)](http://www.heartthinkdo.com/?p=2241)

[NIO - Multiple Reactors 模型 | 多巴胺的小站 (shadowland.cn)](https://blog.shadowland.cn/java/2018/10/06/NIO-Multiple-Reactors/)