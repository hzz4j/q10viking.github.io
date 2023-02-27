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

