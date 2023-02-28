---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

## synchronized底层原理

**synchronized内置锁是一种对象锁(锁的是对象而非引用)，作用粒度是对象，可以用来实现对临界资源的同步互斥访问，是可重入的。**

1. **synchronized是基于JVM**内置锁实现，通过内部对象**Monitor**(监视器锁)实现，❤️基于进入与退出**Monitor**对象实现方法与代码块同步❤️，监视器锁的实现依赖底层操作系统的**Mutex lock**（互斥锁）实现，它是一个重量级锁性能较低。
2. 当然，**JVM内置锁在1.5之后版本做了重大的优化，**如锁粗化（Lock Coarsening）、锁消除（Lock Elimination）、轻量级锁（Lightweight Locking）、偏向锁（Biased Locking）、适应性自旋（Adaptive Spinning）等技术来减少锁操作的开销，内置锁的并发性能已经基本与Lock持平。

❤️synchronized关键字被编译成字节码后会被翻译成monitorenter 和 monitorexit 两条指令分别在同步块逻辑代码的起始位置与结束位置❤️

![img](/images/concurrency/2512.png)

**每个同步对象都有一个自己的Monitor(监视器锁)**，加锁过程如下图所示

![img](/images/concurrency/2528.png)



## Monitor监视器锁⭐

**任何一个对象都有一个Monitor与之关联，当且一个Monitor被持有后，它将处于锁定状态**。Synchronized在JVM里的实现都是 **基于进入和退出Monitor对象来实现方法同步和代码块同步**，虽然具体实现细节不一样，但是都可以通过成对的MonitorEnter和MonitorExit指令来实现。

- **monitorenter**：每个对象都是一个监视器锁（monitor）。当monitor被占用时就会处于锁定状态，线程执行monitorenter指令时尝试获取monitor的所有权，过程如下
  1. **如果monitor的进入数为0**，则该线程进入monitor，然后将进入数设置为1，该线程即为monitor的所有者
  2. **如果线程已经占有该monitor**，只是重新进入，则进入monitor的进入数加1；
  3. **如果其他线程已经占用了monitor**，则该线程进入阻塞状态，直到monitor的进入数为0，再重新尝试获取monitor的所有权；

- **monitorexit**：执行monitorexit的线程必须是objectref所对应的monitor的所有者。**指令执行时，monitor的进入数减1，如果减1后进入数为0，那线程退出monitor，不再是这个monitor的所有者**。其他被这个monitor阻塞的线程可以尝试去获取这个 monitor 的所有权。
  1. **monitorexit，指令出现了两次，第1次为同步正常退出释放锁；第2次为发生异步退出释放锁**；

通过上面两段描述，我们应该能很清楚的看出Synchronized的实现原理，❤️**Synchronized的语义底层是通过一个monitor的对象来完成，其实wait/notify等方法也依赖于monitor对象**，这就是为什么只有在同步的块或者方法中才能调用wait/notify等方法，**否则会抛出java.lang.IllegalMonitorStateException的异常的原因**。❤️

## 同步方法的synchronized

```java
public class SynchronizedMethod {
    public synchronized void method() {
        System.out.println("Hello World!");
    }
}
```

反编译结果

![image-20210620204330572](/images/concurrency/image-20210620204330572.png)

从编译的结果来看，方法的同步并没有通过指令 **monitorenter** 和 **monitorexit** 来完成（理论上其实也可以通过这两条指令来实现），不过相对于普通方法，其常量池中多了 **ACC_SYNCHRONIZED** 标示符。**JVM就是根据该标示符来实现方法的同步的**：

当方法调用时，**调用指令将会检查方法的 ACC_SYNCHRONIZED 访问标志是否被设置**，如果设置了，**执行线程将先获取monitor**，获取成功之后才能执行方法体，**方法执行完后再释放monitor**。在方法执行期间，其他任何线程都无法再获得同一个monitor对象。

两种同步方式本质上没有区别，只是方法的同步是一种隐式的方式来实现，无需通过字节码来完成。**两个指令的执行是JVM通过调用操作系统的互斥原语mutex来实现，被阻塞的线程会被挂起、等待重新调度**，会导致**“用户态和内核态”两个态之间来回切换**，对性能有较大影响。

## 什么是monitor

1. 可以把它理解为 **一个同步工具**，也可以描述为 **一种同步机制**，它通常被 **描述为一个对象**。
2. ❤️与一切皆对象一样，**所有的Java对象是天生的Monitor**，每一个Java对象都有成为Monitor的潜质，**因为在Java的设计中 ，每一个Java对象自打娘胎里出来就带了一把看不见的锁，它叫做内部锁或者Monitor锁**。❤️
3. **也就是通常说Synchronized的对象锁，MarkWord锁标识位为10，其中指针指向的是Monitor对象的起始地址**。

在Java虚拟机（HotSpot）中，**Monitor是由ObjectMonitor实现的**，其主要数据结构如下（位于HotSpot虚拟机源码ObjectMonitor.hpp文件，C++实现的）：

```c++
ObjectMonitor() {
    _header       = NULL;
    _count        = 0; // 记录个数
    _waiters      = 0,
    _recursions   = 0;
    _object       = NULL;
    _owner        = NULL;
    _WaitSet      = NULL; // 处于wait状态的线程，会被加入到_WaitSet
    _WaitSetLock  = 0 ;
    _Responsible  = NULL ;
    _succ         = NULL ;
    _cxq          = NULL ;
    FreeNext      = NULL ;
    _EntryList    = NULL ; // 处于等待锁block状态的线程，会被加入到该列表
    _SpinFreq     = 0 ;
    _SpinClock    = 0 ;
    OwnerIsThread = 0 ;
  }
```

ObjectMonitor中有两个队列，**_WaitSet 和 _EntryList**，用来保存ObjectWaiter对象列表（ **每个等待锁的线程都会被封装成ObjectWaiter对象** ），**_owner指向持有ObjectMonitor对象的线程**，当多个线程同时访问一段同步代码时：

1. 首先会进入 _EntryList 集合，**当线程获取到对象的monitor后，进入 _Owner区域并把monitor中的owner变量设置为当前线程，同时monitor中的计数器count加1**；
2. 若线程调用 wait() 方法，**将释放当前持有的monitor，owner变量恢复为null，count自减1，同时该线程进入 WaitSet集合中等待被唤醒**；
3. 若当前线程执行完毕，**也将释放monitor（锁）并复位count的值，以便其他线程进入获取monitor(锁)**；
   1. 同时，**Monitor对象存在于每个Java对象的对象头Mark Word中（存储的指针的指向），Synchronized锁便是通过这种方式获取锁的**，也是为什么Java中任意对象可以作为锁的原因，**同时notify/notifyAll/wait等方法会使用到Monitor锁对象，所以必须在同步代码块中使用**。
   2. 监视器Monitor有两种同步方式：**互斥与协作**。多线程环境下线程之间如果需要共享数据，需要解决互斥访问数据的问题，**监视器可以确保监视器上的数据在同一时刻只会有一个线程在访问**。

