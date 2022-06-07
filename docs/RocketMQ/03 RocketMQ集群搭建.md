---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /RocketMQ/
typora-root-url: ..\.vuepress\public
---

::: tip 

主从架构，主是干什么的（收发消息），从是干什么的（做备份）

:::



## 机器环境

### 三台虚拟机规划

准备三台虚拟机，root密码 123456;IP地址：

```sh
192.168.187.135 （work1）# 以它为主
192.168.187.130 （work2）
192.168.187.132	（work3）
```

----------

### 关闭防火墙

```sh
systemctl stop firewalld.service
firewall-cmd --state 
```

## 配置RocketMQ集群(2主2从异步刷盘)

我们为了便于观察，这次搭建一个**2主2从异步刷盘**的集群，所以我们会使用conf/2m-2s-async下的配置文件，实际项目中，为了达到高可用，一般会使用dleger。预备设计的集群情况如下：

| 机器                    | nemaeServer节点部署 | broker节点部署       |
| ----------------------- | ------------------- | -------------------- |
| 192.168.187.135 (work1) | nameserver          |                      |
| 192.168.187.130 (work2) | nameserver          | broker-a, broker-b-s |
| 192.168.187.132 (work3) | nameserver          | broker-b,broker-a-s  |

所以修改的配置文件是进入rocketmq的config目录下修改2m-2s-async的配置文件。--只需要配置broker.conf。

> 在rocketmq的config目录下可以看到rocketmq建议的各种配置方式：
>
> - 2m-2s-async: 2主2从异步刷盘(吞吐量较大，但是消息可能丢失),
> - 2m-2s-sync:2主2从同步刷盘(吞吐量会下降，但是消息更安全)，
> - 2m-noslave:2主无从(单点故障)，然后还可以直接配置broker.conf，进行单点环境配置。
> - 而dleger就是用来实现主从切换的。集群中的节点会基于Raft协议随机选举出一个leader，其他的就都是follower。通常正式环境都会采用这种方式来搭建集群。

![image-20211101224451742](/images/RocketMQ/image-20211101224451742.png)

**我们这次采用2m-2s-async的方式搭建集群。**

----------

### 配置第一组broker-a

#### broker-a主节点

在**192.168.187.130**上先配置borker-a的master节点。先配置2m-2s-async/broker-a.properties

```sh
#所属集群名字，名字一样的节点就在同一个集群内
brokerClusterName=rocketmq-cluster
#broker名字，名字一样的节点就是一组主从节点。⭐⭐
brokerName=broker-a
#brokerid,0就表示是Master，>0的都是表示 Slave
brokerId=0
#nameServer地址，分号分割
#namesrvAddr=worker1:9876;worker2:9876;worker3:9876
namesrvAddr=192.168.187.135:9876;192.168.187.130:9876;192.168.187.132:9876
#在发送消息时，自动创建服务器不存在的topic，默认创建的队列数 ⭐⭐
defaultTopicQueueNums=4
#是否允许 Broker 自动创建Topic，建议线下开启，线上关闭
autoCreateTopicEnable=true
#是否允许 Broker 自动创建订阅组，建议线下开启，线上关闭
autoCreateSubscriptionGroup=true
#Broker 对外服务的监听端口
listenPort=10911
#删除文件时间点，默认凌晨 4点
deleteWhen=04
#文件保留时间，默认 48 小时
fileReservedTime=120
#commitLog每个文件的大小默认1G
mapedFileSizeCommitLog=1073741824
#ConsumeQueue每个文件默认存30W条，根据业务情况调整
mapedFileSizeConsumeQueue=300000
#destroyMapedFileIntervalForcibly=120000
#redeleteHangedFileInterval=120000
#检测物理文件磁盘空间
diskMaxUsedSpaceRatio=88
#存储路径
storePathRootDir=/usr/rocketmq/store
#commitLog 存储路径
storePathCommitLog=/usr/rocketmq/store/commitlog
#消费队列存储路径存储路径
storePathConsumeQueue=/usr/rocketmq/store/consumequeue
#消息索引存储路径
storePathIndex=/usr/rocketmq/store/index
#checkpoint 文件存储路径
storeCheckpoint=/usr/rocketmq/store/checkpoint
#abort 文件存储路径
abortFile=/usr/rocketmq/store/abort
#限制的消息大小
maxMessageSize=65536
#flushCommitLogLeastPages=4
#flushConsumeQueueLeastPages=2
#flushCommitLogThoroughInterval=10000
#flushConsumeQueueThoroughInterval=60000
#Broker 的角色
#- ASYNC_MASTER 异步复制Master
#- SYNC_MASTER 同步双写Master
#- SLAVE
brokerRole=ASYNC_MASTER
#刷盘方式
#- ASYNC_FLUSH 异步刷盘
#- SYNC_FLUSH 同步刷盘
flushDiskType=ASYNC_FLUSH
#checkTransactionMessageEnable=false
#发消息线程池数量
#sendMessageThreadPoolNums=128
#拉消息线程池数量
#pullMessageThreadPoolNums=128
# 开启sql过滤
enablePropertyFilter=true
```

