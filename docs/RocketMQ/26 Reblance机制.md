---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /RocketMQ/
typora-root-url: ..\.vuepress\public
---



## Rebalance简介

Rebalance(再均衡)机制指的是：将一个Topic下的多个队列(或称之为分区)，在同一个消费者组(consumer group)下的多个消费者实例(consumer instance)之间进行重新分配。

Rebalance机制本意是为了提升消息的并行处理能力。例如，一个Topic下5个队列，在只有1个消费者的情况下，那么这个消费者将负责处理这5个队列的消息。如果此时我们增加一个消费者，那么可以给其中一个消费者分配2个队列，给另一个分配3个队列，从而提升消息的并行处理能力。如下图：

![image](/images/RocketMQ/863118-20220212222125424-1455025977.png)

但是Rebalance机制也存在明显的限制与危害。

`Rebalance限制`：由于一个队列最多分配给一个消费者，因此当某个消费者组下的消费者实例数量大于队列的数量时，多余的消费者实例将分配不到任何队列。

`Rebalance危害`： 除了以上限制，更加严重的是，在发生Rebalance时，存在着一些危害，如下所述：

- `消费暂停`：考虑在只有Consumer 1的情况下，其负责消费所有5个队列；在新增Consumer 2，触发Rebalance时，需要分配2个队列给其消费。那么Consumer 1就需要停止这2个队列的消费，等到这两个队列分配给Consumer 2后，这两个队列才能继续被消费。
- `重复消费`：Consumer 2 在消费分配给自己的2个队列时，必须接着从Consumer 1之前已经消费到的offset继续开始消费。然而默认情况下，offset是异步提交的，如consumer 1当前消费到offset为10，但是异步提交给broker的offset为8；那么如果consumer 2从8的offset开始消费，那么就会有2条消息重复。也就是说，Consumer 2 并不会等待Consumer1提交完offset后，再进行Rebalance，因此提交间隔越长，可能造成的重复消费就越多。
- `消费突刺`：由于rebalance可能导致重复消费，如果需要重复消费的消息过多；或者因为rebalance暂停时间过长，导致积压了部分消息。那么都有可能导致在rebalance结束之后瞬间可能需要消费很多消息,(**造成了消息积压**)。

基于Rebalance可能会给业务造成的负面影响，我们有必要对其内部原理进行深入剖析，以便于问题排查。我们将从Broker端和Consumer端两个角度来进行说明。

- Broker端主要负责Rebalance元数据维护，以及通知机制，在整个消费者组Rebalance过程中**扮演协调者**的作用
- 而Consumer端分析，主要聚焦于单个Consumer的Rebalance流程。



## Broker端Rebalance协调机制

从本质上来说，触发Rebalance的根本因素无非是两个：

1. 订阅Topic的队列数量变化
2. 消费者组信息变化。导致二者发生变化的典型场景如下所示：

| 队列信息变化     | 典型场景：broker宕机、broker升级等运维操作、队列扩容/缩容    |
| :--------------- | :----------------------------------------------------------- |
| 消费者组信息变化 | 典型场景：日常发布过程中的停止与启动、消费者异常宕机、网络异常导致消费者与Broker断开连接、主动进行消费者数量扩容/缩容、Topic订阅信息发生变化 |

将队列信息和消费者组信息称之为Rebalance元数据，Broker负责维护这些元数据，并在二者信息发生变化时，以某种通知机制告诉消费者组下所有实例，需要进行Rebalance。从这个角度来说，Broker在Rebalance过程中，是一个协调者的角色。
在Broker内部，通过元数据管理器维护了Rebalance元数据信息，如下图所示：

![image](/images/RocketMQ/863118-20220212222616330-1754495023.png)

这些管理器，内部实现都是一个Map。其中：

- `队列信息`：由`TopicConfigManager`维护。Map 的key是Topic名称，Value是TopicConfig。Broker通过实时的或者周期性的上报自己的Topic配置信息给NameServer，在NameServer组装成Topic的完整路由信息。消费者定时向NameServer定时拉取最新路由信息，以实现间接通知，当发现队列信息变化，触发Rebalance。

- `消费者组信息`：由`ConsumerManager`、`ConsumerOffsetManager`、`SubscriptionGroupManager`三者共同维护。

  - ConsumerManager维护了消费者组订阅信息，以及消费者组下当前的消费者实例信息，当消费者组的订阅信息或者实例发生变化，Broker都会主动给所有消费者实例发送通知，触发Rebalance。
  - 而在Rebalance时，消费者需要从ConsumerOffsetManager查询应该从那个位置继续开始消费。
  - SubscriptionGroupManager主要是维护消费者组的一些附加信息，方便运维。

### 队列信息变化

队列信息通过Broker内的TopicConfigManager来维护，每个Broker都会将自己的信息上报给NameServer，由NameServer组装成完整的Topic路由信息。

