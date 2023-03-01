---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

## failfast机制 ConcurrentModificationException

一边读一边写

```java
public class CopyOnWriteArrayListRunner {
    /**
     * 读线程
     *
     */
    private static class ReadTask implements Runnable {
        List<String> list;

        public ReadTask(List<String> list) {
            this.list = list;
        }

        public void run() {
            for (String str : list) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(str);
            }
            System.out.println("--------------------");
        }
    }
    /**
     * 写线程
     */
    private static class WriteTask implements Runnable {
        List<String> list;
        int index;

        public WriteTask(List<String> list, int index) {
            this.list = list;
            this.index = index;
        }

        public void run() {
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            list.remove(index);
            list.add(index, "write_" + index);
        }
    }

    public void run() throws InterruptedException {
//        final int NUM = Runtime.getRuntime().availableProcessors();
        final int NUM = 4;
        List<String> list =  new ArrayList<String>();
        for (int i = 0; i < NUM; i++) {
            list.add("main_" + i);
        }
        ExecutorService executorService = Executors.newFixedThreadPool(NUM);
        for (int i = 0; i < NUM; i++) {
            if(i == 0){
              executorService.execute(new ReadTask(list));
            }
            executorService.execute(new WriteTask(list, i));
        }
        executorService.shutdown();

        Thread.sleep(1000);
        System.out.println(list);
    }

    public static void main(String[] args) throws InterruptedException {
        new CopyOnWriteArrayListRunner().run();
    }
}
/**
 main_0
 [write_0, write_1, write_2, write_3]
 Exception in thread "pool-1-thread-1" java.util.ConcurrentModificationException
 */
```



## CopyOnWriteArrayList解决一边读一边写

```java
public class CopyOnWriteArrayListRunner {
    /**
     * 读线程
     */
    private static class ReadTask implements Runnable {
        List<String> list;

        public ReadTask(List<String> list) {
            this.list = list;
        }

        public void run() {
            for (String str : list) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(str);
            }
            System.out.println("--------------------");
        }
    }
    /**
     * 写线程
     */
    private static class WriteTask implements Runnable {
        List<String> list;
        int index;

        public WriteTask(List<String> list, int index) {
            this.list = list;
            this.index = index;
        }

        public void run() {
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            list.remove(index);
            list.add(index, "write_" + index);
        }
    }

    public void run() throws InterruptedException {
//        final int NUM = Runtime.getRuntime().availableProcessors();
        final int NUM = 4;
        List<String> list =  new CopyOnWriteArrayList<>();//new ArrayList<String>();
        for (int i = 0; i < NUM; i++) {
            list.add("main_" + i);
        }
        ExecutorService executorService = Executors.newFixedThreadPool(NUM);
        for (int i = 0; i < NUM; i++) {
            if(i == 0){
              executorService.execute(new ReadTask(list));
            }
            executorService.execute(new WriteTask(list, i));
        }
        executorService.shutdown();

        Thread.sleep(1000);
        System.out.println(list);
    }

    public static void main(String[] args) throws InterruptedException {
        new CopyOnWriteArrayListRunner().run();
    }
}
/**
 main_0
 [write_0, write_1, write_2, write_3]
 main_1
 main_2
 main_3
 --------------------
 */
```



## CopyOnWrite机制

读多写少，读写分离，空间换时间，避免为保证并发安全导致的锁竞争

> 1、CopyOnWrite适用于读多写少的情况，最大程度的提高读的效率；
>
> 2、CopyOnWrite是**最终一致性**，在写的过程中，原有的读的数据是不会发生更新的，只有新的读才能读到最新数据；
>
> 3、如何使其他线程能够及时读到新的数据，需要使用volatile变量；
>
> 4、写的时候不能并发写，需要对写操作进行加锁；

![image-20210630183020616](/images/concurrency/image-20210630183020616.png)



![img](/images/concurrency/16242.png)

### 源码

```java
/*
 *   添加元素api
 */
public boolean add(E e) {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        Object[] elements = getArray();
        int len = elements.length;
        Object[] newElements = Arrays.copyOf(elements, len + 1); //复制一个array副本
        newElements[len] = e; //往副本里写入
        setArray(newElements); //副本替换原本，成为新的原本
        return true;
    } finally {
        lock.unlock();
    }
}
//读api
public E get(int index) {
    return get(getArray(), index); //无锁
}
```





