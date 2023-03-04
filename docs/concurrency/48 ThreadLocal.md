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

> 线程的隔离线程

[Source Code](https://github.com/Q10Viking/learncode/blob/main/concurrency/src/main/java/org/hzz/tl/UseThreadLocal.java)

```java
public class UseThreadLocal {
    // 设置为静态防止被gc回收掉，同理线程池使用也是
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

get方法，其实就是拿到**每个线程独有的ThreadLocalMap**，然后再用ThreadLocal的当前实例，拿到Map中的相应的Entry，然后就可以拿到相应的值返回出去。当然，如果Map为空，还会先进行map的创建，初始化等工作

![img](/images/concurrency/10751)



## 内存泄漏

如果在线程池中使⽤ThreadLocal会造成内存泄漏，因为当ThreadLocal对象使⽤完之后，应该 要把设置的key，value，也就是Entry对象进⾏回收，但**线程池中的线程不会回收，⽽线程对象 是通过强引⽤指向ThreadLocalMap，ThreadLocalMap也是通过强引⽤指向Entry对象，线程 不被回收，Entry对象也就不会被回收，从⽽出现内存泄漏，解决办法是，在使⽤了 ThreadLocal对象之后，⼿动调⽤ThreadLocal的remove⽅法，⼿动清楚Entry对象**

[Source Code](https://github.com/Q10Viking/learncode/blob/main/concurrency/src/main/java/org/hzz/tl/leak/MemoryLeakDemo.java)

```java
public class MemoryLeakDemo {
    private static final int TASK_SIZE = 500;
    /**线程池*/
    final static Executor excutor = new ThreadPoolExecutor(5,5,1,
            TimeUnit.SECONDS,
            new LinkedBlockingDeque<>());

    private ThreadLocal<LocalVariable> threadLocal;

    static class LocalVariable{
        private byte[] a = new byte[5*1024*1024]; // 5M
    }
    public static void main(String[] args) {
        for (int i=0; i<TASK_SIZE;i++){
            excutor.execute(()->{
                MemoryLeakDemo oom = new MemoryLeakDemo();
                oom.threadLocal = new ThreadLocal<>();
                oom.threadLocal.set(new LocalVariable());
                // 线程池的线程不会结束，所以需要手动释放空间
                oom.threadLocal.remove();
            });
        }
    }
}
```



> 没有remove的内存

![image-20230304170535718](/images/concurrency/image-20230304170535718.png)

> remove后的内存

![image-20230304170452344](/images/concurrency/image-20230304170452344.png)

### 分析

> ThreadLocal内存泄漏的根源是：由于ThreadLocalMap的生命周期跟Thread一样长，如果没有手动删除对应key就会导致内存泄漏

每个Thread 维护一个 ThreadLocalMap，这个映射表的 key 是 ThreadLocal实例本身，value 是真正需要存储的 Object，也就是说 ThreadLocal 本身并不存储值，它只是作为一个 key 来让线程从 ThreadLocalMap 获取 value。仔细观察ThreadLocalMap，这个map是使用 ThreadLocal 的弱引用作为 Key 的，弱引用的对象在 GC 时会被回收。

![img](/images/concurrency/10766)

当把threadlocal变量置为null以后，没有任何强引用指向threadlocal实例，所以threadlocal将会被gc回收。这样一来，ThreadLocalMap中就会出现key为null的Entry，就没有办法访问这些key为null的Entry的value，如果当前线程再迟迟不结束的话，这些key为null的Entry的value就会一直存在一条强引用链：Thread Ref -> Thread -> ThreaLocalMap -> Entry -> value，而这块value永远不会被访问到了，所以存在着内存泄露

![image-20230304170828601](/images/concurrency/image-20230304170828601.png)



### 小结

1. JVM利用设置ThreadLocalMap的Key为弱引用，来避免内存泄露。
2. JVM利用调用remove，回收弱引用。
3. 使用**线程池+** ThreadLocal时要小心，因为这种情况下，线程是一直在不断的重复运行的，从而也就造成了value可能造成累积的情况。



## initialValue的使用

> ThreadLocal是变量的副本，但是Number是在堆上分配的，所有的引用都是一个对象

[Source Code](https://github.com/Q10Viking/learncode/blob/main/concurrency/src/main/java/org/hzz/tl/ThreadLocalUnsafe.java)

```java
public class ThreadLocalUnsafe {
    private static Number number = new Number(0);
    private static ThreadLocal<Number> threadLocal = new ThreadLocal();

    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            new Thread(()->{
                ThreadLocalRandom current = ThreadLocalRandom.current();
                number.setNumber(current.nextInt(100));
                threadLocal.set(number);
                try {
                    Thread.sleep(5*1000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                System.out.printf("%s = %s"+System.lineSeparator(),
                        Thread.currentThread().getName(),threadLocal.get());
            }).start();
        }
    }
}
/**
 * Thread-0 = Number{number=83}
 * Thread-4 = Number{number=83}
 * Thread-3 = Number{number=83}
 * Thread-1 = Number{number=83}
 * Thread-2 = Number{number=83}
 */
```

使用initialValue来解决[Source Code](https://github.com/Q10Viking/learncode/blob/main/concurrency/src/main/java/org/hzz/tl/ThreadLocalUnsafe1.java)

```java
public class ThreadLocalUnsafe1 {
//    private static Number number = new Number(0);
    private static ThreadLocal<Number> threadLocal = new ThreadLocal(){
        // 初始化
        @Override
        protected Object initialValue() {
            return new Number(0);
        }
    };

    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            new Thread(()->{
                ThreadLocalRandom current = ThreadLocalRandom.current();
                // 初始化
                Number number = threadLocal.get();
                number.setNumber(current.nextInt(100));
                threadLocal.set(number);
                try {
                    Thread.sleep(5*1000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                System.out.printf("%s = %s"+System.lineSeparator(),
                        Thread.currentThread().getName(),threadLocal.get());
            }).start();
        }
    }
}
/**
 * Thread-1 = Number{number=83}
 * Thread-3 = Number{number=76}
 * Thread-2 = Number{number=28}
 * Thread-4 = Number{number=25}
 * Thread-0 = Number{number=33}
 */
```



## 应用

ThreadLocal的一大应用场景就是**跨方法进行参数传递**，比如Web容器中，每个完整的请求周期会由一个线程来处理。结合ThreadLocal再使用Spring里的IOC和AOP，就可以很好的解决我们上面的事务的问题。只要将一个数据库连接放入ThreadLocal中，当前线程执行时只要有使用数据库连接的地方就从ThreadLocal获得就行了。

再比如，在微服务领域，链路跟踪中的traceId传递也是利用了ThreadLocal。

再比如：ThreadLocal经典的应⽤场景就是连接管理（⼀个线程持有⼀个连接，该连接对象可以在不同的⽅法之 间进⾏传递，线程之间不共享同⼀个连接）

![image-20230303191310260](/images/concurrency/image-20230303191310260.png)