#### broker-a从节点

该节点对应的从节点在**192.168.187.132**上。修改2m-2s-async/broker-a-s.properties **需要修改brokerId和brokerRole**

还有**storePathRootDir和listenPort**

```sh
#所属集群名字，名字一样的节点就在同一个集群内
brokerClusterName=rocketmq-cluster
#broker名字，名字一样的节点就是一组主从节点。 
brokerName=broker-a
#brokerid,0就表示是Master，>0的都是表示 Slave
brokerId=1
#nameServer地址，分号分割
#namesrvAddr=worker1:9876;worker2:9876;worker3:9876
namesrvAddr=192.168.187.135:9876;192.168.187.130:9876;192.168.187.132:9876
#在发送消息时，自动创建服务器不存在的topic，默认创建的队列数
defaultTopicQueueNums=4
#是否允许 Broker 自动创建Topic，建议线下开启，线上关闭
autoCreateTopicEnable=true
#是否允许 Broker 自动创建订阅组，建议线下开启，线上关闭
autoCreateSubscriptionGroup=true
#Broker 对外服务的监听端口
listenPort=11011
#删除文件时间点，默认凌晨 4点
deleteWhen=04
#文件保留时间，默认 48 小时
fileReservedTime=120
#commitLog每个文件的大小默认1G
mapedFileSizeCommitLog=1073741824
#ConsumeQueue每个文件默认存30W条，根据业务情况调整
mapedFileSizeConsumeQueue=300000
#destroyMapedFileIntervalForcibly=120000
#redeleteHangedFileInterval=120000
#检测物理文件磁盘空间
diskMaxUsedSpaceRatio=88
#存储路径
storePathRootDir=/usr/rocketmq/storeSlave
#commitLog 存储路径
storePathCommitLog=/usr/rocketmq/storeSlave/commitlog
#消费队列存储路径存储路径
storePathConsumeQueue=/usr/rocketmq/storeSlave/consumequeue
#消息索引存储路径
storePathIndex=/usr/rocketmq/storeSlave/index
#checkpoint 文件存储路径
storeCheckpoint=/usr/rocketmq/storeSlave/checkpoint
#abort 文件存储路径
abortFile=/usr/rocketmq/storeSlave/abort
#限制的消息大小
maxMessageSize=65536
#flushCommitLogLeastPages=4
#flushConsumeQueueLeastPages=2
#flushCommitLogThoroughInterval=10000
#flushConsumeQueueThoroughInterval=60000
#Broker 的角色
#- ASYNC_MASTER 异步复制Master
#- SYNC_MASTER 同步双写Master
#- SLAVE
brokerRole=SLAVE
#刷盘方式
#- ASYNC_FLUSH 异步刷盘
#- SYNC_FLUSH 同步刷盘
flushDiskType=ASYNC_FLUSH
#checkTransactionMessageEnable=false
#发消息线程池数量
#sendMessageThreadPoolNums=128
#拉消息线程池数量
#pullMessageThreadPoolNums=128
# 开启sql过滤
enablePropertyFilter=true
```

### 配置第二组Broker-b

#### broker-b主节点