通常情况下，一个Topic下的队列数量不会频繁的变化，但是如果遇到，Topic队列数量扩/缩容，、broker日常运维时的停止/启动或者broker异常宕机，也有可能导致队列数量发生变化。

这里我们重点讲一下为什么broker异常停止/宕机会导致数量变化。一些读者可能会认为创建Topic时，已经明确指定了队列的数量，那么之后不论怎样，队列的数量信息都不会发生变化，这是一种典型误解。

下图展示了一个RocketMQ集群双主部署模式下，某个broker宕机后，Topic路由信息的变化。

![image](/images/RocketMQ/863118-20220212222951003-1231054740.png)

可以看到，在宕机前，主题TopicX下队列分布在broker-a和broker-b两个broker上，每个broker上各有8个队列。当broker-a宕机后，其路由信息会被移除，此时我们就只能看到TopicX在broker-b上的路由信息。

因此，在RocketMQ中，Topic的路由信息实际上是动态变化的。不论是停止/启动/扩容导致的所有变化最终都会上报给NameServer。客户端可以给NameServer发送`GET_ROUTEINTO_BY_TOPIC`请求，来获得某个Topic的完整路由信息。如果发现队列信息发生变化，则触发Reabalance。



### 消费者组信息变化

Rebalance的另外一个条件：消费者组信息，由ConsumerManager、ConsumerOffsetManager、SubscriptionGroupManager三个组件共同维护。

#### ConsumerManager

ConsumerManager是最重要的一个消费者组元数据管理器，其**维护了某个消费者组的订阅信息，以及所有消费者实例的详细信息**，并在发生变化时提供通知机制。

- `数据添加`：客户端通过发送HEART_BEAT请求给Broker，将自己添加到ConsumerManager中维护的某个消费者组中。需要注意的是，**每个Consumer都会向所有的Broker进行心跳**，因此每个Broker都维护了所有消费者的信息。
- `数据删除`：客户端正常停止时，发送UNREGISTER_CLIENT请求，将自己从ConsumerManager移除；此外在发生网络异常时，Broker也会主动将消费者从ConsumerManager中移除。
- `数据查询`：消费者可以向任意一个Broker发送GET_CONSUMER_LIST_BY_GROUP请求，来获得一个消费者组下的所有消费者实例信息。

我们可以通过mqadmin命令行工具的consumerConnection子命令，来查看ConsumerManager中，某个消费者的信息，如：

![image](/images/RocketMQ/863118-20220212233740537-168813331.png)

输出主要分为2个部分：

1. 消费者组实例信息：展示了groupA下当前有2个消费者，以及对应的详细信息，包括：消费者id，消费者ip/port，消费者语言，消费者版本
2. 消费者组订阅信息：包括订阅的Topic，过滤条件，消费模式，以及从什么位置开始消费等。

这二者不论哪个信息发生变化，Broker都会主动通知这个消费者组下的所有实例进行Rebalance。在ConsumerManager的registerConsumer方法中，我们可以看到这个通知机制。如以下源码片段第四步中所示：
`ConsumerManager#registerConsumer`

```java
public boolean registerConsumer(final String group, final ClientChannelInfo clientChannelInfo,
    ConsumeType consumeType, MessageModel messageModel, ConsumeFromWhere consumeFromWhere,
    final Set<SubscriptionData> subList, boolean isNotifyConsumerIdsChangedEnable) {
 
    //1 查找consumer group信息，如果没有，创建一个新的
    ConsumerGroupInfo consumerGroupInfo = this.consumerTable.get(group);
    if (null == consumerGroupInfo) {
        ConsumerGroupInfo tmp = new ConsumerGroupInfo(group, consumeType, 
                                               messageModel, consumeFromWhere);
        ConsumerGroupInfo prev = this.consumerTable.putIfAbsent(group, tmp);
        consumerGroupInfo = prev != null ? prev : tmp;
    }
    //2 消费者组下实例信息是否发生变化
    boolean r1 =
        consumerGroupInfo.updateChannel(clientChannelInfo, consumeType, messageModel, 
                                        consumeFromWhere);
 
    //3 消费者订阅信息是否发生变化
    boolean r2 = consumerGroupInfo.updateSubscription(subList);
 
    //4 如果r1或者r2任意一个为true，则通知这个消费者组下的所有实例进行rebalance
    if (r1 || r2) {
        if (isNotifyConsumerIdsChangedEnable) {
            this.consumerIdsChangeListener.handle(ConsumerGroupEvent.CHANGE, 
                                           group, consumerGroupInfo.getAllChannel());
        }
    }
 
    this.consumerIdsChangeListener.handle(ConsumerGroupEvent.REGISTER, group, subList);
 
    return r1 || r2;
}
```

consumerIdsChangeListener在处理`ConsumerGroupEvent.CHANGE`事件时，会给每个Consumer都发送一个`NOTIFY_CONSUMER_IDS_CHANGED`通知，这个消费者组下的所有实例在收到通知后，各自进行Rebalance，如下图所示：

