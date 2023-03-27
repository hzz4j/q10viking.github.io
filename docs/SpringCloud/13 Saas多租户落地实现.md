---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /SpringCloud/
typora-root-url: ..\.vuepress\public
---

### 落地

AbstractRoutingDataSource用它来提供一个数据源。

当租户请求时需要连接数据库，我们在数据库中有一张表记录着租户连接的库的信息，当用户连接时请求该数据库获得连接信息，然后创建一个DataSource.

新建租户的时候，我们把提供一个接口，这个接口做的内容就是创建一个租户，存储到租户表中，并创建一个数据库，然后初始化里面的表。并将连接信息存放到这个租户表中。



## 参考

[基于Spring Boot实现多租户SaaS平台示例 (ramostear.com)](https://www.ramostear.com/2019/09/springbootsaas.html)

[SpringBoot配置动态数据源](https://www.jianshu.com/p/3a713ed038de)

[创建数据库实例 - JDBC 指南 - UDN开源文档 (yonyoucloud.com)](https://doc.yonyoucloud.com/doc/wiki/project/jdbc/create-database.html)

[springboot-maven项目+jpa 运行过程中执行resources下sql脚本文件-ClassPathResource和ScriptUtils.executeSqlScript的使用](https://blog.csdn.net/m0_37482190/article/details/127990972)