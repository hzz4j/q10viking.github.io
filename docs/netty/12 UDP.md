---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /netty/
typora-root-url: ..\.vuepress\public
---



## 客户端

> 模拟Nacos的通信服务（其实它就相当客户端），nacos通过服务发送过来的查询服务实例列表，其中带有IP，udp端口，从而知道了怎么与服务进行udp通信。

```java
public class NacosServer {
    public static void main(String[] args) {
        InetSocketAddress socketAddr = new InetSocketAddress("127.0.0.1", Constants.PORT);
        try{
            // 不传入端口，让系统自己选一个端口
            DatagramSocket udpSocket = new DatagramSocket();
            System.out.println("启动在端口："+udpSocket.getLocalPort());
            byte[] dataBytes = "Hello World".getBytes();
            DatagramPacket packet = new DatagramPacket(dataBytes, dataBytes.length, socketAddr);
            udpSocket.send(packet);  // 发送
        }catch (SocketException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
/**
 * 启动在端口：63214
 */
```



## 服务端（服务）

> 模拟服务接收

```java
public class MallOrderService2 {
    public static void main(String[] args) {
        try {
            DatagramSocket udpSocket = new DatagramSocket(Constants.PORT);
            byte[] data = new byte[1<<10]; // 1kb
            DatagramPacket packet = new DatagramPacket(data, data.length);
            while(true){
                udpSocket.receive(packet);	// 接收
                int length = packet.getLength();
                String s = new String(data).trim();
                System.out.println("来自："+packet.getSocketAddress()); // 从数据包中能拿到对方的地址，方便响应ack
                System.out.println("实际: ----------------------------length = "+length);
                System.out.println(s);
                System.out.println(new String(data,0,length));
            }

        } catch (SocketException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
/**
 * 来自：/127.0.0.1:63214
 */
```

