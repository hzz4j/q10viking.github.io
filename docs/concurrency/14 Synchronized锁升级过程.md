---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## 对象的内存布局

![img](/images/concurrency/2557)

### 对象头

![image-20210620185907370](/images/concurrency/image-20210620185907370.png)

hashCode在偏向所，轻量级，重量级时放到哪里去了呢？



### 无锁状态

```java
public class T0_ObjectSize {

    public static void main(String[] args) throws InterruptedException {
        Object o = new Object();
        System.out.println(ClassLayout.parseInstance(o).toPrintable());
    }
}
/**
 java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
 0     4        (object header)                           01 00 00 00 (00000001 00000000 00000000 00000000) (1)
 4     4        (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
 8     4        (object header)                           e5 01 00 f8 (11100101 00000001 00000000 11111000) (-134217243)
 12     4        (loss due to the next object alignment)
 Instance size: 16 bytes
 Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
 */
```

对象头的Mark Workd,操作系统的大端，小端，一般采用的是小端模式

```java
00000001 00000000 00000000 00000000
// 转变为小端分析  001 表示无锁状态
00000000 00000000 00000000 00000001  
    
// 而hashcode是通过懒加载模式生成的，所以最开始没有
```

----------

### 偏向锁

JVM启动的时候，**会延迟去启动偏向锁**，JVM启动时内部也有多个线程，这多个线程可能会竞争同一个资源，为了减少锁的升级带来的开销，所以需要延迟偏向锁

```java
public class T0_ObjectSize {

    public static void main(String[] args) throws InterruptedException {
        //  渡过JVM延迟偏向锁的启动
        TimeUnit.SECONDS.sleep(5);
        Object o = new Object();
        System.out.println(ClassLayout.parseInstance(o).toPrintable());
        synchronized (o){
            System.out.println(ClassLayout.parseInstance(o).toPrintable());
        }
    }
}
/**
java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
      0     4        (object header)                           05 00 00 00 (00000101 00000000 00000000 00000000) (5)
      4     4        (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
      8     4        (object header)                           e5 01 00 f8 (11100101 00000001 00000000 11111000) (-134217243)
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
      0     4        (object header)                           05 78 c2 c6 (00000101 01111000 11000010 11000110) (-960333819)
      4     4        (object header)                           dc 02 00 00 (11011100 00000010 00000000 00000000) (732)
      8     4        (object header)                           e5 01 00 f8 (11100101 00000001 00000000 11111000) (-134217243)
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
 */
```

#### 匿名偏向

预先准备措施

```java
00000101 01100000 10100001 01101101
// 转变为小端分析  101 表示偏向锁状态
00000000 00000000 00000000 00000101	//	第一个输出，匿名偏向所，尽管没有同步块，但预先做了偏向
01101101 10100001 01100000 00000101 //  第二个输出，同步块中
```

### 轻量级锁

1. 下面的代码可以看到升级锁之后，不会回退的
2. 两线程交替执行（即一个线程执行完之后才开启另外一个线程来执行）从偏向锁升级到轻量级锁

```java
@Slf4j
public class T0_BasicLock {
    public static void main(String[] args) throws InterruptedException {
        Thread.sleep(5000);
        Object o = new Object();
        log.info(ClassLayout.parseInstance(o).toPrintable());

        new Thread(()->{
            synchronized (o){
                log.info(ClassLayout.parseInstance(o).toPrintable());
            }
        }).start();

        Thread.sleep(2000);
        log.info(ClassLayout.parseInstance(o).toPrintable());

        new Thread(()->{
            synchronized (o){
                log.info(ClassLayout.parseInstance(o).toPrintable());
            }
        }).start();

        Thread.sleep(2000);
        log.info(ClassLayout.parseInstance(o).toPrintable());
    }
}
/**
 19:46:39.238 [main] INFO com.yg.edu.T0_BasicLock - java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
 0     4        (object header)                           05 00 00 00 (00000101 00000000 00000000 00000000) (5)
 4     4        (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
 8     4        (object header)                           e5 01 00 f8 (11100101 00000001 00000000 11111000) (-134217243)
 12     4        (loss due to the next object alignment)
 Instance size: 16 bytes
 Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

 19:46:39.244 [Thread-0] INFO com.yg.edu.T0_BasicLock - java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
 0     4        (object header)                           05 f0 fa 7e (00000101 11110000 11111010 01111110) (2130374661)
 4     4        (object header)                           4d 02 00 00 (01001101 00000010 00000000 00000000) (589)
 8     4        (object header)                           e5 01 00 f8 (11100101 00000001 00000000 11111000) (-134217243)
 12     4        (loss due to the next object alignment)
 Instance size: 16 bytes
 Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

 19:46:41.243 [main] INFO com.yg.edu.T0_BasicLock - java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
 0     4        (object header)                           05 f0 fa 7e (00000101 11110000 11111010 01111110) (2130374661)
 4     4        (object header)                           4d 02 00 00 (01001101 00000010 00000000 00000000) (589)
 8     4        (object header)                           e5 01 00 f8 (11100101 00000001 00000000 11111000) (-134217243)
 12     4        (loss due to the next object alignment)
 Instance size: 16 bytes
 Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

 19:46:41.245 [Thread-1] INFO com.yg.edu.T0_BasicLock - java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
 0     4        (object header)                           00 f2 cf 50 (00000000 11110010 11001111 01010000) (1355805184)
 4     4        (object header)                           c4 00 00 00 (11000100 00000000 00000000 00000000) (196)
 8     4        (object header)                           e5 01 00 f8 (11100101 00000001 00000000 11111000) (-134217243)
 12     4        (loss due to the next object alignment)
 Instance size: 16 bytes
 Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

 19:46:43.245 [main] INFO com.yg.edu.T0_BasicLock - java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
 0     4        (object header)                           01 00 00 00 (00000001 00000000 00000000 00000000) (1)
 4     4        (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
 8     4        (object header)                           e5 01 00 f8 (11100101 00000001 00000000 11111000) (-134217243)
 12     4        (loss due to the next object alignment)
 Instance size: 16 bytes
 Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
 */
```

