---
prev:
  text: Back To 目录
  link: /topicNav/
typora-root-url: ..\.vuepress\public
---

## 什么是Ribbon

- **集中式负载均衡**：在消费者和服务提供方中间使用独立的代理方式进行负载，有硬件的F5,软件nginx
- **客户端根据自己的请求情况负载均衡**，Ribbon就属于客户端自己做负载均衡

**Spring Cloud Ribbon是基于Netfilx Ribbon实现的一套客户端的负载均衡工具**，Ribbon客户端组件提供一系列完善的配置，如超时，重试等。

**通过Load Balancer获取到服务提供的所有机器实例**。

Ribbon会自动基于**某种规则(轮询，随机)去调用这些服务**。Ribbon也可以实现我们自己的负载均衡算法。

### 客户端负载均衡

例如spring cloud中的ribbon，客户端会有一个服务器地址列表，在发送请求前通过负载均衡算法选择一个服务器，然后进行访问，这是客户端负载均衡；即在客户端就进行负载均衡算法分配

<img src="/images/ribbon/13568.png" alt="img" style="zoom: 80%;" />

### 服务端负载均衡

例如Nginx，通过Nginx进行负载均衡，先发送请求，然后通过负载均衡算法，在多个服务器之间选择一个进行访问；即在服务器端再进行负载均衡算法分配。

<img src="/images/ribbon/13572.png" alt="img" style="zoom: 67%;" />

## 常见负载均衡算法

- 随机，通过随机选择服务进行执行，一般这种方式使用较少;
- 轮训，负载均衡默认实现方式，请求来之后排队处理;
- 加权轮训，通过对服务器性能的分型，给高配置，低负载的服务器分配更高的权重，均衡各个服务器的压力;
- 地址Hash，通过客户端请求的地址的HASH值取模映射进行服务器调度。  ip --->hash
- 最小链接数，即使请求均衡了，压力不一定会均衡，最小连接数法就是根据服务器的情况，比如请求积压数等参数，将请求分配到当前压力最小的服务器上。  最小活跃数



## Ribbon模块

| 名 称               | 说  明                                                       |
| ------------------- | ------------------------------------------------------------ |
| ribbon-loadbalancer | 负载均衡模块，可独立使用，也可以和别的模块一起使用。         |
| Ribbon              | 内置的负载均衡算法都实现在其中。                             |
| ribbon-eureka       | 基于 Eureka 封装的模块，能够快速、方便地集成 Eureka。        |
| ribbon-transport    | 基于 Netty 实现多协议的支持，比如 HTTP、Tcp、Udp 等。        |
| ribbon-httpclient   | 基于 Apache HttpClient 封装的 REST 客户端，集成了负载均衡模块，可以直接在项目中使用来调用接口。 |
| ribbon-example      | Ribbon 使用代码示例，通过这些示例能够让你的学习事半功倍。    |
| ribbon-core         | 一些比较核心且具有通用性的代码，客户端 API 的一些配置和其他 API 的定义。 |



## nacos与Ribbon关系

nacos-discovery依赖了ribbon，可以不用再引入ribbon依赖

![img](/images/ribbon/13575)

