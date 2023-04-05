---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



## @Target({})

> java中@Target({})怎么使用，里面没有任何参数

在mybatis源码中看到

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({})
public @interface Signature {}
```


在Java中，@Target({}) 表示该注解可以用于任何元素，例如类、方法、字段等。当没有指定任何参数时，这个注解可以用于所有的程序元素。
以下是一个例子，展示了如何在一个Java类中使用@Target({})注解：

```java

@Retention(RetentionPolicy.RUNTIME)
@Target({})
public @interface MyAnnotation {
    // 注解元素定义
}
```

在上面的例子中，@Target({})表示这个自定义注解可以用于任何元素。这意味着，你可以在类、方法、字段等各种程序元素上使用这个注解。
注意，@Target注解只能用于自定义注解中。它的作用是指定自定义注解可以用于哪些程序元素。



--------

## 注解里面的注解

```java
@Intercepts({
        @Signature(type = Executor.class, method = "update", args = {MappedStatement.class,Object.class})
})
public class ExamPlugin implements Interceptor {}
```

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Intercepts {
    /**
   * Returns method signatures to intercept.
   *
   * @return method signatures
   */
    Signature[] value();
}
```

