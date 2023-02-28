---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



**synchronized内置锁是一种对象锁(锁的是对象而非引用)，作用粒度是对象，可以用来实现对临界资源的同步互斥访问，是可重入的。**

## **加锁的方式：**

```java
1. 同步实例方法，锁是当前实例对象（this）
2. 同步类方法，锁是当前类对象，粒度比较大
3. 同步代码块，锁是括号里面的对象
```



## 同步实例方法

```java
public class Juc_LockOnThisObject {

    private Integer stock = 10;

    public synchronized void decrStock(){
        --stock;
        System.out.println(ClassLayout.parseInstance(this).toPrintable());
    }

    public static void main(String[] args) {
        Juc_LockOnThisObject to = new Juc_LockOnThisObject();
        //System.out.println(ClassLayout.parseInstance(to).toPrintable());
        to.decrStock();

        Juc_LockOnThisObject to1 = new Juc_LockOnThisObject();
        to1.decrStock();
    }
}
```

### 项目中不要使用System.out的原因

out对象是单例的，这样对于多线程环境下会存在锁的竞争。

```java
public final static PrintStream out = null;

public void println(String x) {
	synchronized (this) {
        print(x);
        newLine();
    }
}
```



## 同步类方法，静态方法

两个方法加锁加的是同一个对象Juc_LockOnClass

```java
public class Juc_LockOnClass {
    static int stock;

    public static synchronized void decrStock(){
        System.out.println(--stock);
    }

    public static synchronized void cgg(){
        // 项目里千万不要这样写这样语句
        // 因为out是单例的,
        System.out.println();
    }

    public static void main(String[] args) {
        //Juc_LockOnClass.class对象
        Juc_LockOnClass.decrStock();
    }

}
```

## 同步代码块

```java
public class Juc_LockOnObject {

    public static Object object = new Object();

    private Integer stock = 10;

    public void decrStock(){
        //T1,T2
        synchronized (object){
            --stock;
            if(stock <= 0){
                System.out.println("库存售罄");
                return;
            }
        }
    }
}
```