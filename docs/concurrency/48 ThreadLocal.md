---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## ThreadLocal

> ThreadLocal是Java中所提供的线程本地存储机制，可以利⽤该机制将数据缓存在某个线程内部，该线 程可以在任意时刻、任意⽅法中获取缓存的数据



## 实现原理

ThreadLocal底层是通过ThreadLocalMap来实现的，每个Thread对象（注意不是ThreadLocal 对象）中都存在⼀个ThreadLocalMap，Map的key为ThreadLocal对象，Map的value为需要缓 存的值

![image-20230303180140479](/images/concurrency/image-20230303180140479.png)



## 内存泄漏

如果在线程池中使⽤ThreadLocal会造成内存泄漏，因为当ThreadLocal对象使⽤完之后，应该 要把设置的key，value，也就是Entry对象进⾏回收，但线程池中的线程不会回收，⽽线程对象 是通过强引⽤指向ThreadLocalMap，ThreadLocalMap也是通过强引⽤指向Entry对象，线程 不被回收，Entry对象也就不会被回收，从⽽出现内存泄漏，解决办法是，在使⽤了 ThreadLocal对象之后，⼿动调⽤ThreadLocal的remove⽅法，⼿动清楚Entry对象





## 应用

ThreadLocal经典的应⽤场景就是连接管理（⼀个线程持有⼀个连接，该连接对象可以在不同的⽅法之 间进⾏传递，线程之间不共享同⼀个连接）

