---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## LockSupport

> `LockSupport` allows a thread to block and wait until it is unparked by another thread.

::: tip

只会阻塞当前线程,但是却并不会释放当前线程持有的锁

:::

```java
public class MessageBroker {
    private Queue<String> queue = new LinkedList<>();
    private Thread consumerThread = new Thread(()->{
        consumeMessage();
    });

    void produceMessage(String message){
        synchronized (queue){
            System.out.println("生产获得锁");
            queue.add(message);
            LockSupport.unpark(consumerThread);
        }
        System.out.println("生产消释放锁");
    }

    void consumeMessage(){
        while(true){
            synchronized (queue){
                System.out.println("消费者获得锁");
                while(queue.isEmpty()){
                    LockSupport.park();  // 消费者线程阻塞,但是不会释放锁
                }
                String message = queue.poll();
                System.out.println("消费消息："+message);
            }
            System.out.println("消费者释放锁");
        }
    }

    void start(){
        consumerThread.start();
    }
    public static void main(String[] args) throws InterruptedException {
        MessageBroker messageBroker = new MessageBroker();
        messageBroker.start();
        Thread.sleep(1000);
        // Produce messages
        messageBroker.produceMessage("Message 1");

        messageBroker.produceMessage("Message 2");
        messageBroker.produceMessage("Message 3");
    }
}
```



### broker

```java
public class Example {
    public static void main(String[] args) throws InterruptedException {
        Object blocker = new Object();
        Thread thread = new Thread(() -> {
            System.out.println("Thread is parking...");
            // LockSupport.park(); // Thread will block here
            LockSupport.park(blocker); // Thread will block here
            System.out.println("Thread is unparked!");
        });

        thread.start();
        Thread.sleep(2000); // Sleep for 2 seconds
        System.out.println("Unparking thread...");
        LockSupport.unpark(thread); // Unpark the thread
    }
}
/**
 * Thread is parking...
 * Unparking thread...
 * Thread is unparked!
 */
```

