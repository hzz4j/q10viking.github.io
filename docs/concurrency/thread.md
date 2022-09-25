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





## 创建线程



### Callable

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