![image](/images/RocketMQ/863118-20220212233935653-283344572.png)

> Broker是通知每个消费者各自Rebalance，即每个消费者自己给自己重新分配队列，而不是Broker将分配好的结果告知Consumer。

从这个角度，RocketMQ与Kafka Rebalance机制类似，二者Rebalance分配都是在客户端进行，不同的是：
`Kafka`：会在消费者组的多个消费者实例中，选出一个作为Group Leader，由这个Group Leader来进行分区分配，分配结果通过Cordinator(特殊角色的broker)同步给其他消费者。相当于Kafka的分区分配只有一个大脑，就是Group Leader。

`RocketMQ`：每个消费者，自己负责给自己分配队列，相当于每个消费者都是一个大脑。

此时，我们需要思考2个问题：

```
问题1：每个消费者自己给自己分配，如何避免脑裂的问题呢？
```

因为每个消费者都不知道其他消费者分配的结果，会不会出现一个队列分配给了多个消费者，或者有的队列分配给了多个消费者。

```
问题2：如果某个消费者没有收到Rebalance通知怎么办？
```

> 每个消费者都会定时触发Rebalance，以避免Rebalance通知丢失。

#### ConsumerOffsetManager

事实上，通过ConsumerManager已经可以获得Rebalance时需要的消费者所有必要信息。但是还有一点，Rebalance时，如果某个队列重新分配给了某个消费者，那么必须接着从上一个消费者的位置继续开始消费，这就是ConsumerOffsetManager的作用。

消费者可以给Broker发送`UPDATE_CONSUMER_OFFSET`请求，来更新消费者组对于某个Topic的消费进度。
发送`QUERY_CONSUMER_OFFSET`指令，来从ConsumerOffsetManager中查询消费进度。

通过mqadmin命令行工具的consumerProgress子命令，来可以看到Topic每个队列的消费进度，如：

![image](/images/RocketMQ/863118-20220212235034744-245488062.png)

#### SubscriptionGroupManager

订阅组配置管理器，内部针对每个消费者组维护一个SubscriptionGroupConfig。主要是为了针对消费者组进行一些运维操作，这里不做过多介绍，感兴趣的读者自行查阅源码。



## Consumer Rebalance机制

前面分析Broker在Rebalance过程中起的是协调者的作用，可以帮忙我们从整体对Rebalance有个初步的认知。但是Rebalance的细节，却是在Consumer端完成的。

在本节中，我们将着重讨论单个consumer的Rebalance流程。

需要说明的是，RocketMQ的consumer分配pull和push两种模式，二者的工作逻辑并不相同。这里主要以push模式的默认实现类`DefaultMQPushConsumer`为例进行讲解。

### Rebalance触发时机

在前文，我们提到Broker会主动通知消费者进行Rebalance，但是从消费者的角度来看，整个生命过程的各个阶段，都有可能触发Rebalance，而不仅仅是收到通知后才进行Rebalance。

具体来说，Consumer在启动/运行时/停止时，都有可能触发Rebalance，如下图所示：

![image](/images/RocketMQ/863118-20220212235232037-2126774732.png)

- `在启动时`，消费者会立即向所有Broker发送一次发送心跳(HEART_BEAT)请求，Broker则会将消费者添加由ConsumerManager维护的某个消费者组中。然后这个Consumer自己会立即触发一次Rebalance。
- `在运行时`，消费者接收到Broker通知会立即触发Rebalance，同时为了避免通知丢失，会周期性触发Rebalance；
- `当停止时`，消费者向所有Broker发送取消注册客户端(UNREGISTER_CLIENT)命令，Broker将消费者从ConsumerManager中移除，并通知其他Consumer进行Rebalance。

#### Consumer启动

DefaultMQPushConsumerImpl的start方法显示了一个消费者的启动流程，如下图所示：

```java
public synchronized void start() throws MQClientException {
    //1 启动准备工作(略)
    switch (this.serviceState) {...}
    //2 从nameserver更新topic路由信息
    this.updateTopicSubscribeInfoWhenSubscriptionChanged();
    //3 检查consumer配置
    this.mQClientFactory.checkClientInBroker();
    //4 向每个broker发送心跳信息
    this.mQClientFactory.sendHeartbeatToAllBrokerWithLock();
    //5 立即触发一次rebalance
    this.mQClientFactory.rebalanceImmediately();
}
```

可以看到Consumer启动主要分为5个步骤，其中步骤2、4、5是我们分析的重点。：

- 步骤1：启动准备工作，这里使用{...}表示省略，以更清楚看清整个流程
- 步骤2：从nameserver更新topic路由信息，收集到了Rebalance所需的队列信息
- 步骤3：检查consumer配置(主要是为了功能兼容，例如consumer要使用SQL92过滤，但是broker并没有开启，则broker会返回错误)
- 步骤4：向每个broker发送心跳信息，将自己加入消费者组
- 步骤5：立即触发一次rebalance，在步骤2和4的基础上立即触发一次Rebalance

