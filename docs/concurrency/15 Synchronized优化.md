---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## 锁的粗化

```java
synchronized(object){
    System.out.println("");
}
synchronized(object){
    System.out.println("");
}
synchronized(object){
    System.out.println("");
}

//------------------jvm会优化成如下------------------------------
synchronized(object){
    System.out.println("");
    System.out.println("");
    System.out.println("");
}

```



## 锁的消除



```java
private void method1(){
  // 该object1不可能被其他线程访问，因为是线程栈中私有的
  Object object1 = new Object();
  synchronized(object1){	//	所以这里的加锁，并没有什么意义
	//	业务代码
  }  
}
```



## 逃逸分析

使用逃逸分析，**编译器可以对代码做如下优化**：

1. 同步省略。如果一个对象被发现只能从一个线程被访问到，那么对于这个对象的操作可以不考虑同步
2. ❤️将堆分配转化为栈分配。如果一个对象在子程序中被分配，要使指向该对象的指针永远不会逃逸，对象可能是栈分配的候选，而不是堆分配❤️
3. 分离对象或标量替换。有的对象可能不需要作为一个连续的内存结构存在也可以被访问到，那么对象的部分（或全部）可以不存储在内存，而是存储在CPU寄存器中

是不是所有的对象和数组都会在堆内存分配空间？**不一定**

### 栈上分配示例

#### 堆发生大量GC的验证

**结论：栈上分配依赖于逃逸分析和标量替换**

是不是所有的对象和数组都会在堆内存分配空间？**不一定**

```java
package org.hzz.gc;

/**
 * 栈上分配，标量替换
 * 代码调用了1亿次alloc()，如果是分配到堆上，大概需要1GB以上堆空间，如果堆空间小于该值，必然会触发GC。
 *
 * 使用如下参数不会发生GC
 * -Xmx15m -Xms15m -XX:+DoEscapeAnalysis -XX:+PrintGC -XX:+EliminateAllocations
 * 使用如下参数都会发生大量GC 第一个没有开启逃逸分析，第二个虽然开启了逃逸分析，但是没有开启标量替换功能
 * -Xmx15m -Xms15m -XX:-DoEscapeAnalysis -XX:+PrintGC -XX:+EliminateAllocations  
 * -Xmx15m -Xms15m -XX:+DoEscapeAnalysis -XX:+PrintGC -XX:-EliminateAllocations
 */
public class AllotOnStack {

    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        for (int i = 0; i < 100000000; i++) {
            alloc();
        }
        long end = System.currentTimeMillis();
        System.out.println(end - start);
    }

    private static void alloc() {
        User user = new User();
        user.setId(1);
        user.setName("zhuge");
    }
}

```

#### 使用jmap查看实例的对象

在本案例中将堆分配很大为4G,**防止GC回收实例，方便验证**

```java
public class T0_ObjectStackAlloc {

    /**
     * 进行两种测试
     * 关闭逃逸分析，同时调大堆空间，避免堆内GC的发生，如果有GC信息将会被打印出来
     * VM运行参数：-Xmx4G -Xms4G -XX:-DoEscapeAnalysis -XX:+PrintGCDetails -XX:+HeapDumpOnOutOfMemoryError
     *
     * 开启逃逸分析
     * VM运行参数：-Xmx4G -Xms4G -XX:+DoEscapeAnalysis -XX:+PrintGCDetails -XX:+HeapDumpOnOutOfMemoryError
     *
     * 执行main方法后
     * jps 查看进程
     * jmap -histo 进程ID
     */
    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        for (int i = 0; i < 500000; i++) {
            alloc();
        }
        long end = System.currentTimeMillis();
        //查看执行时间
        System.out.println("cost-time " + (end - start) + " ms");
        try {
            Thread.sleep(1000000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        System.out.println("over");
    }

    private static TulingStudent alloc() {
        //Jit对编译时会对代码进行 逃逸分析
        //并不是所有对象存放在堆区，有的一部分存在线程栈空间
        TulingStudent student = new TulingStudent();
        return student;
    }

    static class TulingStudent {
        private long id;
        private int age;
    }
}
```

> jps 查看进程
> jmap -histo 进程ID

在关闭逃逸分析时，在堆上实打实创建了500000个实例

```sh
 num     #instances         #bytes  class name
----------------------------------------------
   1:           671       70415008  [I
   2:        500000       12000000  com.yg.edu.T0_ObjectStackAlloc$TulingStudent
```

在开启逃逸分析时，在堆上只创建了155679个实例

```java
 num     #instances         #bytes  class name
----------------------------------------------
   1:           671       78678760  [I
   2:        155679        3736296  com.yg.edu.T0_ObjectStackAlloc$TulingStudent
```

