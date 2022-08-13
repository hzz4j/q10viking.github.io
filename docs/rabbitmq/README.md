---
sidebarDepth: 3
prev:
  text: Back To 目录
  link: /topicNav/
typora-root-url: ..\.vuepress\public
---



::: tip

[Messaging that just works — RabbitMQ](https://www.rabbitmq.com/)

2007年，Rabbit 技术公司基于 AMQP 标准开发的 RabbitMQ 1.0 发布。RabbitMQ 采用 Erlang 语言开发。Erlang 语言由 Ericson 设计，专门为开发高并发和分布式系统的一种语言，在电信领域使用广泛。

:::

## MQ简介

::: tip

MQ全称 **Message Queue（消息队列）**，是在消息的传输过程中**保存消息的容器**。多用于**分布式系统之间进行通信**。

:::

![](/images/RabbitMQ/image-20210422201903080.png)

## MQ优势

###  应用解耦

::: tip

使得应用间解耦，**提升容错性和可维护性**

:::

![](/images/RabbitMQ/image-20210422202000051.png)

![](/images/RabbitMQ/image-20210422202047240.png)

### 异步提速

一个下单操作耗时：20 + 300 + 300 + 300 = 920ms，用户点击完下单按钮后，需要等待920ms才能得到下单响应，太慢！

![](/images/RabbitMQ/image-20210422202225800.png)



用户点击完下单按钮后，只需等待25ms就能得到下单响应 (20 + 5 = 25ms)，**提升用户体验和系统吞吐量**（单位时间内处理请求的数目)

![](/images/RabbitMQ/image-20210422202320669.png)



### 削峰填谷

::: tip

使用MQ后，可以提高系统稳定性

:::

![](/images/RabbitMQ/image-20210422202651914.png)

请求瞬间增多，每秒5000个请求

![](/images/RabbitMQ/image-20210422202621244.png)

::: tip

使用了 MQ 之后，限制消费消息的速度为1000，这样一来，高峰期产生的**数据势必会被积压在 MQ** 中，**高峰就被“削”掉了**，但是因为**消息积压**，在高峰期过后的一段时间内，消费消息的速度还是会维持在1000，直到消费完积压的消息，这就叫做“填谷”

:::

![image-20210422202808519](/images/RabbitMQ/image-20210422202808519.png)



------------



### 小结

1. 应用解耦：提高系统容错性和可维护性
2. 异步提速：提升用户体验和系统吞吐量
3. 削峰填谷：提高系统稳定性

## MQ劣势

![image-20211030171613623](/images/RabbitMQ/image-20211030171613623.png)

### 系统可用性降低

系统**引入的外部依赖**越多，系统稳定性越差。一旦 MQ 宕机，就会对业务造成影响。如何保证MQ的**高可用**⭐？

### 系统复杂度提高

MQ 的加入大大增加了系统的复杂度，以前系统间是**同步的远程调用**，现在是通过 MQ 进行异步调用。**如何保证消息不被丢失等情况**⭐？

-----------



## MQ常见产品

![](/images/RabbitMQ/image-20210422211240124.png)

