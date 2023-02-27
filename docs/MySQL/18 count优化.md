---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---

> 【强制】不要使用 count(列名)或 count(常量)来替代 count(\*)，count(\*)是 SQL92 定义的标 准统计行数的语法，跟数据库无关，跟 NULL 和非 NULL 无关。 说明：**count(*)会统计值为 NULL 的行，而 count(列名)不会统计此列为 NULL 值的行**。

```sql
 EXPLAIN select count(1) from employees;
 EXPLAIN select count(id) from employees;
 EXPLAIN select count(name) from employees;
 EXPLAIN select count(*) from employees;      
```

**注意：以上4条sql只有根据某个字段count不会统计字段为null值的数据行**

**四个sql的执行计划一样，说明这四个sql执行效率应该差不多**

![image-20211028201409693](/../../../../saas-yong/fullstack/Java架构师之路/Mysql/imgs/image-20211028201409693.png)

**字段有索引：count(\*)≈count(1)>count(字段)>count(主键 id)    //字段有索引，count(字段)统计走二级索引，二级索引存储数据比主键索引少，所以count(字段)>count(主键 id)** 

**字段无索引：count(\*)≈count(1)>count(主键 id)>count(字段)    //字段没有索引count(字段)统计走不了索引，count(主键 id)还可以走主键索引，所以count(主键 id)>count(字段)**

⭐⭐⭐

1. count(1)跟count(字段)执行过程类似，不过count(1)不需要取出字段统计，就用常量1做统计，count(字段)还需要取出字段，所以理论上count(1)比count(字段)会快一点。

2. count(\*) 是例外，mysql并不会把全部字段取出来，而是**专门做了优化，不取值，按行累加**，效率很高，所以**不需要用count(列名)或count(常量)来替代 count(*)。**

3. 为什么对于count(id)，mysql最终选择辅助索引而不是主键聚集索引？因为**二级索引相对主键索引存储数据更少，检索性能应该更高**，mysql内部做了点优化(应该是在5.7版本才优化)。