##### 更新订阅的topic路由信息

上述代码步骤2，调用updateTopicSubscribeInfoWhenSubscriptionChanged()方法，从nameserver更新topic路由信息，由于一个消费者可以订阅多个topic，因此这个Topic都需要更新，如下：

`MQClientInstance#updateTopicSubscribeInfoWhenSubscriptionChanged`

```java
private void updateTopicSubscribeInfoWhenSubscriptionChanged() {
    //获得的订阅当前Consumer订阅所有Topic信息。key为topic，value为SubscriptionData
    Map<String, SubscriptionData> subTable = this.getSubscriptionInner();
    if (subTable != null) {
        for (final Map.Entry<String, SubscriptionData> entry : subTable.entrySet()) {
            final String topic = entry.getKey();
            //从NameServer逐一更新每个topic的路由信息
            this.mQClientFactory.updateTopicRouteInfoFromNameServer(topic);
        }
    }
}
```

通过这一步，**当前Consumer就拿到了Topic下所有队列信息**，具备了Rebalance的第一个条件。

##### 向broker发送心跳信息

在上述启动流程中的第4步，调用`sendHeartbeatToAllBrokerWithLock`方法，给每个Broker都发送一个心跳请求。

```java
this.mQClientFactory.sendHeartbeatToAllBrokerWithLock();
```

当Broker收到心跳请求后，将这个消费者注册到ConsumerManager中，前文提到，当Consumer数量变化时，Broker会主动通知其他消费者进行Rebalance。

而心跳的数据，这些数据是在MQClientInstance类的prepareHeartbeatData方法来准备的。我们在前文通过mqadmin命令行工具的consumerConnection 自命令查看到的消费者订阅信息，在这里都出现了，如所示：

```java
private HeartbeatData prepareHeartbeatData() {
    HeartbeatData heartbeatData = new HeartbeatData();
 
    //1 clientID
    heartbeatData.setClientID(this.clientId);
 
    //2 Consumer心跳信息
    for (Map.Entry<String, MQConsumerInner> entry : this.consumerTable.entrySet()) {
        MQConsumerInner impl = entry.getValue();
        if (impl != null) {
            ConsumerData consumerData = new ConsumerData();
            consumerData.setGroupName(impl.groupName());//消费者名称
            consumerData.setConsumeType(impl.consumeType());//消费类型
            consumerData.setMessageModel(impl.messageModel());//消费模式
            consumerData.setConsumeFromWhere(impl.consumeFromWhere());//从什么位置开始消费
            consumerData.getSubscriptionDataSet().addAll(impl.subscriptions());//每个topic的订阅信息
            consumerData.setUnitMode(impl.isUnitMode());
 
            heartbeatData.getConsumerDataSet().add(consumerData);
        }
    }
 
    //3 Producer心跳信息
    for (Map.Entry<String/* group */, MQProducerInner> entry : this.producerTable.entrySet()) {
        MQProducerInner impl = entry.getValue();
        if (impl != null) {
            ProducerData producerData = new ProducerData();
            producerData.setGroupName(entry.getKey());
 
            heartbeatData.getProducerDataSet().add(producerData);
        }
    }
 
    return heartbeatData;
}
```

提示：可以看到心跳数据HeartbeatData中，既包含Consumer信息，也包含Producer信息(这里进行了省略)。

##### 立即触发一次Rebalance

消费者启动流程的最后一步是调用以下方法立即触发一次rebalance：

```java
this.mQClientFactory.rebalanceImmediately();
```

这个方法内部实际上，是通过唤醒一个RebalanceService，来触发Rebalance：

```java
public void rebalanceImmediately() {
        this.rebalanceService.wakeup();
    }
```

这里我们并不着急分析RebalanceService的内部具体实现，因为所有的Rebalance触发都是以这个类为入口，我们将在讲解完运行时/停止时的Rebalance触发时机后，统一进行说明。



#### Consumer运行时

consumer在运行时，通过两种机制来触发Rebalance：

- 监听broker 消费者数量变化通知，触发rebalance
- 周期性触发rebalance，避免Broker的Rebalance通知丢失。

##### 监听broker 消费者数量变化通知，触发rebalance

RocketMQ支持双向通信机制，Broker发送给客户端到的通知请求，在客户端通过ClientRemotingProcessor的processRequest方法来处理进行区分处理，如下：

`ClientRemotingProcessor#processRequest`

