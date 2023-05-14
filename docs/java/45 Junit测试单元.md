---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



> 本文章采用Junit5版本[官方文档](https://junit.org/junit5/docs/current/user-guide/)



## 依赖

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.junit</groupId>
            <artifactId>junit-bom</artifactId>
            <version>5.9.3</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```



> scope说明，如果标注了test，那么junit只能在test目录生效，在我们正式的代码不会生效，如IDEA导入包的时候甚至都没有提示

![image-20230514152150010](/images/java/image-20230514152150010.png)



## 注解

[JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/#writing-tests-annotations)



> 常用注解

| 注解        | 说明                  |
| ----------- | --------------------- |
| @BeforeEach | 相当于Junit4的@Before |
| @AfterEach  | 相当于Junit4的@After  |

