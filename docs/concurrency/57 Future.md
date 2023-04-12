---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



```java
public class FutureDemo {
    private static final ExecutorService executor = Executors.newFixedThreadPool(1);
    // 创建Future对象：您可以使用ExecutorService提交一个任务以进行异步执行，并获取代表任务结果的Future对象


    public static void main(String[] args) {
        // 创建Future对象：您可以使用ExecutorService提交一个任务以进行异步执行，并获取代表任务结果的Future对象
        Future<String> future = executor.submit(() -> {

            return "Hello";
        });
        // 从Future对象中获取任务结果
        // if(future.isDone())
        if (true) {
            try {
                String result = future.get(); // 获取任务的结果
                System.out.println(result);
            } catch (InterruptedException | ExecutionException e) {
                // 处理在获取结果时可能发生的异常
                e.printStackTrace();
            }
        }else{
            System.out.println("任务未完成");
        }
        executor.shutdown();
    }
}
```



## FutureTask原理分析

- 提交到线程池的任务被封装为了FutureTask

  ```java
  public <T> Future<T> submit(Callable<T> task) {
          if (task == null) throw new NullPointerException();
          RunnableFuture<T> ftask = newTaskFor(task);
          execute(ftask);
          return ftask;
      }
  ```

- 接着我们就拿到了这个FutureTask,然后执行get方法进入等待

[Link](https://www.processon.com/view/link/6436763b74d9e91985a5a952)

<common-progresson-snippet src="https://www.processon.com/view/link/6436763b74d9e91985a5a952"/>

![Future](/images/concurrency/Future.png)

