---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /RocketMQ/
typora-root-url: ..\.vuepress\public
---

## 下载RocketMQ

依赖环境java

[Quick Start - Apache RocketMQ](http://rocketmq.apache.org/docs/quick-start/)

![image-20211101195412586](/images/RocketMQ/image-20211101195412586.png)

 RocketMQ源码版本下载地址：[**https://dlcdn.apache.org/rocketmq/4.9.2/rocketmq-all-4.9.2-source-release.zip**](https://dlcdn.apache.org/rocketmq/4.9.2/rocketmq-all-4.9.2-source-release.zip)

 RocketMQ运行版本下载地址： [**https://dlcdn.apache.org/rocketmq/4.9.2/rocketmq-all-4.9.2-bin-release.zip**](https://dlcdn.apache.org/rocketmq/4.9.2/rocketmq-all-4.9.2-bin-release.zip)

 这两个版本我们都下载下来。



## 快速安装RocketMQ

 RocketMQ的安装非常简单，就是上传解压就可以了。

1. 把下载的rocketmq-all-4.9.2-bin-release.zip在本地完成解压，并上传到/usr/rocketmq目录。

2. 把rocketmq的bin目录也配置到环境变量当中。 vi  /etc/profile，加入以下rocket的内容，并执行source /etc/profile让环境变量生效：

```sh
# /etc/profile
#----------------Java Environment config----------------------

JAVA_HOME=/usr/java/jdk1.8.0_311
CLASSPATH=.:$JAVA_HOME/lib/
#-------------------Rocket config-----------------------------
ROCKETMQ_HOME=/usr/rocketmq/rocketmq-4.9.2

PATH=$PATH:$JAVA_HOME/bin:$ROCKETMQ_HOME/bin
export PATH JAVA_HOME CLASSPATH ROCKETMQ_HOME
```

 这样RocketMQ就安装完成了。我们把他运行起来。

> 这个ROCKETMQ_HOME的环境变量是必须要单独配置的，如果不配置的话，启动NameSever和Broker都会报错。
>
> 这个环境变量的作用是用来加载$ROCKETMQ_HOME/conf下的除broker.conf以外的几个配置文件。所以实际情况中，可以不按这个配置，但是一定要能找到配置文件。

## 启动RocketMQ

### 启动NameServer⭐

启动NameServer非常简单， 在$ROCKETMQ_HOME/bin目录下有个mqnamesrv。直接执行这个脚本就可以启动RocketMQ的NameServer服务。

但是要注意，RocketMQ默认预设的JVM内存是4G，这是RocketMQ给我们的最佳配置。但是通常我们用虚拟机的话都是不够4G内存的，所以需要调整下JVM内存大小。[修改的方式是直接修改runserver.sh](http://xn--runserver-z89na9857bcqmtlfda85rmzcf95l5zb.sh/)。 用vi runserver.sh编辑这个脚本，在脚本中找到这一行调整内存大小为512M

```sh
JAVA_OPT="${JAVA_OPT} -server -Xms4g -Xmx4g -Xmn2g -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=320m"
# 修改为
JAVA_OPT="${JAVA_OPT} -server -Xms512m -Xmx512m -Xmn256m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=320m"
```

然后我们用静默启动的方式启动NameServer服务：

```sh
nohup bin/mqnamesrv & 
```

启动完成后，在nohup.out(该文件会在当前目录自动生成)里看到这一条关键日志就是启动成功了。并且使用jps指令可以看到有一个NamesrvStartup进程。

```sh
[root@localhost rocketmq-4.9.2]# ll
total 44
drwxrwxrwx. 2 root root   126 Nov  1 07:59 benchmark
drwxrwxrwx. 3 root root  4096 Nov  1 07:59 bin
drwxrwxrwx. 6 root root   211 Nov  1 07:59 conf
drwxrwxrwx. 2 root root  4096 Nov  1 07:59 lib
-rwxrwxrwx. 1 root root 17327 Nov  1 07:59 LICENSE
-rw-------. 1 root root   344 Nov  1 08:25 nohup.out
-rwxrwxrwx. 1 root root  1338 Nov  1 07:59 NOTICE
-rwxrwxrwx. 1 root root  5342 Nov  1 07:59 README.md
[root@localhost rocketmq-4.9.2]# cat nohup.out
Java HotSpot(TM) 64-Bit Server VM warning: Using the DefNew young collector with the CMS collector is deprecated and will likely be removed in a future release
Java HotSpot(TM) 64-Bit Server VM warning: UseCMSCompactAtFullCollection is deprecated and will likely be removed in a future release.
The Name Server boot success. serializeType=JSON
```

#### 出现权限问题

```sh
[root@localhost rocketmq-4.9.2]# nohup: ignoring input and appending output to ‘nohup.out’
nohup: failed to run command ‘bin/mqnamesrv’: Permission denied
```

```sh
# -R 是指级联应用到目录里的所有子目录和文件
# 777 是所有用户都拥有最高权限
chmod -R 777 rocketmq-4.9.2
```

### 启动Broker⭐

 [启动Broker的脚本是runbroker.sh](http://xn--brokerrunbroker-wy8y53qb44gl6dtn1h9p4b.sh/)。Broker的默认预设内存是8G，启动前，如果内存不够，同样需要调整下JVM内存。vi [runbroker.sh](http://runbroker.sh/)，找到这一行，进行内存调整

```sh
JAVA_OPT="${JAVA_OPT} -server -Xms8g -Xmx8g"
#修改为
JAVA_OPT="${JAVA_OPT} -server -Xms512m -Xmx512m -Xmn256m"
```

然后我们需要找到$ROCKETMQ_HOME/conf/broker.conf， vi指令进行编辑，在最下面加入一个配置：

```sh
autoCreateTopicEnable=true
```

 [然后也以静默启动的方式启动runbroker.sh](http://xn--runbroker-zz6n89bg5xa221choab1448bmczanv9bfgw6s1niq8a.sh/)

```sh
nohup bin/mqbroker &
```

启动完成后，同样是检查nohup.out日志，有这一条关键日志就标识启动成功了。 并且jps指令可以看到一个BrokerStartup进程。

```sh
The broker[localhost.localdomain, 192.168.187.135:10911] boot success. serializeType=JSON
```

> 在观察runserver.sh和runbroker.sh时，我们还可以查看到其他的JVM执行参数，这些参数都可以进行定制。例如我们观察到一个比较有意思的地方，nameServer使用的是CMS垃圾回收器，而Broker使用的是G1垃圾回收器。 关于垃圾回收器的知识你还记得吗？

#### 出现No route info of this topic, TopicTest问题

https://blog.csdn.net/jiangyu1013/article/details/81478754

----------

### jps查看是否启动成功

```sh
[root@localhost rocketmq-4.9.2]# jps
1907 BrokerStartup
1866 NamesrvStartup
1962 Jps
```

## 命令行快速验证

在RocketMQ的安装包中，提供了一个tools.sh工具可以用来在命令行快速验证RocketMQ服务。我们在worker2上进入RocketMQ的安装目录：

首先需要配置一个环境变量NAMESRV_ADDR指向我们启动的NameServer服务。

```sh
export NAMESRV_ADDR='localhost:9876'
```

然后启动消息生产者发送消息：默认会发1000条消息

```sh
bin/tools.sh org.apache.rocketmq.example.quickstart.Producer
```

我们可以看到发送消息的日志：

```sh
...
SendResult [sendStatus=SEND_OK, msgId=7F00000109334517D9A301E6B28203E6, offsetMsgId=C0A8BB8700002A9F000000000002EC12, messageQueue=MessageQueue [topic=TopicTest, brokerName=localhost.localdomain, queueId=3], queueOffset=249]
SendResult [sendStatus=SEND_OK, msgId=7F00000109334517D9A301E6B28303E7, offsetMsgId=C0A8BB8700002A9F000000000002ECD2, messageQueue=MessageQueue [topic=TopicTest, brokerName=localhost.localdomain, queueId=0], queueOffset=249]
08:51:36.255 [NettyClientSelector_1] INFO  RocketmqRemoting - closeChannel: close the connection to remote address[127.0.0.1:9876] result: true
08:51:36.341 [NettyClientSelector_1] INFO  RocketmqRemoting - closeChannel: close the connection to remote address[192.168.187.135:10911] result: true
```

这日志中，上面部分就是我们发送的消息的内容。后面两句标识消息生产者正常关闭。

然后启动消息消费者接收消息：

```sh
bin/tools.sh  org.apache.rocketmq.example.quickstart.Consumer
```

启动后，可以看到消费到的消息。

```sh
ConsumeMessageThread_20 Receive New Messages: [MessageExt [brokerName=localhost.localdomain, queueId=0, storeSize=192, queueOffset=147, sysFlag=0, bornTimestamp=1635771095196, bornHost=/192.168.187.135:36366, storeTimestamp=1635771095208, storeHost=/192.168.187.135:10911, msgId=C0A8BB8700002A9F000000000001BAD2, commitLogOffset=113362, bodyCRC=566808141, reconsumeTimes=0, preparedTransactionOffset=0, toString()=Message{topic='TopicTest', flag=0, properties={MIN_OFFSET=0, MAX_OFFSET=500, CONSUME_START_TIME=1635771295321, UNIQ_KEY=7F00000109334517D9A301E6AE9C024F, CLUSTER=DefaultCluster, TAGS=TagA}, body=[72, 101, 108, 108, 111, 32, 82, 111, 99, 107, 101, 116, 77, 81, 32, 53, 57, 49], transactionId='null'}]]
```

> 日志中MessageExt后的整个内容就是一条完整的RocketMQ消息。我们要对这个消息的结构有个大概的了解，后面会对这个消息进行深入的理解。
>
> 其中比较关键的属性有：brokerName，queueId，msgId，topic，cluster，tags，body，transactionId。先找下这些属性在哪里。

而这个**Consume指令并不会结束，他会继续挂起**，**等待消费其他的消息**。我们可以使用CTRL+C停止该进程。

## 查看broker是否连接到了Namesrv⭐

```sh
[root@localhost bin]# mqadmin clusterList -n localhost:9876
RocketMQLog:WARN No appenders could be found for logger (io.netty.util.internal.InternalThreadLocalMap).
RocketMQLog:WARN Please initialize the logger system properly.
#Cluster Name     #Broker Name            #BID  #Addr                  #Version                #InTPS(LOAD)       #OutTPS(LOAD) #PCWait(ms) #Hour #SPACE
DefaultCluster    localhost.localdomain   0     192.168.187.135:10911  V4_9_2                   0.00(0,0ms)         0.00(0,0ms)          0 454380.83 0.4200
```



## 关闭RocketMQ服务

要关闭RocketMQ服务可以通过mqshutdown脚本直接关闭

```sh
# 1.关闭NameServer
sh bin/mqshutdown namesrv
# 2.关闭Broker
sh bin/mqshutdown broker
```

