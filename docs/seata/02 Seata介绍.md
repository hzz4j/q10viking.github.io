---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /seata/
typora-root-url: ..\.vuepress\public
---



Seata 是一款开源的分布式事务解决方案，致力于提供高性能和简单易用的分布式事务服务。Seata 将为用户提供了 AT、TCC、SAGA 和 XA 事务模式，为用户打造一站式的分布式解决方案。AT模式是阿里首推的模式



## **Seata的三大角色**

在 Seata 的架构中，一共有三个角色： 

- **TC (Transaction Coordinator) - 事务协调者**
  - 维护全局和分支事务的状态，驱动全局事务提交或回滚。

- **TM (Transaction Manager) - 事务管理器**
  - 定义全局事务的范围：开始全局事务、提交或回滚全局事务。

- **RM (Resource Manager) - 资源管理器**
  - 管理分支事务处理的资源，与TC交谈以注册分支事务和报告分支事务的状态，并驱动分支事务提交或回滚。

> 其中，TC 为单独部署的 Server 服务端，TM 和 RM 为嵌入到应用中的 Client 客户端。

在 Seata 中，一个分布式事务的生命周期如下：

1. TM 请求 TC 开启一个全局事务。TC 会生成一个 XID 作为该全局事务的编号。XID会在微服务的调用链路中传播，保证将多个微服务的子事务关联在一起。
2. RM 请求 TC 将本地事务注册为全局事务的分支事务，通过全局事务的 XID 进行关联。
3. TM 请求 TC 告诉 XID 对应的全局事务是进行提交还是回滚。
4. TC 驱动 RM 们将 XID 对应的自己的本地事务进行提交还是回滚

![https://note.youdao.com/yws/public/resource/c480b9d259db401acff9fdd30a770d64/xmlnote/C6C51A3053FB4CCBA3A7F972AE5A8651/54140](/images/seata/54140.png)



## **Seata AT模式的设计思路**

> Seata AT模式的核心是对业务无侵入，是一种改进后的两阶段提交，其设计思路如下:

- 一阶段：业务数据和回滚日志记录在同一个本地事务中提交，释放本地锁和连接资源。
- 二阶段：
- - 提交异步化，非常快速地完成。
  - 回滚通过一阶段的回滚日志进行反向补偿。

### **一阶段**

业务数据和回滚日志记录在同一个本地事务中提交，释放本地锁和连接资源。核心在于对业务sql进行解析，转换成undolog，并同时入库，这是怎么做的呢？

​    ![0](/images/seata/54152.png)



### **二阶段**

- 分布式事务操作成功，则TC通知RM异步删除undolog

​    ![0](/images/seata/54150.png)

- 分布式事务操作失败，TM向TC发送回滚请求，RM 收到协调器TC发来的回滚请求，通过 XID 和 Branch ID 找到相应的回滚日志记录，通过回滚记录生成反向的更新 SQL 并执行，以完成分支的回滚
- ![https://note.youdao.com/yws/public/resource/c480b9d259db401acff9fdd30a770d64/xmlnote/08356958531F44FF9C6ABCF38BE1AC58/54151](/images/seata/54151.png)

