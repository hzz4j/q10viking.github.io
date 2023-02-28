---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

volatile对应的汇编指令码lock

**volatile基于内存屏障实现**

> lock前缀  触发硬件缓存锁机制（两种：总线锁，缓存一致性协议）

总线锁：锁住了系统总线，导致效率比较低

早期是使用总线锁来保证缓存一致，现在采用缓存一致性协议（MESI）



## MESI

1. MESI 是指4中状态的首字母。每个Cache line有4个状态，可用2个bit表示
2. CPU缓存系统中是以缓存行（cache line）为单位存储的**缓存行（Cache line）**:缓存存储数据的单元。

**总线嗅探机制**：其他内核嗅探到读，写。会更改缓存中的副本标记为相应的（M,E,S,I）状态。

| 状态                     | 描述                                                         | 监听任务                                                     |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| M 修改 (Modified)        | 该Cache line有效，数据被修改了，和内存中的数据不一致，数据只存在于本Cache中。 | 缓存行必须时刻监听所有试图读该缓存行相对就主存的操作，这种操作必须在缓存将该缓存行写回主存并将状态变成S（共享）状态之前被延迟执行。 |
| E 独享、互斥 (Exclusive) | 该Cache line有效，数据和内存中的数据一致，数据只存在于本Cache中。 | 缓存行也必须监听其它缓存读主存中该缓存行的操作，一旦有这种操作，该缓存行需要变成S（共享）状态。 |
| S 共享 (Shared)          | 该Cache line有效，数据和内存中的数据一致，数据存在于很多Cache中。 | 缓存行也必须监听其它缓存使该缓存行无效或者独享该缓存行的请求，并将该缓存行变成无效（Invalid）。 |
| I 无效 (Invalid)         | 该Cache line无效。                                           | 无                                                           |

![image-20210620110422747](/images/concurrency/image-20210620110422747.png)

CPU修改缓存中的值，需要对**缓存行进行加锁**，**同时向外部发一个消息（本地写缓存消息）**，另外其他的cpu检测到这个信号，就会把该缓存行的变量副本标记为（I）无效状态。

如果两个CPU都对该缓存行进行加锁，同时都发出了各自的消息。那么就会进行总线裁决。

因为缓存行锁的是对一个缓存行进行的，如果一个大对象占据多个缓存行，那么缓存行一致性协议就会升级为总线锁。

----------

程序运行执行后，先把计算的写到CPU的store_buffer，因为消息传递需要时间，等到其他CPU中相应的缓存失效后（失效后也会发送一个消息通知），再从store_buffer写主存。



## 单核读取

1. CPU A发出了一条指令，从主内存中读取x。
2. 从主内存通过bus读取到缓存中（远端读取Remote read）,这是该Cache line修改为E状态（独享）.

![img](/images/concurrency/14510)

## 双核读取

1. CPU A发出了一条指令，从主内存中读取x。
2. CPU A从主内存通过bus读取到 cache a中并将该cache line 设置为E状态
3. CPU B发出了一条指令，从主内存中读取x
4. CPU B试图从主内存中读取x时，CPU A检测到了地址冲突。这时CPU A对相关数据做出响应。此时x 存储于cache a和cache b中，x在chche a和cache b中都被设置为S状态(共享)

![img](/images/concurrency/14509)

## 修改数据

1. CPU A 计算完成后发指令需要修改x
2. CPU A 将x设置为M状态（修改）并通知缓存了x的CPU B, CPU B将本地cache b中的x设置为I状态(无效)
3. CPU A 对x进行赋值

![img](/images/concurrency/14511)

## 同步数据

1. CPU B 发出了要读取x的指令
2. CPU B 通知CPU A,CPU A将修改后的数据同步到主内存时cache a 修改为E（独享）
3. CPU A同步CPU B的x,将cache a和同步后cache b中的x设置为S状态（共享）

![img](/images/concurrency/14508)

## 缓存行伪共享

CPU缓存系统中是以缓存行（cache line）为单位存储的。目前主流的CPU Cache 的 Cache Line 大小都是64Bytes。在多线程情况下，如果需要修改“共享同一个缓存行的变量”，就会无意中影响彼此的性能，这就是**伪共享**（False Sharing）。

举个例子: 现在有2个long 型变量 a 、b，如果有t1在访问a，t2在访问b，而a与b刚好在同一个cache line中，此时t1先修改a，将导致b被刷新！

**怎么解决伪共享？**

Java8中新增了一个注解：@sun.misc.Contended。加上这个注解的类会自动补齐缓存行，需要注意的是此注解默认是无效的，需要在jvm启动时设置 `-XX:-RestrictContended` 才会生效。

```java
@sun.misc.Contended
public final static class TulingVolatileLong {
    public volatile long value = 0L;
    //public long p1, p2, p3, p4, p5, p6;
}
```

##  CPU切换状态阻塞解决-存储缓存(Store Bufferes)

比如你需要修改本地缓存中的一条信息，那么你必须将I（无效）状态通知到其他拥有该缓存数据的CPU缓存中，并且等待确认。等待确认的过程会阻塞处理器，这会降低处理器的性能。应为这个等待远远比一个指令的执行时间长的多。

为了避免这种CPU运算能力的浪费，Store Bufferes被引入使用。处理器把它想要写入到主存的值写到缓存，然后继续去处理其他事情。当所有失效确认（Invalidate Acknowledge）都接收到时，数据才会最终被提交。

这么做有两个风险

1. 就是处理器会尝试从存储缓存（Store buffer）中读取值，但它还没有进行提交。这个的解决方案称为Store Forwarding，它使得加载的时候，如果存储缓存中存在，则进行返回。

2. **保存什么时候会完成，这个并没有任何保证**。

```java
value = 3；
void exeToCPUA(){
  value = 10;
  isFinsh = true;
}
void exeToCPUB(){
  if(isFinsh){
    //value一定等于10？！
    assert value == 10;
  }
}
```

试想一下开始执行时，CPU A保存着finished在E(独享)状态，而value并没有保存在它的缓存中。（例如，Invalid）。在这种情况下，value会比finished更迟地抛弃存储缓存。完全有可能CPU B读取finished的值为true，而value的值不等于10。**即isFinsh的赋值在value赋值之前。**

这种在可识别的行为中发生的变化称为重排序（reordings）