---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

## 定时线程池介绍

它用来处理延时任务或定时任务，常用在其他框架，如Eureka等发送心跳

### 类结构图

![0](D:\Github\saas-yong\fullstack\Java架构师之路\Java并发编程\imgs\36441.png)



### 提交任务

它接收SchduledFutureTask类型的任务，是线程池调度任务的最小单位，有三种提交任务的方式

```java
schedule
scheduledAtFixedRate
scheduleWithFixedDelay
```



## 基本使用

### schedule提交Runnable的任务

```java
public class Test1 {
    public static void main(String[] args) {
        ScheduledThreadPoolExecutor scheduledThreadPoolExecutor = new ScheduledThreadPoolExecutor(1);

        scheduledThreadPoolExecutor.schedule(() -> {
            System.out.println("我要延迟5s执行");
        }, 5000, TimeUnit.MILLISECONDS);

        System.out.println("over");
    }
}
/**
 over
 我要延迟5s执行
 */
```

### schedule提交Callable的任务

> 异步阻塞

```java
@Slf4j
public class Test1 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        ScheduledThreadPoolExecutor scheduledThreadPoolExecutor = new ScheduledThreadPoolExecutor(1);

        ScheduledFuture<Integer> future = scheduledThreadPoolExecutor.schedule(() -> {
            System.out.println("我要延迟5s执行");
            return 1;
        }, 5000, TimeUnit.MILLISECONDS);

        System.out.println("running");
        System.out.println(future.get()); // 会阻塞一直等到结果
        System.out.println("over");

        scheduledThreadPoolExecutor.shutdown();
    }
}
/**
 running
 我要延迟5s执行
 1
 over
 */
```



### scheduledAtFixedRate提交周期性执行任务

每两秒执行一次发送心跳

```java
@Slf4j
public class Test2 {
    public static void main(String[] args) {
        ScheduledThreadPoolExecutor scheduledThreadPoolExecutor = new ScheduledThreadPoolExecutor(1);
        //发心跳，service1->service2,每次过5s，发送一个心跳，证明s2可用
        scheduledThreadPoolExecutor.scheduleAtFixedRate(() -> {
            log.info("send heart beat");
        }, 1000, 2000, TimeUnit.MILLISECONDS);
    }
}
/**
 18:51:32.538 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - send heart beat
 18:51:34.537 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - send heart beat
 18:51:36.536 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - send heart beat
 18:51:38.536 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - send heart beat
 18:51:40.538 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - send heart beat
 */
```

#### 问题

假如业务执行的时间超过了周期的时间，如任务执行了5s,周期是2s

并且可以看到一个任务始终都是由一个线程去执行。可以看到线程池中虽然有两个线程，且任务执行周期已经到了，但是并没有第二个线程去执行

```java
@Slf4j
public class Test2 {
    public static void main(String[] args) {
        ScheduledThreadPoolExecutor scheduledThreadPoolExecutor = new ScheduledThreadPoolExecutor(2);
        //发心跳，service1->service2,每次过5s，发送一个心跳，证明s2可用
        scheduledThreadPoolExecutor.scheduleAtFixedRate(() -> {
            log.info("send heart beat");
            long starttime = System.currentTimeMillis(), nowtime = starttime;
            while ((nowtime - starttime) < 5000) {
                nowtime = System.currentTimeMillis();
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            log.info("task over....");
        }, 1000, 2000, TimeUnit.MILLISECONDS);
    }
}
/**
 18:55:34.249 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - send heart beat
 18:55:39.389 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - task over....
 18:55:39.389 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - send heart beat  几乎时间于上面的over同一执行
 18:55:44.525 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - task over....
 18:55:44.525 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - send heart beat
 */
```

我们需要任务执行完之后，再等2s才执行，那么就用到了scheduledWithFixedDelay

### scheduleWithFixedDelay提交周期性任务

可以看到任务执行完之后，在延期了2秒才重复执行

```java
@Slf4j
public class Test2 {
    public static void main(String[] args) {
        ScheduledThreadPoolExecutor scheduledThreadPoolExecutor = new ScheduledThreadPoolExecutor(1);

        scheduledThreadPoolExecutor.scheduleWithFixedDelay(() -> {
            log.info("send heart beat");
            long starttime = System.currentTimeMillis(), nowtime = starttime;
            while ((nowtime - starttime) < 5000) {
                nowtime = System.currentTimeMillis();
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            log.info("task over....");
        }, 1000, 2000, TimeUnit.MILLISECONDS);
    }
}
/**
 19:01:00.878 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - send heart beat
 19:01:06.017 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - task over....
 19:01:08.019 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - send heart beat
 19:01:13.153 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - task over....
 19:01:15.154 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - send heart beat
 */
```



### 抛异常会导致任务丢失

所以需要需要在任务中自己处理掉异常，才能继续周期性执行

```java
@Slf4j
public class Test2 {
    public static void main(String[] args) {
        ScheduledThreadPoolExecutor scheduledThreadPoolExecutor = new ScheduledThreadPoolExecutor(1);
        // 任务one
        scheduledThreadPoolExecutor.scheduleAtFixedRate(() -> {
            log.info("one send heart beat");
            throw new RuntimeException("unexpected error , stop working"); // 抛异常
        }, 1000, 2000, TimeUnit.MILLISECONDS);
        // 任务two
        scheduledThreadPoolExecutor.scheduleAtFixedRate(() -> {
            log.info("two send heart beat");
        }, 1000, 2000, TimeUnit.MILLISECONDS);
    }
}
/**
 19:20:38.081 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - one send heart beat
 19:20:38.084 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - two send heart beat
 19:20:40.079 [pool-1-thread-1] INFO com.yg.edu.schedule.Test2 - two send heart beat

 // 任务one不再周期执行
 */
```



## 定时线程池机制

![img](D:\Github\saas-yong\fullstack\Java架构师之路\Java并发编程\imgs\36361.png)

