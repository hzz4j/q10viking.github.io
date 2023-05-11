---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



## 介绍

String是final修饰的，不可变每次操作都会产生新的String对象

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence 
```

StringBuffer和StringBuilder都是在原对象上操作

StringBuffer是线程安全的，StringBuilder线程不安全的StringBuffer方法都是synchronized修饰的

```java
@Override
public synchronized int length() {
    return count;
}
```

性能：StringBuilder > StringBuffer > String

场景：经常需要改变字符串内容时使用后面两个

优先使用StringBuilder，多线程使用共享变量时使用StringBuffer 



## StringBuilder线程不安全演示

```java
public class StringBuilderNotSafeDemo {
    public static void main(String[] args) throws InterruptedException {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    sb.append("a");
                }
            }).start();
        }
        // 睡眠确保所有线程都执行完
        Thread.sleep(1000);
        System.out.println(sb.length());
    }
}
/**
 * 5503
 */
```

上述业务逻辑比较简单，就是构建一个StringBuilder，然后创建10个线程，每个线程中拼接字符串“a”1000次，理论上当线程执行完成之后，打印的结果应该是10000才对。

但多次执行上面的代码打印的结果是10000的概率反而非常小，大多数情况都要少于10000。同时，还有一定的概率出现下面的异常信息

```sql
Exception in thread "Thread-0" java.lang.ArrayIndexOutOfBoundsException
	at java.lang.System.arraycopy(Native Method)
	at java.lang.String.getChars(String.java:826)
	at java.lang.AbstractStringBuilder.append(AbstractStringBuilder.java:449)
	at java.lang.StringBuilder.append(StringBuilder.java:136)
	at com.secbro2.strings.StringBuilderTest.lambda$test$0(StringBuilderTest.java:18)
	at java.lang.Thread.run(Thread.java:748)
9007
```

### 线程不安全的原因

StringBuilder中针对字符串的处理主要依赖两个成员变量char数组value和count。StringBuilder通过对value的不断扩容和count对应的增加来完成字符串的append操作。

```java
// 存储的字符串（通常情况一部分为字符串内容，一部分为默认值）
char[] value;

// 数组已经使用数量
int count;
```

上面的这两个属性均位于它的抽象父类AbstractStringBuilder中。

如果查看构造方法我们会发现，在创建StringBuilder时会设置数组value的初始化长度。

```java
public StringBuilder() {
    super(16);
}

AbstractStringBuilder(int capacity) {
    value = new char[capacity];
}
```

当调用append方法时会对count进行增加，增加值便是append的字符串的长度，具体实现也在抽象父类中

```java
public AbstractStringBuilder append(String str) {
    if (str == null)
        return appendNull();
    int len = str.length();
    ensureCapacityInternal(count + len);  // 线程不安全，多个线程都读取到同一个count值
    // 将str添加到value中
    str.getChars(0, len, value, count);
    count += len;  // 不是原子性的
    return this;
}
```

> 我们所说的线程不安全的发生点便是在append方法中count的“+=”操作。我们知道该操作是线程不安全的，那么便会发生两个线程同时读取到count值为5，执行加1操作之后，都变成6，而不是预期的7。这种情况一旦发生便不会出现预期的结果。



### 抛异常的原因

回头看异常的堆栈信息，回发现有这么一行内容：

```javascript
at java.lang.String.getChars(String.java:826)
```

对应的代码就是上面AbstractStringBuilder中append方法中的代码。对应方法的源代码如下：

```javascript
public void getChars(int srcBegin, int srcEnd, char dst[], int dstBegin) {
    if (srcBegin < 0) {
        throw new StringIndexOutOfBoundsException(srcBegin);
    }
    if (srcEnd > value.length) {
        throw new StringIndexOutOfBoundsException(srcEnd);
    }
    if (srcBegin > srcEnd) {
        throw new StringIndexOutOfBoundsException(srcEnd - srcBegin);
    }
    System.arraycopy(value, srcBegin, dst, dstBegin, srcEnd - srcBegin);
}
```

其实异常是最后一行arraycopy时JVM底层发生的。arraycopy的核心操作就是将传入的String对象copy到value当中

导致这里出现异常的原因是，因为之前扩容由于并发问题没有做好

```java
ensureCapacityInternal(count + len);  // 线程不安全，多个线程都读取到同一个count值
```

[ProgressOn](https://www.processon.com/view/link/645cc06be18d2f06805c8d20)

![StringBuilder线程不安全的原因](/images/java/StringBuilder线程不安全的原因.png)