```java
@Override
public RemotingCommand processRequest(ChannelHandlerContext ctx,
    RemotingCommand request) throws RemotingCommandException {
    switch (request.getCode()) {
        //检查事务消息状态
        case RequestCode.CHECK_TRANSACTION_STATE:
            return this.checkTransactionState(ctx, request);
        //通知消费者数量发生变化，内部会触发rebalance
        case RequestCode.NOTIFY_CONSUMER_IDS_CHANGED:
            return this.notifyConsumerIdsChanged(ctx, request);
        //重置消费者offset
        case RequestCode.RESET_CONSUMER_CLIENT_OFFSET:
            return this.resetOffset(ctx, request);
        //获得消费者状态
        case RequestCode.GET_CONSUMER_STATUS_FROM_CLIENT:
            return this.getConsumeStatus(ctx, request);
        //获得消费者运行时信息
        case RequestCode.GET_CONSUMER_RUNNING_INFO:
            return this.getConsumerRunningInfo(ctx, request);
        //直接消费消息
        case RequestCode.CONSUME_MESSAGE_DIRECTLY:
            return this.consumeMessageDirectly(ctx, request);
        default:
            break;
    }
    return null;
}
```

目前，我们关注的是，消费者数量变化时，Broker给客户端的通知，也就是上图中红色框的内容。在收到通知后，其调用`notifyConsumerIdsChanged`进行处理，这个方法内部会立即触发Rebalance。

`ClientRemotingProcessor#notifyConsumerIdsChanged`

```java
public RemotingCommand notifyConsumerIdsChanged(ChannelHandlerContext ctx,
    RemotingCommand request) throws RemotingCommandException {
    try {
        //对Broker的Rebalance通知请求进行解码
        final NotifyConsumerIdsChangedRequestHeader requestHeader =
            (NotifyConsumerIdsChangedRequestHeader) 
            request.decodeCommandCustomHeader(NotifyConsumerIdsChangedRequestHeader.class);
        //打印Rebalance通知信息
        log.info("receive broker's notification[{}], the consumer group: {} 
            changed, rebalance immediately",
            RemotingHelper.parseChannelRemoteAddr(ctx.channel()),
            requestHeader.getConsumerGroup());
        //立即触发Rebalance
        this.mqClientFactory.rebalanceImmediately();
    } catch (Exception e) {
        log.error("notifyConsumerIdsChanged exception", RemotingHelper.exceptionSimpleDesc(e));
    }
    return null;
}
```

可以看到这里是调用mqClientFactory的rebalanceImmediately方法触发Rebalance，而前面讲解消费者启动时是通过RebalanceService触发，事实上，后者RebalanceService内部也是通过mqClientFactory进行触发Rebalance。

##### 周期性触发rebalance，避免Broker的Rebalance通知丢失

为了避免Broker的Rebalance通知丢失问题，客户端还会通过RebalanceService定时的触发Rebalance，默认间隔是20秒，如下：

```java
public class RebalanceService extends ServiceThread {
    //1 周期性触发Rebalance时间间隔，默认20秒
    private static long waitInterval =
        Long.parseLong(System.getProperty("rocketmq.client.rebalance.waitInterval", "20000"));
    private final InternalLogger log = ClientLogger.getLog();
    private final MQClientInstance mqClientFactory;
 
    public RebalanceService(MQClientInstance mqClientFactory) {
        this.mqClientFactory = mqClientFactory;
    }
 
    @Override
    public void run() {
        log.info(this.getServiceName() + " service started");
        //2 在消费者没有停止的情况下，通过死循环定时触发Rebalance
        while (!this.isStopped()) {
            //3 等待20秒，如果被唤醒，则无需等待
            this.waitForRunning(waitInterval);
            //4 触发Rebalance
            this.mqClientFactory.doRebalance();
        }
 
        log.info(this.getServiceName() + " service end");
    }
 
    @Override
    public String getServiceName() {
        return RebalanceService.class.getSimpleName();
    }
}
```



#### consumer停止

最后，消费者在正常停止时，需要调用shutdown方法，这个方法的工作逻辑如下所示：

`DefaultMQPushConsumerImpl#shutdown`

```java
public synchronized void shutdown() {
    switch (this.serviceState) {
        case CREATE_JUST:
            break;
        case RUNNING:
            //1 停止正在消费中的消息
            this.consumeMessageService.shutdown();
            //2 持久化offset
            this.persistConsumerOffset();
            //3 取消注册consumer
            this.mQClientFactory.unregisterConsumer(this.defaultMQPushConsumer.getConsumerGroup());
            //4 关闭与name server和broker的连接
            this.mQClientFactory.shutdown();
            log.info("the consumer [{}] shutdown OK", this.defaultMQPushConsumer.getConsumerGroup());
            //5 丢弃尚未处理的消息
            this.rebalanceImpl.destroy();
            this.serviceState = ServiceState.SHUTDOWN_ALREADY;
            break;
        case SHUTDOWN_ALREADY:
            break;
        default:
            break;
    }
}
```

可以看到停止也分为5步，我们重点关注第2、3步：

- 在停止时，会首先通过第2步`持久化offset`，前文提到过默认情况下，offset是异步提交的，为了避免重复消费，因此在关闭时，必须要对尚未提交的offset进行持久化，其实就是发送UPDATE_CONSUMER_OFFSET请求给Broker，Broker对应更新ConsumerOffsetManager中的记录。这样当队列分配给其他消费者时，就可以从这个位置继续开始消费。
- 接着第3步调用`unregisterConsumer`方法，向所有broker发送UNREGISTER_CLIENT命令，取消注册Consumer。broker接收到这个命令后，将consumer从ConsumerManager中移除，然后通知这个消费者下的其他Consumer进行Rebalance。