这一组broker的主节点在**192.168.187.132**上，所以需要配置worker3上的config/2m-2s-async/broker-b.properties

```sh
#所属集群名字，名字一样的节点就在同一个集群内
brokerClusterName=rocketmq-cluster
#broker名字，名字一样的节点就是一组主从节点。
brokerName=broker-b
#brokerid,0就表示是Master，>0的都是表示 Slave
brokerId=0
#nameServer地址，分号分割
#namesrvAddr=worker1:9876;worker2:9876;worker3:9876
namesrvAddr=192.168.187.135:9876;192.168.187.130:9876;192.168.187.132:9876
#在发送消息时，自动创建服务器不存在的topic，默认创建的队列数
defaultTopicQueueNums=4
#是否允许 Broker 自动创建Topic，建议线下开启，线上关闭
autoCreateTopicEnable=true
#是否允许 Broker 自动创建订阅组，建议线下开启，线上关闭
autoCreateSubscriptionGroup=true
#Broker 对外服务的监听端口
listenPort=10911
#删除文件时间点，默认凌晨 4点
deleteWhen=04
#文件保留时间，默认 48 小时
fileReservedTime=120
#commitLog每个文件的大小默认1G
mapedFileSizeCommitLog=1073741824
#ConsumeQueue每个文件默认存30W条，根据业务情况调整
mapedFileSizeConsumeQueue=300000
#destroyMapedFileIntervalForcibly=120000
#redeleteHangedFileInterval=120000
#检测物理文件磁盘空间
diskMaxUsedSpaceRatio=88
#存储路径
storePathRootDir=/usr/rocketmq/store
#commitLog 存储路径
storePathCommitLog=/usr/rocketmq/store/commitlog
#消费队列存储路径存储路径
storePathConsumeQueue=/usr/rocketmq/store/consumequeue
#消息索引存储路径
storePathIndex=/usr/rocketmq/store/index
#checkpoint 文件存储路径
storeCheckpoint=/usr/rocketmq/store/checkpoint
#abort 文件存储路径
abortFile=/usr/rocketmq/store/abort
#限制的消息大小
maxMessageSize=65536
#flushCommitLogLeastPages=4
#flushConsumeQueueLeastPages=2
#flushCommitLogThoroughInterval=10000
#flushConsumeQueueThoroughInterval=60000
#Broker 的角色
#- ASYNC_MASTER 异步复制Master
#- SYNC_MASTER 同步双写Master
#- SLAVE
brokerRole=ASYNC_MASTER
#刷盘方式
#- ASYNC_FLUSH 异步刷盘
#- SYNC_FLUSH 同步刷盘
flushDiskType=ASYNC_FLUSH
#checkTransactionMessageEnable=false
#发消息线程池数量
#sendMessageThreadPoolNums=128
#拉消息线程池数量
#pullMessageThreadPoolNums=128
# 开启sql过滤
enablePropertyFilter=true
```

----------

#### broker-b从节点

然后他对应的slave在**192.168.187.130**上，修改work2上的 **conf/2m-2s-async/broker-b-s.properties** 需要修改brokerId和brokerRole

还有**storePathRootDir和listenPort**

