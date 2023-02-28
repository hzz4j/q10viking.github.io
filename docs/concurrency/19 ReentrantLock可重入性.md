---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



Lock，Synchronized都具有重入性

```java
@Slf4j
public class Juc02_Thread_ReentrantLock {

    private static ReentrantLock lock = new ReentrantLock(true);

    public static void reentrantLock(){
        String threadName = Thread.currentThread().getName();
        //默认创建的是独占锁，排它锁；同一时刻读或者写只允许一个线程获取锁
        lock.lock();
        log.info("Thread:{},第一次加锁",threadName);
            lock.lock();
            log.info("Thread:{},第二次加锁",threadName);
            lock.unlock();
            log.info("Thread:{},第一次解锁",threadName);
        lock.unlock();
        log.info("Thread:{},第二次解锁",threadName);
    }

    public static void main(String[] args) {
        Thread t0 = new Thread(()-> reentrantLock(),"t0");
        t0.start();

        Thread t1 = new Thread(()-> reentrantLock(),"t1");
        t1.start();
    }
}
/**
 14:30:31.592 [t0] INFO com.yg.edu.lock.Juc02_Thread_ReentrantLock - Thread:t0,第一次加锁
 14:30:31.596 [t0] INFO com.yg.edu.lock.Juc02_Thread_ReentrantLock - Thread:t0,第二次加锁
 14:30:31.596 [t0] INFO com.yg.edu.lock.Juc02_Thread_ReentrantLock - Thread:t0,第一次解锁
 14:30:31.596 [t0] INFO com.yg.edu.lock.Juc02_Thread_ReentrantLock - Thread:t0,第二次解锁
 14:30:31.597 [t1] INFO com.yg.edu.lock.Juc02_Thread_ReentrantLock - Thread:t1,第一次加锁
 14:30:31.597 [t1] INFO com.yg.edu.lock.Juc02_Thread_ReentrantLock - Thread:t1,第二次加锁
 14:30:31.597 [t1] INFO com.yg.edu.lock.Juc02_Thread_ReentrantLock - Thread:t1,第一次解锁
 14:30:31.597 [t1] INFO com.yg.edu.lock.Juc02_Thread_ReentrantLock - Thread:t1,第二次解锁
 */
```

