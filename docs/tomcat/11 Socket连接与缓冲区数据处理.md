---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /tomcat/
---




```
Connection: keep-alive
Connection: close
```



## Socket缓存区

::: tip

:one: 客户端一直向服务端发送数据，而服务器一直不处理数据，那么服务端的缓冲区会逐渐挤满，从而导致发送端不能再发送数据，发生阻塞。

:two: 当又一个新的客户端连接到服务器，并且又开始不断发送数据时，一开始并不阻塞，而是发送到一定的数据量时，该客户端开始阻塞。

:star: 也就是说在服务端，它对应每个连接到的socket都有对应的缓冲区。

:::

![image (25)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112062023121.jpg)

:::: code-group
::: code-group-item ServerDemo

```java
public class ServerDemo {
    private static int PORT = 8082;
    public static void main(String[] args) {
        try(ServerSocket serverSocket = new ServerSocket(PORT)){
            System.out.println("Server start up at port: "+PORT);
            while(true){
                Socket socket = serverSocket.accept();
                System.out.println("连接成功："+socket.getInetAddress().getHostAddress()
                        +" : " + socket.getPort());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

:::
::: code-group-item ClientDemo

```java
public class ClientDemo {
    public static void main(String[] args) {
        try(Socket socket = new Socket("localhost", 8082)){
            OutputStream outputStream = socket.getOutputStream();
            int count = 0;
            while(true){
                outputStream.write("123".getBytes());
                System.out.println(++count);
            }

        }catch (IOException e){
            e.printStackTrace();
        }
    }
}
```

:::
::::

效果，当客户端发送到764040次数时，客户端发生了阻塞。



### 从缓冲区读取数据

::: tip

服务端开始读取客户端发送过来的数据，模拟只读取一次的情况。

观察到服务端从缓冲区取了数据之后，客户端又可以继续发送数据了从阻塞的764040发送到了1549937，接着又开始阻塞

:::

:::: code-group
::: code-group-item ServerDemo

```java {13-15}
public class ServerDemo {
    private static int PORT = 8082;
    public static void main(String[] args) {
        try(ServerSocket serverSocket = new ServerSocket(PORT)){
            System.out.println("Server start up at port: "+PORT);
            while(true){
                Socket socket = serverSocket.accept();
                System.out.println("连接成功："+socket.getInetAddress().getHostAddress()
                        +" : " + socket.getPort());

                System.in.read(); // 阻塞
                System.out.println("开始读取RecvBuf的数据");
                byte[] bytes = new byte[1024*1024];
                InputStream inputStream = socket.getInputStream();
                int read = inputStream.read(bytes);
                System.out.println(new String(bytes,0,read));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

:::
::: code-group-item ClientDemo

```java
public class ClientDemo {
    public static void main(String[] args) {
        try(Socket socket = new Socket("localhost", 8082)){
            OutputStream outputStream = socket.getOutputStream();
            int count = 0;
            while(true){
                outputStream.write("123".getBytes());
                System.out.println(++count);
            }

        }catch (IOException e){
            e.printStackTrace();
        }
    }
}
```

:::
::::