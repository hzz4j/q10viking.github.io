---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /RocketMQ/
typora-root-url: ..\.vuepress\public
---



## 丢消息的环节

1，2，4三个场景都是跨网络的，而跨网络就肯定会有丢消息的可能

3这个环节，通常MQ存盘时都会先写入操作系统的缓存page cache中，然后再由操作系统异步的将消息写入硬盘。这个中间有个时间差，就可能会造成消息丢失。如果服务挂了，缓存中还没有来得及写入硬盘的消息就会丢失

![image](/images/RocketMQ/3A8C23E1897F4.jpg)

## RocketMQ消息零丢失方案

### **下单使用事务消息机制保证消息零丢失**

> 以最常见的电商订单场景为例

![image](/images/RocketMQ/B3953FC5A.jpg)



#### **1. half消息**

这个half消息是在订单系统进行下单操作前发送，并且对下游服务的消费者是不可见的。那这个消息的作用更多的体现在确认RocketMQ的服务是否正常。相当于嗅探下RocketMQ服务是否正常，并且通知RocketMQ，我马上就要发一个很重要的消息了，你做好准备。

#### **2. half消息写入失败(RocketMQ服务挂了)**⭐⭐

如果没有half消息这个流程，那我们通常是会在订单系统中先完成下单，再发送消息给MQ。这时候写入消息到MQ如果失败就会非常尴尬了。而half消息如果写入失败，我们就可以认为MQ的服务是有问题的，这时，就不能通知下游服务了。我们可以在下单时给订单一个状态标记，然后**等待MQ服务正常后再进行补偿操作**，等MQ服务正常后重新下单通知下游服务。

#### **3. 订单系统写数据库失败了怎么办(MySQL挂了)**⭐⭐

这个问题我们同样比较下没有使用事务消息机制时会怎么办？如果没有使用事务消息，我们只能判断下单失败，抛出了异常，那就不往MQ发消息了，这样至少保证不会对下游服务进行错误的通知。但是这样的话，如果过一段时间数据库恢复过来了，这个消息就无法再次发送了。当然，也可以设计另外的补偿机制，例如将订单数据缓存起来，再启动一个线程定时尝试往数据库写。而如果使用事务消息机制，就可以有一种更优雅的方案。

如果下单时，写数据库失败(可能是数据库崩了，需要等一段时间才能恢复)。那我们可以另外找个地方把订单消息先缓存起来(Redis、文本或者其他方式)，然后给RocketMQ返回一个**UNKNOWN**状态。这样RocketMQ就会过一段时间来回查事务状态。我们**就可以在回查事务状态时再尝试把订单数据写入数据库**，**如果数据库这时候已经恢复了，那就能完整正常的下单，再继续后面的业务。**这样这个订单的消息就不会因为数据库临时崩了而丢失。

#### 4.**下单成功后如何优雅的等待支付成功**⭐⭐

在订单场景下，通常会要求下单完成后，客户在一定时间内，例如10分钟，内完成订单支付，支付完成后才会通知下游服务进行进一步的营销补偿。

如果不用事务消息，那通常会怎么办？

最简单的方式是启动一个定时任务，每隔一段时间扫描订单表，比对未支付的订单的下单时间，将超过时间的订单回收。这种方式显然是有很大问题的，需要定时扫描很庞大的一个订单信息，这对系统是个不小的压力。

那更进一步的方案是什么呢？是不是就可以使用RocketMQ提供的延迟消息机制。**往MQ发一个延迟1分钟的消息，消费到这个消息后去检查订单的支付状态，如果订单已经支付，就往下游发送下单的通知。而如果没有支付，就再发一个延迟1分钟的消息。最终在第十个消息时把订单回收。**这个方案就不用对全部的订单表进行扫描，而只需要每次处理一个单独的订单消息。

那如果使用上了事务消息呢？我们就可以用事务消息的状态回查机制来替代定时的任务。在下单时，给Broker返回一个UNKNOWN的未知状态。而在状态回查的方法中去查询订单的支付状态。这样整个业务逻辑就会简单很多。我们只需要配置RocketMQ中的**事务消息回查次数(默认15次)和事务回查间隔时间(messageDelayLevel)**，就可以更优雅的完成这个支付状态检查的需求。



### **RocketMQ配置同步刷盘+Dledger主从架构保证MQ主从同步时不会丢消息**

#### 同步刷盘

可以简单的把RocketMQ的刷盘方式 **flushDiskType**配置成同步刷盘就可以保证消息在刷盘过程中不会丢失了。

#### **Dledger的文件同步**

> 简单来说，数据同步会通过两个阶段，一个是uncommitted阶段，一个是commited阶段。
>
> Leader Broker上的Dledger收到一条数据后，会标记为uncommitted状态，然后他通过自己的DledgerServer组件把这个uncommitted数据发给Follower Broker的DledgerServer组件。
>
>  接着Follower Broker的DledgerServer收到uncommitted消息之后，必须返回一个ack给Leader Broker的Dledger。然后如果Leader Broker收到超过半数的Follower Broker返回的ack之后，就会把消息标记为committed状态。
>
>  再接下来， Leader Broker上的DledgerServer就会发送committed消息给Follower Broker上的DledgerServer，让他们把消息也标记为committed状态。这样，就基于Raft协议完成了两阶段的数据同步。

![image](/images/RocketMQ/1654659579586.png)



### **消费者端不要使用异步消费机制**

消费者端都是需要先处理本地事务，然后再给MQ一个ACK响应，这时MQ就会修改Offset，将消息标记为已消费，从而不再往其他消费者推送消息。所以在Broker的这种重新推送机制下，消息是不会在传输过程中丢失的。但是也会有下面这种情况会造成服务端消息丢失：

```java
DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("please_rename_unique_group_name_4");
consumer.registerMessageListener(new MessageListenerConcurrently() {
    @Override
    public ConsumeConcurrentlyStatus consumeMessage(List<MessageExt> msgs,
                                                    ConsumeConcurrentlyContext context) {
        new Thread(){
            public void run(){
                //处理业务逻辑
                System.out.printf("%s Receive New Messages: %s %n", Thread.currentThread().getName(), msgs);
            }
        };
        return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
    }
});
```

这种异步消费的方式，就有可能造成消息状态返回后消费者本地业务逻辑处理失败造成消息丢失的可能。



### **RocketMQ特有的问题，NameServer挂了如何保证消息不丢失**

在这种情况下，RocketMQ相当于整个服务都不可用了，那他本身肯定无法给我们保证消息不丢失了。我们**只能自己设计一个降级方案**来处理这个问题了。例如在订单系统中，如果多次尝试发送RocketMQ不成功，那就只能另外找给地方(Redis、文件或者内存等)把订单消息缓存下来，然后起一个线程定时的扫描这些失败的订单消息，尝试往RocketMQ发送。这样等RocketMQ的服务恢复过来后，就能第一时间把这些消息重新发送出去。

