---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /RocketMQ/
typora-root-url: ..\.vuepress\public
---



## RocketMQ关键组件

RocketMQ由以下这几个组件组成

- NameServer : 提供轻量级的Broker路由服务。
- Broker：实际处理消息存储、转发等服务的核心组件。
- Producer：消息生产者集群。通常是业务系统中的一个功能模块。
- Consumer：消息消费者集群。通常也是业务系统中的一个功能模块

![image](/images/RocketMQ/B324F92B57AD.jpg)



## RocketMQ的集群架构是怎样的

- Name Server集群是RocketMQ的一种轻量级的服务节点，**负责注册和管理Broker的服务地址**，提供服务的注册和发现功能。每个Broker节点都要跟所有的Name Server节点建立长连接，定义注册Topic路由信息和发送心跳。每个 NameServer 节点都会保存完整的 Broker 列表数据，并且 NameServer 个个节点之间不会同步数据。因此，NameServer 集群不会因为单个节点发生故障而停止服务。
- Broker 是 RocketMQ 的核心组件，负责存储和传输消息。一个 RocketMQ 集群通常包含多个 Broker 实例，共同协作来提高 RocketMQ 的可用性和吞吐量。其中，Master Broker，主节点，负责处理客户端的请求，并将消息存储到磁盘上，然后将消息同步复制给所有的从节点。而从节点，是Master Broker 的消息备份。
- 客户端包含 Producer 生产者和 Consumer 消费者。其中，Producer 负责将消息发送给 Broker。Producer 可以将消息发送到指定的 Topic，RocketMQ 会负责将消息存放到对应的 Broker 上。Consumer 可以订阅一个或多个 Topic，并从对应的 Broker 上接收消息进行处理。RocketMQ 的客户端提供了多种处理消息的方式，比如延迟消息、事务消息、集群消息、广播消息等。



## RocketMQ的Broker有三种集群模式

1. 单Master模式：只有一个Master节点，其他都是Slave节点。Master节点负责响应客户端的请求并存储消息，Slave节点只同步Master节点的消息，也会响应部分客户端的读请求。这种模式的优点是简单易部署，但是存在单点故障的问题，如果Master节点宕机，会导致整个服务不可用。
2. Master-Slave模式（经典双集群部署）：一个Master节点对应多个Slave节点，Master和Slave都是独立的NameServer。Master节点负责响应客户端请求并存储消息，Slave节点只同步Master节点的消息，也会响应部分客户端的读请求。这种模式的优点是高可用性，即使Master节点宕机，Slave节点可以自动升级为Master节点，继续提供服务。但是，如果只有一个Master节点，存在单点故障的问题。
3. Dledger模式（高可用集群部署）：在Master-Slave模式的基础上增加了Raft协议，实现了自动脑裂后的数据高可靠性。即使某个节点从网络上掉下来或者宕机后，仍然能够保证所有的消息不会丢失。这种模式的优点是高可用性和高可靠性，即使某个节点出现故障，也能保证服务的可用性。