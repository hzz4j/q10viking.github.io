---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



> 说明

```java
// initialize 设置成true会初始化，也会执行static静态代码块
// 设置成false,则不会初始化，也不会执行static静态代码块
public static Class<?> forName(String name, boolean initialize,
                                   ClassLoader loader)
```

> 测试

```java
public abstract class SelectorImpl {
    protected Set<Integer> selectedKeys = new HashSet();
    static {
        System.out.println("run?");
    }
}
```

```java
public class NioEventLoop {
    public NioEventLoop()  {}
    public void getSelectorImplClass(){
        try{
            // initialize设置true或false
            Class<?> selectorImplClass = Class.forName("org.hzz.reflect.netty.SelectorImpl",
                    false,ClassLoader.getSystemClassLoader());

        }catch (Exception xxx){}
    }

}
```

```java
public class TestMain {
    public static void main(String[] args) {
        NioEventLoop nioEventLoop = new NioEventLoop();
        nioEventLoop.getSelectorImplClass();   // SelectorImpl静态代码块没有执行
    }
}
```

Class.forName和ClassLoader是Java反射中用于加载类的两种不同方式。

**Class.forName是一个静态方法**，通过提供类的完全限定名，在运行时加载类。此方法还会执行类的静态初始化块。如果类名不存在或无法访问，将抛出ClassNotFoundException异常。

**ClassLoader是一个抽象类，用于加载类的工具**。每个Java类都有关联的ClassLoader对象，负责将类文件加载到Java虚拟机中。ClassLoader可以动态加载类，从不同来源加载类文件，如本地文件系统、网络等。

两者区别如下：

- Class.forName方法由java.lang.Class类调用，负责根据类名加载类，并执行静态初始化。
- ClassLoader是抽象类，提供了更灵活的类加载机制，可以自定义类加载过程，从不同来源加载类文件。

一般情况下，推荐使用**ClassLoader**来加载和使用类，因为它更灵活，并避免执行静态初始化的副作用。**Class.forName**主要用于特定场景，如加载数据库驱动程序。
