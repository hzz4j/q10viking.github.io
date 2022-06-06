---
typora-root-url: ..\.vuepress\public
---

## 应用场景

1. 海量日志收集
2. 数据同步应用
3. 实时计算分析

![image-20220505122608814](/images/kafka/image-20220505122608814.png)

![image-20220505123008728](/images/kafka/image-20220505123008728.png)

![image-20220505123413799](/images/kafka/image-20220505123413799.png)



## 概念Topic主题-Partition分区

一对多的关系

![image-20220505123926663](/images/kafka/image-20220505123926663.png)

## Replica副本

## In Sync Replicas

Leader选举的时候从ISR中选举

![image-20220505125053117](/images/kafka/image-20220505125053117.png)

HW与LEO与数据同步有关

![image-20220505125452031](/images/kafka/image-20220505125452031.png)

----------

## HelloWorld

> 生产者

生产者属性Properties

KafkaProducer

ProducerRecord 指定主题和消息

> 消费者

KafkaConsumer

KafkaConsumer.subscribe 订阅主题

无限循环拉去消息

consumerl.poll 会返回ConsumerRecords，会取到所有partition的消息

```java
for(TopicPartition topicPartition: records.partitions){
    // 通过每个partition获取数据集合
	List<ConsumerRecord<String,String>> partitionRecords = 
        records.records(topicPartition);
}
```



属性配置：

生产者： 地址，序列化，CLIEND_ID

消费者：地址，反序列化，GRROUP_ID_CONFIG(消费者订阅组)，会话连接超时，offset自动提价还是手动提交（默认是自动提交），offset自动提交的周期

---------

生产者参数

acks  消息投递的可靠性

[【kafka】生产者消息投递可靠性（ACK机制，ISR机制，leader选举机制）_抬头看世界，低头写代码的技术博客_51CTO博客](https://blog.51cto.com/phpme/2513901)

![image-20220505143117119](/images/kafka/image-20220505143117119.png)

acks = -1不能完全确保消息100%的投递，如果ISR中只有一个主节点，其他的副本都在OSR,这种情况就会出现acks=1的情况。还需要配置kafka，至少多少份同步后才返回ack。这样会影响吞吐量