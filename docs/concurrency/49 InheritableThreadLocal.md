---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

> 他可以实现在子线程中使用父线程中的线程本地变量

```java
public class InheritableThreadLocalDemo {
    private static  InheritableThreadLocal<String> threadLocal = new InheritableThreadLocal<>();

    public static void main(String[] args) {
        threadLocal.set("Hello Q10Viking");
        new Thread(()->{
            System.out.println(threadLocal.get());
        }).start();
    }
}
/**
 * Hello Q10Viking
 */
```

## 实现原理

在创建线程的过程中会调用init方法，在创建的ThreadLocalMap设置了key为InheritableThreadLocal

```java
if (inheritThreadLocals && parent.inheritableThreadLocals != null)
            this.inheritableThreadLocals =
                ThreadLocal.createInheritedMap(parent.inheritableThreadLocals);
```



## 参考

[InheritableThreadLocal详解 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/101780720)