至此，我们已经讲解完了Consumer启动时/运行时/停止时，所有可能的Rebalance触发时机



## 单个消费者Rebalance流程

### 整体介绍

前面提到Consumer的Rebalance触发时机有很多，Broker主动通知某个消费者组需要进行Rebalance；RebalanceService也会定时20秒触发Rebalance。然而需要注意的是，`只要任意一个消费者组需要Rebalance，这台机器上启动的所有其他消费者，也都要进行Rebalance`。
不同的触发机制最终底层都调用了MQClientInstance的doRebalance方法，而在这个方法的源码中，并没有区分哪个消费者组需要进行Rebalance，而是逐一进行触发，如下：

`MQClientInstance#doRebalance`

```java
public void doRebalance() {
    //迭代每个consumer，进行rebalance
    for (Map.Entry<String, MQConsumerInner> entry : this.consumerTable.entrySet()) {
        MQConsumerInner impl = entry.getValue();
        if (impl != null) {
            try {
                //逐一触发Rebalance
                impl.doRebalance();
            } catch (Throwable e) {
                log.error("doRebalance exception", e);
            }
        }
    }
}
```

上述代码逐一迭代当前机器启动的所有消费者(MQConsumerInner)，并调用其doRebalance方法进行触发Rebalance。

MQConsumerInner有push模式和pull模式两种实现，分别是：`DefaultMQPushConsumerImpl`和`DefaultMQPullConsumerImpl`，二者的Rebalance逻辑并不相同。
对于push模式，其会根据消费者指定的消息监听器是有序还是无序进行判定Rebalance过程中是否需要对有序消费进行特殊处理。

参见：`DefaultMQPushConsumerImpl#doRebalance`。

```java
@Override
public void doRebalance() {
    if (!this.pause) {
        //如果MessageListenerOrderly，则为true；否则为false
        this.rebalanceImpl.doRebalance(this.isConsumeOrderly());
    }
}
```

而pull模式，总是认为是无序的，因为写死了为false。参见：DefaultMQPullConsumerImpl#doRebalance

```java
@Override
public void doRebalance() {
    if (this.rebalanceImpl != null) {
        this.rebalanceImpl.doRebalance(false);
    }
}
```

我们看到，不管是push还是pull模式的Consumer实现，内部都是调用RebalanceImpl的doRebalance方法进行触发，将是否有序作为一个参数传入。

在这个方法内部，如果一个消费者订阅了多个Topic，会迭代每个Topic维度逐一触发Rebalance。相关源码如下所示：

`RebalanceImpl#doRebalance`

```java
public void doRebalance(final boolean isOrder) {
    //1 迭代当前consumer订阅的每一个topic，逐一进行rebalance
    Map<String, SubscriptionData> subTable = this.getSubscriptionInner();
    if (subTable != null) {
        for (final Map.Entry<String, SubscriptionData> entry : subTable.entrySet()) {
            final String topic = entry.getKey();
            try {
                //2 按照topic维度进行rebalance
                this.rebalanceByTopic(topic, isOrder);
            } catch (Throwable e) {
                if (!topic.startsWith(MixAll.RETRY_GROUP_TOPIC_PREFIX)) {
                    log.warn("rebalanceByTopic Exception", e);
                }
            }
        }
    }
 
    this.truncateMessageQueueNotMyTopic();
}
```

在这一点上，Kafka与不RocketMQ同，其是将所有Topic下的所有队列合并在一起，进行Rebalance。
RocketMQ按照Topic维度进行Rebalance，会导致一个很严重的结果：如果一个消费者组订阅多个Topic，可能会出现分配不均。
举例来说：某个消费者组group_X下有4个消费者实例，分别部署在192.168.0.[1-4] 4台机器上；订阅了两个主题：TopicX和TopicY。如下图：

![image](/images/RocketMQ/863118-20220213000344825-805438762.png)

其中：001~004表示的就是这4个消费者的信息，而订阅信息显示了订阅TopicX和TopicY。

TopicX、TopicY各有2个队列，因此总共有4个队列；而刚好又有4个消费者，我们的期望是每个消费者分配一个队列。然后实际分配情况如下图所示：

![image](/images/RocketMQ/863118-20220213000937054-315720411.png)

通过观察Client IP列，我们看到192.168.0.1、192.168.0.2各出现2两次，也就是分配到了两个队列，另外2个IP(192.168.0.3、192.168.0.4)并没有出现，表示没有分配到任何队列。

之所以出现分配不均，就是因为按照Topic维度进行Rebalance，因此这里TopicX和TopicY会各Rebalance一次。且每次Rebalance时都对消费者组下的实例进行排序，所以TopicX和TopicY各自的两个队列，都分配给消费者组中的前两个消费者了。

