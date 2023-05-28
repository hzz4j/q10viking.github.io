---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---







## 背景

::: tip

springdata data jpa的优点：通过实体映射数据库，并且有DDD聚合持久化的功能。

:::

本次试验，通过实体映射的优势，我们采用了两个不同的关系型数据库，一个是H2一个是Mysql.





### ddl-auto

```yaml
spring:
	jpa:
		show-sql: true
		hibernate:
			ddl-auto: create
```



- create：
  每次加载hibernate时都会删除上一次的生成的表，然后根据你的model类再重新来生成新表，哪怕两次没有任何改变也要这样执行，这就是导致数据库表数据丢失的一个重要原因。

- update

  最常用的属性，第一次加载hibernate时根据model类会自动建立起表的结构（前提是先建立好数据库），以后加载hibernate时根据 model类自动更新表结构，即使表结构改变了但表中的行仍然存在不会删除以前的行。要注意的是当部署到服务器后，表结构是不会被马上建立起来的，是要等 应用第一次运行起来后才会。



## 参考

[Spring Data JPA - Reference Documentation](https://docs.spring.io/spring-data/jpa/docs/2.7.12/reference/html/)

[Spring Boot JPA - Quick Guide (tutorialspoint.com)](https://www.tutorialspoint.com/spring_boot_jpa/spring_boot_jpa_quick_guide.htm)

[Domain-Driven Design Series' Articles - DEV Community](https://dev.to/peholmst/series/12780)

[Different Ways to Store JPA Entity Objects into a Database (javaguides.net)](https://www.javaguides.net/2018/12/different-ways-to-store-jpa-entity-objects-into-database.html)

❤️[JPA / Hibernate ElementCollection Example with Spring Boot | CalliCoder](https://www.callicoder.com/hibernate-spring-boot-jpa-element-collection-demo/)

### 日志

[Show Hibernate SQL with Parameter Values in Spring Boot (howtodoinjava.com)](https://howtodoinjava.com/spring-boot/spring-data-jpa-sql-logging/)

[Show Hibernate/JPA SQL Statements in Spring Boot | Baeldung](
