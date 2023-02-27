---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /rabbitmq/
typora-root-url: ..\.vuepress\public
---

## **Pub/Sub** **订阅模式** 



![image-20211031014501124](/images/MySQL/image-20211031014501124.png)

在订阅模型中，多了一个 Exchange 角色，而且过程略有变化：

- P：生产者，也就是要发送消息的程序，但是不再发送到队列中，而是发给X（交换机）
- C：消费者，消息的接收者，会一直等待消息到来
- Queue：消息队列，接收消息、缓存消息
- Exchange：交换机（X）。一方面，接收生产者发送的消息。另一方面，知道如何处理消息，例如**递交给某个特别队列、递交给所有队列、或是将消息丢弃**。到底如何操作，取决于Exchange的类型。Exchange有常见以下3种类型
  - **Fanout**：广播，将消息交给所有绑定到交换机的队列
  - **Direct**：定向，把消息交给符合指定routing key 的队列
  - **Topic**：通配符，把消息交给符合routing pattern（路由模式） 的队列

**Exchange**（交换机）只负责转发消息，不具备存储消息的能力，因此**如果没有任何队列与 Exchange 绑定**，或者没有符合路由规则的队列，那么**消息会丢失**！

### 注意⭐

1. **队列与交换机有一个bind关系，但是route是空**⭐

   ```java
   channel.queueBind(RabbitConstant.QUEUE_SINA, RabbitConstant.EXCHANGE_WEATHER, "");
   ```

![image-20211031020856758](/../../../../saas-yong/fullstack/Java架构师之路/Rabbitmq/imgs/image-20211031020856758.png)


2. **创建的exchange类型是Fanout**⭐

   ![image-20211031020549489](/../../../../saas-yong/fullstack/Java架构师之路/Rabbitmq/imgs/image-20211031020549489.png)

----------

## 使用场景

![image-20211031015009800](/../../../../saas-yong/fullstack/Java架构师之路/Rabbitmq/imgs/image-20211031015009800.png)

## **小结**

1. 交换机需要与队列进行绑定，绑定之后；一个消息可以被多个消费者都收到
2. 发布订阅模式与工作队列模式的区别
   1. **工作队列模式不用定义交换机，而发布/订阅模式需要定义交换机**
   2. 发布/订阅模式的生产方是面向交换机发送消息，工作队列模式的生产方是面向队列发送消息(底层使用默认交换机)
   3. 发布/订阅模式需要设置队列和交换机的绑定，工作队列模式不需要设置，实际上工作队列模式会将队列绑 定到默认的交换机 