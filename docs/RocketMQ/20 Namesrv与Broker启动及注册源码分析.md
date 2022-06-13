---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /RocketMQ/
typora-root-url: ..\.vuepress\public
---



## Namesrv中Broker注册表

```java
private final HashMap<String/* topic */, List<QueueData>> topicQueueTable;
private final HashMap<String/* brokerName */, BrokerData> brokerAddrTable;
private final HashMap<String/* clusterName */, Set<String/* brokerName */>> clusterAddrTable;
private final HashMap<String/* brokerAddr */, BrokerLiveInfo> brokerLiveTable;
private final HashMap<String/* brokerAddr */, List<String>/* Filter Server */> filterServerTable;
```

![image-20220613201916168](/images/RocketMQ/image-20220613201916168.png)

## Namesrv与Broker启动及注册源码分析

[Namesrv与Broker启动及注册源码分析 | ProcessOn免费在线作图,在线流程图,在线思维导图 |](https://www.processon.com/view/link/62a72c9f1e08535c73e48499)

<common-progresson-snippet src="https://www.processon.com/view/link/62a72c9f1e08535c73e48499"/>

![Namesrv与Broker启动及注册源码分析](/images/RocketMQ/Namesrv与Broker启动及注册源码分析.png)