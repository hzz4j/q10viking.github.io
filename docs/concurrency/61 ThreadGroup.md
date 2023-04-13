---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## ThreadGroup

用于表示一组线程。线程组是一种组织和集中管理线程的方式。它提供了一种控制、监视和操作多个线程作为单一单位的方法。

ThreadGroup 类提供了各种方法来管理线程，包括在组内创建线程、设置组级别的属性、枚举组内的线程、中断组内的所有线程以及处理组内线程的未捕获异常。

以下是 ThreadGroup 类的一些关键特点：

1. 线程层次结构：ThreadGroup 类表示一种层次结构，允许线程以父子关系组织起来。线程组可以包含子组，形成类似树形结构的形式。
2. 属性继承：在 ThreadGroup 中创建的线程会继承该组的属性，例如最大优先级、守护线程状态和未捕获异常处理器。这样可以方便地管理具有相似行为的线程。
3. 线程监视：ThreadGroup 类提供了枚举组内线程的方法，使您可以集中监视和管理线程，例如挂起、恢复或停止组内的所有线程。
4. 异常处理：ThreadGroup 类允许您为组内的线程设置未捕获异常处理器。如果组内的线程由于未捕获异常而终止，处理器可以执行自定义操作，例如日志记录或清理

```java
public class ThreadGroupDemo {
    public static void main(String[] args) {
        // 创建线程组
        ThreadGroup group = new ThreadGroup("MyThreadGroup");

        // 创建线程
        Thread thread1 = new Thread(group, new MyRunnable(), "Thread 1");
        Thread thread2 = new Thread(group, new MyRunnable(), "Thread 2");

        // 设置线程组属性
        group.setMaxPriority(8);
        group.setDaemon(true);

        // 启动线程
        thread1.start();
        thread2.start();

        // 枚举组内的线程
        Thread[] threads = new Thread[group.activeCount()];
        group.enumerate(threads);



        // 挂起组内的所有线程
        group.suspend();

        // 恢复组内的所有线程
        group.resume();

        // 中断组内的所有线程
        group.interrupt();
    }
    static class MyRunnable implements Runnable {
        @Override
        public void run() {
            // 线程执行的逻辑
            while(!Thread.currentThread().isInterrupted()){

            }
            System.out.println("线程执行完毕");
        }
    }
}
```



## 父子ThreadGroup

```java
// 创建父线程组
ThreadGroup parentGroup = new ThreadGroup("ParentGroup");

// 创建子线程组
ThreadGroup childGroup = new ThreadGroup(parentGroup, "ChildGroup");

// 创建线程并加入子线程组
Thread thread1 = new Thread(childGroup, new MyRunnable(), "Thread 1");
Thread thread2 = new Thread(childGroup, new MyRunnable(), "Thread 2");

// 设置线程组的未捕获异常处理器
childGroup.setUncaughtExceptionHandler(new MyUncaughtExceptionHandler());

// 启动线程
thread1.start();
thread2.start();

// 中断父线程组中的所有线程
parentGroup.interrupt();

// 摧毁父线程组，同时摧毁子线程组和线程
parentGroup.destroy();

// 自定义未捕获异常处理器
class MyUncaughtExceptionHandler implements Thread.UncaughtExceptionHandler {
    @Override
    public void uncaughtException(Thread t, Throwable e) {
        // 处理未捕获的异常
    }
}

// 自定义线程操作
class MyRunnable implements Runnable {
    @Override
    public void run() {
        // 线程执行的逻辑
    }
}
```

