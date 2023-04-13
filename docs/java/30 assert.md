---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



> 断言是一种调试方式，断言失败会抛出`AssertionError`，只能在开发和测试阶段启用断言

```java
public class AssertDemo {
    public static void main(String[] args) {
        int age = 20;
        assert age < 18: "age is not less than 18";
        System.out.println("age is greater than 18");
    }
}
/** 需要添加 -ea 参数
 * Exception in thread "main" java.lang.AssertionError: age is not less than 18
 * 	at org.hzz.assertt.AssertDemo.main(AssertDemo.java:6)
 */
```

![image-20230413134028912](/images/concurrency/image-20230413134028912.png)