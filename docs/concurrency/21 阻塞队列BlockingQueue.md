---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## 阻塞队列BlockingQueue

1. 线程通信的一个工具
2. 它的特性是**在任意时刻只有一个线程可以进行take或者put操作**，并且BlockingQueue提供了超时return null的机制，在许多生产场景里都可以看到这个工具的身影。
   1. 线程池，Eureka的三级缓存，Nacos，Netty,MQ(RocketMQ)

## 队列类型

1. 无限队列
2. 有界队列

### 常见的4种阻塞队列

- ArrayBlockingQueue 由数组支持的有界队列
- LinkedBlockingQueue 由链接节点支持的可选有界队列
- PriorityBlockingQueue 由优先级堆支持的无界优先级队列
- DelayQueue 由优先级堆支持的、基于时间的调度队列

## 原理

```java
public ArrayBlockingQueue(int capacity, boolean fair) {
    if (capacity <= 0)
        throw new IllegalArgumentException();
    this.items = new Object[capacity];
    lock = new ReentrantLock(fair);
    notEmpty = lock.newCondition();
    notFull =  lock.newCondition();
}
```



### 条件等待队列与同步等待队列的配合

1. 只有CLH队列，才能获取锁
2. 当条件满足等待时，相应的条件等待队列中的全部Node全部转移到CLH队列

![ArrayBlockingQueue](/images/concurrency/ArrayBlockingQueue.png)

