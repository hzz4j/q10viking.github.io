---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /RocketMQ/
typora-root-url: ..\.vuepress\public
---



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

配置环境变量

```sh
ROCKETMQ_HOME=D:\learncode\RocketMQ\rocketmq-all-4.9.1-source-release
```

![image-20220613164943279](/images/RocketMQ/image-20220613164943279.png)



## BrokerStartup

启动Broker时，同样需要ROCETMQ_HOME环境变量，并且还需要配置一个-c 参 数，指向broker.conf配置文件。

![image-20220613165741676](/images/RocketMQ/image-20220613165741676.png)
