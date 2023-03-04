---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /JVM/
typora-root-url: ..\.vuepress\public
---

## Class文件结构参考表

```shell
javap -verbose name.class
```

<img src="/images/concurrency/10780.png" alt="img" />

## 常量池项

相当于类的资源仓库，池化的思想

<img src="/images/jvm/class常量池类型分类.png" alt="class常量池类型分类" style="zoom:200%;" />

1. method_info

2. field_info

3. class_info

4. 字面量（字符串）

   1. 方法名
   2. 类型

5. LineNumberTable(异常的时候，打印出来的行号，即字节码与源代码一一对应)

6. LocalVairableTable（局部变量表----在编译的时候就确定了）

   1. 如在`this`就作为一个隐式的入参就传入到了局部变量表中

7. 

   

   ![img](/images/jvm/10896.png)

**基本参数类型和void类型都是用一个大写的字符来表示，对象类型是通过一个大写L加全类名表示，这么做的好处就是在保证jvm能读懂class文件的情况下尽量的压缩class文件体积.**

**基本数据类型表示:**

**B---->byte**

**C---->char**

**D---->double** 

**F----->float**

**I------>int**

**J------>long**

**S------>short**

**Z------>boolean**

**V------->void**

**对象类型:**

**String------>Ljava/lang/String;(后面有一个分号)**

**对于数组类型: 每一个唯独都是用一个前置 [ 来表示**

**比如:** **int[] ------>[ I,** 

​         **String [][]------>[[Ljava.lang.String;**

----------

## **访问标识符号**

![img](/images/jvm/10818.png)

## 字段结构

![img](/images/jvm/10851.png)



## ⭐方法结构

![img](/images/jvm/10855.png)

![image-20210614193146557](/images/jvm/image-20210614193146557.png)

1. 助记符aload_0
2. 行号表LineNumberTable
   1. 指令码的行数
   2. 源码的行数
3. localVariableTable
   1. 作用范围覆盖长度
   2. 索引指向

