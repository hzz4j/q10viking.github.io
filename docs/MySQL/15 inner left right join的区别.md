---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---



## 表

`Person表`

![image-20211027213211152](/images/MySQL/image-20211027213211152.png)

`Orders表`

![image-20211027213411660](/images/MySQL/image-20211027213411660.png)



## inner join（内连接）⭐

在两张表进行连接查询时，**只保留两张表中完全匹配的结果集**

```sql
SELECT p.id_p,p.FirstName, p.LastName, o.OrderNo
FROM Person p
INNER JOIN Orders o
ON p.id_p=o.id_P
ORDER BY p.id_p
```

![image-20211027213751967](/../../../../saas-yong/fullstack/Java架构师之路/Mysql/imgs/image-20211027213751967.png)

**注意**：单纯的**select * from a,b**是笛卡尔乘积。比如a表有5条数据，b表有3条数据，那么最后的结果有5*3=15条数据。

但是如果对两个表进行关联:**select * from a,b where a.id = b.id** 意思就变了，此时就等价于：**select * from a inner join b on a.id = b.id**。即就是内连接。

但是这种写法并不符合规范，可能只对某些数据库管用，如sqlserver。推荐最好不要这样写。最好写成inner join的写法。

--------



## left join(左连接)

在两张表进行连接查询时，**会返回左表所有的行，即使在右表中没有匹配的记录**。

```sql
SELECT p.id_p,p.FirstName, p.LastName, o.OrderNo
FROM Person p
LEFT JOIN Orders o
ON p.id_p=o.id_P
ORDER BY p.id_p
```

![image-20211027214033187](/images/MySQL/image-20211027214033187.png)



## right join（右连接）

在两张表进行连接查询时，会返回右表所有的行，即使在左表中没有匹配的记录。

```sql
SELECT p.id_p,p.FirstName, p.LastName, o.OrderNo
FROM Person p
RIGHT JOIN Orders o
ON p.id_p=o.id_P
ORDER BY p.id_p
```

![image-20211027214237150](/images/MySQL/image-20211027214237150.png)



## 测试数据

```sql
CREATE TABLE `Person` (
  `id_p` int NOT NULL AUTO_INCREMENT COMMENT 'person id',
  `FirstName` varchar(255) DEFAULT NULL COMMENT 'first name',
  `LastName` varchar(255) DEFAULT NULL COMMENT 'last name',
  `Address` varchar(255) DEFAULT NULL COMMENT 'address',
  `City` varchar(255) DEFAULT NULL COMMENT 'City',
  PRIMARY KEY (`id_p`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Person` (`id_p`, `FirstName`, `LastName`, `Address`, `City`) VALUES (1, 'John', 'Adams', 'Oxford Street', 'London');
INSERT INTO `Person` (`id_p`, `FirstName`, `LastName`, `Address`, `City`) VALUES (2, 'George', 'Bush', 'Fifth Avenue', 'New York');
INSERT INTO `Person` (`id_p`, `FirstName`, `LastName`, `Address`, `City`) VALUES (3, 'Thomas', 'Carter', 'Changan Street', 'Beijing');

CREATE TABLE `Orders` (
  `id_O` int NOT NULL AUTO_INCREMENT COMMENT 'order id',
  `OrderNo` varchar(255) DEFAULT NULL COMMENT '订单编号',
  `id_P` int NOT NULL COMMENT 'person id',
  PRIMARY KEY (`id_O`),
  KEY `idx_personId` (`id_P`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `Orders` (`id_O`, `OrderNo`, `id_P`) VALUES (1, '77895', 3);
INSERT INTO `Orders` (`id_O`, `OrderNo`, `id_P`) VALUES (2, '44678', 3);
INSERT INTO `Orders` (`id_O`, `OrderNo`, `id_P`) VALUES (3, '22456', 1);
INSERT INTO `Orders` (`id_O`, `OrderNo`, `id_P`) VALUES (4, '24562', 1);
INSERT INTO `Orders` (`id_O`, `OrderNo`, `id_P`) VALUES (5, '34764', 65);

```



## MySQL多表查询时有哪些连接方式

1. **内连接（INNER JOIN）：**返回同时满足连接条件的行。它通过比较连接列的值，将两个或多个表中匹配的行组合在一起。
2. **左外连接（LEFT JOIN）：**返回左表中的所有行，以及与左表匹配的右表的行。如果右表中没有匹配的行，对应的列将填充为 NULL。
3. **右外连接（RIGHT JOIN）：**返回右表中的所有行，以及与右表匹配的左表的行。如果左表中没有匹配的行，对应的列将填充为 NULL。
4. **全外连接（FULL JOIN）：**返回左右两个表中的所有行。如果某个表中没有匹配的行，对应的列将填充为 NULL。需要注意 MySQL 不支持 FULL JOIN 可以使用UNION ALL 模拟。
5. **自连接（Self JOIN）：**将单个表视为两个独立的表，使用别名来引用同一个表。这种连接适用于在同一个表中根据某些条件关联不同的行。
6. **交叉连接（CROSS JOIN）：**返回两个表的笛卡尔积，即所有可能的组合。它将第一个表的每一行与第二个表的每一行进行组合。
