---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /ddd/
typora-root-url: ..\.vuepress\public
---



## CQS

CQS(CommandQuerySeparation): 命令查询分离

基本思想是可以将系统操作划分为两个界限明显的类别：

- 查询。 这些查询返回结果，不改变系统的状态，且没有副作用。
- 命令。 这些命令会更改系统状态

CQS 是一个简单的概念 - 说明同一对象中的方法是查询还是命令。 每种方法要么返回状态，要么更改状态，不会二者兼具。 即使是单个存储库模式对象也符合 CQS。 CQS 被视为 CQRS 的基本原则。



## CQRS



CQRS(**Command Query Responsibility Segregation**) 命令查询职责隔离,是一种分离数据读取与写入模型的体系结构模式



![img](/images/ddd/cqrs.png)



![CQRS命令与查询示意图](/images/ddd/cqrs-csdn.png)

## 参考

[在微服务中应用简化的 CQRS 和 DDD 模式 | Microsoft Learn](https://learn.microsoft.com/zh-cn/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/apply-simplified-microservice-cqrs-ddd-patterns)

[CQRS (martinfowler.com)](https://martinfowler.com/bliki/CQRS.html)

[CommandQuerySeparation (martinfowler.com)](https://martinfowler.com/bliki/CommandQuerySeparation.html)

[(2条消息) DDD+CQRS架构如何优雅实现查询_ddd查询_橙子AQA的博客-CSDN博客](https://blog.csdn.net/qq_35211818/article/details/104244027)

