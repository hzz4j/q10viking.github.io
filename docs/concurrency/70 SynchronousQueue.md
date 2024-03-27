---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



在使用`Executors.newCachedThreadPool`内部有`SynchronousQueue`,看一下是如何使用的

```java
  public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                      60L, TimeUnit.SECONDS,
                                      new SynchronousQueue<Runnable>());
    }
```

将`SynchronousQueue`看作是一个没有容量的阻塞队列，它严格遵循FIFO（先进先出）的原则，但特殊的是，它不会保存任何元素，而是直接在不同的线程间进行传递。

`SynchronousQueue`类在Java中主要用于解决线程间的直接、同步的数据交换问题，在多线程编程中，常常会遇到多个线程需要协作完成任务的情况，有时，一个线程需要等待另一个线程提供的数据才能继续执行，此时，使用`SynchronousQueue`它可以确保数据的生产者和消费者之间严格的同步，即生产者线程在数据被消费者线程取走之前会一直等待，而消费者线程在没有数据可取时也会等待。

这种同步机制有助于避免多线程编程中常见的竞态条件和数据不一致问题，通过`SynchronousQueue`，可以确保数据在多个线程之间安全、有序地传递，从而提高程序的稳定性和可靠性。

## 使用demo

- 生产者线程模拟生产数据的过程，并通过`put`方法将数据放入队列中，如果此时没有消费者线程等待数据，生产者线程将会被阻塞
- 消费者线程通过`take`方法从队列中取出数据，并进行消费，如果队列中没有数据可取，消费者线程将会被阻塞

```java
public class SynchronousQueueDemo {

    public static void main(String[] args) throws InterruptedException {
        // 创建一个SynchronousQueue实例
        SynchronousQueue<Integer> queue = new SynchronousQueue<>();

        // 创建一个生产者线程
        Thread producerThread = new Thread(() -> {
            try {
                // 模拟生产数据的过程
                TimeUnit.SECONDS.sleep(1);
                int data = 42; // 假设这是生产的数据

                // 将数据放入SynchronousQueue中，如果此时没有消费者线程等待，生产者线程将会被阻塞
                queue.put(data);
                System.out.println("生产者线程: 数据 " + data + " 已被放入队列。");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        // 创建一个消费者线程
        Thread consumerThread = new Thread(() -> {
            try {
                System.out.println("消费者3s即将获取数据");
                // 模拟消费数据的过程
                TimeUnit.SECONDS.sleep(3);
                // 从SynchronousQueue中取出数据，如果没有数据可取，消费者线程将会被阻塞
                int data = queue.take();

                // 模拟消费数据的过程
                TimeUnit.SECONDS.sleep(1);
                System.out.println("消费者线程: 数据 " + data + " 已被消费。");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        // 启动生产者和消费者线程
        producerThread.start();
        consumerThread.start();

        // 等待两个线程执行完毕
        producerThread.join();
        consumerThread.join();

        System.out.println("主线程: 程序执行完毕。");
    }
}
/**
 * 消费者3s即将获取数据
 * 生产者线程: 数据 42 已被放入队列。  -- 3s后打印
 * 消费者线程: 数据 42 已被消费。
 * 主线程: 程序执行完毕。
 */
```

