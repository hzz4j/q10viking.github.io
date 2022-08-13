---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /rabbitmq/
typora-root-url: ..\.vuepress\public
---



::: tip

[Source Code](https://github.com/Q10Viking/learncode/tree/main/rabbitmq/_01_rabbitmq_java_api/src/main/java/org/hzz/helloworld)

:::

## 添加依赖

```xml
<dependency>
    <groupId>com.rabbitmq</groupId>
    <artifactId>amqp-client</artifactId>
    <version>5.3.0</version>
</dependency>
```

## Hello World工作模式

![image-20211031010728443](/images/RabbitMQ/image-20211031010438000.png)

在上图的模型中，有以下概念：

- P：生产者，也就是要发送消息的程序
- C：消费者：消息的接收者，会一直等待消息到来
- queue：消息队列，图中红色部分。类似一个邮箱，可以缓存消息；生产者向其中投递消息，消费者从其中取出消息

## 生产者❤️

```java
public class Producer {
    public static void main(String[] args) throws IOException, TimeoutException {
        
        //获取TCP长连接
        Connection conn = RabbitUtils.getConnection();
        //创建通信“通道”，相当于TCP中的虚拟连接
        Channel channel = conn.createChannel();

        //创建队列,声明并创建一个队列，如果队列已存在，则使用这个队列
        //第一个参数：队列名称ID
        //第二个参数：是否持久化，false对应不持久化数据，MQ停掉数据就会丢失
        //第三个参数：是否队列私有化，false则代表所有消费者都可以访问，true代表只有第一次拥有它的消费者才能一直使用，其他消费者不让访问
        //第四个：是否自动删除,false代表连接停掉后不自动删除掉这个队列
        //其他额外的参数, null
        channel.queueDeclare(RabbitConstant.QUEUE_HELLOWORLD,false, false, false, null);

        String message = "静默: hello World";
        //四个参数
        //exchange 交换机，暂时用不到，在后面进行发布订阅时才会用到
        //队列名称
        //额外的设置属性
        //最后一个参数是要传递的消息字节数组
        channel.basicPublish("", RabbitConstant.QUEUE_HELLOWORLD, null,message.getBytes());
        channel.close();
        conn.close();
        System.out.println("===发送成功===");
    }
}
```

**不指定exchange,即exchange="",发送的消息使用的默认exchange是（AMQP default),将消息直接路由到指定的queue中**

![image-20211031010826149](/images/RabbitMQ/image-20211031010826149.png)

![image-20211031010258335](/images/RabbitMQ/image-20211031010258335.png)

## 消费者❤️

```java
public class Consumer {
    public static void main(String[] args) throws IOException, TimeoutException {
        //获取TCP长连接
        Connection conn = RabbitUtils.getConnection();
        //创建通信“通道”，相当于TCP中的虚拟连接
        Channel channel = conn.createChannel();

        //创建队列,声明并创建一个队列，如果队列已存在，则使用这个队列
        //第一个参数：队列名称ID
        //第二个参数：是否持久化，false对应不持久化数据，MQ停掉数据就会丢失
        //第三个参数：是否队列私有化，false则代表所有消费者都可以访问，true代表只有第一次拥有它的消费者才能一直使用，其他消费者不让访问
        //第四个：是否自动删除,false代表连接停掉后不自动删除掉这个队列
        //其他额外的参数, null
        channel.queueDeclare(RabbitConstant.QUEUE_HELLOWORLD,false, false, false, null);

        //从MQ服务器中获取数据

        //创建一个消息消费者
        //第一个参数：队列名
        //第二个参数代表是否自动确认收到消息，false代表手动编程来确认消息，这是MQ的推荐做法
        //第三个参数要传入DefaultConsumer的实现类
        channel.basicConsume(RabbitConstant.QUEUE_HELLOWORLD, false, new Reciver(channel));
    }
}

class  Reciver extends DefaultConsumer {
    private Channel channel;
    //重写构造函数,Channel通道对象需要从外层传入，在handleDelivery中要用到
    public Reciver(Channel channel) {
        super(channel);
        this.channel = channel;
    }

    @Override
    public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {

        String message = new String(body);
        System.out.println("消费者接收到的消息："+message);

        System.out.println("消息的TagId："+envelope.getDeliveryTag());
        //false只确认签收当前的消息，设置为true的时候则代表签收该消费者所有未签收的消息
        channel.basicAck(envelope.getDeliveryTag(), false);
    }
}
/**
 * 0 [main] INFO org.hzz.util.RabbitUtils  - 成功连接到： /192.168.187.135:5672
 * 消费者接收到的消息：静默: hello World
 * 消息的TagId：1
 */
```

