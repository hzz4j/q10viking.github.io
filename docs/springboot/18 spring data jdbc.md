---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---





[Spring Data JPA 的启动载入方式_安迪源文的博客-CSDN博客](https://blog.csdn.net/andy_zhang2007/article/details/95774766)





## 依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jdbc</artifactId>
</dependency>

<!-- 而不是 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```

![image-20230527004201865](/images/ddd/image-20230527004201865.png)





## 参考

[Integrating Spring Boot and Spring JDBC with H2 and Starter JDBC | Spring Boot Tutorial](https://www.springboottutorial.com/spring-boot-and-spring-jdbc-with-h2)

[Spring Data JDBC: Implementing Domain Driven Design Aggregate | by Tahir Naqash | Medium](https://medium.com/@techphile/spring-data-jdbc-implementing-domain-driven-design-aggregate-4d6bac13c728)

[领域设计：聚合与聚合根 (qq.com)](https://mp.weixin.qq.com/s?__biz=MzA4MjQ1ODIzMA==&mid=504716494&idx=1&sn=5e1616b133730e9b8c4e6008bad06947&chksm=04649fd7331316c16fac4e20b63396c766ffb7b6e81b3193cfa91f129deb971ecfce88afc78c#rd)
