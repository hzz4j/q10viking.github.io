---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## CountDownLatch简介

CountDownLatch这个类能够使一个线程等待其他线程完成各自的工作后再执行。例如，应用程序的主线程希望在负责启动框架服务的线程已经启动所有的框架服务之后再执行。

1. Zookeeper分布式锁
2. Jmeter模拟高并发

## CountDownLatch如何工作

CountDownLatch是通过一个计数器来实现的，计数器的初始值为线程的数量。每当一个线程完成了自己的任务后，计数器的值就会减1。当计数器值到达0时，它表示所有的线程已经完成了任务，然后在闭锁上等待的线程就可以恢复执行任务。



## 使用

```java
public class CountDownLaunchRunner {

    public static void main(String[] args) throws InterruptedException {
        long now = System.currentTimeMillis();
        CountDownLatch countDownLatch = new CountDownLatch(2);

        new Thread(new SeeDoctorTask(countDownLatch)).start();
        new Thread(new QueueTask(countDownLatch)).start();


        //等待线程池中的2个任务执行完毕，否则一直等待,zk分布式锁
        countDownLatch.await();
        System.out.println("over，回家 cost:"+(System.currentTimeMillis()-now));
    }

}
/**
 开始看医生
 开始在医院药房排队买药....
 看医生结束，准备离开病房
 排队成功，可以开始缴费买药
 over，回家 cost:5003
 */
```

```java
public class QueueTask implements Runnable {

    private CountDownLatch countDownLatch;

    public QueueTask(CountDownLatch countDownLatch){
        this.countDownLatch = countDownLatch;
    }
    public void run() {
        try {
            System.out.println("开始在医院药房排队买药....");
            Thread.sleep(5000);
            System.out.println("排队成功，可以开始缴费买药");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            if (countDownLatch != null)
                countDownLatch.countDown();
        }
    }
}
```

```java
public class SeeDoctorTask implements Runnable {
    private CountDownLatch countDownLatch;

    public SeeDoctorTask(CountDownLatch countDownLatch){
        this.countDownLatch = countDownLatch;
    }

    public void run() {
        
        try {
            System.out.println("开始看医生");
            Thread.sleep(2000);
            System.out.println("看医生结束，准备离开病房");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            if (countDownLatch != null)
                countDownLatch.countDown();
        }
    }

}
```





## 结合钩子函数Runtime

```java
final CountDownLatch latch = new CountDownLatch(1);

Runtime.getRuntime().addShutdownHook(new Thread("streams-shutdown-hook") {
    @Override
    public void run() {
        streams.close();
        latch.countDown();
    }
});

try {
    streams.start();
    latch.await();
} catch (Exception e) {
    System.exit(1);
}
System.exit(0);
```

