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

CountDownLatch是Java中用于多线程协作的辅助类，它可以让一个或多个线程等待其他线程完成某个任务后再继续执行。

CountDownLatch通过一个计数器来实现，计数器的初始值可以设置为等待的线程数量。每个线程在完成任务后都会调用countDown()方法来减少计数器的值。当计数器的值减至0时，等待在CountDownLatch上的线程就会被唤醒，可以继续执行后续的操作。

CountDownLatch的主要作用是协调多个线程的执行顺序，使得某个线程（或多个线程）必须等待其他线程完成后才能继续执行。它常用于以下场景：

1. 主线程等待多个子线程完成任务：主线程可以使用await()方法等待所有子线程完成，然后进行结果的汇总或其他操作。
2. 多个线程等待外部事件的发生：多个线程可以同时等待某个共同的事件发生，比如等待某个资源准备就绪或者等待某个信号的触发。
3. 控制并发任务的同时开始：在某些并发场景中，需要等待所有线程都准备就绪后才能同时开始执行任务，CountDownLatch提供了一种便捷的方式来实现这一需求。

需要注意的是，**CountDownLatch的计数器是不能被重置的**，也就是说它是一次性的。一旦计数器减至0，它将无法再次使用。如果需要多次使用可重置的计数器，则可以考虑使用CyclicBarrier

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

