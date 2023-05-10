---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



## javap

反汇编：将class文件进行转化为

```sh
C:\Users\11930>javap
用法: javap <options> <classes>
其中, 可能的选项包括:
  -help  --help  -?        输出此用法消息
  -version                 版本信息
  -v  -verbose             输出附加信息
  -l                       输出行号和本地变量表
  -public                  仅显示公共类和成员
  -protected               显示受保护的/公共类和成员
  -package                 显示程序包/受保护的/公共类
                           和成员 (默认)
  -p  -private             显示所有类和成员
  -c                       对代码进行反汇编
  -s                       输出内部类型签名
  -sysinfo                 显示正在处理的类的
                           系统信息 (路径, 大小, 日期, MD5 散列)
  -constants               显示最终常量
  -classpath <path>        指定查找用户类文件的位置
  -cp <path>               指定查找用户类文件的位置
  -bootclasspath <path>    覆盖引导类文件的位置
```



为了对边我们创建一个代码

```java
public class IntegerSimpleTest {
    public static void main(String[] args) {
        Integer a = 100;
        Integer b = 200;
    }
}
```



### javap -p

> `java -p IntegerSimpleTest.class`输出方法

```java
public class org.hzz.autobox.IntegerSimpleTest {
  public org.hzz.autobox.IntegerSimpleTest();
  public static void main(java.lang.String[]);
}
```



### javap -p -c

> `java -p -c IntegerSimpleTest.class`输出jvm的汇编指令



```java
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



### java -p -v

> `java -p -v IntegerSimpleTest.class` 输出附加信息,如常量池

```java
Classfile /D:/Github/learncode/javabasic/out/production/javabasic/org/hzz/autobox/IntegerSimpleTest.class
  Last modified 2023-5-10; size 565 bytes
  MD5 checksum 7cf832758ac39c0e24e8ff7919741e0d
  Compiled from "IntegerSimpleTest.java"
public class org.hzz.autobox.IntegerSimpleTest
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #4.#21         // java/lang/Object."<init>":()V
   #2 = Methodref          #22.#23        // java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
   #3 = Class              #24            // org/hzz/autobox/IntegerSimpleTest
   #4 = Class              #25            // java/lang/Object
   #5 = Utf8               <init>
   #6 = Utf8               ()V
   #7 = Utf8               Code
   #8 = Utf8               LineNumberTable
   #9 = Utf8               LocalVariableTable
  #10 = Utf8               this
  #11 = Utf8               Lorg/hzz/autobox/IntegerSimpleTest;
  #12 = Utf8               main
  #13 = Utf8               ([Ljava/lang/String;)V
  #14 = Utf8               args
  #15 = Utf8               [Ljava/lang/String;
  #16 = Utf8               a
  #17 = Utf8               Ljava/lang/Integer;
  #18 = Utf8               b
  #19 = Utf8               SourceFile
  #20 = Utf8               IntegerSimpleTest.java
  #21 = NameAndType        #5:#6          // "<init>":()V
  #22 = Class              #26            // java/lang/Integer
  #23 = NameAndType        #27:#28        // valueOf:(I)Ljava/lang/Integer;
  #24 = Utf8               org/hzz/autobox/IntegerSimpleTest
  #25 = Utf8               java/lang/Object
  #26 = Utf8               java/lang/Integer
  #27 = Utf8               valueOf
  #28 = Utf8               (I)Ljava/lang/Integer;
{
  public org.hzz.autobox.IntegerSimpleTest();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 3: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Lorg/hzz/autobox/IntegerSimpleTest;

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=1, locals=3, args_size=1
         0: bipush        100
         2: invokestatic  #2                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
         5: astore_1
         6: sipush        200
         9: invokestatic  #2                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
        12: astore_2
        13: return
      LineNumberTable:
        line 5: 0
        line 6: 6
        line 7: 13
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      14     0  args   [Ljava/lang/String;
            6       8     1     a   Ljava/lang/Integer;
           13       1     2     b   Ljava/lang/Integer;
}
SourceFile: "IntegerSimpleTest.java"

```

