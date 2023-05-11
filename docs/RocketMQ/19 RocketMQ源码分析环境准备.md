---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /RocketMQ/
typora-root-url: ..\.vuepress\public
---





## 下载源码

分析4.9.2版本的代码[下载 | RocketMQ (apache.org)](https://rocketmq.apache.org/zh/download)



## 导入到IDEA

将源码导入IDEA后，需要先对源码进行编译。编译指令 `clean install - Dmaven.test.skip=true`

![image-20230511221758107](/images/RocketMQ/image-20230511221758107.png)

编译完成后就可以开始调试代码了。调试时需要按照以下步骤： 调试时，先在项目目录下创建一个conf目录，并从distribution目录中拷贝 broker.conf和logback_broker.xml和logback_namesrv.xml

![image-20230511222836744](/images/RocketMQ/image-20230511222836744.png)

并对broker.conf做一些配置

```properties
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

brokerClusterName = DefaultCluster
brokerName = broker-a
brokerId = 0
deleteWhen = 04
fileReservedTime = 48
brokerRole = ASYNC_MASTER
flushDiskType = ASYNC_FLUSH

# 自动创建Topic
autoCreateTopicEnable=true
# nameServ地址
namesrvAddr=localhost:9876
# 存储路径
storePathRootDir=E:\\RocketMQ\\data\\rocketmq\\dataDir
# commitLog路径
storePathCommitLog=E:\\RocketMQ\\data\\rocketmq\\dataDir\\commitlog
# 消息队列存储路径
storePathConsumeQueue=E:\\RocketMQ\\data\\rocketmq\\dataDir\\consumequeue
# 消息索引存储路径
storePathIndex=E:\\RocketMQ\\data\\rocketmq\\dataDir\\index
# checkpoint文件路径
storeCheckpoint=E:\\RocketMQ\\data\\rocketmq\\dataDir\\checkpoint
# abort文件存储路径
abortFile=E:\\RocketMQ\\data\\rocketmq\\dataDir\\abort
```







## Windows

界面准备

```
E:\RocketMQ\web
```

运行

```sh
java -jar rocketmq-console-ng-1.0.1.jar
```

访问[http://localhost:8080/#/](http://localhost:8080/#/)





## NamesrvStartup启动

启动报错

```sh
Please set the ROCKETMQ_HOME variable in your environment to match the location of the RocketMQ installation
```

报错原因是是为NamesrvConfig这个类在初始化没有获得相应的配置,rocketmqHome为null所以报出上面的语句

```java
// MixAll.ROCKETMQ_HOME_PROPERTY = "rocketmq.home.dir"
// MixAll.ROCKETMQ_HOME_ENV = "ROCKETMQ_HOME"
private String rocketmqHome = System.getProperty(MixAll.ROCKETMQ_HOME_PROPERTY, System.getenv(MixAll.ROCKETMQ_HOME_ENV));
```



```java
if (null == namesrvConfig.getRocketmqHome()) {
    System.out.printf("Please set the %s variable in your environment to match the location of the RocketMQ installation%n", MixAll.ROCKETMQ_HOME_ENV);
    System.exit(-2); // Process finished with exit code -2
}
```

配置环境变量

```sh
ROCKETMQ_HOME=D:\learncode\RocketMQ\rocketmq-all-4.9.1-source-release
```

![image-20220613164943279](/images/RocketMQ/image-20220613164943279.png)



## BrokerStartup

启动Broker时，同样需要ROCETMQ_HOME环境变量，并且还需要配置一个-c 参 数，指向broker.conf配置文件。

![image-20220613165741676](/images/RocketMQ/image-20220613165741676.png)
