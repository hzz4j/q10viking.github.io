---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---



## 背景

> API文档，之前使用的[springfox/springfox: Automated JSON API documentation for API's built with Spring (github.com)](https://github.com/springfox/springfox)目前在github上最新的更新时间已经是三年前了

![image-20230522113301607](/images/springboot/image-20230522113301607.png)



> 目前[OpenAPI 3 Library for spring-boot  springdoc](https://springdoc.org/)我观察项目很活跃



## 依赖

```xml
<properties>
    <springdoc.version>1.7.0</springdoc.version>
</properties>

<dependencyManagement>
    <!-- OpenAPI 3 -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi</artifactId>
        <version>${springdoc.version}</version>
        <type>pom</type>
        <scope>import</scope>
    </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-ui</artifactId>
    </dependency>
</dependencies>
```







