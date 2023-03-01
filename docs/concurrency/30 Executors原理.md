---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## Executors简介

主要用来创建线程池，代理了线程池的创建，使得你的创建入口参数变得简单

1. newCachedThreadPool创建一个可缓存线程池，如果线程池长度超过处理需
   要，可灵活回收空闲线程，若无可回收，则新建线程。
2. newFixedThreadPool 创建一个定长线程池，可控制线程最大并发数，超出的
   线程会在队列中等待。
3. newScheduledThreadPool 创建一个定长线程池，支持定时及周期性任务执行。
4. newSingleThreadExecutor 创建一个单线程化的线程池，它只会用唯一的工作
   线程来执行任务，保证所有任务按照指定顺序(FIFO, LIFO, 优先级)执行。

## 使用

```java
public class ExecutorsRunner {
    public static void main(String[] args) {
        ScheduledExecutorService es = Executors.newScheduledThreadPool(2);

        //延迟三秒执行
        es.schedule(new Runnable() {
            public void run() {
                System.out.println("鸣人在跑......");
            }
        },3, TimeUnit.SECONDS);

        es.schedule(new Runnable() {
            public void run() {
                System.out.println("佐助在跑......");
            }
        },2, TimeUnit.SECONDS);

        es.shutdown();
        System.out.println("over");
    }
}
/**
 over
 佐助在跑......
 鸣人在跑......
 */
```

