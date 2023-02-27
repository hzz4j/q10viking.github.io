---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---

## Explain工具介绍

> 通过explain来进行sql优化

使用EXPLAIN关键字可以模拟优化器执行SQL语句，分析你的查询语句或是结构的性能瓶颈,**分析SQL执行计划**

在 select 语句之前增加 explain 关键字，MySQL 会在查询上设置一个标记，执行查询会返回执行计划的信息，而不是
执行这条SQL

注意：如果 from 中包含子查询，仍会执行该子查询，将结果放入临时表中



## explain使用

通过 show warnings 命令可以得到优化后的查询语句，从而看出优化器优化了什么

```sql
explain select * from film where id = 2;
show warnings;
```

![image-20211026210700278](/images/MySQL/image-20211026210442469.png)

show warings;显示的sql优化,如果复制出来，自己执行，可能并不成功，这是mysql内部使用的

```sql
/* select#1 */ select '2' AS `id`,'film2' AS `name` from `learn_mysql`.`film` where true
```



### explain列解释

```sql
-- #关闭mysql5.7新特性对衍生表的合并优化
set session optimizer_switch='derived_merge=off';
explain select (select 1 from actor where id = 1) from (select * from film where
id = 1) der;
```

![image-20211026211507009](/images/MySQL/image-20211026211507009.png)

#### id列

id列的编号是 select 的序列号，有几个 select 就有几个id，并且id的顺序是按 select 出现的顺序增长的。id列越大执行优先级越高，id相同则从上往下执行，id为NULL最后执行。



#### select_type列

select_type 表示对应行是简单还是复杂的查询。

1. simple：简单查询。查询不包含子查询和union
2. primary：复杂查询中最外层的 select
3. subquery：包含在 select 中的子查询（不在 from 子句中）
4. derived：包含在 from 子句中的子查询。MySQL会将结果存放在一个**临时表中，也称为派生表**（derived的英文含
   义）

#### table列

这一列表示 explain 的一行正在访问哪个表。当 from 子句中有子查询时，table列是 < derivenN > 格式，表示当前查询依赖 id=N 的查询，于是先执行 id=N 的查询。

#### type列⭐

这一列表示**关联类型或访问类型**，即MySQL决定如何查找表中的行，查找数据行记录的大概范围。

依次从最优到最差分别为：**system > const > eq_ref > ref > range > index > ALL**

**一般来说，得保证查询达到range级别，最好达到ref**

**⭐NULL**：mysql能够在**优化阶段分解查询语句，在执行阶段用不着再访问表或索引**。例如：在索引列中选取最小值，可以单独查找索引来完成，不需要在执行时访问表

```sql
explain select min(id) from film;
```

![image-20211026213302139](/images/MySQL/image-20211026213302139.png)

---------

1. **const, system**：mysql能对查询的某部分进行优化并将其转化成一个常量（可以看show warnings 的结果）。用于
   primary key 或 unique key 的所有列与常数比较时，表最多有一个匹配行，读取1次，速度比较快。system是
   const的特例，表里只有一条元组匹配时为system;

   1. ```sql
      explain select * from (select * from film where id = 1) tmp;
      ```

   2. ![image-20211026214359568](/images/MySQL/image-20211026214359568.png)

   3. ```sql
      show warnings;
      -- 像查常量一样
      -- select '1' AS `id`,'film1' AS `name` from dual;
      ```

2. **eq_ref：**primary key 或 unique key 索引的所有部分被连接使用 ，最多只会返回一条符合条件的记录。这可能是在
   const 之外最好的联接类型了，简单的 select 查询不会出现这种 type。

   1. ```sql
      explain select * from film_actor left join film on film_actor.film_id = film.id;
      ```

   2. ![image-20211026215622343](/images/MySQL/image-20211026215622343.png)

