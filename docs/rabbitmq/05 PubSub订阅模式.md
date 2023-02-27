---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /rabbitmq/
typora-root-url: ..\.vuepress\public
---

## **Pub/Sub** **订阅模式** 

[pubsub source code](https://github.com/Q10Viking/learncode/tree/main/rabbitmq/_01_rabbitmq_java_api/src/main/java/org/hzz/pubsub)

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



> Weather.java

```java
public class Weather {
    public static void main(String[] args) throws Exception {
        Connection connection = RabbitUtils.getConnection();
        String input = new Scanner(System.in).next();
        Channel channel = connection.createChannel();

        //第一个参数交换机名字   其他参数和之前的一样
        channel.basicPublish(RabbitConstant.EXCHANGE_WEATHER,"" , null , input.getBytes());

        channel.close();
        connection.close();
    }
}
```

> Sina.java

```java
public class Sina {
    public static void main(String[] args) throws IOException {
        //获取TCP长连接
        Connection connection = RabbitUtils.getConnection();
        //获取虚拟连接
        final Channel channel = connection.createChannel();
        //声明队列信息
        channel.queueDeclare(RabbitConstant.QUEUE_SINA, false, false, false, null);

        //queueBind用于将队列与交换机绑定
        //参数1：队列名 参数2：交互机名  参数三：路由key（暂时用不到)
        channel.queueBind(RabbitConstant.QUEUE_SINA, RabbitConstant.EXCHANGE_WEATHER, "");
        channel.basicQos(1);
        channel.basicConsume(RabbitConstant.QUEUE_SINA , false , new DefaultConsumer(channel){
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("新浪天气收到气象信息：" + new String(body));
                channel.basicAck(envelope.getDeliveryTag() , false);
            }
        });
    }
}
```



## **小结**

1. 交换机需要与队列进行绑定，绑定之后；一个消息可以被多个消费者都收到
2. 发布订阅模式与工作队列模式的区别
   1. **工作队列模式不用定义交换机，而发布/订阅模式需要定义交换机**
   2. 发布/订阅模式的生产方是面向交换机发送消息，工作队列模式的生产方是面向队列发送消息(底层使用默认交换机)
   3. 发布/订阅模式需要设置队列和交换机的绑定，工作队列模式不需要设置，实际上工作队列模式会将队列绑 定到默认的交换机 