```sh
#所属集群名字，名字一样的节点就在同一个集群内
brokerClusterName=rocketmq-cluster
#broker名字，名字一样的节点就是一组主从节点。
brokerName=broker-b
#brokerid,0就表示是Master，>0的都是表示 Slave
brokerId=1
#nameServer地址，分号分割
#namesrvAddr=worker1:9876;worker2:9876;worker3:9876
namesrvAddr=192.168.187.135:9876;192.168.187.130:9876;192.168.187.132:9876
#在发送消息时，自动创建服务器不存在的topic，默认创建的队列数
defaultTopicQueueNums=4
#是否允许 Broker 自动创建Topic，建议线下开启，线上关闭
autoCreateTopicEnable=true
#是否允许 Broker 自动创建订阅组，建议线下开启，线上关闭
autoCreateSubscriptionGroup=true
#Broker 对外服务的监听端口
listenPort=11011
#删除文件时间点，默认凌晨 4点
deleteWhen=04
#文件保留时间，默认 48 小时
fileReservedTime=120
#commitLog每个文件的大小默认1G
mapedFileSizeCommitLog=1073741824
#ConsumeQueue每个文件默认存30W条，根据业务情况调整
mapedFileSizeConsumeQueue=300000
#destroyMapedFileIntervalForcibly=120000
#redeleteHangedFileInterval=120000
#检测物理文件磁盘空间
diskMaxUsedSpaceRatio=88
#存储路径
storePathRootDir=/usr/rocketmq/storeSlave
#commitLog 存储路径
storePathCommitLog=/usr/rocketmq/storeSlave/commitlog
#消费队列存储路径存储路径
storePathConsumeQueue=/usr/rocketmq/storeSlave/consumequeue
#消息索引存储路径
storePathIndex=/usr/rocketmq/storeSlave/index
#checkpoint 文件存储路径
storeCheckpoint=/usr/rocketmq/storeSlave/checkpoint
#abort 文件存储路径
abortFile=/usr/rocketmq/storeSlave/abort
#限制的消息大小
maxMessageSize=65536
#flushCommitLogLeastPages=4
#flushConsumeQueueLeastPages=2
#flushCommitLogThoroughInterval=10000
#flushConsumeQueueThoroughInterval=60000
#Broker 的角色
#- ASYNC_MASTER 异步复制Master
#- SYNC_MASTER 同步双写Master
#- SLAVE
brokerRole=SLAVE
#刷盘方式
#- ASYNC_FLUSH 异步刷盘
#- SYNC_FLUSH 同步刷盘
flushDiskType=ASYNC_FLUSH
#checkTransactionMessageEnable=false
#发消息线程池数量
#sendMessageThreadPoolNums=128
#拉消息线程池数量
#pullMessageThreadPoolNums=128
# 开启sql过滤
enablePropertyFilter=true
```



----------

这样broker就配置完成了。需要注意的配置项：

1. 同一机器上两个实例的store目录不能相同，否则会报错 Lock failed,MQ already started

2. 同一机器上两个实例的listenPort也不能相同。否则会报端口占用的错

3. nameserver不需要进行配置，直接启动就行。这也**看出nameserver是无状态的**。

### 小结

1. 所属集群名字，名字一样的节点就在同一个集群内
2. broker名字，名字一样的节点就是一组主从节点。
3. Broker 的角色
   1. 主 ASYNC_MASTER 异步复制Master ; SYNC_MASTER 同步双写Master
   2. 从SLAVE

----------

## 启动RocketMQ⭐

启动就比较简单了，直接调用bin目录下的脚本就行。只是启动之前要注意看下他们的JVM内存配置，默认的配置都比较高。

### 先启动nameServer

修改三个节点上的bin/runserver.sh，调整里面的jvm内存配置。找到下面这一行调整下内存

```sh
JAVA_OPT="${JAVA_OPT} -server -Xms512m -Xmx512m -Xmn256m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=320m"
```

**直接在三个节点上启动nameServer**。

```sh
nohup bin/mqnamesrv &
```

使用jps指令可以看到一个NamesrvStartup进程。



### 再启动broker

启动broker是使用的mqbroker指令，只是**注意启动broker时需要通过-c 指定对应的配置文件**。

在**worker2（192.168.187.130）**上启动broker-a的master节点和broker-b的slave节点

```sh
nohup bin/mqbroker -c conf/2m-2s-async/broker-a.properties &
nohup bin/mqbroker -c conf/2m-2s-async/broker-b-s.properties &
```

在**work3（192.168.187.132）**上启动broker-b的master节点和broker-a的slave节点

```sh
nohup bin/mqbroker -c conf/2m-2s-async/broker-b.properties &
nohup bin/mqbroker -c conf/2m-2s-async/broker-a-s.properties &
```

> 启动slave时，如果遇到报错 Lock failed,MQ already started ，那是因为有多个实例共用了同一个storePath造成的，这时就需要调整store的路径。

----------



## 查看效果

任意一台机器运行该命令即可

```sh
mqadmin clusterList -n localhost:9876
```

![image-20211101233811455](/images/RocketMQ/image-20211101233811455.png)

