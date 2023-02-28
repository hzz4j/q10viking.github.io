---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



volatile是如何实现禁止指令重排优化的。先了解一个概念，内存屏障(Memory Barrier）

## 硬件层的内存屏障

Intel硬件提供了一系列的内存屏障，主要有： 

1. lfence，是一种Load Barrier 读屏障 

2. sfence, 是一种Store Barrier 写屏障 

3. mfence, 是一种全能型的屏障，具备ifence和sfence的能力 

4. Lock前缀，Lock不是一种内存屏障，但是它能完成类似内存屏障的功能。Lock会对CPU总线和高速缓存加锁，可以理解为CPU指令级的一种锁。它后面可以跟ADD, ADC, AND, BTC, BTR, BTS, CMPXCHG, CMPXCH8B, DEC, INC, NEG, NOT, OR, SBB, SUB, XOR, XADD, and XCHG等指令。

## JVM四类内存屏障指令

不同硬件实现内存屏障的方式不同，Java内存模型屏蔽了这种底层硬件平台的差异，由JVM来为不同的平台生成相应的机器码。 JVM中提供了四类内存屏障指令：

| 屏障类型   | 指令示例                   | 说明                                                         |
| ---------- | -------------------------- | ------------------------------------------------------------ |
| LoadLoad   | Load1; LoadLoad; Load2     | 保证load1的读取操作在load2及后续读取操作之前执行             |
| StoreStore | Store1; StoreStore; Store2 | 在store2及其后的写操作执行前，保证store1的写操作已刷新到主内存 |
| LoadStore  | Load1; LoadStore; Store2   | 在store2及其后的写操作执行前，保证load1的读操作已读取结束    |
| StoreLoad  | Store1; StoreLoad; Load2   | 保证store1的写操作已刷新到主内存之后，load2及其后的读操作才能执行 |



## 基于内存屏障volatile的实现

> javap -v -p name.class

```java
private static volatile boolean initFlag;
    descriptor: Z
    flags: ACC_PRIVATE, ACC_STATIC, ACC_VOLATILE
```

在字节码层面会添加ACC_VOLATILE

volatile能够保证可见性（及时看到），能够禁止指令重排序，但是不能确保原子性



**内存屏障**，又称**内存栅栏**，是一个CPU指令，它的作用有两个，**一是保证特定操作的执行顺序**，**二是保证某些变量的内存可见性**（利用该特性实现volatile的内存可见性）

1. 由于**编译器和处理器**都能执行**指令重排优化**。如果在指令间插入一条Memory Barrier则会告诉编译器和CPU
   1. 不管什么指令都不能和这条Memory Barrier指令重排序，也就是说通过插入内存屏障禁止在内存屏障前后的指令执行重排序优化。
   2. Memory Barrier的另外一个作用是**强制刷出各种CPU的缓存数据**，因此任何CPU上的线程都能读取到这些数据的最新版本。
   3. 总之，**volatile变量正是通过内存屏障实现其在内存中的语义，即可见性和禁止重排优化**



