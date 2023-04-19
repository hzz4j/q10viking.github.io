---
prev:
  text: Back To 目录
  link: /topicNav/
typora-root-url: ..\.vuepress\public
---



[官网](https://www.grpc.io/)

[gRPC 官方文档中文版](http://doc.oschina.net/grpc)



RPC 框架的目标就是让远程服务调用更加简单、透明，其负责屏蔽底层的传输方式（TCP/UDP）、序列化方式（XML/Json）和通信细节。服务调用者可以像调用本地接口一样调用远程的服务提供者，而不需要关心底层通信细节和调用过程。



[gRPC](http://www.oschina.net/p/grpc-framework)  是一个高性能、开源和通用的 RPC 框架，面向移动和 HTTP/2 设计。目前提供 C、Java 和 Go 语言版本，分别是：grpc, grpc-java, grpc-go

在 gRPC 里客户端应用可以像调用本地对象一样直接调用另一台不同的机器上服务端应用的方法，使得您能够更容易地创建分布式应用和服务。与许多 RPC 系统类似，gRPC 也是基于以下理念：定义一个服务，指定其能够被远程调用的方法（包含参数和返回类型）。在服务端实现这个接口，并运行一个 gRPC 服务器来处理客户端调用。在客户端拥有一个存根能够像服务端一样的方法。

![img](/images/grpc/1635738359289-a699b333-938d-4aa3-b0e7-568cb7d8bf8d.png)

gRPC 的功能优点：

- 高兼容性、高性能、使用简单



gRPC 的组成部分：

- 使用 http2 作为网络传输层
- 使用 protobuf 这个高性能的数据包序列化协议
- 通过 protoc gprc 插件生成易用的 SDK

![image.png](/images/grpc/1636530118846-4046bead-72ea-4dfb-92c6-fcfa27337bdb.png)