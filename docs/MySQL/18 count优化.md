---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---





## count(*) 的实现方式

在不同的 MySQL 引擎中，count(*) 有不同的实现方式。

- MyISAM 引擎把一个表的总行数存在了磁盘上，因此执行 count(*) 的时候会直接返回这个数，效率很高；
- 而 InnoDB 引擎就麻烦了，它执行 count(*) 的时候，需要把数据一行一行地从引擎里面读出来，然后累积计数。

这里需要注意的是，在这里讨论的是没有过滤条件的 count(*)，如果加了 where 条件的话，MyISAM 表也是不能返回得这么快的。



> 那**为什么 InnoDB 不跟 MyISAM 一样，也把数字存起来呢？**

这是因为即使是在同一个时刻的多个查询，由于多版本并发控制（MVCC）的原因，InnoDB 表“应该返回多少行”也是不确定的。这里，我用一个算 count(*) 的例子来为你解释一下。

假设表 t 中现在有 10000 条记录，我们设计了三个用户并行的会话。

- 会话 A 先启动事务并查询一次表的总行数；
- 会话 B 启动事务，插入一行后记录后，查询表的总行数；
- 会话 C 先启动一个单独的语句，插入一行记录后，查询表的总行数。

![image-20230509221218260](/images/MySQL/image-20230509221218260.png)



## count(*)很慢解决方案

### 用缓存系统保存计数

可以用一个 Redis 服务来保存这个表的总行数。这个表每被插入一行 Redis 计数就加 1，每被删除一行 Redis 计数就减 1。这种方式下，读和更新操作都很快。

但是缓存系统可能会丢失更新。而且会有数据不一致性的问题

1. 一种是，查到的 100 行结果里面有最新插入记录，而 Redis 的计数里还没加 1；
2. 另一种是，查到的 100 行结果里没有最新插入的记录，而 Redis 的计数里已经加了 1

![image-20230509221425761](/images/MySQL/image-20230509221425761.png)

### 在数据库保存计数❤️

> **把这个计数直接放到数据库里单独的一张计数表 C 中**.通过事务的一致性来保证

![image-20230509221538424](/images/MySQL/image-20230509221538424.png)



## 不同count的用法

在 select count(?) from t 这样的查询语句里面，count(*)、count(主键 id)、count(字段) 和 count(1) 等不同用法的性能


> 阿里规范：【强制】不要使用 count(列名)或 count(常量)来替代 count(\*)，count(\*)是 SQL92 定义的标 准统计行数的语法，跟数据库无关，跟 NULL 和非 NULL 无关。 说明：**count(*)会统计值为 NULL 的行，而 count(列名)不会统计此列为 NULL 值的行**。

```sql
 EXPLAIN select count(1) from employees;
 EXPLAIN select count(id) from employees;
 EXPLAIN select count(name) from employees;
 EXPLAIN select count(*) from employees;      
```

**注意：以上4条sql只有根据某个字段count不会统计字段为null值的数据行**

**四个sql的执行计划一样，说明这四个sql执行效率应该差不多**

![image-20211028201409693](/images/MySQL/image-20211028201409693.png)

**字段有索引：count(\*)≈count(1)>count(字段)>count(主键 id)    //字段有索引，count(字段)统计走二级索引，二级索引存储数据比主键索引少，所以count(字段)>count(主键 id)** 

**字段无索引：count(\*)≈count(1)>count(主键 id)>count(字段)    //字段没有索引count(字段)统计走不了索引，count(主键 id)还可以走主键索引，所以count(主键 id)>count(字段)**

⭐⭐⭐

1. count(1)跟count(字段)执行过程类似，不过count(1)不需要取出字段统计，就用常量1做统计，count(字段)还需要取出字段，所以理论上count(1)比count(字段)会快一点。

2. count(\*) 是例外，mysql并不会把全部字段取出来，而是**专门做了优化，不取值，按行累加**，效率很高，所以**不需要用count(列名)或count(常量)来替代 count(*)。**

3. 为什么对于count(id)，mysql最终选择辅助索引而不是主键聚集索引？因为**二级索引相对主键索引存储数据更少，检索性能应该更高**，mysql内部做了点优化(应该是在5.7版本才优化)。

