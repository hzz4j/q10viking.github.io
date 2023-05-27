---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /javahelper/
typora-root-url: ..\.vuepress\public
---





::: tip

[Vavr](https://www.vavr.io/) is a functional library for Java 8+ that provides immutable data types and functional control structures.

[Vavr](https://www.vavr.io/)是Java 8+的函数库，提供不可变的数据类型和函数控制结构。

:::

## 依赖

> 目前该教程基于最新的版本，[Vavr User Guide](https://docs.vavr.io/#_maven)

```xml
<dependency>
    <groupId>io.vavr</groupId>
    <artifactId>vavr</artifactId>
    <version>0.10.4</version>
</dependency>
```





## Tuple

是一种不可变的数据结构，目前支持到8个

```java
public static void main(String[] args) {
    Tuple3<String,Integer,String> tuple3 = new Tuple3<>("Q10Viking",8,"java8");
    String name = tuple3._1();
    Integer version = tuple3._2();
    String language = tuple3._3();

    System.out.printf("name:%s is learning language:%s of version:%d\n",name,language,version);
}
// name:Q10Viking is learning language:java8 of version:8
```



## Either

[Introduction to Vavr's Either | Baeldung](https://www.baeldung.com/vavr-either)

```java
static Either<String,Integer> compute(int marks){
    if(marks < 85){
        return Either.left("Marks not acceptable");
    }else{
        return Either.right(marks);
    }
}

// 以下是不使用Either,纯粹靠java自带的功能实现
public static Object[] computeWithoutEitherUsingArray(int marks) {
    Object[] results = new Object[2];
    if (marks < 85) {
        results[0] = "Marks not acceptable";
    } else {
        results[1] = marks;
    }
    return results;
}

public static Map<String, Object> computeWithoutEitherUsingMap(int marks) {
    Map<String, Object> results = new HashMap<>();
    if (marks < 85) {
        results.put("FAILURE", "Marks not acceptable");
    } else {
        results.put("SUCCESS", marks);
    }
    return results;
}
```



> 测试Either

```java
public static void main(String[] args) {
    // a = 100
    Integer a = compute(100).right().getOrElseThrow(x -> new RuntimeException(x));
    // b = Marks not acceptable
    String b = compute(60).left().getOrNull();
    // c = null
    Integer c = compute(10).right()
        .map(x -> x + 1)
        .getOrNull();
}
```



### fold

```java
Either<Object, Integer> right = Either.right(5);
// 统一结果
// result = right:5
String result = right.fold(
    l -> "left: " + l,
    r -> "right:" + r
);
```

更详细的例子：

```java
CompleteFuture<Either<CommandFailure, Tuple2<PaymentId, PaymentStatus>>> promise = //...返回一个CompleteFuture

// 统一结果
CompleteFuture r =  promise.thenApply(acceptOrReject -> acceptOrReject.fold(
    reject -> ResponseEntity.badRequest().body(reject),
    accept -> ResponseEntity.accepted().body(new PerformPaymentResponse(accept._1.id, accept._2.name()))
));
```



## 参考

[Vavr User Guide](https://docs.vavr.io/#_maven)

[Introduction to Vavr | Baeldung](https://www.baeldung.com/vavr)

