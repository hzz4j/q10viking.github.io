---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



## 问题

> 先看一段代码,发现。本文就是重点分析为什么a==b 为true,而c == d为false

```java
public class IntegerTest {
    public static void main(String[] args) {
        Integer a = 100,b = 100;
        Integer c = 200,d = 200;
        System.out.println("a == b " + (a == b));
        System.out.println("c == d " + (c == d));
    }
}
/**
 * a == b true
 * c == d false
 */
```



## 分析

为了简化待会反汇编的代码，我们简化一下代码

```java
public class IntegerSimpleTest {
    public static void main(String[] args) {
        Integer a = 100;
        Integer b = 200;
    }
}
```

通过命令`javap -c IntegerSimpleTest.class`对class文件进行反汇编。

```java
Compiled from "IntegerSimpleTest.java"
public class org.hzz.autobox.IntegerSimpleTest {
  public org.hzz.autobox.IntegerSimpleTest();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: bipush        100
       2: invokestatic  #2                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
       5: astore_1
       6: sipush        200
       9: invokestatic  #2                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
      12: astore_2
      13: return
}
```

可以看到jvm会对int类型进行自动包装调用了`Integer.valueOf`这个静态方法

```java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```

其中缓存了[-128, 127]的Integer

```java
static final int low = -128;
static final int high = 127; // 默认
cache = new Integer[(high - low) + 1];
int j = low;
for(int k = 0; k < cache.length; k++)
    cache[k] = new Integer(j++);
```



> 所以a==b 为true是因为使用了缓存的Integer,
>
> 而c == d为false是因为没有使用缓存，每次都new一个Integer



## 自动包装和拆装

```java
public class IntegerSimpleTest2 {
    public static void main(String[] args) {
        Integer a = 100;
        int b = a + 100;
    }
}
```

反汇编

```java
public class org.hzz.autobox.IntegerSimpleTest2 {
  public org.hzz.autobox.IntegerSimpleTest2();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: bipush        100
       2: invokestatic  #2                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
       5: astore_1
       6: aload_1
       7: invokevirtual #3                  // Method java/lang/Integer.intValue:()I
      10: bipush        100
      12: iadd
      13: istore_2
      14: return
```



> 可以看到JVM会对int类型赋值给Integer类型时，进行了自动包装，调用`Integer.valueOf`,
>
> 而Integer类型赋值给int类型时，会进行自动拆箱，调用`Integer.intValue`



## 为什么需要Integer?

> 有了int为什么还需要Integer类型？

主要是因为面向对象的思想，因为Java语言是面向对象的，这也是它只所以流行的原因之一，对象封装有很多好处，可以把属性也就是数据跟处理这些数据的方法结合在一起。

Integer将int包装起来，并且提供了很多方法来操作这个int。

[Integer (Java Platform SE 8 ) (oracle.com)](https://docs.oracle.com/javase/8/docs/api/java/lang/Integer.html)

![image-20230510192509014](/images/MySQL/image-20230510192509014.png)