---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

[Source Code](https://gitee.com/q10viking/java-practice/tree/master/javabasic/src/main/java/org/hzz/jdk%E9%A2%84%E8%AE%BE%E7%9A%84%E7%BA%BF%E7%A8%8B%E6%B1%A0)

## Executors简介

主要用来创建线程池，代理了线程池的创建，使得你的创建入口参数变得简单

1. newCachedThreadPool创建一个可缓存线程池，如果线程池长度超过处理需
   要，可灵活回收空闲线程，若无可回收，则新建线程。
2. newFixedThreadPool 创建一个定长线程池，可控制线程最大并发数，超出的
   线程会在队列中等待。
3. newScheduledThreadPool 创建一个定长线程池，支持定时及周期性任务执行。
4. newSingleThreadExecutor 创建一个单线程化的线程池，它只会用唯一的工作
   线程来执行任务，保证所有任务按照指定顺序(FIFO, LIFO, 优先级)执行。



## Executors.newCachedThreadPool()

### 使用

```java
public class CacheThreadPool {
    public static void main(String[] args) {
        ThreadPoolExecutor executor =
                (ThreadPoolExecutor) Executors.newCachedThreadPool();
        executor.submit(() -> {
            Thread.sleep(1000);
            return null;
        });
        executor.submit(() -> {
            Thread.sleep(1000);
            return null;
        });
        executor.submit(() -> {
            Thread.sleep(1000);
            return null;
        });

        System.out.println(executor.getPoolSize());
        System.out.println(executor.getQueue().size());
    }
}
/**
 * 3
 * 0
 */
```

### 说明

源码

```java
  public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                      60L, TimeUnit.SECONDS,
                                      new SynchronousQueue<Runnable>());
    }
```

此方法根本不接收多个线程。

- 将corePoolSize设置为0，
- 并将maximumPoolSize设置为Integer.MAX_VALUE
- keepAliveTime为60秒：

#### 注意

- **缓存的线程池可以无边界地增长以容纳任何数量的提交任务**。

- 当不再需要线程时，它们将在60秒的不活动后被处理掉。一个典型的用例是当我们的应用程序中有很多短期任务（short-living tasks）时。

- 队列大小将始终为零，因为在内部使用SynchronousQueue实例。在SynchronousQueue中，插入和删除操作对总是同时发生。因此，队列实际上从不包含任何内容。

## Executors.newSingleThreadExecutor()

单线程执行器非常适合创建事件循环。

### 使用

```java
public class SingleThreadExecutorDemo {
    public static void main(String[] args) {
        AtomicInteger counter = new AtomicInteger();

        ExecutorService executor = Executors.newSingleThreadExecutor();
        executor.submit(() -> {
            counter.set(1);
            System.out.println("执行时间：" + LocalDateTime.now() + "结果: "+counter.get());
        });
        executor.submit(() -> {
            counter.compareAndSet(1, 2);
            System.out.println("执行时间：" + LocalDateTime.now() + "结果: "+counter.get());
        });
    }
}
/**
 * 执行时间：2024-03-27T16:31:03.094结果: 1
 * 执行时间：2024-03-27T16:31:03.094结果: 2
 */
```

### 说明

```java
    public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>()));
    }
```

- 这个ThreadPoolExecutor是用一个不可变的包装器装饰的，所以在创建后不能重新配置。请注意，这也是我们不能将其强制转换为ThreadPoolExecutor的原因。
- 

## Executors.newScheduledThreadPool

```java
public class ExecutorsRunner {
    public static void main(String[] args) {
        ScheduledExecutorService es = Executors.newScheduledThreadPool(2);

        //延迟三秒执行
        es.schedule(new Runnable() {
            public void run() {
                System.out.println("鸣人在跑......");
            }
        },3, TimeUnit.SECONDS);

        es.schedule(new Runnable() {
            public void run() {
                System.out.println("佐助在跑......");
            }
        },2, TimeUnit.SECONDS);

        es.shutdown();
        System.out.println("over");
    }
}
/**
 over
 佐助在跑......
 鸣人在跑......
 */
```

## Executors.newFixedThreadPool

```java
public class FixedThreadPoolDemo {
    public static void main(String[] args) {
        ThreadPoolExecutor executor =
                (ThreadPoolExecutor) Executors.newFixedThreadPool(2);
        executor.submit(() -> {
            Thread.sleep(1000);
            return null;
        });
        executor.submit(() -> {
            Thread.sleep(1000);
            return null;
        });
        executor.submit(() -> {
            Thread.sleep(1000);
            return null;
        });
        System.out.println(executor.getPoolSize());
        System.out.println(executor.getQueue().size());
    }
}
/**
 * 2
 * 1
 */
```

在这里，我们实例化一个固定线程数为2的ThreadPoolExecutor。这意味着，如果同时运行的任务数量总是小于或等于两个，它们就会立即执行。否则，这些任务中的一些可能会被放入队列中等待轮到它们。

我们创建了三个可调用任务，通过睡眠1000毫秒来模仿繁重的工作。前两个任务将同时运行，第三个任务必须在队列中等待。我们可以在提交任务后立即调用`getPoolSize()`和`getQueue().size()`方法来验证它。

### 说明

```java
    public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                      0L, TimeUnit.MILLISECONDS,
                                      new LinkedBlockingQueue<Runnable>());
    }
```

- newFixedThreadPool方法创建一个ThreadPoolExecutor，其corePoolSize和maximumPoolSize参数值相等，keepAliveTime为零。这意味着此线程池中的线程数始终相同：
- 
