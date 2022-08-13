---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /rabbitmq/
typora-root-url: ..\.vuepress\public
---

::: tip

[Source Code](https://github.com/Q10Viking/learncode/tree/main/rabbitmq/_01_rabbitmq_java_api/src/main/java/org/hzz/workqueue)

:::

## Work queues 工作队列模式

::: tip

**Work Queues：**与入门程序的简单模式相比，多了一个或一些消费端，**多个消费端共同消费同一个队列中的消息(不会重复消费,消费者之间是竞争关系)**。

:::

![image-20211031011008065](/images/RabbitMQ/image-20211031011008065.png)

l**应用场景**：对于任务过重或任务较多情况使用工作队列可以❤️提高任务处理的速度❤️。

--------

## 短信通知服务例子❤️

**Work Queues** 与入门程序的简单模式的代码几乎是一样的。可以完全复制，并**多复制一个消费者进行多个消费者同时对消费消息的测试。**

![image-20211031011112216](/images/RabbitMQ/image-20211031011112216.png)

### 生产者❤️

::: tip

模拟发送短信

:::

```java
public class OrderSystem {
    public static void main(String[] args) throws IOException, TimeoutException {
        Connection connection = RabbitUtils.getConnection();
        Channel channel = connection.createChannel();
        channel.queueDeclare(RabbitConstant.QUEUE_SMS, false, false, false, null);

        for(int i = 1 ; i <= 10 ; i++) {
            SMS sms = new SMS("乘客" + i, "13900000" + i, "您的车票已预订成功");
            String jsonSMS = new Gson().toJson(sms);
            channel.basicPublish("" , RabbitConstant.QUEUE_SMS , null , jsonSMS.getBytes());
        }
        System.out.println("发送数据成功");
        channel.close();
        connection.close();
    }
}
```

### 消费者❤️

::: tip

模拟三个消费者，消费消息。但是每个消费者处理的消息的速度不一样，分别是10ms,100ms,1500ms，最终模拟的结果分别是：消费道理7条数，2条数据，1条数据

:::

> 其中一个消费者

```java
public class SMSSender2 {
    public static void main(String[] args) throws IOException {
        Connection connection = RabbitUtils.getConnection();
        final Channel channel = connection.createChannel();

        channel.queueDeclare(RabbitConstant.QUEUE_SMS, false, false, false, null);

        //如果不写basicQos（1），则自动MQ会将所有请求平均发送给所有消费者
        //basicQos,MQ不再对消费者一次发送多个请求，而是消费者处理完一个消息后（确认后），在从队列中获取一个新的
        channel.basicQos(1);//处理完一个取一个

        channel.basicConsume(RabbitConstant.QUEUE_SMS , false , new DefaultConsumer(channel){
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                String jsonSMS = new String(body);
                SMS sms = new Gson().fromJson(jsonSMS, SMS.class);
                System.out.println("SMSSender2-短信发送成功:" + sms);
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                channel.basicAck(envelope.getDeliveryTag() , false);
            }
        });
    }
}
/**
 * 0 [main] INFO org.hzz.util.RabbitUtils  - 成功连接到： /192.168.187.135:5672
 * SMSSender2-短信发送成功:SMS{name='乘客2', mobile='139000002', content='您的车票已预订成功'}
 * SMSSender2-短信发送成功:SMS{name='乘客10', mobile='1390000010', content='您的车票已预订成功'}
 */
```



## 总结⭐

1. 在一个队列中如果有多个消费者，那么消费者之间对于同一个消息的关系是**竞争⭐**的关系

    ```sh
      由于存在竞争关系，设置basicQos(1) 很重要，处理完一条再拿一条，而不是先全部揽过来。
    ```

2. **Work Queues** 对于任务过重或任务较多情况使用工作队列可以提高任务处理的速度。例如：短信服务部署多个，只需要有一个节点成功发送即可。

