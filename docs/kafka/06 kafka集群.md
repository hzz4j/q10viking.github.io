---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /kafka/
typora-root-url: ..\.vuepress\public
---



## 集群搭建

一个单独的broker意味着kafka集群中只有一个节点。要想增加kafka集群中的节点数量，只需要多启动几个broker实例即可。为了有更好的理解，现在我们在一台机器上同时启动三个broker实例。

首先，我们需要建立好其他2个broker的配置文件

```sh
cp config/server.properties config/server-9093.properties
cp config/server.properties config/server-9094.properties
```

### 配置

```sh
#broker.id属性在kafka集群中必须要是唯一
broker.id=1
#kafka部署的机器ip和提供服务的端口号
listeners=PLAINTEXT://192.168.65.60:9093   
log.dir=/home/q10viking/software/kafka_2.12-2.5.0/kafka-logs-9093
#kafka连接zookeeper的地址，要把多个kafka实例组成集群，对应连接的zookeeper必须相同
zookeeper.connect=192.168.65.60:2181



broker.id=2
listeners=PLAINTEXT://192.168.65.60:9094
log.dir=/home/q10viking/software/kafka_2.12-2.5.0/kafka-logs-9094
zookeeper.connect=192.168.65.60:2181


```



### 启动

```sh
bin/kafka-server-start.sh -daemon config/server.properties   # 9092 默认的配置
bin/kafka-server-start.sh -daemon config/server-9093.properties
bin/kafka-server-start.sh -daemon config/server-9094.properties

```

![image-20230422230754044](/images/kafka/image-20230422230754044.png)







## 创建一个主题

> 这个主题有2个分区，每个分区3个副本

```sh
bin/kafka-topics.sh --create --zookeeper 172.29.96.105:2181 --replication-factor 3 --partitions 2 --topic terminal-cluster-topic
```



> 查看这个主题下的分区在broker中的情况

```sh
 bin/kafka-topics.sh --describe --zookeeper 172.29.96.105:2181 --topic terminal-cluster-topic
Topic: terminal-cluster-topic   PartitionCount: 2       ReplicationFactor: 3    Configs:
        Topic: terminal-cluster-topic   Partition: 0    Leader: 2       Replicas: 2,0,1 Isr: 2,0,1
        Topic: terminal-cluster-topic   Partition: 1    Leader: 0       Replicas: 0,1,2 Isr: 0,1,2
```

![image-20230422231803231](/images/kafka/image-20230422231803231.png)

- leader节点负责给定partition的所有读写请求，同一个主题不同分区leader副本一般不一样(为了容灾)
- replicas 表示某个partition在哪几个broker上存在备份。不管这个几点是不是”leader“，甚至这个节点挂了，也会列出。
- isr 是replicas的一个子集，它只列出当前还存活着的，并且**已同步备份**了该partition的节点。



## 发送消息

```sh
bin/kafka-console-producer.sh --broker-list 172.29.96.105:9092,172.29.96.105:9093,172.29.96.105:9094 --topic terminal-cluster-topic
>1st message
>2st message
>3st message
```

![image-20230422232613654](/images/kafka/image-20230422232613654.png)



## 消费消息

```sh
bin/kafka-console-consumer.sh --bootstrap-server 172.29.96.105:9092,172.29.96.105:9093,172.29.96.105:9094 --from-beginning --topic terminal-cluster-topic
```

![image-20230422233151249](/images/kafka/image-20230422233151249.png)



### 测试容错性

因为broker2目前是`terminal-cluster-topic`的分区0的leader，所以我们要将其kill

![image-20230422233414932](/images/kafka/image-20230422233414932.png)

![image-20230422233459088](/images/kafka/image-20230422233459088.png)



找到这个进程，kill掉

```sh
$ netstat -nltp | grep 9094
tcp6       0      0 172.29.96.105:9094      :::*                    LISTEN      13351/java

kill 13351
```

![image-20230422233749376](/images/kafka/image-20230422233749376.png)

![image-20230422233835448](/images/kafka/image-20230422233835448.png)

> 我们可以看到，分区0的leader节点已经变成了broker 2。要注意的是，在Isr中，已经没有了2号节点。leader的选举也是从ISR(in-sync replica)中进行的

```sh
bin/kafka-topics.sh --describe --zookeeper 172.29.96.105:2181 --topic terminal-cluster-topic
Topic: terminal-cluster-topic   PartitionCount: 2       ReplicationFactor: 3    Configs:
        Topic: terminal-cluster-topic   Partition: 0    Leader: 0       Replicas: 2,0,1 Isr: 0,1
        Topic: terminal-cluster-topic   Partition: 1    Leader: 0       Replicas: 0,1,2 Isr: 0,1
```

> 继续消费消息,还是可以消费到

```sh
 bin/kafka-console-consumer.sh --bootstrap-server 172.29.96.105:9092,172.29.96.105:9093,172.29.96.105:9094 --from-beginning --topic terminal-cluster-topic
2st message
1st message
3st message
```



