---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---

## Navicat添加用户

![image-20211025031428586](/images/MySQL/image-20211025031428586.png)

![image-20211025031717504](/images/MySQL/image-20211025031717504.png)

对应的sql

```sql
CREATE USER `hzz`@`%` IDENTIFIED WITH mysql_native_password BY 'Root.123456';

GRANT Alter, Alter Routine, Create, Create Routine, Create Temporary Tables, Create View, Delete, Drop, Event, Execute, Grant Option, Index, Insert, Lock Tables, References, Select, Show View, Trigger, Update ON `syncdemo`.* TO `hzz`@`%`;
```



## 生成百万级数据

[使用Navicat创建存储过程（顺带插入百万级数据量)](https://www.cnblogs.com/qq1445496485/p/14474266.html)