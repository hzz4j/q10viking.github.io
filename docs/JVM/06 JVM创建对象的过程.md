---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /JVM/
typora-root-url: ..\.vuepress\public
---

## 对象创建过程

在Java中，**对象分配规则**是关于如何为新对象分配内存的一套规则，以确保内存的有效使用和对象的**正确初始化**。以下是关于对象分配的主要规则：

1. **内存分配**：新对象通常在堆内存中分配内存空间。
2. **对象头**：在为对象分配内存空间后，Java虚拟机会为对象分配一个**对象头**。对象头包含了一些关于对象的**元信息**，如对象的**哈希码、锁状态、垃圾回收信息**等。
3. **零值初始化**：在对象内存分配后，所有的成员变量会被初始化为零值。具体的零值取决于变量的数据类型。例如，整数类型会初始化为0，布尔类型会初始化为false，对象引用会初始化为null。
4. **构造函数调用**：一旦对象内存分配和零值初始化完成，Java虚拟机会调用对象的构造函数。
5. **对象引用**：最后，**new** 关键字会返回对象的引用，将这个引用分配给一个变量，以便后续可以通过该变量访问对象的属性和方法。
6. **垃圾回收管理**：Java虚拟机会自动管理对象的内存。如果对象不再被引用，它会被标记为垃圾，并在适当的时机由垃圾回收器回收，释放占用的内存。

这些规则确保了对象在创建时的正确初始化和内存管理。对于程序员来说，最重要的是编写好构造函数以确保对象在创建后具有合适的初始状态，并且不忘记在不再需要对象时将引用置为null，以便垃圾回收器能够回收不再使用的对象。

```java
Math math = new Math();
```

![img](/images/jvm/103841)



## 类加载检查

虚拟机遇到一条new指令时，首先将去检查这个指令的参数是否能**在常量池中定位到一个类的符号引用**，并且检查这个符号引用代表的类是否已被加载、解析和初始化过。如果没有，那必须先执行相应的类加载过程。

new指令对应到语言层面上讲是，**new关键词、对象克隆、对象序列化**等

----------



## 分配内存

**对象所需内存的大小在类 加载完成后便可完全确定**，为对象分配空间的任务等同于**把 一块确定大小的内存从Java堆中划分出来**。

### 划分内存的方法

#### 指针碰撞

指针碰撞Bump the Pointer（默认用指针碰撞）：如果J**ava堆中内存是绝对规整的**，所有用过的内存都放在一边，空闲的内存放在另一边，中间放着一个指针作为分界点的指示器，**那所分配内存就仅仅是把那个指针向空闲空间那边挪动一段与对象大小相等的距离**。

#### 空闲列表

空闲列表Free List: 如果Java堆中的内存并不是规整的，已使用的内存和空闲的内存相互交错，那就没有办法简单地进行指针碰撞了，**虚拟机就必须维护一个列表，记录上哪些内存块是可用的**，在分配的时候从列表中**找到一块足够大的空间划分给对象实例， 并更新列表上的记录**

### 解决并发问题的方法

#### CAS

虚拟机采用**CAS配上失败重试**的方式保证更新操作的原子性来对分配内存空间的动作进行同步处理.

#### TLAB

1. 本地线程分配缓冲（Thread Local Allocation Buffer,TLAB）
2. 把内存分配的动作按照线程划分在不同的空间之中进行，即**每个线程在Java堆中预先分配一小块内存**。
3. 通过**-XX:+/-UseTLAB**参数来设定虚拟机是否使用TLAB(JVM会默认开启**-XX:+UseTLAB**)，**-XX:TLABSize** 指定TLAB大小。

----------

## 初始化零值

> private int initData = 666;

内存分配完成后，**虚拟机需要将分配到的内存空间都初始化为零值（不包括对象头）**， 如果使用TLAB，这一工作过程也可以提前至TLAB分配时进行。这一步操作保证了对象的实例字段在Java代码中可以不赋初始值就直接使用，程序能访问到这些字段的数据类型所对应的零值

## **设置对象头**

在HotSpot虚拟机中，对象在内存中存储的布局可以分为3块区域：对象头（Header）、 实例数据（Instance Data）和对齐填充（Padding）

![img](/images/jvm/95007)

![img](/images/jvm/2557)

