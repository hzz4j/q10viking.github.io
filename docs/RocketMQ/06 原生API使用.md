---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /RocketMQ/
typora-root-url: ..\.vuepress\public
---



## 依赖

```xml
<dependency>
    <groupId>org.apache.rocketmq</groupId>
    <artifactId>rocketmq-client</artifactId>
    <version>4.9.2</version>
</dependency>
```

RocketMQ的生产者和消费者的编程模型都是有个比较固定的步骤的

- 消息发送者的固定步骤
  1. 创建消息生产者producer，并制定生产者组名
  2. 指定Nameserver地址(集群以逗号分隔)
  3. 启动producer
  4. 创建消息对象，指定主题Topic、Tag和消息体
  5. 发送消息
  6. 关闭生产者producer
- 消息消费者的固定步骤
  1. 创建消费者Consumer，制定消费者组名
  2. 指定Nameserver地址
  3. 订阅主题Topic和Tag
  4. 设置回调函数，处理消息
  5. 启动消费者consumer