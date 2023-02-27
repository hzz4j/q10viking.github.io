---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---

## 1. 全值匹配

针对联合索引，最左前缀原则，对于联合索引，使用的字段覆盖越多越好

```sql
EXPLAIN SELECT * FROM employees WHERE name= 'LiLei';
```

![image-20211026235907189](/images/MySQL/image-20211026235907189.png)

```sql
EXPLAIN SELECT * FROM employees WHERE name= 'LiLei' AND age = 22;
```

![image-20211026235954942](/images/MySQL/image-20211026235954942.png)

```sql
EXPLAIN SELECT * FROM employees WHERE name= 'LiLei' AND age = 22 AND position ='manager';
```

![image-20211027000032859](/images/MySQL/image-20211027000032859.png)

---------



## 2. 最左前缀法则

如果**要索引了多列**，要遵守最左前缀法则。指的是查询**从索引的最左前列开始并且不跳过索引中的列**。

![image-20210520101928183](/images/MySQL/image-20210520101928183.png)

```sql
-- 走了部分索引name
EXPLAIN SELECT * FROM employees WHERE name = 'Bill' and position ='manager';
-- 走了部分索引name,age
EXPLAIN SELECT * FROM employees WHERE name = 'Bill' and age = 31;
-- 没有走索引
EXPLAIN SELECT * FROM employees WHERE age = 30 AND position = 'dev';
-- 没有走索引
EXPLAIN SELECT * FROM employees WHERE position = 'manager';
```

## 3. 不在索引列上做任何操作（计算、函数、（自动or手动）类型转换），会导致索引失效而转向全表扫描

```sql
EXPLAIN SELECT * FROM employees WHERE left(name,3) = 'LiLei';
```

给hire_time增加一个普通索引：

```sql
ALTER TABLE `employees` ADD INDEX `idx_hire_time` (`hire_time`) USING BTREE ;
EXPLAIN select * from employees where date(hire_time) ='2021-10-26';
```

![image-20211027002313798](/images/MySQL/image-20211027002313798.png)

转化为日期范围查询，有可能会走索引

```sql
EXPLAIN select * from employees where hire_time >='2021-10-26 00:00:00' and hire_time <='2021-10-26 23:59:59';
```

![image-20211027002512622](/images/MySQL/image-20211027002512622.png)

还原最初索引状态

```sql
ALTER TABLE `employees` DROP INDEX `idx_hire_time`;
```





----------



## 4. 存储引擎不能使用索引中范围条件右边的列

```sql
-- position有走索引
EXPLAIN SELECT * FROM employees WHERE name= 'LiLei' AND age = 22 AND position ='manager';
-- position有走索引， 因为在age是范围查找的，对应的position可能是无需的，那么position就不能再走索引查询了
EXPLAIN SELECT * FROM employees WHERE name= 'LiLei' AND age > 22 AND position ='manager';
```

![image-20211027003259658](/images/MySQL/image-20211027003259658.png)

可以看到position没有走，而bame,age都是走的查询，78如果只是name的话是74![image-20211027003335914](/images/MySQL/image-20211027003335914.png)

--------



## 5. 尽量使用覆盖索引（只访问索引的查询（索引列包含查询列）），减少 select * 语句

> 减少回表查询

```sql
EXPLAIN SELECT name,age FROM employees WHERE name= 'LiLei' AND age = 23 AND position='manager';
```

![image-20211027012806773](/images/MySQL/image-20211027012806773.png)

```sql
EXPLAIN SELECT * FROM employees WHERE name= 'LiLei' AND age = 23 AND position ='manager';
```

![image-20211027012844507](/images/MySQL/image-20211027012844507.png)



## 6. mysql在使用不等于（！=或者<>），not in ，not exists 的时候无法使用索引会导致全表扫描

< 小于、 > 大于、 <=、>= 这些，mysql内部优化器会根据检索比例、表大小等多个因素整体评估是否使用索引

