---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

## Semaphore简介

Semaphore 字面意思是信号量的意思，它的作用是**控制访问特定资源的线程数目**，底层依
赖AQS的状态State，是在生产当中比较常用的一个工具类。

如限流

### 使用

```java
public class SemaphoreRunner {

    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(2);
        for (int i=0;i<10;i++){
            new Thread(new Task(semaphore,"yangguo+"+i)).start();
        }
    }

    static class Task extends Thread{
        Semaphore semaphore;

        public Task(Semaphore semaphore,String tname){
            super(tname);
            this.semaphore = semaphore;
            //this.setName(tname);
        }

        public void run() {
            try {
                //semaphore.acquireUninterruptibly();
                semaphore.acquire();//获取公共资源

                System.out.println(Thread.currentThread().getName()+":aquire() at time:"+System.currentTimeMillis());
                Thread.sleep(5000);

                semaphore.release();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

    }
}
```

### 常用的API

1. acquire()
2. acquire(int)
3. tryAcquire(ong timeout, TimeUnit unit)



### 超时降级

服务限流(Hystrix里限流就有基于信号量方式)

```java
public class SemaphoreRunner {

    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(2);
        for (int i=0;i<10;i++){
            new Thread(new Task(semaphore,"yangguo+"+i)).start();
        }
    }

    static class Task extends Thread{
        Semaphore semaphore;

        public Task(Semaphore semaphore,String tname){
            super(tname);
            this.semaphore = semaphore;
            //this.setName(tname);
        }

        public void run() {
            try {

                if(semaphore.tryAcquire(500,TimeUnit.MILLISECONDS)){
                    System.out.println(Thread.currentThread().getName()+":aquire() at time:"+System.currentTimeMillis());
                    Thread.sleep(5000);
                    semaphore.release();//释放公共资源
                }else{
                    fallback();
                }

            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        public void fallback(){
            System.out.println("降级");
        }
    }
}
```



## 原理

通过同步状态state来记录,waitStatus（共享模式）

```java
//	在这个循环中一直去激活可以获取信号量
private void doReleaseShared() {
    for (;;) {
        Node h = head;
        if (h != null && h != tail) {
            int ws = h.waitStatus;
            if (ws == Node.SIGNAL) {
                if (!compareAndSetWaitStatus(h, Node.SIGNAL, 0))
                    continue;            // loop to recheck cases
                unparkSuccessor(h);
            }
            else if (ws == 0 &&
                     !compareAndSetWaitStatus(h, 0, Node.PROPAGATE))
                continue;                // loop on failed CAS
        }
        if (h == head)                   // loop if head changed
            break;
    }
}
```

![Semaphore-PROPAGATE状态分析](/images/concurrency/Semaphore-PROPAGATE状态分析.png)



![Semaphore源码分析](/images/concurrency/Semaphore源码分析.png)



