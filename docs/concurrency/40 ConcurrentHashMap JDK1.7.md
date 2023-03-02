---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## 数据结构

ConcurrentHashMap的数据结构与HashMap基本类似，区别在于：

1. 内部在数据写入时加了同步机制(**分段锁**)保证线程安全，读操作是无锁操作；
2. 扩容时老数据的转移是并发执行的，这样扩容的效率更高。

## 并发安全控制

![img](/images/concurrency/16139-1.png)


> 大的Hash表套小的Hash表

**Segment数组extends ReentrantLock （分段锁）**

![image-20210630155701579](/images/concurrency/image-202106301557015792)

当hash计算出现相同的时候，使用segement的锁，来确保线程安全

![image-20210630155308895](/images/concurrency/image-20210630155308895.png)





