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

    <!-- idea的支持，因为我们使用的版本是5.9.3 -->
    <dependency>
        <groupId>org.junit.platform</groupId>
        <artifactId>junit-platform-launcher</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-engine</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.junit.vintage</groupId>
        <artifactId>junit-vintage-engine</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

> IntelliJ IDEA supports running tests on the JUnit Platform。In order to use a different JUnit 5 version (e.g., 5.9.3)（本次项目我们使用的是5.9.3）, you may need to include the corresponding versions of the `junit-platform-launcher`, `junit-jupiter-engine`, and `junit-vintage-engine` JARs in the classpath.
>
> 还需要添加上面提到的三个依赖到IDEA中，方便IDEA运行Junit[JUnit 5 User Guide running-tests-ide-intellij-idea](https://junit.org/junit5/docs/current/user-guide/#running-tests-ide-intellij-idea)



> scope说明，如果标注了test，那么junit只能在test目录生效，在我们正式的代码不会生效，如IDEA导入包的时候甚至都没有提示

![image-20230514152150010](/images/java/image-20230514152150010.png)



## 注解

[JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/#writing-tests-annotations)



> 常用注解

| 注解        | 说明                  |
| ----------- | --------------------- |
| @BeforeEach | 相当于Junit4的@Before |
| @AfterEach  | 相当于Junit4的@After  |

