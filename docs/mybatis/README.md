---
sidebarDepth: 3
prev:
  text: Back To 目录
  link: /topicNav/
typora-root-url: ..\.vuepress\public
---



::: tip

MyBatis 是一款优秀的持久层框架/半自动的ORM，它支持自定义 SQL、存储过程以及高级映射

[mybatis – MyBatis 3 | 简介](https://mybatis.org/mybatis-3/zh/index.html)

:::

## 持久层的演变过程

java 原生的JDBC

![](/images/mybatis/image-20210803174446820.png)



2. DBUtils工具
3. Hibernate
4. JDBCTemplate 内嵌在spring框架中
5. Mybatis

## MyBatis介绍

应用数据是在内存中的，当断电之后，为了保证数据不丢失，需要将数据进行持久化。而MyBatis是一款很优秀的持久层框架。

MyBatis免除了几乎所有的JDBC代码以及设置参数和获取结果集的工作。

![image-20220808024340463](/images/mybatis/image-20220808024340463.png)

### **mybatis对传统的JDBC的解决方案**

1. 数据库连接创建、释放频繁造成系统资源浪费从而影响系统性能，如果使用数据库连接池可解决此问题。

   解决：在SqlMapConfig.xml中配置数据连接池，使用连接池管理数据库链接

2. Sql语句写在代码中造成代码不易维护，实际应用sql变化的可能较大，sql变动需要改变java代码

   解决：将Sql语句配置在XXXXmapper.xml文件中与java代码分离。

3. 向sql语句传参数麻烦，因为sql语句的where条件不一定，可能多也可能少，占位符需要和参数一一对应

   解决：Mybatis自动将java对象映射至sql语句，通过statement中的parameterType定义输入参数的类型

4. 对结果集解析麻烦，sql变化导致解析代码变化，且解析前需要遍历，如果能将数据库记录封装成pojo对象解析比较方便

   解决：Mybatis自动将sql执行结果映射至java对象，通过statement中的resultType定义输出结果的类型。



## 开发工具

### MybatisX

ctrl+alt 鼠标点击，跳转到mapper中定义的sql

![image-20210804122057089](/images/mybatis/image-20210804122057089.png)



## 面试

[有道云笔记 (youdao.com)](https://note.youdao.com/ynoteshare/index.html?id=5d41fd41d970f1af9185ea2ec0647b64&type=notebook&_time=1659842562165#/wcp1593675640527261)







