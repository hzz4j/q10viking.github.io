---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



[Source Code](https://gitee.com/q10viking/java-practice/tree/master/Timer/Timer/src/test/java/org/hzz)

Timer只有一个线程，如果任务抛出异常，那么后续提交的任务，将不再执行。

而ScheduleThreadPoolExecutor，任务抛出异常，只是任务丢失了，如果线程池没有线程了，会补充添加一个线程进去。

Timer： 单线程，线程挂了，不会再创建线程执行任务

定时线程池： 线程挂了，再提交任务，线程池会创建新的线程执行任务

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

