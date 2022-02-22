::: tip

如何充分的压榨硬件系统

1. 并发三大特性
2. JMM工作内存与主内存的关系
3. 线程之间如何通信
4. volatile的可见性与有序性
5. CAS

:::

## 可见性

>  Java中可见性如何保证？ 方式归类有两种:

1.  jvm层面 storeLoad内存屏障    ===>  x86   lock替代了mfence
2.  上下文切换   Thread.yield();

