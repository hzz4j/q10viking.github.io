---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---





- 修饰类：表示类不可被继承
- 修饰方法：表示方法不可被子类覆盖（重写），但是可以重载

  ```java
  public class A {
      public final void test(){};
      public final void test(String a){}; // 允许重载
  }
  
  class B extends A{
    @Override
    public final void test(){};  // 不允许重写，编译报错
  }
  ```

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



## 为什么局部内部类和匿名内部类只能访问final?



```java
public class Test {
    public static void main(String[] args) {
        Test test = new Test();
        test.test(3);
    }

    // 局部变量a,b
    public void test(final int b){ // jdk8在这里做了优化，不用写,语法糖，但实际上也是有的，也不能修改
        final int a = 1;
        // 匿名内部类
        new Thread(){
            public void run(){
                System.out.println("a="+a);
                System.out.println("b="+b);
            }
        }.start();
    }
}
```



```java
public class OutClass {
    private int age = 18;

    public static void main(String[] args) {
        OutClass outClass = new OutClass();
        outClass.outprint(3);
    }
    public void outprint(final int a){
        final int b = 5;
        class InnerClass{
            public void innerPrint(){
                System.out.println("a="+a);
                System.out.println("b="+b);
                System.out.println("age="+age);
            }
        }

        new InnerClass().innerPrint();
    }
}
```



首先需要知道的一点是: 内部类和外部类是处于同一个级别的，内部类不会因为定义在方法中就会随着方法的执行完毕就被销毁。

这里就会产生问题：当外部类的方法结束时，局部变量就会被销毁了，但是内部类对象可能还存在(只有没有人再引用它时，才会死亡)。

这里就出现了一个矛盾：内部类对象访问了一个不存在的变量。为了解决这个问题，就将局部变量复制了一份作为内部类的成员变量，这样当局部变量死亡后，内部类仍可以访问它，实际访问的是局部变量的"copy"。这样就好像延长了局部变量的生命周期

将局部变量复制为内部类的成员变量时，必须保证这两个变量是一样的，也就是如果我们在内部类中修改了成员变量，方法中的局部变量也得跟着改变，怎么解决问题呢？

就将局部变量设置为final，对它初始化后，我就不让你再去修改这个变量，就保证了内部类的成员变量和方法的局部变量的一致性。这实际上也是一种妥协。使得局部变量与内部类内建立的拷贝保持一致





## finally什么场景不会被执行

比较极端的调用，`System.exit（0）`

