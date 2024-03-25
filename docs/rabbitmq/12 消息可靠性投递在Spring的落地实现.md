---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /rabbitmq/
typora-root-url: ..\.vuepress\public
---



## 丢失原因分析

rabbitmq 整个消息投递的路径为：

```java
producer--->rabbitmq broker--->exchange--->queue--->consumer   ⭐
```

从上述流程我们可以得知：消息从生产者到达消费者，经过两次网络传输，并且在 RabbitMQ 服务器中进行路由。

因此我们能知道整个流程中可能会出现三种消息丢失场景：

- 生产者发送消息到 RabbitMQ 服务器的过程中出现消息丢失。 可能是网络波动未收到消息，又或者是服务器宕机。
- RabbitMQ 服务器消息持久化出现消息丢失。 消息发送到 RabbitMQ 之后，未能及时存储完成持久化，RabbitMQ 服务器出现宕机重启，消息出现丢失。
- 消费者拉取消息过程以及拿到消息后出现消息丢失。 消费者从 RabbitMQ 服务器获取到消息过程出现网络波动等问题可能出现消息丢失；消费者拿到消息后但是消费者未能正常消费，导致丢失，可能是消费者出现处理异常又或者是消费者宕机。

针对上述三种消息丢失场景，RabbitMQ 提供了相应的解决方案，confirm 消息确认机制（生产者），消息持久化机制（RabbitMQ 服务），ACK 事务机制（消费者）

## 

## 生产端

在使用 RabbitMQ 的时候，作为消息发送方希望杜绝任何消息丢失或者投递失败场景。RabbitMQ 为我们提供了两种方式用来控制消息的投递可靠性模式。

- confirm 确认模式

- return 退回模式

### 在Spring中实现

	- 消息从 producer 到 exchange 则会返回一个 confirmCallback
	- 消息从 exchange-->queue 投递失败则会返回一个 returnCallback 

```xml
    <!-- 定义rabbitmq connectionFactory -->
    <rabbit:connection-factory id="connectionFactory" host="${rabbitmq.host}"
                               port="${rabbitmq.port}"
                               username="${rabbitmq.username}"
                               password="${rabbitmq.password}"
                               virtual-host="${rabbitmq.virtual-host}"
                               publisher-confirms="true"  ⭐
                               publisher-returns="true"   ⭐
    />
```



#### confirm确认模式

- 设置ConnectionFactory的publisher-confirms="true" 开启 确认模式。

- 使用rabbitTemplate.**setConfirmCallback**设置回调函数。当消息发送到exchange后回调confirm方法。在方法中判断ack，如果为true，则发送成功，如果为false，则发送失败，需要处理。

  ```java
  //定义回调
  rabbitTemplate.setConfirmCallback(new RabbitTemplate.ConfirmCallback() {
      /**
               *
               * @param correlationData 相关配置信息
               * @param ack   exchange交换机 是否成功收到了消息。true 成功，false代表失败
               * @param cause 失败原因
               */
      @Override
      public void confirm(CorrelationData correlationData, boolean ack, String cause) {
          System.out.println("confirm方法被执行了....");
  
          //ack 为  true表示 消息已经到达交换机
          if (ack) {
              //接收成功
              System.out.println("接收成功消息" + cause);
          } else {
              //接收失败
              System.out.println("接收失败消息" + cause);
              //做一些处理，让消息再次发送。
          }
      }
  });
  ```

  

#### return回退模式

1. 设置ConnectionFactory的publisher-returns="true" 开启 退回模式
2. 使用rabbitTemplate.setReturnCallback设置退回函数，当消息从exchange路由到queue失败后，如果设置了**rabbitTemplate.setMandatory(true)参数，则会将消息退回给producer。并执行回调函数returnedMessage。**⭐

```java
//设置交换机处理失败消息的模式   为true的时候，消息达到不了 队列时，会将消息重新返回给生产者
rabbitTemplate.setMandatory(true);

//定义回调
rabbitTemplate.setReturnCallback(new RabbitTemplate.ReturnCallback() {
    /**
             *
             * @param message   消息对象
             * @param replyCode 错误码
             * @param replyText 错误信息
             * @param exchange  交换机
             * @param routingKey 路由键
             */
    @Override
    public void returnedMessage(Message message, int replyCode, String replyText, String exchange, String routingKey) {
        System.out.println("return 执行了....");

        System.out.println("message:"+message);
        System.out.println("replyCode:"+replyCode);
        System.out.println("replyText:"+replyText);
        System.out.println("exchange:"+exchange);
        System.out.println("routingKey:"+routingKey);

        //处理
    }
});
```



