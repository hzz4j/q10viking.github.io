---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /networkDevelopByJava/
---



## Echo protocol

::: tip

[Echo protocol rfc862 (ietf.org)](https://datatracker.ietf.org/doc/html/rfc862) 

A very useful debugging and measurement tool is an echo service.  An echo service simply sends back to the originating source any data it receives.

::: 

## EchoServer

::: tip

**TCP Based Echo Service**

One echo service is defined as a connection based application on TCP. A server listens for TCP connections on TCP port 7.  Once a connection is established any data received is sent back.  This continues until the calling user terminates the connection.

::: 



:::: code-group
::: code-group-item EchoDemo

```java {4-8}
public class EchoDemo {
    public static void main(String[] args) throws IOException {
        EchoServer server = new EchoServer(8380);
        // 不够优雅
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("钩子函数被执行，可以在这里关闭资源");
            server.stop();
        }));
        server.start();
    }
}
```

:::
::: code-group-item EchoServer

```java {14，16}
public class EchoServer {
    private ServerSocket serverSocket;
    private int port;
    public EchoServer(int port){
        this.port = port;
    }

    public void start(){
        try {
            serverSocket = new ServerSocket(this.port);
            System.out.println("Server start up listen port->"+serverSocket.getLocalPort());
            while(true){
                System.out.println("监听客户端连接... ...");
                Socket client = serverSocket.accept();
                System.out.println("客户端连接："+client.getInetAddress()+":"+client.getPort());
                new ClientHandler(client).start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void stop(){
        try {
            this.serverSocket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println("Server shutdown");
    }
}
```

:::

::: code-group-item ClientHandler

```java {20-12}
public class ClientHandler extends Thread {
    private final Socket socket;
    private final String hostname;
    private final int port;
    private BufferedReader reader;
    private PrintWriter writer;

    public ClientHandler(Socket socket) {
        this.socket = socket;
        this.hostname = socket.getInetAddress().toString();
        this.port = socket.getPort();
    }

    @Override
    public void run() {
        try {
            reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            writer = new PrintWriter(socket.getOutputStream());
            String line;
            // 判断socket停止的方法
            while ((line = reader.readLine()) != null) {
                System.out.println(getClientInfo() + ": " + line);
                writer.println("echo: "+line);
                writer.flush();
            }
        } catch (IOException e) {
            try {
                reader.close();
                writer.close();
            } catch (IOException ex) {
                ex.printStackTrace();
            }
            System.out.println("客户端异常");
        } finally {
            try {
                this.socket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        System.out.println("客户端退出");

    }

    private String getClientInfo() {
        return "客户端 " + this.hostname + ":" + this.port;
    }
}
```

:::

::::

----------

## Client

```java {4-6,9-10}
public class ClientDemo {
    public static void main(String[] args) throws IOException {
        Socket socket = new Socket();
        socket.connect(new InetSocketAddress(Inet4Address.getLocalHost(), 8380), 3000);
        System.out.println("客户端: " + socket.getLocalAddress() + ":" + socket.getLocalPort());
        System.out.println("服务端: " + socket.getInetAddress() + ":" + socket.getPort());

        // 得到Socket输出流，并转换为打印流
        BufferedReader socketReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        PrintStream printStream = new PrintStream(socket.getOutputStream());
        printStream.println("Hello Server");
        printStream.flush();
        String msg = socketReader.readLine();
        System.out.println(msg);

        printStream.close();
        socketReader.close();
        socket.close();
    }
}
```

::: tip

:one: 服务器如何优雅的关闭资源？

:two: 如何优雅的处理与客户端的读写？

:::



服务端接收到的socket的端口与客户端的端口

[Lesson: All About Sockets (The Java™ Tutorials > Custom Networking) (oracle.com)](https://docs.oracle.com/javase/tutorial/networking/sockets/index.html)

