---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

## 什么是阻塞队列，举几个应用场景

阻塞队列（BlockingQueue）是一种特殊类型的队列，它用于在多线程环境中实现线程之间的通信。常见的Java阻塞队列实现包括：ArrayBlockingQueue、LinkedBlockingQueue、PriorityBlockingQueue等。

阻塞队列具有以下特点：

1. 当队列为空时，从队列中获取元素的操作会被阻塞，直到队列中有新的元素可用。
2. 当队列已满时，向队列中添加元素的操作会被阻塞，直到队列中有空位可用。

以下是几个常见的应用场景：

1. 生产者-消费者模型：这是阻塞队列最常见的应用场景。生产者将元素添加到队列中，消费者从队列中获取元素。阻塞队列在这里起到了缓冲的作用，避免了生产者和消费者之间的直接竞争。
2. 线程池的任务队列：阻塞队列可以被用作线程池的任务队列。当有新的任务到达时，它们会被添加到阻塞队列中。当线程池中有空闲线程时，它们会从队列中获取任务并执行。
3. 线程同步：阻塞队列可以用于实现线程之间的同步。例如，多个线程可以共享一个阻塞队列，当一个线程需要获取某个元素时，如果队列为空，该线程会被阻塞，直到其他线程将元素添加到队列中。
4. 数据的分发和收集：在某些应用中，可能需要将数据从一个线程分发到其他线程，或者从多个线程收集数据。阻塞队列可以用于实现这种数据传递。

总之，阻塞队列是一种非常有用的工具，它可以帮助程序员在多线程环境中实现线程之间的通信和同步。

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

