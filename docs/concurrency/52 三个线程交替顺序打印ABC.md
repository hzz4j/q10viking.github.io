---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



::: tip

线程之间的通信机制的小案例

:::



## voliatile+synchronized

> 锁的竞争

[Source Code](https://github.com/Q10Viking/learncode/blob/main/concurrency/src/main/java/org/hzz/basic/threethreadprint/ThreeThreadPrintDemo.java)

```java
public class ThreeThreadPrintDemo {
    private volatile int count = 1;
    private volatile int threadIdToRun = 0;
    private Object lock = new Object();
    private final static char[] ABC = {'A','B','C'};
    public static void main(String[] args) {
        ThreeThreadPrintDemo demo = new ThreeThreadPrintDemo();
        new Thread(demo.new Printer(0)).start();
        new Thread(demo.new Printer(1)).start();
        new Thread(demo.new Printer(2)).start();

    }

     class Printer implements Runnable{
        private int threadId;
        public Printer(int id){
            this.threadId = id;
        }
        @Override
        public void run() {
            try{
                while(count<10){
                    synchronized (lock){
                        if(threadId != threadIdToRun){
                            lock.wait(); // 不到你的执行时机就乖乖释放锁
                        }else{
                            System.out.printf("Thread-%d: Print: %s\n",threadId,ABC[threadId]);
                            count++;
                            // update threadIdToRun
                            threadIdToRun = (threadIdToRun + 1) % 3;
                            lock.notifyAll();  // 唤醒线程竞争锁
                            /** 等价 threadIdToRun = (threadIdToRun + 1) % 3;
                                if(threadIdToRun == 0){
                                    threadIdToRun = 1;
                                }else if (threadIdToRun == 1){
                                    threadIdToRun = 2;
                                }else if(threadIdToRun == 2){
                                    threadIdToRun = 0;
                                }
                             */
                        }
                    }

                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
/**
 * Thread-0: Print: A
 * Thread-1: Print: B
 * Thread-2: Print: C
 * Thread-0: Print: A
 * Thread-1: Print: B
 * Thread-2: Print: C
 * Thread-0: Print: A
 * Thread-1: Print: B
 * Thread-2: Print: C
 */
```



## ReentrantLock+Condition



```java
private Lock lock = new ReentrantLock();  
private Condition condition = lock.newCondition(); 
condition.await();//this.wait();  
condition.signal();//this.notify();  
condition.signalAll();//this.notifyAll();
```

Synchronized能实现的通信方式，Condition都可以实现

[Source Code](https://github.com/Q10Viking/learncode/blob/main/concurrency/src/main/java/org/hzz/basic/threethreadprint/ReentrantLockConditionDemo.java)

```java
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class ReentrantLockConditionDemo {
    private Lock lock = new ReentrantLock();
    private Condition conditionA = lock.newCondition();
    private Condition conditionB = lock.newCondition();
    private Condition conditionC = lock.newCondition();
    private volatile int threadIdtoRun = 0;
    private final static char[] ABC = {'A','B','C'};
    public static void main(String[] args) {
        ReentrantLockConditionDemo demo = new ReentrantLockConditionDemo();
        demo.new Task(0, demo.conditionA, demo.conditionB).start();
        demo.new Task(1, demo.conditionB, demo.conditionC).start();
        demo.new Task(2, demo.conditionC, demo.conditionA).start();
    }

    private void updateThreadIdtoRun(){
        threadIdtoRun = (threadIdtoRun + 1) % 3;
    }

    public class Task extends Thread{
        private int threadId;
        private Condition self,next;
        public Task(int threadId,Condition self,Condition next){
            this.threadId = threadId;
            this.self = self;
            this.next = next;
        }

        private void print(){
            System.out.printf("%s print %s"+System.lineSeparator(),
                    Thread.currentThread().getName(),ABC[threadId]);
        }
        @Override
        public void run() {
            try{
                lock.lock();
                for(int i = 0;i < 3; i++){
                    while(threadId != threadIdtoRun) // 自旋
                        self.await();  // 释放锁
                    print();
                    updateThreadIdtoRun();
                    next.signal();  // 唤醒锁
                }
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            } finally {
                lock.unlock();
            }
        }
    }
}
/**
 * Thread-0 print A
 * Thread-1 print B
 * Thread-2 print C
 * Thread-0 print A
 * Thread-1 print B
 * Thread-2 print C
 * Thread-0 print A
 * Thread-1 print B
 * Thread-2 print C
 */
```



## Semaphore信号量

在创建Semaphore对象的时候还可以指定它的公平性。一般常用非公平的信号量，非公平信号量是指在获取许可时先尝试获取许可，而不必关心是否已有需要获取许可的线程位于等待队列中，如果获取失败，才会入列。而公平的信号量在获取许可时首先要查看等待队列中是否已有线程，如果有则入列。

```java
//非公平的构造函数
public Semaphore(int permits);//permits=10，表示允许10个线程获取许可证，最大并发数是10；
////通过fair参数决定公平性
public Semaphore(int permits，boolean fair)

Semaphore semaphore = new Semaphore(10,true);  
semaphore.acquire();  //线程获取许可证
//do something here  
semaphore.release();  //线程归还许可证
```

[Source Code](https://github.com/Q10Viking/learncode/blob/main/concurrency/src/main/java/org/hzz/basic/threethreadprint/SemaphoreDemo.java)

```java
public class SemaphoreDemo {
    private Semaphore semaphoreA = new Semaphore(1);
    private Semaphore semaphoreB = new Semaphore(0);
    private Semaphore semaphoreC = new Semaphore(0);
    private final static char[] ABC = {'A','B','C'};
    public static void main(String[] args) {
        SemaphoreDemo demo = new SemaphoreDemo();
        demo.new Task(0,demo.semaphoreA,demo.semaphoreB).start();
        demo.new Task(1,demo.semaphoreB,demo.semaphoreC).start();
        demo.new Task(2,demo.semaphoreC,demo.semaphoreA).start();

    }

    class Task extends Thread{
        private int threadId;
        private Semaphore self,next;

        public Task(int threadId,Semaphore self,Semaphore next){
            this.threadId = threadId;
            this.self = self;
            this.next = next;
        }

        private void print(){
            System.out.printf("%s print %s"+System.lineSeparator(),
                    Thread.currentThread().getName(),ABC[threadId]);
        }
        @Override
        public void run() {
            try {
                for (int i = 0; i < 3; i++) {
                    self.acquire(); // 为0时将无法继续获得该信号量
                    print();
                    next.release(); // 释放信号量加1
                }
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
/**
 * Thread-0 print A
 * Thread-1 print B
 * Thread-2 print C
 * Thread-0 print A
 * Thread-1 print B
 * Thread-2 print C
 * Thread-0 print A
 * Thread-1 print B
 * Thread-2 print C
 */
```



## 有三个线程T1,T2,T3,如何保证顺序执行

- **使用 join() 方法**： 可以在每个线程内部使用 join() 方法来等待前一个线程执行完成。具体操作是在线程 T2 的 run() 方法中调用 T1.join()，在线程 T3 的 run() 方法中调用 T2.join()。这样可以确保 T1 在 T2 之前执行，T2 在 T3 之前执行。

### join方法

```java

Thread T1 = new Thread(() -> {
    // 线程 T1 的任务
});

Thread T2 = new Thread(() -> {
    try {
        T1.join(); // 等待 T1 执行完成
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    // 线程 T2 的任务
});

Thread T3 = new Thread(() -> {
    try {
        T2.join(); // 等待 T2 执行完成
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    // 线程 T3 的任务
});

T1.start();
T2.start();
T3.start();
```



### CountDownLatch

- **使用 CountDownLatch**： 可以使用 CountDownLatch 来控制线程的执行顺序。创建一个 CountDownLatch 对象，设置初始计数为 2，分别在 T1 和 T2 的线程内等待计数器减少到 0，然后释放 T3 线程。

- ```java
  CountDownLatch latch1 = new CountDownLatch(1);
  CountDownLatch latch2 = new CountDownLatch(1);
  
  Thread t1 = new Thread(() -> {
      System.out.println("T1 running.");
      latch1.countDown(); // T1 执行完后释放 latch1
  });
  
  Thread t2 = new Thread(() -> {
      try {
          latch1.await(); // 等待 latch1 的释放
        	System.out.println("T2 running.");
          latch2.countDown(); // T2 执行完后释放 latch2
      } catch (InterruptedException e) {
          e.printStackTrace();
      }
  });
  
  Thread t3 = new Thread(() -> {
      try {
          latch2.await(); // 等待 latch2 的释放
        	System.out.println("T3 running.");
      } catch (InterruptedException e) {
          e.printStackTrace();
      }
  });
  
  t1.start();
  t2.start();
  t3.start();
  ```



###  LockSupport

可以使用LockSupport的park和unpark来控制线程的执行顺序。

```java
public class Test {
    private static Thread t1;
    private static Thread t2;
    private static Thread t3;
    public static void main(String[] args) {

        t1 = new Thread(() -> {
            System.out.println("T1 is running.");
            LockSupport.unpark(t2); // 唤醒线程T2
        });

        t2 = new Thread(() -> {
            LockSupport.park(); // 阻塞线程T2
            System.out.println("T2 is running.");
            LockSupport.unpark(t3); // 唤醒线程T3
        });

        t3 = new Thread(() -> {
            LockSupport.park(); // 阻塞线程T3
            System.out.println("T3 is running.");
        });


        t1.start();
        t2.start();
        t3.start();
    }
}
```



## 参考

[java - 3 Threads Printing numbers in sequence - Stack Overflow](https://stackoverflow.com/questions/30964133/3-threads-printing-numbers-in-sequence)

[三个线程交替顺序打印ABC_三个线程abc顺序执行](https://blog.csdn.net/hefenglian/article/details/82596072)