3. **ref**：相比 eq_ref，不使用唯一索引，而是使用普通索引或者联合索引的部分前缀，索引要和某个值相比较，可能会
   找到多个符合条件的行。

   1. 简单 select 查询，name是普通索引（非唯一索引）

      1. ```sql
         explain select * from film where name = 'film1';
         ```

      2. ![image-20211026220114478](/images/MySQL/image-20211026220114478.png)

   2. 关联表查询，idx_film_actor_id是film_id和actor_id的联合索引，这里使用到了film_actor的左边前缀film_id部分

      1. ```sql
         explain select film_id from film left join film_actor on film.id = film_actor.film_id;
         ```

      2. ![image-20211026220525028](/images/MySQL/image-20211026220525028.png)

4. **range**：范围扫描通常出现在 in(), between ,> ,<, >= 等操作中。使用一个索引来检索给定范围的行。

   1. ```sql
      explain select * from actor where id > 1;
      ```

   2. ![image-20211026220936080](/images/MySQL/image-20211026220936080.png)

5. **index**：扫描全索引就能拿到结果，一般是扫描某个二级索引，这种扫描不会从索引树根节点开始快速查找，而是直接
   对二级索引的叶子节点遍历和扫描，速度还是比较慢的，这种查询一般为使用覆盖索引，**二级索引一般比较小，所以这**
   **种通常比ALL快一些**。（所查找的信息能够在二级所用中直接获得）。

   1. ```sql
      explain select * from film;
      ```

   2. ![image-20211026224238367](/images/MySQL/image-20211026224238367.png)

6. **ALL**:即全表扫描，扫描你的聚簇索引的所有叶子节点。通常情况下这需要增加索引来进行优化了。

   1. ```sql
      explain select * from actor;
      ```

   2. ![image-20211026225149432](/images/MySQL/image-20211026225149432.png)

#### possible_keys列

这一列显示查询可能使用哪些索引来查找。

explain 时可能出现 possible_keys 有列，而 key 显示 NULL 的情况，**这种情况是因为表中数据不多，mysql认为索引**
**对此查询帮助不大，选择了全表查询。**

如果该列是NULL，则没有相关的索引。在这种情况下，可以通过检查 where 子句看是否可以创造一个适当的索引来提
高查询性能，然后用 explain 查看效果。

#### key列

这一列显示mysql实际采用哪个索引来优化对该表的访问。

如果没有使用索引，则该列是 NULL。如果想强制mysql使用或忽视possible_keys列中的索引，在查询中使用 force
index、ignore index。

#### key_len列

这一列显示了mysql在索引里使用的字节数，通过这个值可以算出具体使用了索引中的哪些列。
举例来说，film_actor的联合索引 idx_film_actor_id 由 film_id 和 actor_id 两个int列组成，并且每个int是4字节。通
过结果中的key_len=4可推断出查询使用了第一个列：film_id列来执行索引查找。

```sql
explain select * from film_actor where film_id = 2;
```

![image-20211026230148076](/images/MySQL/image-20211026230148076.png)

key_len计算规则如下：

1. 字符串，char(n)和varchar(n)，5.0.3以后版本中，n均代表字符数，而不是字节数，**如果是utf-8，一个数字**
   **或字母占1个字节，一个汉字占3个字节**
   1. char(n)：如果存汉字长度就是 3n 字节
   2. varchar(n)：如果存汉字则长度是 3n + 2 字节，加的2字节用来存储字符串长度，**因为**
      **varchar是变长字符串**
2. 数值类型
   1. tinyint：1字节
   2. smallint：2字节
   3. int：4字节
   4. bigint：8字节
3. 时间类型　
   1. date：3字节
   2. timestamp：4字节
   3. datetime：8字节
4. 如果字段允许为 NULL，需要1字节记录是否为 NULL

索引最大长度是768字节，当字符串过长时，mysql会做一个类似左前缀索引的处理，将前半部分的字符提取出来做索
引。

#### ref列

这一列显示了在key列记录的索引中，表查找值所用到的列或常量，常见的有：const（常量），字段名（例：film.id）

```sql
explain select * from film_actor left join film on film_actor.film_id = film.id;
```

