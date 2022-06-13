---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /RocketMQ/
typora-root-url: ..\.vuepress\public
---



## Producer启动



```java
// DefaultMQProducerImpl
ConcurrentMap<String/* topic */, TopicPublishInfo> topicPublishInfoTable =
        new ConcurrentHashMap<String, TopicPublishInfo>();
private final ConcurrentMap<String/* Topic */, TopicRouteData> topicRouteTable
```



如何选择队列发送，尤其是第一次没有topic的时候

![image-20220614002517988](/images/RocketMQ/image-20220613235730248.png)

它会根据系统的TBW102获取到Broker的基本信息，然后在producer中生成queue,生成的queue主要用来做负载均衡。（此时broker没有topic和对应的message queue建立）

## Producer发消息

[Producer发消息 | ProcessOn免费在线作图,在线流程图,在线思维导图 |](https://www.processon.com/view/link/62a7741007912939b22b5ffb)

<common-progresson-snippet src="https://www.processon.com/view/link/62a7741007912939b22b5ffb"/>