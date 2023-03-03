---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## ThreadLocal

::: tip

ThreadLocal是Java中所提供的线程本地存储机制，可以利⽤该机制将数据缓存在某个线程内部，该线 程可以在任意时刻、任意⽅法中获取缓存的数据。

:::

> ThreadLocal为每个线程都提供了变量的副本，使得每个线程在某一时间访问到的并非同一个对象，这样就隔离了多个线程对数据的数据共享。

ThreadLocal和Synchonized都用于解决多线程并发访问。可是ThreadLocal与synchronized有本质的差别。synchronized是利用锁的机制，使变量或代码块在某一时该仅仅能被一个线程访问，ThreadLocal则是副本机制。此时不论多少线程并发访问都是线程安全的

![image-20230303191241368](/images/concurrency/image-20230303191241368.png)

> 线程的隔离线

```java
public class UseThreadLocal {
    static ThreadLocal<String> threadLocal1 = new ThreadLocal<>();
    static ThreadLocal<Integer> threadLocal2 = new ThreadLocal<>();

    static class TestThread extends Thread{
        int id;
        public TestThread(int id){this.id = id;}
        @Override
        public void run() {
            String threadName = Thread.currentThread().getName();
            threadLocal1.set("线程__"+threadName);
            if(id == 2){
                threadLocal2.set(id);
            }
            System.out.println(threadName+":"+threadLocal1.get());
            System.out.println(threadName+":"+threadLocal2.get());
        }
    }

    private void startThreadArray(){
        for(int i = 0;i < 3 ; i++){
            new TestThread(i).start();
        }
    }
    public static void main(String[] args) {
        UseThreadLocal useThreadLocal = new UseThreadLocal();
        useThreadLocal.startThreadArray();
    }
}
/**
 * Thread-0:线程__Thread-0
 * Thread-0:null
 * Thread-2:线程__Thread-2
 * Thread-1:线程__Thread-1
 * Thread-1:null
 * Thread-2:2
 */
```







## 实现原理

ThreadLocal底层是通过ThreadLocalMap来实现的，每个Thread对象（注意不是ThreadLocal 对象）中都存在⼀个ThreadLocalMap，Map的key为ThreadLocal对象，Map的value为需要缓 存的值

![image-20230303180140479](/images/concurrency/image-20230303180140479.png)



## 内存泄漏

如果在线程池中使⽤ThreadLocal会造成内存泄漏，因为当ThreadLocal对象使⽤完之后，应该 要把设置的key，value，也就是Entry对象进⾏回收，但线程池中的线程不会回收，⽽线程对象 是通过强引⽤指向ThreadLocalMap，ThreadLocalMap也是通过强引⽤指向Entry对象，线程 不被回收，Entry对象也就不会被回收，从⽽出现内存泄漏，解决办法是，在使⽤了 ThreadLocal对象之后，⼿动调⽤ThreadLocal的remove⽅法，⼿动清楚Entry对象





## 应用

ThreadLocal的一大应用场景就是**跨方法进行参数传递**，比如Web容器中，每个完整的请求周期会由一个线程来处理。结合ThreadLocal再使用Spring里的IOC和AOP，就可以很好的解决我们上面的事务的问题。只要将一个数据库连接放入ThreadLocal中，当前线程执行时只要有使用数据库连接的地方就从ThreadLocal获得就行了。

再比如，在微服务领域，链路跟踪中的traceId传递也是利用了ThreadLocal。

再比如：ThreadLocal经典的应⽤场景就是连接管理（⼀个线程持有⼀个连接，该连接对象可以在不同的⽅法之 间进⾏传递，线程之间不共享同⼀个连接）

![image-20230303191310260](/images/concurrency/image-20230303191310260.png)