![image-20211026230717463](/images/MySQL/image-20211026230717463.png)

#### row列

这一列是mysql估计要读取并检测的行数，注意这个不是结果集里的行数。

#### Extra列

这一列展示的是额外信息。常见的重要值如下：

1. **Using index**：使用覆盖索引

**覆盖索引**定义：mysql执行计划explain结果里的key有使用索引，如果select后面查询的字段都可以从这个索引的树中获取，这种情况一般可以说是用到了覆盖索引，extra里一般都有using index；覆盖索引一般针对的是辅助索引，整个查询结果只通过辅助索引就能拿到结果，不需要通过辅助索引树找到主键，再通过主键去主键索引树里获取其它字段值。**不需要回表查询**

```sql
explain select film_id from film_actor where film_id = 1;
```

![image-20211026232620822](/images/MySQL/image-20211026232620822.png)



2. **Using where**：使用 where 语句来处理结果，并且查询的列未被索引覆盖

   ```sql
   explain select * from actor where name = 'a';
   ```

![image-20211026232854013](/images/MySQL/image-20211026232854013.png)

3. **Using index condition**：查询的列不完全被索引覆盖，where条件中是一个前导列的范围

```sql
explain select * from film_actor where film_id > 1;
```

![image-20211026233108261](/images/MySQL/image-20211026233108261.png)

4. **Using temporary**：mysql需要创建一张临时表来处理查询。出现这种情况一般是要进行优化的，首先是想到用索
   引来优化。

   1. actor.name没有索引，此时创建了张临时表来distinct

      ```sql
      explain select distinct name from actor;
      ```

      ![image-20211026233527869](/images/MySQL/image-20211026233527869.png)

   2. film.name建立了idx_name索引，此时查询时extra是using index,没有用临时表

      ```sql
      explain select distinct name from film;
      ```

      ![image-20211026233634775](/images/MySQL/image-20211026233634775.png)

5. **Using filesort**：将用外部排序而不是索引排序，数据较小时从内存排序，否则需要在磁盘完成排序。这种情况下一
   般也是要考虑使用索引来优化的。

   1. actor.name未创建索引，会浏览actor整个表，保存排序关键字name和对应的id，然后排序name并检索行记录

      1. ```sql
         explain select * from actor order by name;
         ```

      2. ![image-20211026234206051](/images/MySQL/image-20211026234206051.png)

   2. film.name建立了idx_name索引,此时查询时extra是using index

      1. ```sql
         explain select * from film order by name;
         ```

      2. ![image-20211026234333806](/images/MySQL/image-20211026234333806.png)

6. **Select tables optimized away**：使用某些聚合函数（比如 max、min）来访问存在索引的某个字段是

```sql
explain select min(id) from film;
```

![image-20211026234431660](/images/MySQL/image-20211026234431660.png)



----------

## 测试数据

```sql
DROP TABLE IF EXISTS `actor`;
CREATE TABLE `actor` (
    `id` int(11) NOT NULL,
    `name` varchar(45) DEFAULT NULL,
    `update_time` datetime DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `actor` (`id`, `name`, `update_time`) VALUES (1,'a','2021-10-13 20:50:02'), (2,'b','2021-10-13 20:50:02'), (3,'c','2021-10-13 20:50:02');

DROP TABLE IF EXISTS `film`;
CREATE TABLE `film` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(10) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `film` (`id`, `name`) VALUES (3,'film0'),(1,'film1'),(2,'film2');

DROP TABLE IF EXISTS `film_actor`;
CREATE TABLE `film_actor` (
     `id` int(11) NOT NULL,
     `film_id` int(11) NOT NULL,
     `actor_id` int(11) NOT NULL,
     `remark` varchar(255) DEFAULT NULL,
     PRIMARY KEY (`id`),
     KEY `idx_film_actor_id` (`film_id`,`actor_id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `film_actor` (`id`, `film_id`, `actor_id`) VALUES (1,1,1),(2,1,2),(3,2,1);
```