锁升级的分析过程

```java
 00000000 00000000 00000000 00000101  // 最开始匿名偏向锁
 01111110 11111010 11110000 00000101  // 第一个线程执行，同步块 为偏向锁
 01111110 11111010 11110000 00000101  // 跳出第一个线程的同步块，还是为偏向锁，不可逆
 01010000 11001111 11110010 00000000  // 第二个线程执行，同步块 为偏向锁升级为轻量级锁
 00000000 00000000 00000000 00000001  // 最后变成无锁状态
```

### 重量级锁

相比之前轻量级锁的线程一个执行完在去执行一个，这次是同时去争抢资源，会升级为重量级锁

```java
public class T0_heavyWeightMonitor {

    public static void main(String[] args) throws InterruptedException {
        Thread.sleep(5000);
        Object a = new Object();

        Thread thread1 = new Thread(){
            @Override
            public void run() {
                synchronized (a){
                    System.out.println("thread1 locking");
                    System.out.println(ClassLayout.parseInstance(a).toPrintable());
                    try {
                        //让线程晚点儿死亡，造成锁的竞争
                        Thread.sleep(2000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        };
        Thread thread2 = new Thread(){
            @Override
            public void run() {
                synchronized (a){
                    System.out.println("thread2 locking");
                    System.out.println(ClassLayout.parseInstance(a).toPrintable());
                    try {
                        Thread.sleep(2000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        };
        thread1.start();
        thread2.start();
    }
}
/**
 thread1 locking
 java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
 0     4        (object header)                           da a8 c6 2c (11011010 10101000 11000110 00101100) (751216858)
 4     4        (object header)                           30 02 00 00 (00110000 00000010 00000000 00000000) (560)
 8     4        (object header)                           e5 01 00 f8 (11100101 00000001 00000000 11111000) (-134217243)
 12     4        (loss due to the next object alignment)
 Instance size: 16 bytes
 Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

 thread2 locking
 java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
 0     4        (object header)                           da a8 c6 2c (11011010 10101000 11000110 00101100) (751216858)
 4     4        (object header)                           30 02 00 00 (00110000 00000010 00000000 00000000) (560)
 8     4        (object header)                           e5 01 00 f8 (11100101 00000001 00000000 11111000) (-134217243)
 12     4        (loss due to the next object alignment)
 Instance size: 16 bytes
 Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
 */
```



## hashCode存在哪里了

1. 轻量级锁，在线程栈中Replace Lock Record里面 （在Replace Lock Record存储了原来的MarkWord），对象处于偏向锁的过程中如果调用了hashCode，会升级为轻量级锁

2. 重量级锁，记录在Monitor里面

> 验证 调用了hashCode，会升级为轻量级锁

```java
public class Juc_PrintMarkWord {

    public static void main(String[] args) throws InterruptedException {
        // 需要sleep一段时间，因为java对于偏向锁的启动是在启动几秒之后才激活。
        // 因为jvm启动的过程中会有大量的同步块，且这些同步块都有竞争，如果一启动就启动
        // 偏向锁，会出现很多没有必要的锁撤销
        Thread.sleep(5000);
        T t = new T();
        //未出现任何获取锁的时候
        System.out.println(ClassLayout.parseInstance(t).toPrintable());
        synchronized (t){
            // 获取一次锁之后
            System.out.println(ClassLayout.parseInstance(t).toPrintable());
        }
        // 输出hashcode
        System.out.println(t.hashCode());
        // 计算了hashcode之后，将导致锁的升级
        System.out.println(ClassLayout.parseInstance(t).toPrintable());
        synchronized (t){
            // 再次获取锁
            System.out.println(ClassLayout.parseInstance(t).toPrintable());
        }
    }
}
class T{
    int i = 0;
}

/**
com.yg.edu.T object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
      0     4        (object header)                           05 00 00 00 (00000101 00000000 00000000 00000000) (5)
      4     4        (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
      8     4        (object header)                           43 c1 00 f8 (01000011 11000001 00000000 11111000) (-134168253)
     12     4    int T.i                                       0
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total

com.yg.edu.T object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
      0     4        (object header)                           05 48 08 ad (00000101 01001000 00001000 10101101) (-1391966203)
      4     4        (object header)                           79 02 00 00 (01111001 00000010 00000000 00000000) (633)
      8     4        (object header)                           43 c1 00 f8 (01000011 11000001 00000000 11111000) (-134168253)
     12     4    int T.i                                       0
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total

1227229563
com.yg.edu.T object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
      0     4        (object header)                           01 7b 09 26 (00000001 01111011 00001001 00100110) (638155521)
      4     4        (object header)                           49 00 00 00 (01001001 00000000 00000000 00000000) (73)
      8     4        (object header)                           43 c1 00 f8 (01000011 11000001 00000000 11111000) (-134168253)
     12     4    int T.i                                       0
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total

com.yg.edu.T object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
      0     4        (object header)                           f0 f3 af 40 (11110000 11110011 10101111 01000000) (1085273072)
      4     4        (object header)                           a0 00 00 00 (10100000 00000000 00000000 00000000) (160)
      8     4        (object header)                           43 c1 00 f8 (01000011 11000001 00000000 11111000) (-134168253)
     12     4    int T.i                                       0
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
*/
```

