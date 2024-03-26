---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



[Source Code](https://gitee.com/q10viking/java-practice/tree/master/Timer/Timer/src/test/java/org/hzz)

Timer 是**线程安全的**，多个线程可以共享一个 Timer 对象，而不需要外部同步。Timer 并不提供实时保证，因为它是通过 `Object.wait(long)` 调度任务的。



## 只执行一次

### 延迟long类型

```java
@Test
public void givenUsingTimer_whenSchedulingTaskOnce_thenCorrect() {
    TimerTask task = new TimerTask() {
        public void run() {
            // Task performed on: Tue Mar 26 11:45:11 GMT+08:00 2024nThread's name: Timer
            System.out.println("Task performed on: " + new Date() + "n" +
                               "Thread's name: " + Thread.currentThread().getName());
        }
    };
    Timer timer = new Timer("Timer");

    long delay = 1000L;
    timer.schedule(task, delay);
}
```



### 延迟Date类型

```java
public class DatabaseMigrationTask extends TimerTask {
    private List<String> oldDatabase;
    private List<String> newDatabase;

    public DatabaseMigrationTask(List<String> oldDatabase, List<String> newDatabase) {
        this.oldDatabase = oldDatabase;
        this.newDatabase = newDatabase;
    }

    @Override
    public void run() {
        newDatabase.addAll(oldDatabase);
    }
}
```



```java
 @Test
    void givenDatabaseMigrationTask_whenTimerScheduledForNowPlusTwoSeconds_thenDataMigratedAfterTwoSeconds() throws Exception {
        List<String> oldDatabase = Arrays.asList("Harrison Ford", "Carrie Fisher", "Mark Hamill");
        List<String> newDatabase = new ArrayList<>();

        LocalDateTime twoSecondsLater = LocalDateTime.now().plusSeconds(2);
        Date twoSecondsLaterAsDate = Date.from(twoSecondsLater.atZone(ZoneId.systemDefault()).toInstant());

        new Timer().schedule(new DatabaseMigrationTask(oldDatabase, newDatabase), twoSecondsLaterAsDate);

        while (LocalDateTime.now().isBefore(twoSecondsLater)) {
            System.out.println("newDatabase size = " + newDatabase.size());
            Thread.sleep(500);
        }
        System.out.println(newDatabase);
    }

    /**
     * newDatabase size = 0
     * newDatabase size = 0
     * newDatabase size = 0
     * newDatabase size = 0
     * [Harrison Ford, Carrie Fisher, Mark Hamill]
     */
```



## 重复执行

```java

public class NewsletterTask extends TimerTask {
    @Override
    public void run() {
        System.out.println("Email sent at: "
                + LocalDateTime.ofInstant(Instant.ofEpochMilli(scheduledExecutionTime()), ZoneId.systemDefault()));
        Random random = new Random();
        int value = random.ints(1, 7)
                .findFirst()
                .getAsInt();
        System.out.println("["+Thread.currentThread().getName()+"] The duration of sending the mail will took: " + value);
        try {
            TimeUnit.SECONDS.sleep(value);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```

### Fixed Delay

任务会有延迟

```sh
# 间隔2s调用，第一个任务T1执行的时间是1s,然后间隔2s执行第二个任务也就是3s开始，但是t2执行需要2s,所以从第3秒开始已经过了2秒那么就开始执行第三个任务T
0s     1s    2s     3s           5s
|--T1--|
|-----2s-----|--1s--|-----T2-----|
|-----2s-----|--1s--|-----2s-----|--T3--|
```

```java
@Test
void givenNewsletterTask_whenTimerScheduledEachSecondFixedDelay_thenNewsletterSentEachSecond() throws Exception {
    timer.schedule(new NewsletterTask(), 0, 1000);

    Thread.sleep(20000);
}
```

```java
Email sent at: 2024-03-26T12:45:42.834
[Timer-0] The duration of sending the mail will took: 6
Email sent at: 2024-03-26T12:45:48.857
[Timer-0] The duration of sending the mail will took: 5
Email sent at: 2024-03-26T12:45:53.874
[Timer-0] The duration of sending the mail will took: 6
Email sent at: 2024-03-26T12:45:59.880
[Timer-0] The duration of sending the mail will took: 5
```

### Fixed Rate

任务不会延迟到点就开始调用

```sh
# 没经过两秒就调用一次，不管前面的任务是否执行完成。比如任务1开始执行，需要经过两秒开始调用T2
0s     1s    2s     3s    4s
|--T1--|       
|-----2s-----|-----T2-----|
|-----2s-----|-----2s-----|--T3--|
```



```java
    @Test
    void givenNewsletterTask_whenTimerScheduledEachSecondFixedRate_thenNewsletterSentEachSecond() throws Exception {
        timer.scheduleAtFixedRate(new NewsletterTask(), 0, 1000);

        Thread.sleep(20000);
    }
```

```java
Email sent at: 2024-03-26T12:44:15.534
[Timer-0] The duration of sending the mail will took: 5
Email sent at: 2024-03-26T12:44:16.534
[Timer-0] The duration of sending the mail will took: 1
Email sent at: 2024-03-26T12:44:17.534
[Timer-0] The duration of sending the mail will took: 6
Email sent at: 2024-03-26T12:44:18.534
[Timer-0] The duration of sending the mail will took: 3
Email sent at: 2024-03-26T12:44:19.534
[Timer-0] The duration of sending the mail will took: 6
```



### 每日任务

```java
@Test
public void givenUsingTimer_whenSchedulingDailyTask_thenCorrect() {
    TimerTask repeatedTask = new TimerTask() {
        public void run() {
            System.out.println("Task performed on " + new Date());
        }
    };
    Timer timer = new Timer("Timer");
    
    long delay = 1000L;
    long period = 1000L * 60L * 60L * 24L;
    timer.scheduleAtFixedRate(repeatedTask, delay, period);
}
```



## 取消执行

### TimeTask内取消

```java
@Test
public void givenUsingTimer_whenCancelingTimerTask_thenCorrect()
  throws InterruptedException {
    TimerTask task = new TimerTask() {
        public void run() {
            System.out.println("Task performed on " + new Date());
            cancel();
        }
    };
    Timer timer = new Timer("Timer");
    
    timer.scheduleAtFixedRate(task, 1000L, 1000L);
    
    Thread.sleep(1000L * 2);
}
```

### Timer取消

```java
@Test
public void givenUsingTimer_whenCancelingTimer_thenCorrect() 
  throws InterruptedException {
    TimerTask task = new TimerTask() {
        public void run() {
            System.out.println("Task performed on " + new Date());
        }
    };
    Timer timer = new Timer("Timer");
    
    timer.scheduleAtFixedRate(task, 1000L, 1000L);
    
    Thread.sleep(1000L * 2); 
    timer.cancel(); 
}
```



## Timer vs  ExecutorService

可以使用ExecutorService来替代Timer

```java
@Test
    public void givenUsingExecutorService_whenSchedulingRepeatedTask_thenCorrect()
            throws InterruptedException {
        TimerTask repeatedTask = new TimerTask() {
            public void run() {
                System.out.println("Task performed on " + new Date());
                // cancel在这里没有意义
                cancel();
            }
        };
        ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
        long delay  = 1000L;
        long period = 1000L;
        executor.scheduleAtFixedRate(repeatedTask, delay, period, TimeUnit.MILLISECONDS);
        Thread.sleep(delay + period * 3);
        executor.shutdown();
    }
```

- Timer可以对系统时钟的变化敏感；ScheduledThreadPoolExecutor不是。
- Timer只有一个执行线程；ScheduledThreadPoolExecutor可以配置任意数量的线程。
- TimerTask内部抛出的运行时异常会杀死线程，因此以下计划任务不会进一步运行；使用ScheduledThreadExecutor，当前任务将被取消，但其余任务将继续运行。



## 原理分析

timer底层是把一个个任务放在一个TaskQueue中，TaskQueue是以平衡二进制堆表示的优先级队列，他是通过nextExecutionTime进行优先级排序的，距离下次执行时间越短优先级越高，通过getMin()获得queue[1]

并且出队的时候通过synchronized保证线程安全，延迟执行和特定时间执行的底层实现类似，源码如下

```java
private void sched(TimerTask task, long time, long period) {
        if (time < 0)
            throw new IllegalArgumentException("Illegal execution time.");

        // Constrain value of period sufficiently to prevent numeric
        // overflow while still being effectively infinitely large.
        if (Math.abs(period) > (Long.MAX_VALUE >> 1))
            period >>= 1;

        synchronized(queue) {
            if (!thread.newTasksMayBeScheduled)
                throw new IllegalStateException("Timer already cancelled.");

            synchronized(task.lock) {
                if (task.state != TimerTask.VIRGIN)
                    throw new IllegalStateException(
                        "Task already scheduled or cancelled");
                task.nextExecutionTime = time;
                task.period = period;
                task.state = TimerTask.SCHEDULED;
            }

            queue.add(task);
            if (queue.getMin() == task) // 如果当前任务处于队列的第一个说明轮到这个任务执行了
                queue.notify();
        }
    }
```

我们主要来看下周期性调度通过什么方式实现的，我们直接来分析源码如下：

```java
private void mainLoop() {
  // 首先一直监听队列中有没有任务
        while (true) {
            try {
                TimerTask task;
                boolean taskFired;
    // 同步，保证任务执行顺序
                synchronized(queue) {
                    // Wait for queue to become non-empty
                    while (queue.isEmpty() && newTasksMayBeScheduled)
                        queue.wait();
                    if (queue.isEmpty())
                        break; // Queue is empty and will forever remain; die

                    // Queue nonempty; look at first evt and do the right thing
                    long currentTime, executionTime;
     // 获取优先级最高的任务
                    task = queue.getMin();
                    synchronized(task.lock) {
                        if (task.state == TimerTask.CANCELLED) {
                            queue.removeMin();
                            continue; // No action required, poll queue again
                        }
                        currentTime = System.currentTimeMillis();
      // 获取任务下次执行时间
                        executionTime = task.nextExecutionTime;
                        if (taskFired = (executionTime<=currentTime)) {
       // 到这里是延迟执行和特定时间点执行已经结束了，状态标记为EXECUTED,周期性执行继续往下走
                            if (task.period == 0) { // Non-repeating, remove
                                queue.removeMin();
                                task.state = TimerTask.EXECUTED;
                            } else { // Repeating task, reschedule
        // 这里他又重新计算了下下个任务的执行，并且任务还在队列中
                                queue.rescheduleMin(
                                  task.period<0 ? currentTime - task.period
                                                : executionTime + task.period);
                            }
                        }
                    }
     // 如果任务执行时间大于当前时间说明任务还没点，继续等，否则执行run代码块
                    if (!taskFired) // Task hasn't yet fired; wait
                        queue.wait(executionTime - currentTime);
                }
                if (taskFired) // Task fired; run it, holding no locks
                    task.run();
            } catch(InterruptedException e) {
            }
        }
    }
}
```



## 参考

[Timer And TimerTask](https://www.baeldung.com/java-timer-and-timertask)
