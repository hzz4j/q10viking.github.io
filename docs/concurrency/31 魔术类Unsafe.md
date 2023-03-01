---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## Unsafe介绍

> Unsafe jdk1.7 加入的API

1. Unsafe是位于sun.misc包下的一个类，主要提供一些用于**执行低级别、不安全操作**的方法，如**直接访问系统内存资源、自主管理内存资源**等，这些方法在提升Java运行效率、增强Java语言底层资源操作能力方面起到了很大的作用。
2. 但由于Unsafe类使Java语言拥有了类似C语言指针一样操作内存空间的能力，这无疑也增加了程序发生相关指针问题的风险。在程序中过度、不正确使用Unsafe类会使得程序出错的概率变大，使得Java这种安全的语言变得不再“安全”，因此对Unsafe的使用一定要慎重。

### 内存管理-文件上传

高并发的文件上传时，导致的大量FullGC，导致其他业务被影响

可以通过使用Unsafe来使用堆外内存来进行优化，但是注意的是需要手动来管理这块开辟的内存，否则会出现内存泄漏

```java
public class AllocateMemoryAccess {

    public static void main(String[] args) {
        Unsafe unsafe = UnsafeInstance.reflectGetUnsafe();
        long oneHundred = 1193123491341341234L;
        byte size = 8;
        /*
         * 调用allocateMemory分配内存
         */
        long memoryAddress = unsafe.allocateMemory(size);
        System.out.println("address:->"+memoryAddress);
        /*
         * 将1写入到内存中
         */
        unsafe.putAddress(memoryAddress, oneHundred);
        /*
         * 内存中读取数据
         */
        long readValue = unsafe.getAddress(memoryAddress);

        System.out.println("value : " + readValue);

        unsafe.freeMemory(memoryAddress);
    }

    @Override
    protected void finalize() throws Throwable {
        super.finalize();
    }
}
/**
 address:->1918311211344
 value : 1193123491341341234
 */
```



## 获取Unsafe实例

由于Unsafe在JDK中是单例且不可直接访问，需要通过反射获取

```java
public class UnsafeInstance {

    public static Unsafe reflectGetUnsafe() {
        try {
            Field field = Unsafe.class.getDeclaredField("theUnsafe");
            field.setAccessible(true);
            return (Unsafe) field.get(null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

## 跨方法形式的加锁

```java
    static Object object = new Object();
    static Unsafe unsafe = UnsafeInstance.reflectGetUnsafe();
    public void method1(){
        unsafe.monitorEnter(object);
    }

    public void method2(){
        unsafe.monitorExit(object);
    }
```



## 线程的阻塞

```java
public class ThreadParkerRunner {

    static Unsafe unsafe = UnsafeInstance.reflectGetUnsafe();

    public static void main(String[] args) {

        Thread t = new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("thread - is running----");
                //true则会实现ms定时,false则会实现ns定时。
                unsafe.park(false,0L); //阻塞当前线程
                System.out.println("thread is over-----");
            }
        });

        t.start();

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("唤醒Thread-t");
        unsafe.unpark(t);

    }

}
/**
 thread - is running----
 唤醒Thread-t
 thread is over-----
 */
```

