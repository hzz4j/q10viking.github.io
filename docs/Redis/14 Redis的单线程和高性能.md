---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---

## **Redis是单线程吗**

Redis 的单线程主要是指 **Redis 的网络 IO 和键值对读写是由一个线程来完成的**，这也是 **Redis 对外提供键值存储服务的主要流程**。

但 Redis 的其他功能，比如**持久化、异步删除、集群数据同步**等，其实是由额外的线程执行的。



## **Redis 单线程为什么还能这么快**

1. 因为它所有的数据都在**内存**中，所有的运算都是内存级别的运算
2. 而且单线程避免了多线程的切换性能损耗问题。
3. 正因为 Redis 是单线程，所以要小心使用 Redis 指令，对于那些耗时的指令(比如keys)，一定要谨慎使用，一不小心就可能会导致 Redis 卡顿。 



## **Redis 单线程如何处理那么多的并发客户端连接**

Redis的**IO多路复用**：redis利用**epoll来实现IO多路复用，将连接信息和事件放到队列**中，依次放到文件事件分派器，**事件分派器**将事件分发给事**件处理器**

![](/images/Redis/69701.png)

```sh
# 查看redis支持的最大连接数，在redis.conf文件中可修改，# maxclients 10000
127.0.0.1:6379> CONFIG GET maxclients
1) "maxclients"
2) "10000"
```

