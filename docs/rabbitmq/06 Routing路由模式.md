---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /rabbitmq/
typora-root-url: ..\.vuepress\public
---

## Routing路由模式

[Routing Source Code](https://github.com/Q10Viking/learncode/tree/main/rabbitmq/_01_rabbitmq_java_api/src/main/java/org/hzz/routing)

1. 队列与交换机的绑定，不能是任意绑定了，**而是要指定一个 RoutingKey（路由key）**
2. 消息的发送方在向 Exchange 发送消息时，也必须指定消息的 RoutingKey
3. Exchange 不再把消息交给每一个绑定的队列，而是根据消息的 Routing Key 进行判断，**只有队列的Routingkey 与消息的 Routing key 完全一致，才会接收到消息**

![image-20211031021812135](/images/MySQL/image-20211031021812135.png)

1. P：生产者，向 Exchange 发送消息，发送消息时，会指定一个routing key
2. X：Exchange（交换机），接收生产者的消息，然后把消息递交给与 routing key 完全匹配的队列
3. C1：消费者，其所在队列指定了需要 routing key 为 error 的消息
4. C2：消费者，其所在队列指定了需要 routing key 为 info、error、warning 的消息

### 注意⭐

1. exchange的类型为Direct

   ![image-20211031022730353](/images/MySQL/image-20211031022730353.png)

2. 队列与交换机建立多个Route关系

![image-20211031022632041](/images/MySQL/image-20211031022632041.png)

## 小结

**Routing** 模式要求队列在绑定交换机时要指定 **routing key**，消息会转发到符合 routing key 的队列



## 样例代码

> Weather.java

```java
public class Baidu {
    public static void main(String[] args) throws IOException {
        Connection connection = RabbitUtils.getConnection();
        final Channel channel = connection.createChannel();
        channel.queueDeclare(RabbitConstant.QUEUE_BAIDU, false, false, false, null);
        //queueBind用于将队列与交换机绑定
        //参数1：队列名 参数2：交互机名  参数三：路由key
        channel.queueBind(RabbitConstant.QUEUE_BAIDU, RabbitConstant.EXCHANGE_WEATHER_ROUTING, "china.hunan.changsha.20201127");
        channel.queueBind(RabbitConstant.QUEUE_BAIDU, RabbitConstant.EXCHANGE_WEATHER_ROUTING, "china.hebei.shijiazhuang.20201128");
        channel.basicQos(1);
        channel.basicConsume(RabbitConstant.QUEUE_BAIDU , false , new DefaultConsumer(channel){
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("百度天气收到气象信息：" + new String(body));
                channel.basicAck(envelope.getDeliveryTag() , false);
            }
        });

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

        //指定队列与交换机以及routing key之间的关系
        channel.queueBind(RabbitConstant.QUEUE_SINA, RabbitConstant.EXCHANGE_WEATHER_ROUTING, "us.cal.lsj.20201127");
        channel.queueBind(RabbitConstant.QUEUE_SINA, RabbitConstant.EXCHANGE_WEATHER_ROUTING, "china.hubei.wuhan.20201127");
        channel.queueBind(RabbitConstant.QUEUE_SINA, RabbitConstant.EXCHANGE_WEATHER_ROUTING, "us.cal.lsj.20201128");
        channel.queueBind(RabbitConstant.QUEUE_SINA, RabbitConstant.EXCHANGE_WEATHER_ROUTING, "china.henan.zhengzhou.20201012");

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