`由于订阅多个Topic时可能会出现分配不均，这是在RocketMQ中我们为什么不建议同一个消费者组订阅多个Topic的重要原因`。另一款消息中间件Kafka会将所有Topic队列合并在一起，然后在消费者中进行分配，因此相对会更加平均。

### 单个Topic的Rebalance流程

对于每个Topic的Rebalance的触发，都是通过RebalanceImpl#rebalanceByTopic方法。这个方法从整体上可以分为3大步骤：

1. 获得Rebalance元数据信息
2. 进行队列分配
3. 分配结果处理

`RebalanceImpl#rebalanceByTopic`

```java
rivate void rebalanceByTopic(final String topic, final boolean isOrder) {
    switch (messageModel) {
        // 广播模式，略
        case BROADCASTING: {...}
        //集群模式
        case CLUSTERING: {
            //1. 获得要Rebalance的元数据
            //mqSet：Topic下的队列信息集合
            //cidAll: 消费者组下的消费者实例id信息集合
            Set<MessageQueue> mqSet = this.topicSubscribeInfoTable.get(topic);
            List<String> cidAll = this.mQClientFactory.findConsumerIdList(topic, consumerGroup);
 
            if (null == mqSet) {
                if (!topic.startsWith(MixAll.RETRY_GROUP_TOPIC_PREFIX)) {
                    log.warn("doRebalance, {}, but the topic[{}] not exist.", consumerGroup, topic);
                }
            }
            if (null == cidAll) {
                log.warn("doRebalance, {} {}, get consumer id list failed", consumerGroup, topic);
            }
 
            if (mqSet != null && cidAll != null) {
                List<MessageQueue> mqAll = new ArrayList<MessageQueue>();
                mqAll.addAll(mqSet);
 
                //2. 进行分配
                //2.1 首先对Topic下的所有队列，和所有消费者实例id分别进行排序
                Collections.sort(mqAll);
                Collections.sort(cidAll);
 
                //2.2 通过AllocateMessageQueueStrategy，进行预分配
                AllocateMessageQueueStrategy strategy = this.allocateMessageQueueStrategy;
                List<MessageQueue> allocateResult = null;
                try {
                    allocateResult = strategy.allocate(
                        this.consumerGroup,
                        this.mQClientFactory.getClientId(),
                        mqAll,
                        cidAll);
                } catch (Throwable e) {
                    log.error("AllocateMessageQueueStrategy.allocate Exception...");
                    return;
                }
 
                //3 分配结果处理
                //3.1 分配结果去重
                Set<MessageQueue> allocateResultSet = new HashSet<MessageQueue>();
                if (allocateResult != null) {
                    allocateResultSet.addAll(allocateResult);
                }
 
                //3.2 根据预分配到的结果尝试更新ProcessQueue Table，并返回true or false表示是否发生变更
                boolean changed = 
                      this.updateProcessQueueTableInRebalance(topic, allocateResultSet, isOrder);
 
                //3.3 如果分配结果发生变更，进行后续处理
                if (changed) {
                    log.info(
                        "rebalanced result changed. allocateMessageQueueStrategyName={}...");
                    this.messageQueueChanged(topic, mqSet, allocateResultSet);
                }
            }
            break;
        }
        default:
            break;
    }
}
```

#### 获得Rebalance元数据

消费者在Rebalance时需要获得：Topic下的队列信息，和消费者组下实例id信息。

- 对于队列信息：会从之前的缓存的Topic路由信息中获取；
- 对于消费者组实例id信息：前面我们提到过Broker通过`ConsumerManager`维护了所有的消费者信息，findConsumerIdList方法内部会会发送`GET_CONSUMER_LIST_BY_GROUP`给请求给任意一个Broker进行获取。

#### 进行队列分配

RocketMQ的分配策略使用AllocateMessageQueueStrategy接口表示，并提供了多种实现：

| AllocateMessageQueueAveragely         | 平均分配 默认    |
| :------------------------------------ | :--------------- |
| AllocateMessageQueueAveragelyByCircle | 循环分配         |
| AllocateMessageQueueConsistentHash    | 一致性哈希       |
| AllocateMessageQueueByConfig          | 根据配置进行分配 |
| AllocateMessageQueueByMachineRoom     | 根据机房         |
| AllocateMachineRoomNearby             | 就近分配         |

在前面，我们提到过RocketMQ的Rebalance流程中，消费者组下的多个实例，自己给自己分配队列，相当于存在多个大脑。那么`如何保证分配结果的一致呢`？

通过以下两个手段来保证：

- 首先，**在分配之前，需要对Topic下的多个队列进行排序，对多个消费者实例按照id进行排序**
- 其次，**每个消费者需要使用相同的分配策略**。

这里以AllocateMessageQueueAveragely分配为例来进行说明。假设某个Topic有10个队列，消费者组有3个实例c1、c2、c3，使用AllocateMessageQueueAveragely分配结果如下图所示：

