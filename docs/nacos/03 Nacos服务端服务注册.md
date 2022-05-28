---
typora-root-url: images
---

## 服务端注册服务

同步转异步解耦



## Nacos服务注册表

服务注册表与注册逻辑

如何防止多节点并发冲突。考虑维度：写入和读取并发冲突。设计思想：**读写分离**

CopyOnWrite 写时复制； Nacos是如何落地的？

synchronsized(Service) 应用



服务更新配置



## 模型总结



## 双层锁    Nacos注册服务并发控制

https://www.processon.com/view/link/629207cef346fb41eeb97dfb

![Nacos注册服务并发控制](/Nacos注册服务并发控制.png)



## 心跳机制





### TODO 

HashTable 并发问题出现在哪里,出现在什么场景？复习杨过老师的课程。

