---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---





- 修饰类：表示类不可被继承
- 修饰方法：表示方法不可被子类覆盖，但是可以重载
- 修饰变量：表示变量一旦被赋值就不可以更改它的值。



## 修饰成员变量

- 如果final修饰的是类变量，只能在静态初始化块中指定初始值或者声明该类变量时指定初始值。
- 如果final修饰的是成员变量，可以在非静态初始化块、声明该变量或者构造器中执行初始值。



## 修饰局部变量

系统不会为局部变量进行初始化，局部变量必须由程序员显示初始化。因此使用final修饰局部变量时，即可以在定义时指定默认值（后面的代码不能对变量再赋值），也可以不指定默认值，而在后面的代码中对final变量赋初值（仅一次）

```java
public class FinalVar {
    final static int a = 0; //在声明的时候就需要赋值 或者静态代码块赋值
    /**
     static{
        a = 0;
     }
     */
    final int b;//再声明的时候就需要赋值 或者代码块中赋值
    {
        b = 0;
    }
    public static void main(String[] args) {
        final int localA; // 局部变量只声明没有初始化，不会报错，与final无关
        localA = 0;  // 但是在使用前一定要赋值
        System.out.println(localA);
    }
}
```



## 修饰基本类型数据和引用类型数据

- 如果是基本数据类型的变量，则其数值一旦在初始化之后便不能更改；
- 如果是引用类型的变量，则在对其初始化之后便不能再让其指向另一个对象。但是引用的值是可变的。

```java
public class FinalReferenceTest {
    public static void main(String[] args) {
        final int[] iarr = {1,2,3};
        iarr[0] = 0; // 合法
        iarr = null; // 非法

        final Person p = new Person(10);
        p.setAge(20); // 合法
        p = null; // 非法
    }
}
/**
 * 非法： 编译会报错，如java: 无法为最终变量p分配值
 */
```

