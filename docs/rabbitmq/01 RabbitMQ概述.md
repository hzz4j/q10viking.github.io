---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /rabbitmq/
typora-root-url: ..\.vuepress\public
---

## AMQP

AMQP，即 **Advanced Message Queuing Protocol**（高级消息队列协议），是一个网络协议，是应用层协议的一个开放标准，为**面向消息的中间件设计**。**基于此协议的客户端与消息中间件可传递消息，并不受客户端/中间件不同产品，不同的开发语言等条件的限制**。

![image-20211030173159114](/images/RabbitMQ/image-20211030173159114.png)



## RabbitMQ介绍

[Messaging that just works — RabbitMQ](https://www.rabbitmq.com/)

2007年，Rabbit 技术公司基于 AMQP 标准开发的 RabbitMQ 1.0 发布。RabbitMQ 采用 Erlang 语言开发。Erlang 语言由 Ericson 设计，专门为开发高并发和分布式系统的一种语言，在电信领域使用广泛。

### 基础架构⭐

![image-20210422211414238](/images/RabbitMQ/image-20210422211414238.png)



### 基本概念

1. **Broker**：接收和分发消息的应用，RabbitMQ Server就是 Message Broker
2. **Virtual host**：出于多租户和安全因素设计的，把 AMQP 的基本组件划分到一个虚拟的分组中，类似于网络中的 namespace 概念。当多个不同的用户使用同一个 RabbitMQ server 提供的服务时，可以划分出多个vhost，每个用户在自己的 vhost 创建 exchange／queue 等
3. **Connection**：publisher／consumer 和 broker 之间的 TCP 连接
4. **Channel**：如果每一次访问 RabbitMQ 都建立一个 Connection，在消息量大的时候建立 TCP Connection的开销将是巨大的，效率也较低。Channel 是在 connection 内部建立的逻辑连接，如果应用程序支持多线程，通**常每个thread创建单独的 channel 进行通讯，AMQP method 包含了channel id 帮助客户端和message broker 识别 channel**，所以 channel 之间是完全隔离的。**Channel 作为轻量级的 Connection 极大减少了操作系统建立 TCP connection 的开销**
5. **Exchange**：message 到达 broker 的第一站，根据分发规则，匹配查询表中的 routing key，分发消息到queue 中去。常用的类型有：direct (point-to-point), topic (publish-subscribe) and fanout (multicast)
6. **Queue**：消息最终被送到这里等待 consumer 取走
7. **Binding**: exchange 和 queue 之间的虚拟连接，binding 中可以包含 routing key。**Binding 信息被保存到 exchange 中的查询表中，用于 message 的分发依据**

## 六大工作模式

RabbitMQ 提供了 6 种工作模式：简单模式、work queues、Publish/Subscribe 发布与订阅模式、Routing 路由模式、Topics 主题模式、RPC 远程调用模式（远程调用，不太算 MQ；暂不作介绍）。

官网对应模式介绍：https://www.rabbitmq.com/getstarted.html

![image-20210422225026111](/images/RabbitMQ/image-20210422225026111.png)

