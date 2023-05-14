---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---





## CompletableFuture

::: tip

在看RocketMQ源码的时候，发现大量使用到了这个类，今天好好研究下，怎么使用它

:::

简单的任务，用Future获取结果还好，但我们并行提交的多个异步任务，往往并不是独立的，很多时候业务逻辑处理存在串行[依赖]、并行、聚合的关系。如果要我们手动用 Fueture 实现，是非常麻烦的。

**CompletableFuture是Future接口的扩展和增强**。CompletableFuture实现了Future接口，并在此基础上进行了丰富地扩展，完美地弥补了Future上述的种种问题。更为重要的是，**CompletableFuture实现了对任务的编排能力**。借助这项能力，我们可以轻松地组织不同任务的运行顺序、规则以及方式。从某种程度上说，这项能力是它的核心能力。而在以往，虽然通过CountDownLatch等工具类也可以实现任务的编排，但需要复杂的逻辑处理，不仅耗费精力且难以维护

[CompletableFuture (Java Platform SE 8 ) (oracle.com)](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html)

[Source Code](https://github.com/Q10Viking/learncode/tree/main/javabasic/src/org/hzz/completablefuture)

## 创建异步操作

> CompletableFuture 提供了四个静态方法来创建一个异步操作

```java
public static CompletableFuture<Void> runAsync(Runnable runnable)
public static CompletableFuture<Void> runAsync(Runnable runnable, Executor executor)
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier)
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier, Executor executor)
```

这四个方法区别在于：

- runAsync 方法以Runnable函数式接口类型为参数，没有返回结果，supplyAsync 方法Supplier函数式接口类型为参数，返回结果类型为U；Supplier 接口的 get() 方法是有返回值的（**会阻塞**）
- 没有指定Executor的方法会使用ForkJoinPool.commonPool() 作为它的线程池执行异步代码。如果指定线程池，则使用指定的线程池运行。
- 默认情况下 CompletableFuture 会使用公共的 ForkJoinPool 线程池，这个线程池默认创建的线程数是 CPU 的核数（也可以通过 JVM option:-Djava.util.concurrent.ForkJoinPool.common.parallelism 来设置 ForkJoinPool 线程池的线程数）。如果所有 CompletableFuture 共享一个线程池，那么一旦有任务执行一些很慢的 I/O 操作，就会导致线程池中所有线程都阻塞在 I/O 操作上，从而造成线程饥饿，进而影响整个系统的性能。所以，**强烈建议你要根据不同的业务类型创建不同的线程池，以避免互相干扰**



### 测试代码

```java
public class AsyncDemo {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        CompletableFuture.runAsync(()->{
            System.out.println(Thread.currentThread().getName()+"执行没有返回结果的任务");
        });

        CompletableFuture<String> future = CompletableFuture.supplyAsync(()->{
            System.out.println(Thread.currentThread().getName()+"执行有返回结果的任务");
            try {
                TimeUnit.SECONDS.sleep(5);
                return "hello completableFuture";
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });

        // 获取结果
//        String s = future.get();
         String s = future.join();
        System.out.println("Result: "+s);
        System.out.println("main end");
    }
}
/**
 * ForkJoinPool.commonPool-worker-9执行没有返回结果的任务
 * ForkJoinPool.commonPool-worker-9执行有返回结果的任务
 * Result: hello completableFuture
 * main end
 */
```



## 获取结果

**join&get**

- join()和get()方法都是用来获取CompletableFuture异步之后的返回值。

- join()方法抛出的是uncheck异常（即未经检查的异常),不会强制开发者抛出。
- get()方法抛出的是经过检查的异常，ExecutionException, InterruptedException 需要用户手动处理（抛出或者 try catch）



## 结果处理(监听器)

CompletableFuture的计算结果完成，或者抛出异常的时候，我们可以执行特定的 Action。主要是下面的方法：

```java
public CompletableFuture<T> whenComplete(BiConsumer<? super T,? super Throwable> action)
public CompletableFuture<T> whenCompleteAsync(BiConsumer<? super T,? super Throwable> action)
public CompletableFuture<T> whenCompleteAsync(BiConsumer<? super T,? super Throwable> action, Executor executor)
```

- Action的类型是BiConsumer，它可以处理正常的计算结果，或者异常情况。
- 方法不以Async结尾，意味着Action使用相同的线程执行，而Async可能会使用其它的线程去执行(如果使用相同的线程池，也可能会被同一个线程选中执行)。
- 这几个方法都会返回CompletableFuture，当Action执行完毕后它的结果返回原始的CompletableFuture的计算结果或者返回异常



> 测试

```java
public class WhenCompleteOrExceptionallyDemo {
    public static void main(String[] args) {
        CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread().getName() + "执行有返回结果的任务");
            try {
                Thread.sleep(1000);
                int i = new Random().nextInt(10);
                System.out.println("i = " + i);
                if (i % 2 == 0) {
                    return 12 / 0;
                }
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            return 12;
        });

        // 相当于监听器，当future执行完毕后，会回调whenComplete方法
        CompletableFuture<Integer> whenComplete = future.whenComplete((s, throwable) -> {
            if (throwable == null) {
                System.out.println(Thread.currentThread().getName() + ": whenComplete->Result: " + s);
            } else {
                System.out.println(Thread.currentThread().getName() + ": whenComplete->Exception: " + throwable.getMessage());
            }
        });

        // 相当于监听器，当future执行过程抛出异常，会回调exceptionally方法
        CompletableFuture<Integer> exceptionally = future.exceptionally(throwable -> {
            System.out.println(Thread.currentThread().getName() + ": exceptionally->Exception: " + throwable.getMessage());
            System.out.println(Thread.currentThread().getName() + ": exceptionally->异常：" + throwable.getMessage() + "，返回默认值");
            return -1;
        });

        // 如果使用join()方法，会抛出runtime异常，不受检查
        // 如果不catch会导致main线程退出
        // Integer result = future.join();
        // 所以使用get方法比较好

        Integer result = null;
        try {
            Thread.sleep(3000);
            result = future.get();  // 获取不到异常后的返回值，只能获取到异常
            System.out.println("Result: " + result);
        } catch (InterruptedException | ExecutionException e) {
            System.out.println("main->Exception: " + e.getMessage());
        }

        try{
            System.out.println("whenComplete: " + whenComplete.get()); // 和上面一样
        }catch (InterruptedException | ExecutionException e) {
            System.out.println("main->Exception: " + e.getMessage());
        }

        try{
            System.out.println("exceptionally: " + exceptionally.get()); // 获取到异常后的返回值
        }catch (InterruptedException | ExecutionException e) {
            System.out.println("main->Exception: " + e.getMessage());
        }
        System.out.println("main end");
    }
}
```

> 运行结果

```sh
ForkJoinPool.commonPool-worker-9执行有返回结果的任务
i = 5
ForkJoinPool.commonPool-worker-9: whenComplete->Result: 12
Result: 12
whenComplete: 12
exceptionally: 12
main end
```

或者

```sh
ForkJoinPool.commonPool-worker-9执行有返回结果的任务
i = 6
ForkJoinPool.commonPool-worker-9: exceptionally->Exception: java.lang.ArithmeticException: / by zero
ForkJoinPool.commonPool-worker-9: exceptionally->异常：java.lang.ArithmeticException: / by zero，返回默认值
ForkJoinPool.commonPool-worker-9: whenComplete->Exception: java.lang.ArithmeticException: / by zero
main->Exception: java.lang.ArithmeticException: / by zero
main->Exception: java.lang.ArithmeticException: / by zero
exceptionally: -1
main end
```

