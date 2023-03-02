---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



[Overview (Java Platform SE 8 ) (oracle.com)](https://docs.oracle.com/javase/8/docs/api/index.html)

## Java线程的调度机制

线程调度是指系统为线程分配处理器使用权的过程，主要调度方式分两种，分别是协同式线程调度和抢占式线程调度

**协同式线程调度**

**线程执行时间由线程本身来控制**，线程把自己的工作执行完之后，要主动通知系统切换到另外一个线程上。最大好处是实现简单，且切换操作对线程自己是可知的，没啥线程同步问题。坏处是线程执行时间不可控制，如果一个线程有问题，可能一直阻塞在那里。

**抢占式线程调度**

**每个线程将由系统来分配执行时间，线程的切换不由线程本身来决定**（Java中，Thread.yield()可以让出执行时间，但无法获取执行时间）。线程执行时间系统可控，也不会有一个线程导致整个进程阻塞。

> **Java线程调度就是抢占式调度**

希望系统能给某些线程多分配一些时间，给一些线程少分配一些时间，可以通过设置线程优先级来完成。Java语言一共10个级别的线程优先级（Thread.MIN_PRIORITY至Thread.MAX_PRIORITY），在两线程同时处于ready状态时，优先级越高的线程越容易被系统选择执行。但优先级并不是很靠谱，因为Java线程是通过映射到系统的原生线程上来实现的，所以线程调度最终还是取决于操作系统。

[Source Code](https://github.com/Q10Viking/learncode/blob/main/concurrency/src/main/java/org/hzz/basic/SellTicketDemo.java)

```java
/**
 * 多窗口卖票
 */
public class SellTicketDemo implements Runnable {

    /**
     * 总车票
     */
    private int tickets;

    public SellTicketDemo(int tickets) {
        this.tickets = tickets;
    }

    public static void main(String[] args) {
        SellTicketDemo sellTicketDemo = new SellTicketDemo(100);

        Thread thread1 = new Thread(sellTicketDemo, "thread-1");
        Thread thread2 = new Thread(sellTicketDemo, "thread-2");
        Thread thread3 = new Thread(sellTicketDemo, "thread-3");
        Thread thread4 = new Thread(sellTicketDemo, "thread-4");

        thread1.setPriority(Thread.MIN_PRIORITY);
        thread2.setPriority(Thread.MAX_PRIORITY);
        thread3.setPriority(Thread.MIN_PRIORITY);
        thread4.setPriority(Thread.MAX_PRIORITY);

        startThread(thread1, thread2, thread3, thread4);
    }

    public static void startThread(Thread... threads) {
        for (Thread thread :
                threads) {
            thread.start();
        }
    }

    @Override
    public void run() {
        while (tickets > 0) {
            synchronized (this) {
                try {
                    if (tickets > 0) {
                        Thread.sleep(20);
                        System.out.println(Thread.currentThread().getName() +
                                ": 正在执行操作，余票：" + (--tickets));
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            Thread.yield();
        }
    }
}
/**
 * output
 * thread-1: 正在执行操作，余票：91
 * thread-1: 正在执行操作，余票：90
 * thread-3: 正在执行操作，余票：89
 * thread-3: 正在执行操作，余票：88
 */
```





## 创建线程的几种方式

### 1. 使用Thread类或者继承Thread类

```java
// 创建线程对象
Thread t = new Thread() {
    public void run() {
    // 要执行的任务
    }
};
// 启动线程
```



### 2. **实现 Runnable 接口配合Thread**

```java
Runnable runnable = new Runnable() {
    public void run(){
    // 要执行的任务
    }
};
// 创建线程对象
Thread t = new Thread( runnable );
// 启动线程
```



### 3. 使用有返回值的Callable

[Source Code](https://github.com/Q10Viking/learncode/blob/main/concurrency/src/main/java/org/hzz/basic/create/CallableTask.java)

```java
// 创建线程
public class CallableTask implements Callable<Integer> {

    @Override
    public Integer call() throws Exception {
        return new Random().nextInt(3);
    }

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        ExecutorService pool = Executors.newFixedThreadPool(10);
        Future<Integer> future = pool.submit(new CallableTask());
        System.out.println(future.get());
        shutdownAndAwaitTermination(pool);
    }

    static void shutdownAndAwaitTermination(ExecutorService pool) {
        pool.shutdown(); // Disable new tasks from being submitted
        try {
            // Wait a while for existing tasks to terminate
            if (!pool.awaitTermination(60, TimeUnit.SECONDS)) {
                pool.shutdownNow(); // Cancel currently executing tasks
                // Wait a while for tasks to respond to being cancelled
                if (!pool.awaitTermination(60, TimeUnit.SECONDS))
                    System.err.println("Pool did not terminate");
            }
        } catch (InterruptedException ie) {
            // (Re-)Cancel if current thread also interrupted
            pool.shutdownNow();
            // Preserve interrupt status
            Thread.currentThread().interrupt();
        }
    }
}
```

Callable与Runnable的关系

> 在java源码中看到ExecutorService.submit

![image-20220925084949014](/images/concurrency/image-20220925084949014.png)

```java
static final class RunnableAdapter<T> implements Callable<T> {
    final Runnable task;
    final T result;
    RunnableAdapter(Runnable task, T result) {
        this.task = task;
        this.result = result;
    }
    public T call() {
        task.run();
        return result;
    }
}
```



### 4. 使用lambda

```java
new Thread(() -> System.out.println(Thread.currentThread().getName())).start();

```



## 线程生命状态

线程是调度CPU资源的最小单位，线程模型分为KLT模型与ULT模型，JVM使用的KLT模型，Java线程与OS线程保持1:1的映射关系，也就是说有一个java线程也会在操作系统里有一个对应的线程。Java线程有多种生命状态。

> **NEW**,新建
>
> **RUNNABLE**,运行
>
> **BLOCKED**,阻塞
>
> **WAITING**,等待
>
> **TIMED_WAITING**,超时等待
>
> **TERMINATED**，终结

### 状态切换图

![img](/images/concurrency/16280.png)

![img](/images/concurrency/1617)

## Thread常用方法

### sleep方法

- 调用 sleep 会让当前线程从 *Running* 进入TIMED_WAITING状态，❤️**不会释放对象锁**❤️
- 其它线程可以使用 interrupt 方法打断正在睡眠的线程，这时 sleep 方法会抛出 InterruptedException，并且会清除中断标志
- 睡眠结束后的线程未必会立刻得到执行
- sleep当传入参数为0时，和yield相同

### yield方法

- yield会释放CPU资源，让当前线程从 Running 进入 Runnable状态，让优先级更高（至少是相同）的线程获得执行机会，不会释放对象锁；
- 假设当前进程只有main线程，当调用yield之后，main线程会继续运行，因为没有比它优先级更高的线程；
- 具体的实现依赖于操作系统的任务调度器



### join方法

等待调用join方法的线程结束之后，程序再继续执行，一般用于等待异步线程执行完结果之后才能继续运行的场景

join可以理解成是线程合并，当在一个线程调用另一个线程的join方法时，当前线程阻塞等待被调用join方法的线程执行完毕才能继续执行，所以join的好处能够保证线程的执行顺序，但是如果调用线程的join方法其实已经失去了并行的意义，虽然存在多个线程，但是本质上还是串行的，最后join的实现其实是基于等待通知机制的

[Source Code](https://github.com/Q10Viking/learncode/tree/main/concurrency/src/main/java/org/hzz/basic/join)

```java
public class ThreadJoinDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(()->{
            System.out.println("t begin");
            try{
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("t end");
        });
        long start = System.currentTimeMillis();
        thread.start();
        // 主线程main等待线程t执行完毕后再继续执行
        thread.join();
        System.out.println("执行时间："+(System.currentTimeMillis() - start));
        System.out.println("Main finished.");
    }
}
/**
 * t begin    // 输出这句后程序等待了一段时间
 * t end
 * 执行时间：5015
 * Main finished.
 */
```

