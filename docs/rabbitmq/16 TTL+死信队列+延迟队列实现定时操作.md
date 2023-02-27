---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /rabbitmq/
typora-root-url: ..\.vuepress\public
---



## 延迟队列

**延迟队列，即消息进入队列后不会立即被消费，只有到达指定时间后，才会被消费**

```sh
需求：
    1. 下单后，30分钟未支付，取消订单，回滚库存。
    2. 新用户注册成功7天后，发送短信问候。
实现方式：
    1. 定时器
    2. 延迟队列

```



## 定时任务的时效性

如果采用定时器去实现，会存**定时器的在时效性的问题**⭐

![image-20211031085355309](/../../../../saas-yong/fullstack/Java架构师之路/Rabbitmq/imgs/image-20211031085355309.png)



## TTL+死信队列 组合实现延迟队列

在RabbitMQ中并未提供延迟队列功能,但是可以使用：**TTL+死信队列 组合实现延迟队列的效果**。

延迟队列:指消息进入队列后，可以被延迟一定时间，再进行消费。

![image-20211031085646577](/images/RabbitMQ/image-20211031085646577.png)

生产端设置

```xml
 <!--
        延迟队列：
            1. 定义正常交换机（order_exchange）和队列(order_queue)
            2. 定义死信交换机（order_exchange_dlx）和队列(order_queue_dlx)
            3. 绑定，设置正常队列过期时间为30分钟
    -->
    <!-- 1. 定义正常交换机（order_exchange）和队列(order_queue)-->
    <rabbit:queue id="order_queue" name="order_queue">
         <!--3. 绑定，设置正常队列过期时间为30分钟-->
        <rabbit:queue-arguments>
            <entry key="x-dead-letter-exchange" value="order_exchange_dlx" />
            <entry key="x-dead-letter-routing-key" value="dlx.order.cancel" />
            <entry key="x-message-ttl" value="10000" value-type="java.lang.Integer" />
        </rabbit:queue-arguments>
    </rabbit:queue>

    <rabbit:topic-exchange name="order_exchange">
        <rabbit:bindings>
            <rabbit:binding pattern="order.#" queue="order_queue"></rabbit:binding>
        </rabbit:bindings>
    </rabbit:topic-exchange>

    <!--2. 定义死信交换机（order_exchange_dlx）和队列(order_queue_dlx)-->
    <rabbit:queue id="order_queue_dlx" name="order_queue_dlx"></rabbit:queue>
    <rabbit:topic-exchange name="order_exchange_dlx">
        <rabbit:bindings>
            <rabbit:binding pattern="dlx.order.#" queue="order_queue_dlx"></rabbit:binding>
        </rabbit:bindings>
    </rabbit:topic-exchange>
```



