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



## Socket

The communication that occurs between the client and the server must be reliable. That is, no data can be dropped and it must arrive on the client side in the same order in which the server sent it.

**TCP provides a reliable, point-to-point communication channel** that client-server applications on the Internet use to communicate with each other. To communicate over TCP, a client program and a server program establish a connection to one another. Each program binds a socket to its end of the connection. To communicate, the client and the server each reads from and writes to the socket bound to the connection.

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

```java {17}
public class ClientHandler extends Thread {
    private final Socket socket;
    private final String hostname;
    private final int port;

    public ClientHandler(Socket socket) {
        this.socket = socket;
        this.hostname = socket.getInetAddress().toString();
        this.port = socket.getPort();
    }

    @Override
    public void run() {
        try (
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(socket.getInputStream()));
                PrintWriter writer = new PrintWriter(socket.getOutputStream(),true)
        ) {
            String line;
            // 判断socket停止的方法
            while ((line = reader.readLine()) != null) {
                writer.println(line);
            }
        } catch (IOException e) {
            System.out.println("客户端" + getClientInfo() + "异常");
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

This client program is straightforward and simple because the echo server implements a simple protocol. The client sends text to the server, and the server echoes it back. When your client programs are talking to a more complicated server such as an HTTP server, your client program will also be more complicated. However, the basics are much the same as they are in this program:

1. Open a socket.
2. Open an input stream and output stream to the socket.
3. :star:**Read from and write to the stream according to the server's protocol.**:star:
4. Close the streams.
5. Close the socket.

Only step 3 differs from client to client, depending on the server. The other steps remain largely the same.

```java {3-11}
public class ClientDemo {
    public static void main(String[] args) throws IOException {
        try (
                Socket echoSocket = new Socket(Inet4Address.getLocalHost(),8380);
                PrintWriter out = new PrintWriter(echoSocket.getOutputStream(),true);
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(echoSocket.getInputStream()));
                BufferedReader stdIn = new BufferedReader(
                        new InputStreamReader(System.in));

        ) {
            System.out.println("客户端: " + echoSocket.getLocalAddress() + ":" + echoSocket.getLocalPort());
            System.out.println("服务端: " + echoSocket.getInetAddress() + ":" + echoSocket.getPort());
            String userInput;
            while((userInput = stdIn.readLine()) != null){
                out.println(userInput);
                System.out.println("echo "+in.readLine());
            }
        }catch (UnknownHostException e) {
            System.err.println("Don't know about host ");
            System.exit(1);
        } catch (IOException e) {
            System.err.println("Couldn't get I/O for the connection to ");
            System.exit(1);
        }
    }
}
```

::: tip

:one: 服务器如何优雅的关闭资源？

:two: 如何优雅的处理与客户端的读写？

:::

use [`try`-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) statement .

The Java runtime automatically closes the input and output streams, the client socket, and the server socket because they have been created in the `try`-with-resources statement.

## Reference



[Lesson: All About Sockets (The Java™ Tutorials > Custom Networking) (oracle.com)](https://docs.oracle.com/javase/tutorial/networking/sockets/index.html)

https://docs.oracle.com/javase/tutorial/networking/sockets/examples/EchoClient.java