```sql
EXPLAIN SELECT * FROM employees WHERE name != 'LiLei';
```

![image-20211027013111811](/../../../../saas-yong/fullstack/Java架构师之路/Mysql/imgs/image-20211027013111811.png)



## 7. is null,is not null 一般情况下也无法使用索引

```sql
EXPLAIN SELECT * FROM employees WHERE name is null;
```

![image-20211027013234790](/../../../../saas-yong/fullstack/Java架构师之路/Mysql/imgs/image-20211027013234790.png)



## 8. like以通配符开头（'$abc...'）mysql索引失效会变成全表扫描操作

```sql
EXPLAIN SELECT * FROM employees WHERE name like '%Lei';
```

![image-20211027013407542](/../../../../saas-yong/fullstack/Java架构师之路/Mysql/imgs/image-20211027013407542.png)

```sql
-- 走了索引
EXPLAIN SELECT * FROM employees WHERE name like 'Lei%';
```

![image-20211027013512040](/../../../../saas-yong/fullstack/Java架构师之路/Mysql/imgs/image-20211027013512040.png)

**问题：解决like'%字符串%'索引不被使用的方法？**

1. 使用覆盖索引，查询字段必须是建立覆盖索引字段

   ```sql
   EXPLAIN SELECT name,age,position FROM employees WHERE name like '%Lei%';
   ```

   ![image-20211027013754413](/../../../../saas-yong/fullstack/Java架构师之路/Mysql/imgs/image-20211027013754413.png)

2. 如果不能使用覆盖索引则可能需要借助搜索引擎

## 9. 字符串不加单引号索引失效

```sql
EXPLAIN SELECT * FROM employees WHERE name = '1000';
```

![image-20211027013857329](/../../../../saas-yong/fullstack/Java架构师之路/Mysql/imgs/image-20211027013857329.png)

```sql
EXPLAIN SELECT * FROM employees WHERE name = 1000;
```

![image-20211027013936150](/../../../../saas-yong/fullstack/Java架构师之路/Mysql/imgs/image-20211027013936150.png)



## 10 少用or或in，用它查询时，mysql不一定使用索引，mysql内部优化器会根据检索比例、表大小等多个因素整体评估是否使用索引，详见范围查询优化

```sql
EXPLAIN SELECT * FROM employees WHERE name = 'LiLei' or name = 'HanMeimei';
```

![image-20211027014057892](/../../../../saas-yong/fullstack/Java架构师之路/Mysql/imgs/image-20211027014057892.png)



## 11 范围查询优化

mysql内部优化器会根据检索比例、表大小等多个因素整体评估是否使用索引

```sql
-- 给年龄添加单值索引
ALTER TABLE `employees` ADD INDEX `idx_age` (`age`) USING BTREE ;
explain select * from employees where age >=1 and age <=2000000;
-- 还原最初索引状态
ALTER TABLE `employees` DROP INDEX `idx_age`;
```



## ⭐⭐索引使用总结

![image-20211027014439280](/../../../../saas-yong/fullstack/Java架构师之路/Mysql/imgs/image-20211027014439280.png)



## 测试数据

```sql
CREATE TABLE `employees` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(24) NOT NULL DEFAULT '' COMMENT '姓名',
 `age` int(11) NOT NULL DEFAULT '0' COMMENT '年龄',
 `position` varchar(20) NOT NULL DEFAULT '' COMMENT '职位',
 `hire_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入职时间',
 PRIMARY KEY (`id`),
 KEY `idx_name_age_position` (`name`,`age`,`position`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='员工记录表';

INSERT INTO employees(name,age,position,hire_time) VALUES('LiLei',22,'manager',NOW());
INSERT INTO employees(name,age,position,hire_time) VALUES('HanMeimei',23,'dev',NOW());
INSERT INTO employees(name,age,position,hire_time) VALUES('Lucy',23,'dev',NOW());
```

