---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /JVM/
typora-root-url: ..\.vuepress\public
---



## 1. JVM整体结构及内存模型

![image-20210325224010190](/images/jvm/image-20210325224010190.png)

## 2. 完整Java虚拟机结构

1. 类装载子系统
2. 运行时数据区
3. 字节码执行引擎

![image-20210610215419675](/images/jvm/image-20210610215419675.png)



##  3. 栈（线程）

1. 一个线程开始执行，就在虚拟机的**栈内存中为该线程分配一个块独立的内存空间**
2. 在**分配的独立内存空间**中又细化分为**栈帧**

```java
public class Math {
    private static final int initData = 666;
    public static User user = new User();

    public int compute(){
        int a = 1;
        int b = 2;
        int c = (a+b)*10;
        return c;
    }

    public static void main(String[] args) {
        Math math = new Math();
        math.compute();
    }
}

```

<img src="/images/jvm/image-20210325205845843.png" alt="image-20210325205845843"/>

### 3.1 栈帧

java为每一个方法分配一块独立的栈帧,在栈帧中存储了

1. `局部变量表`
2. `操作数栈`
3. `动态链接`
4. `方法出口`

![image-20210325213525732](/images/jvm/image-20210325213525732.png)

####  1. 局部变量表 & 操作数栈

> 变量到操作数栈load指令，操作数栈到变量store指令，常数到操作数栈bipush
>
> **操作数栈**是：程序**做操作的临时中转存放的内存空间**

1. iconst_2 将int类型常量2压入栈

2. istore_2 将int类型值存入局部变量2

3. iload_1 从局部变量1中装载int类型值

4. iadd

5. bipush 10

6. ireturn

   

![image-20210325214928489](/images/jvm/image-20210325214928489.png)

----------

**main方法中局部表的分析**

```java
 public static void main(String[] args) {
     Math math = new Math();
     math.compute();
 }
```

在该main的**局部变量表中存放的是new 出来的math对象分配在堆上的内存地址**

![image-20210610224550696](/images/jvm/image-20210610224550696.png)







#### 2. 动态链接 & 方法出口

**动态链接**：math.compute()程序运行时，把**符号引用转化为对应代码的内存地址**
**方法出口**：返回调用方法的某个位置

![image-20210325215416698](/images/jvm/image-20210325215416698.png)



## 3. 程序计数器

1. 字节码执行引擎，会动态修改程序计数器，对应**代码执行的位置**
2. ❤️**cpu分配时间片结束时，线程进行了切换，记录线程执行到的位置**❤️

![image-20210610222626995](/images/jvm/image-20210610222626995.png)

----------

## 4 本地方法栈native

字节码执行引擎执行到native方法时会去找对应的c语言

执行那些native方法时需要分配一块内存空间用于执行本地方法栈

```java
private native void start0();
```

![image-20210325221224958](/images/jvm/image-20210325221224958.png)

----------

##  5 堆

new出来的对象会放在堆，一般在Eden区

![image-20210325222836659](/images/jvm/image-20210325222836659.png)

GC大概过程

GC Root可达性分析: （GC Root根引用）局部变量中引用的对象

> 在web系统中由于用户不断地请求会不断产生对象，就会进行垃圾回收，在垃圾回收过程中对于非垃圾对象会放到Survivor区S0,S1（在S0和S1中不断转移），其对象的分代年龄会+1，在Eden区的垃圾对象就会被清除,如果对象经过多次GC后还没有被清理，并且分代年龄达到了一定值（最大是15），（或Suvivor区中存储不下了）则会放到老年代
>
> 如果老年代内存不足，就会出现OOM,内存溢出。
>



**jvisualvm命令观察GC整体过程**

![image-20210326001329445](/images/jvm/image-20210326001329445.png)

### 5.1 STW（Stop-The-World）

在GC的过程中会触发STW,**会停止所有用户线程（用户发起的线程，如用户下单，用户体验感知会觉得网站卡顿了）**

JVM调优就是为了减少GC次数

1. **垃圾收集会触发STW机制**
2. **JVM设置STW机制的目的**：**确保GC找的非垃圾对象是有效的**。比如不存在STW，GC在寻找过程中找到的非垃圾对象是用户线程所使用的，在漫长的寻找非垃圾对象过程中，用户线程结束，那么之前的非垃圾对象就会变成垃圾对象了，那么就白找了。在高并发的场景中，GC就变得没有意义了。GC就会频繁的触发

### 5.2 jvisualvm命令观察GC整体过程

[JDK高版本中不带有jvisualvm](https://blog.csdn.net/qq_28509737/article/details/106541693)

[jvisualvm官网](https://visualvm.github.io/index.html)

[IDEA集成VisualVM](https://www.cnblogs.com/avivaye/p/10515259.html)

jvisualvm工具安装插件VisualGC

<img src="/images/jvm/image-20210325235915193.png" alt="image-20210325235915193" />

**不断生成对象代码测试观察**

```java
public class HeadTest {

    public static void main(String[] args) throws InterruptedException {
        List<HeadTest> list = new ArrayList<>();
        while(true){
            list.add(new HeadTest());
            Thread.sleep(1);
        }
    }
}
```

![image-20210326001329445](/images/jvm/image-202103260013294451)



----------

## 6. 方法区（元空间）

存储的是class对象，如Math.class,1.8之前又叫**永久区**

-----------





## 7. 栈与堆之间的关系

![image-20210325215936583](/images/jvm/image-20210325215936583.png)



## 8. 方法区（元空间）& 堆关系❤️

方法区主要存储的数据

1. **常量** static final int
2. **静态变量** static int
3. **类元信息** Math.class  (const pool)

堆：主要存放new 出来的对象

```java
// 在方法区中Test类元信息中的user存储的是指向在堆上的User实例所在的内存地址	
public class Test{
    private static User user = new User();
}
```

![image-20210325220510041](/images/jvm/image-20210325220510041.png)





----------

