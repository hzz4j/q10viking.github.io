---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /mybatis/
typora-root-url: ..\.vuepress\public
---



## 环境搭建

IDEA创建 spring项目

1. 引入spring Data JDBC的原因是为了方便去执行sql文件

<img src="/images/mybatis/image-20210823214003003.png" alt="image-20210823214003003" style="zoom:67%;" />

2. 引入Druid依赖

   ```xml
           <dependency>
               <groupId>com.alibaba</groupId>
               <artifactId>druid</artifactId>
               <version>1.2.3</version>
           </dependency>
   ```



### 不太推荐：第一种配置DruidDataSource的Bean

```java
@Configuration
public class DruidConfig {

    @Bean
    @ConfigurationProperties("spring.datasource")  // 会根据DruidDataSource的setXXX方法将配置文件的属性注入到bean中
    public DataSource druidDataSource(){
        return new DruidDataSource();
    }
}
```

```java
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
    username: root
    password: root
    url: jdbc:mysql://localhost:3306/springboot_mybatis?characterEncoding=utf8&useSSL=false&serverTimezone=UTC
    schema: classpath:sql/schema.sql   # 项目启动运行的sql脚本
    initialization-mode: always  # 每次项目启动都会运行

    #druid数据源其他配置

    initialSize: 5  # 数据源初始化时建立的连接数
    minIdle: 5
    maxActive: 21
    maxWait: 5
    timeBetweenEvictionRunsMillis: 60000
    minEvictableIdleTimeMillis: 300000
    validationQuery: SELECT 1 FROM DUAL
    testWhileIdle: true
    testOnBorrow: false
    testOnReturn: false
    poolPreparedStatements: true
    filters: stat,wall
    maxPoolPreparedStatementPerConnectionSize: 20
    useGlobalDataSourceStat: true
    connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=500

```



### 推荐2：使用JDBC中的数据源

```java
    @Bean
    @ConfigurationProperties("spring.datasource.druid") // 单独指定了druid
    public DataSource druidDataSource(DataSourceProperties dataSourceProperties){
        return dataSourceProperties.initializeDataSourceBuilder().build();
    }
```

```java
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
    username: root
    password: root
    url: jdbc:mysql://localhost:3306/springboot_mybatis?characterEncoding=utf8&useSSL=false&serverTimezone=UTC
    schema: classpath:sql/schema.sql   # 项目启动运行的sql脚本
    initialization-mode: always  # 每次项目启动都会运行

    #druid数据源其他配置
    druid:
      initialSize: 5  # 数据源初始化时建立的连接数
      minIdle: 5
      maxActive: 21
      maxWait: 5
      timeBetweenEvictionRunsMillis: 60000
      minEvictableIdleTimeMillis: 300000
      validationQuery: SELECT 1 FROM DUAL
      testWhileIdle: true
      testOnBorrow: false
      testOnReturn: false
      poolPreparedStatements: true
      filters: stat,wall
      maxPoolPreparedStatementPerConnectionSize: 20
      useGlobalDataSourceStat: true
      connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=500

```





## 推荐：3种方法场景启动器配置方法❤️

::: tip

[Source Code](https://github.com/Q10Viking/learncode/tree/main/mybatis/_09_springboot_druid)

:::

以上两种方法都是基于直接依赖druid的方式，现在改为直接引入Druid的场景启动器

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.1.21</version>
</dependency>
```

> springboot 2.7.2的配置

```yml
spring:
  sql:
    init:
      schema-locations: classpath:sql/schema.sql
      mode: always
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
    username: root
    password: Root.123456
    url: jdbc:mysql://192.168.187.135:3306/springboot_mybatis?characterEncoding=utf8&useSSL=false&serverTimezone=UTC
    #druid数据源其他配置
    druid:   # 需要添加
      initialSize: 5  # 数据源初始化时建立的连接数
      minIdle: 5
      maxActive: 21
      maxWait: 5
      timeBetweenEvictionRunsMillis: 60000
      minEvictableIdleTimeMillis: 300000
      validationQuery: SELECT 1 FROM DUAL
      testWhileIdle: true
      testOnBorrow: false
      testOnReturn: false
      poolPreparedStatements: true
      filters: stat,wall
      maxPoolPreparedStatementPerConnectionSize: 20
      useGlobalDataSourceStat: true
      connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=500
      stat-view-servlet:
        enabled: true
        login-password: 123456
        login-username: admin
      web-stat-filter:
        enabled: true
```



### 自动配置的原理的分析

https://www.processon.com/view/link/6123f06f7d9c0856876e123c

![img](/images/mybatis/6123d56e0e3e743b327d3700.png)

分析了源码之后我们就知道怎么配置了,需要添加druid的配置

```yml
spring:
  sql:
    init:
      schema-locations: classpath:sql/schema.sql
      mode: always
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
    username: root
    password: Root.123456
    url: jdbc:mysql://192.168.187.135:3306/springboot_mybatis?characterEncoding=utf8&useSSL=false&serverTimezone=UTC
    #druid数据源其他配置
    druid:   # 需要添加
      initialSize: 5  # 数据源初始化时建立的连接数
      minIdle: 5
      maxActive: 21
      maxWait: 5
      timeBetweenEvictionRunsMillis: 60000
      minEvictableIdleTimeMillis: 300000
      validationQuery: SELECT 1 FROM DUAL
      testWhileIdle: true
      testOnBorrow: false
      testOnReturn: false
      poolPreparedStatements: true
      filters: stat,wall
      maxPoolPreparedStatementPerConnectionSize: 20
      useGlobalDataSourceStat: true
      connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=500
      stat-view-servlet:
        enabled: true
        login-password: 123456
        login-username: admin
      web-stat-filter:
        enabled: true
```



### 访问druid控制台

```
http://localhost:8080/druid/
用户名密码就是配置的信息
```



## 配置详解

![img](/images/mybatis/image-4.png)

