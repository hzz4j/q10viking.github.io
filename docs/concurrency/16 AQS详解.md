---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## AQS(AbstractQueuedSynchronizer)大概架构图

```java
ReentrantLock lock = new ReentrantLock(false);	// false为非公平锁，true为公平锁
T0,T1,T2,T3,T4线程
lock.lock()
    while(true){		//	如果有几百个线程在循环，那么消耗CPU资源过多，浪费。所以存储Thread
        if(加锁成功){	//	通过CAS加锁->比较与交换 compare and swap
            break;跳出循环
        }
        HashSet,LinkedQueue等集合存储起当前线程
        HashSet.add(Thread); LinkedQueue.put(Thread);
        //利用LockSupport工具阻塞线程
        LockSupport.park();
    }
 T0获取锁
 执行业务代码
lock.unlock()  // 释放锁
     // 唤醒之前存储起来的Thread
     Thread thread = HashSet.get();
	 Thread thread = LinkedQueue.take();
     LockSupport.unpark(thread);
    
```

### Lock三大核心原理

1. 自旋

2. LockSupport

3. CAS


并且依赖一种数据结构(容器类)来保存Thread引用，Queue



## LockSupport唤醒指定的线程

```java
@Slf4j
public class Juc01_Thread_LockSupport {

    public static void main(String[] args) {

        Thread t0 = new Thread(new Runnable() {

            @Override
            public void run() {
                Thread current = Thread.currentThread();
                log.info("{},开始执行!",current.getName());
                for(;;){//spin 自旋
                    log.info("准备park住当前线程：{}....",current.getName());
                    LockSupport.park();
                    log.info("当前线程{}已经被唤醒....",current.getName());
                }
            }

        },"t0");

        t0.start();

        try {
            Thread.sleep(5000);
            log.info("准备唤醒{}线程!",t0.getName());
            LockSupport.unpark(t0);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
/**
 00:17:34.551 [t0] INFO com.yg.edu.lock.Juc01_Thread_LockSupport - t0,开始执行!
 00:17:34.553 [t0] INFO com.yg.edu.lock.Juc01_Thread_LockSupport - 准备park住当前线程：t0....
 00:17:39.549 [main] INFO com.yg.edu.lock.Juc01_Thread_LockSupport - 准备唤醒t0线程!
 00:17:39.549 [t0] INFO com.yg.edu.lock.Juc01_Thread_LockSupport - 当前线程t0已经被唤醒....
 00:17:39.549 [t0] INFO com.yg.edu.lock.Juc01_Thread_LockSupport - 准备park住当前线程：t0....
 */
```

----------

## AQS源码分析

### IDEA工具分析

> ctrl+alt+shift+u

![image-20210621010208278](/images/concurrency/image-20210621010208278.png)

> ctrl+alt+b  查看继承类

![image-20210621010329383](/images/concurrency/image-20210621010329383.png)

> ctrl+A选中--->enter

![AbstractQueuedSynchronizer](/images/concurrency/AbstractQueuedSynchronizer.png)

如果没展示全部则选择

![image-20210621011759739](/images/concurrency/image-20210621011759739.png)



### ReentrantLock公平锁与非公平锁的实现

ReentrantLock如何实现synchronized不具备的公平与非公平性呢？

在ReentrantLock内部定义了一个Sync的内部类，该类继承AbstractQueuedSynchronized，对该抽象类的部分方法做了实现；并且还定义了两个子类：

1. FairSync 公平锁的实现

2. NonfairSync 非公平锁的实现

这两个类都继承自Sync，也就是间接继承了AbstractQueuedSynchronized，所以这一个ReentrantLock同时具备公平与非公平特性。

上面主要涉及的设计模式：模板模式-子类根据需要做具体业务实现

```java
    public ReentrantLock(boolean fair) {
        sync = fair ? new FairSync() : new NonfairSync();
    }
```



```java
// 当前获得锁的线程
private transient Thread exclusiveOwnerThread;
// 同步器状态的变量
private volatile int state;
// 队列的构造
private transient volatile Node head;
private transient volatile Node tail;
```

### 同步等待队列

1. AQS当中的**同步等待队列也称CLH队列**，CLH队列是Craig、Landin、Hagersten三人发明的一种基于**双向链表数据结构的队列**，是**FIFO先入先出线程等待队列**
2. Java中的CLH队列是原CLH队列的一个变种,线程由原自旋机制改为阻塞机制

```java
static final class Node {
    volatile Node prev;
    volatile Node next;
    volatile Thread thread;
}
```

![img](/images/concurrency/14090)

### ReentrantLock加锁初步分析

![AQS_source_code](/images/concurrency/AQS_source_code.png)