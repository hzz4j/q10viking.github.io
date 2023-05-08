---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Lock/
typora-root-url: ..\.vuepress\public
---



## CAP角度分析redis和zk锁

redis主从架构满足的是AP架构。主从切换会导致锁的失效。

zk leader节点收到数据之后，会同步到slave子节点，有半数以上的节点同步成功，leader节点才响应客户端。如果主节点挂了，那么子节点成为主节点，数据仍然在。





## RedLock实现原理

针对redis主从架构可能失效的问题，出现了红锁的解决方案。

牺牲了性能了，但是保证了一致性。

### 实现原理

::: tip

绿色部分是主节点。并且这三个redis不是集群。

:::

![image-20220810150530278](/images/Redis/image-20220810150530278.png)



## 存在问题

::: tip

红锁不能百分之百解决redis主从架构的锁失效问题。

:::

还是主从问题。redis如果有从节点，如redis2挂了，redis2的从节点没有同步redis2的数据，那么下个线程来加锁，还是能半数以上成功。