## 消费端

### ack方式

ack指Acknowledge，确认。 **表示消费端收到消息后的确认方式。**

有三种确认方式：

- 自动确认：acknowledge="none"

- 手动确认：acknowledge="manual"

- 根据异常情况确认：acknowledge="auto"，（这种方式使用麻烦，不作讲解）

⭐⭐⭐⭐⭐

**其中自动确认是指，当消息一旦被Consumer接收到，则自动确认收到，并将相应 message 从 RabbitMQ 的消息缓存中移除。但是在实际业务处理中，很可能消息接收到，业务处理出现异常，那么该消息就会丢失⭐⭐。**

**如果设置了手动确认方式，则需要在业务处理成功后，调用channel.basicAck()，手动签收，如果出现异常，则调用channel.basicNack()方法，拒绝签收，让其自动重新发送消息。**

​	⭐⭐注意**拒绝签收时**basicNack的第三个参数设置为**requeue=true**时，会将当前处理的消息重新发回给Rabbitmq.缺点，如果业务一直异常，是会造成不断的循环的。为false时，则会丢弃消息。

一般出现异常的时候，会把该消息保存起来，保存到数据库，或者写到日志文件⭐

---------

### 在Spring中实现

1. 设置为acknowledge手动签收

```xml
    <!--定义监听器容器
      acknowledge="manual":手动签收
      prefetch="1":每次抓取多少条消息
    -->
    <rabbit:listener-container connection-factory="connectionFactory" acknowledge="manual" prefetch="2" >
```

2. 实现ChannelAwareMessageListener，为了拿到channel,进行签收操作

   1. 如果在消费端没有出现异常，则调用channel.basicAck(deliveryTag,false);方法确认签收消息
   2. 如果出现异常，则在catch中调用 basicNack或 basicReject，拒绝消息，让MQ重新发送消息

   ```java
   @Component
   public class AckListener implements ChannelAwareMessageListener {
   
       @Override
       public void onMessage(Message message, Channel channel) throws Exception {
           //1、获取消息的id
           long deliveryTag = message.getMessageProperties().getDeliveryTag();
           try {
   
   
           //2、获取消息
           System.out.println("message:"+new String(message.getBody()));
   
           //3、进行业务处理
           System.out.println("=====进行业务处理====");
   
           //模拟出现异常
           int  i = 5/0;
   
           //4、进行消息签收
           channel.basicAck(deliveryTag, true);
   
           } catch (Exception e) {
   
               //拒绝签收
                /*
                 * 第三个参数：requeue：重回队列。如果设置为true，则消息重新回到queue，broker会重新发送该消息给消费端⭐
                */
               channel.basicNack(deliveryTag, true, true);
   
           }
       }
   }
   ```

   

3. 设置监听的队列

```xml
<rabbit:listener-container connection-factory="connectionFactory" acknowledge="manual" prefetch="2" >

    <rabbit:listener ref="ackListener" queue-names="test_queue_confirm"></rabbit:listener>

</rabbit:listener-container>
```



## 消息持久化机制（RabbitMQ 服务）

持久化机制是指将消息存储到磁盘，以保证在 RabbitMQ 服务器宕机或重启时，消息不会丢失。

**使用方法：**

- 生产者通过将消息的 **delivery_mode** 属性设置为 2，将消息标记为持久化。
- 队列也需要进行持久化设置，确保队列在 RabbitMQ 服务器重启后仍然存在。经典队列需要将durable属性设置为true。而仲裁队列和流式队列默认必须持久化保存。

**注意事项：**

- 持久化机制会影响性能，因此在需要确保消息不丢失的场景下使用。

### 

## 消息可靠性总结

1. 持久化
   - exchange要持久化
   - queue要持久化
   - message要持久化

2. 生产方确认Confirm

3. 消费方确认Ack

4. Broker高可用