![img](/images/jvm/100689)

> Klass Pointer类型指针,指向存储在方法区的类元信息(Math.class,存储着代码的信息)。实例数据以及，Class对象都存在堆中 (Math实例，Class< Math >)
>
> **关于对齐填充：**对于大部分处理器，对象以**8字节整数倍来对齐填充都是最高效的存取方式**。

### 计算对象大小

在Java中，对象的大小通常是由对象的实例变量、对象头和内部填充组成的。对象的大小计算方法可以简化为以下几个步骤：

1. **计算对象头大小**：对象头包含了一些关于对象的**元信息**，如对象的哈希码、锁状态、垃圾回收信息等。对象头的大小在不同的JVM实现和配置下会有所不同。通常，对象头的大小在64位JVM是8个字节，在32位JVM是4个字节。
2. **计算实例变量大小**：对象的实例变量是对象的数据部分，它们占用的内存空间由它们的数据类型和数量决定。例如，一个整数类型的实例变量在64位JVM是8个字节，在32位JVM是4个字节。
3. **计算内部填充大小**：为了对齐数据，Java虚拟机通常在实例变量之间插入一些内部填充。填充的大小取决于虚拟机和操作系统的要求，通常是8字节的倍数。这样可以提高内存的访问效率。

```java
import org.openjdk.jol.info.ClassLayout;

/**
 * 计算对象大小
 */
public class JOLSample {

    public static void main(String[] args) {
        ClassLayout layout = ClassLayout.parseInstance(new Object());
        System.out.println(layout.toPrintable());

        System.out.println();
        ClassLayout layout1 = ClassLayout.parseInstance(new int[]{});
        System.out.println(layout1.toPrintable());

        System.out.println();
        ClassLayout layout2 = ClassLayout.parseInstance(new A());
        System.out.println(layout2.toPrintable());
    }

    // -XX:+UseCompressedOops           默认开启的压缩所有指针
    // -XX:+UseCompressedClassPointers  默认开启的压缩对象头里的类型指针Klass Pointer
    // Oops : Ordinary Object Pointers
    public static class A {
                       //8B mark word
                       //4B Klass Pointer   如果关闭压缩-XX:-UseCompressedClassPointers或-XX:-UseCompressedOops，则占用8B
        int id;        //4B
        String name;   //4B  如果关闭压缩-XX:-UseCompressedOops，则占用8B
        byte b;        //1B 
        Object o;      //4B  如果关闭压缩-XX:-UseCompressedOops，则占用8B
    }
}


64位机器下面 运行结果：
java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
      0     4        (object header)                           01 00 00 00 (00000001 00000000 00000000 00000000) (1)    //mark word
      4     4        (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)    //mark word     
      8     4        (object header)                           e5 01 00 f8 (11100101 00000001 00000000 11111000) (-134217243)    //Klass Pointer
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total


[I object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
      0     4        (object header)                           01 00 00 00 (00000001 00000000 00000000 00000000) (1)
      4     4        (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
      8     4        (object header) // Klass Pointer          6d 01 00 f8 (01101101 00000001 00000000 11111000) (-134217363)
     12     4        (object header)//数组长度                  00 00 00 00 (00000000 00000000 00000000 00000000) (0)
     16     0    int [I.<elements>                             N/A
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total


com.tuling.jvm.JOLSample$A object internals:
 OFFSET  SIZE               TYPE DESCRIPTION                               VALUE
      0     4                    (object header)                           01 00 00 00 (00000001 00000000 00000000 00000000) (1)
      4     4                    (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
      8     4                    (object header)                           61 cc 00 f8 (01100001 11001100 00000000 11111000) (-134165407)
     12     4                int A.id                                      0
     16     1               byte A.b                                       0
     17     3                    (alignment/padding gap)                  
     20     4   java.lang.String A.name                                    null
     24     4   java.lang.Object A.o                                       null
     28     4                    (loss due to the next object alignment)
Instance size: 32 bytes
Space losses: 3 bytes internal + 4 bytes external = 7 bytes total
```

## **执行< init >方法**

 执行方法，即对象按照程序员的意愿进行初始化。对应到语言层面上讲，就是为**属性赋值**（注意，这与上面的赋零值不同，这是由程序员赋的值），和**执行构造方法**。