```java
 00000000 00000000 00000000 00000101	//	未出现任何获取锁的时候，匿名偏向
 10101101 00001000 01001000 00000101    //  第一个同步块，变为偏向锁
 00100110 00001001 01111011 00000001    //  回退到无锁状态，此时在上一步的时候调用了hashcode
 01000000 10101111 11110011 11110000    // 再次从无锁状态进入同步块，此时因为生成了hashcode，该hashcode需要存储，直接升级为轻量级锁，而不是偏向锁
```



## synchronized锁膨胀过程

![image-20210620184323097](D:\Github\saas-yong\fullstack\Java架构师之路\Java并发编程\imgs\image-20210620184323097.png)

1. 没有线程访问时，处于**无锁**状态
2. 当只有一个线程执行同步块synchronized代码时，由于没有其他线程竞争，就会处于一种**偏向锁**
3. 存在多个线程竞争，但是线程占用锁时间不是很久，没有抢到锁的线程不会处于阻塞状态，而是处于一种自旋，会占着CPU（不会让出CPU资源）,等到其他线程执行完成，自己抢到锁就可以立即执行了，不用唤醒。此时为**轻量级锁**
4. 但是如果没有抢到锁的线程，占用CPU时间过长，那么就会锁进行升级，变成**重量级锁**。

上面的锁的膨胀升级，比单纯直接进行重量级锁，效率要高。但是锁的过程不可逆，其中不包括无锁状态。

![image-20210620205323300](/images/concurrency/image-20210620205323300.png)

![image-20210620205724376](/images/concurrency/image-20210620205724376.png)





## 锁的优化机制

锁的优化机制是Java等编程语言中常见的一种提高并发性能的方法。锁的优化旨在减少锁的竞争，从而提高程序的性能

1. **偏向锁**（Biased Locking）：偏向锁是一种针对无竞争情况的锁优化机制。它通过消除无谓的获取锁和释放锁的操作，提高了程序的性能。偏向锁会记录哪个线程正在访问某个对象，并且后续的访问请求如果是同一个线程，就可以直接访问，而不需要加锁
2. **轻量级锁**（Lightweight Locking）：轻量级锁是一种针对单线程访问的情况的锁优化机制。它通过使用标记位或者CAS操作来对共享资源进行加锁和解锁，避免了使用重量级锁时的上下文切换和内核态切换等开销
3. **自旋锁**（Spin Lock）：自旋锁是一种非阻塞的锁机制，当线程无法立即获取锁时，它会持续检查锁是否被释放，直到获取到锁为止。自旋锁可以减少线程的上下文切换开销，但在锁持有时间较长的情况下，会浪费CPU资源
4. **适应性自旋锁**（Adaptive Spin Lock）：适应性自旋锁是一种结合了自旋锁和阻塞锁的锁机制。在刚开始时，线程会采用自旋的方式来等待锁的释放，但随着时间的推移，如果锁仍然没有被释放，线程会逐渐切换到阻塞状态，从而减少CPU资源的浪费。
5. **分段锁**（Segmented Locking）：分段锁是一种针对共享资源过多的情况下的锁优化机制。它将共享资源分成多个段，每个线程只需要对其中一部分进行加锁和解锁操作，从而减少了锁的竞争和开销
6. **乐观锁**（Optimistic Locking）：乐观锁是一种基于冲突检测的锁机制。它假设多个线程同时访问和修改同一个数据的概率较小，因此在读取数据时不会加锁，而是在提交修改时检测是否存在冲突。如果存在冲突，则进行回滚或重试操作。乐观锁适用于读操作较多的场景
7. **锁粗化**（Lock Coarsening）：锁粗化是一种针对长时间持有锁的场景的优化策略。如果一个线程在短时间内需要连续多次加锁和解锁，那么可以将这些加锁和解锁操作合并成一个较大的加锁和解锁操作，从而减少了加锁和解锁的次数，提高了效率。