![image](/images/RocketMQ/863118-20220213001331286-1776201859.png)

在分配时，每个消费者(c1、c2、c3)平均分配3个，此时还多出1个，多出来的队列按顺序分配给消费者队列的头部元素，因此c1多分配1个，最终c1分配了4个队列。

尽管每个消费者是各自给自己分配，但是因为使用的相同的分配策略，定位从队列列表中哪个位置开始给自己分配，给自己分配多少个队列，从而保证最终分配结果的一致。

`AllocateMessageQueueAveragely`源码如下所示：

```java
public class AllocateMessageQueueAveragely implements AllocateMessageQueueStrategy {
    private final InternalLogger log = ClientLogger.getLog();
 
    @Override
    public List<MessageQueue> allocate(String consumerGroup, String currentCID, 
                         List<MessageQueue> mqAll,List<String> cidAll) {
        //...检查工作，略
 
        List<MessageQueue> result = new ArrayList<MessageQueue>();
        if (!cidAll.contains(currentCID)) {
            log.info("[BUG] ConsumerGroup: {} The consumerId: {} not in cidAll: {}",
                consumerGroup,
                currentCID,
                cidAll);
            return result;
        }
        //计算自己再消费者列表中的位置
        int index = cidAll.indexOf(currentCID);
        //计算平均分配后，多出来的数量
        int mod = mqAll.size() % cidAll.size();
        //计算每个消费者平均分配的数量，
        //如果不能平均分配(mod>0)，取模多出来的队列，将分配消费者列表中的前几个消费者
        int averageSize =
            //1 如果队列数量<=消费者数量，将averageSize设置为1，即每个队列分配1个
            mqAll.size() <= cidAll.size() ? 1 : 
                    //2 如果队列数量多于消费者数量
                    //如果不能平均分配(mod > 0)，并且自己的位置小于取模的位置(index < mod)
                    (mod > 0 && index < mod ? 
                            mqAll.size() / cidAll.size() + 1 //在平均分配的基础上多分配一个
                            : mqAll.size() / cidAll.size()); //进行平均分配
 
        //计算分配给自己的队列列表中的起始位置
        int startIndex = (mod > 0 && index < mod) ? 
                      index * averageSize : index * averageSize + mod;
        //计算range，即分配给自己几个队列。
        // 由于计算出的averageSize最小为1，当队列数量是小于消费者数量，多出来的消费者应该分配为0，所
        //以取(mqAll.size() - startIndex)
        int range = Math.min(averageSize, mqAll.size() - startIndex);
        //从起始位置开始，循环range次，把对应的队列分配给自己
        for (int i = 0; i < range; i++) {
            result.add(mqAll.get((startIndex + i) % mqAll.size()));
        }
        //返回
        return result;
    }
 
    @Override
    public String getName() {
        return "AVG";
    }
}
```

对于其他分配策略，感兴趣的读者可以自行阅读源码，在实际开发中使用的很少。

特别的，mqadmin工具提供了一个allocateMQ子命令，通过其我们可以预览某个Topic在多个消费者分区是如何分配的，使用方式如下：

> sh bin/mqadmin allocateMQ -i ip1,ip2,ip3 -t TopicA -n localhost:9876

这个工具是按照AllocateMessageQueueAveragely策略，将模拟分配的结果进行json格式展示。

#### 分配结果处理

消费者计算出分配给自己的队列结果后，需要与之前进行比较，判断添加了新的队列，或者移除了之前分配的队列，也可能没有变化。

- 对于新增的队列，需要先计算从哪个位置开始消费，接着从这个位置开始拉取消息进行消费；
- 对于移除的队列，要移除缓存的消息，并停止拉取消息，并持久化offset。

这些操作都是在`RebalanceImpl#updateProcessQueueTableInRebalance`中进行。



#### 其他操作

处理完队列变更后，会调用messageQueueChanged方法进行最后一步处理。
对于push和pull的处理逻辑不同。

- 对于push模式主要是进行一些流控参数的更新。
- 对于pull模式是回调用户自定义的MessageQueueListener。
  参考：RebalancePullImpl#messageQueueChanged

`RebalancePullImpl#messageQueueChanged`

```java
@Override
public void messageQueueChanged(String topic, Set<MessageQueue> mqAll, Set<MessageQueue> mqDivided) {
    MessageQueueListener messageQueueListener = 
             this.defaultMQPullConsumerImpl.getDefaultMQPullConsumer().getMessageQueueListener();
    if (messageQueueListener != null) {
        try {
            //回调用户注册的队列变更监听器
            messageQueueListener.messageQueueChanged(topic, mqAll, mqDivided);
        } catch (Throwable e) {
            log.error("messageQueueChanged exception", e);
        }
    }
}

```



## 参考

[深入理解RocketMQ消费者Rebalance机制](https://www.cnblogs.com/mpyidudu/p/15887951.html)