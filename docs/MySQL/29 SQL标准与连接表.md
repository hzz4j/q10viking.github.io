---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---



::: tip

主要关注在mysql中能够执行的语句

:::



## SQL标准

SQL 有两个主要的标准，分别是 SQL92 和 SQL99。92 和 99 代表了标准提出的时间，SQL92 就是 92 年提出的标准规范。当然除了 SQL92 和 SQL99 以外，还存在 SQL-86、SQL-89、SQL:2003、SQL:2008、SQL:2011 和 SQL:2016 等其他的标准

- 实际上最重要的 SQL 标准就是 SQL92 和 SQL99。一般来说 SQL92 的形式更简单，但是写的 SQL 语句会比较长，可读性较差。
- 而 SQL99 相比于 SQL92 来说，语法更加复杂，但可读性更强。

![image-20230510205723057](/images/MySQL/image-20230510205723057.png)

> 为了方便对比，建立三张表

- player表,为球员表，一共有 37 个球员

![image-20230510210601049](/images/MySQL/image-20230510210601049.png)

- team表,球队表，一共有 3 支球队

  ![image-20230510210925627](/images/MySQL/image-20230510210925627.png)

- 身高级别表 height_grades

  ![image-20230510211339268](/images/MySQL/image-20230510211339268.png)

---------





## 笛卡尔积(交叉连接)

> 笛卡尔积也称为交叉连接，英文是 CROSS JOIN，它的作用就是可以把任意表进行连接，即使这两张表不相关。但我们通常进行连接还是需要筛选的，因此你需要在连接后面加上 WHERE 子句，也就是作为过滤条件对连接数据进行筛选。



### SQL92

笛卡尔乘积是一个数学运算。假设我有两个集合 X 和 Y，那么 X 和 Y 的笛卡尔积就是 X 和 Y 的所有可能组合，也就是第一个对象来自于 X，第二个对象来自于 Y 的所有可能

```sql
mysql>  SELECT * FROM player, team;
+-----------+---------+------------------------------------+--------+---------+-----------------------+
| player_id | team_id | player_name                        | height | team_id | team_name             |
+-----------+---------+------------------------------------+--------+---------+-----------------------+
|     10001 |    1001 | 韦恩-艾灵顿                        |   1.93 |    1003 | 亚特兰大老鹰          |
|     10001 |    1001 | 韦恩-艾灵顿                        |   1.93 |    1002 | 印第安纳步行者        |
|     10001 |    1001 | 韦恩-艾灵顿                        |   1.93 |    1001 | 底特律活塞            |
|     10002 |    1001 | 雷吉-杰克逊                        |   1.91 |    1003 | 亚特兰大老鹰          |
|     10002 |    1001 | 雷吉-杰克逊                        |   1.91 |    1002 | 印第安纳步行者        |
|     10002 |    1001 | 雷吉-杰克逊                        |   1.91 |    1001 | 底特律活塞            |
...
|     10036 |    1002 | 阿利兹-约翰逊                      |   2.06 |    1003 | 亚特兰大老鹰          |
|     10036 |    1002 | 阿利兹-约翰逊                      |   2.06 |    1002 | 印第安纳步行者        |
|     10036 |    1002 | 阿利兹-约翰逊                      |   2.06 |    1001 | 底特律活塞            |
|     10037 |    1002 | 伊凯·阿尼博古                      |   2.08 |    1003 | 亚特兰大老鹰          |
|     10037 |    1002 | 伊凯·阿尼博古                      |   2.08 |    1002 | 印第安纳步行者        |
|     10037 |    1002 | 伊凯·阿尼博古                      |   2.08 |    1001 | 底特律活塞            |
+-----------+---------+------------------------------------+--------+---------+-----------------------+
```

运行结果（一共 37*3=111 条记录）：

```sql
mysql> select count(*) from player,team;
+----------+
| count(*) |
+----------+
|      111 |
+----------+
```



### SQL99（cross join）

```sql
mysql>  SELECT * FROM player CROSS JOIN team;
+-----------+---------+------------------------------------+--------+---------+-----------------------+
| player_id | team_id | player_name                        | height | team_id | team_name             |
+-----------+---------+------------------------------------+--------+---------+-----------------------+
|     10001 |    1001 | 韦恩-艾灵顿                        |   1.93 |    1003 | 亚特兰大老鹰          |
|     10001 |    1001 | 韦恩-艾灵顿                        |   1.93 |    1002 | 印第安纳步行者        |
|     10001 |    1001 | 韦恩-艾灵顿                        |   1.93 |    1001 | 底特律活塞            |
|     10002 |    1001 | 雷吉-杰克逊                        |   1.91 |    1003 | 亚特兰大老鹰          |
|     10002 |    1001 | 雷吉-杰克逊                        |   1.91 |    1002 | 印第安纳步行者        |
|     10002 |    1001 | 雷吉-杰克逊                        |   1.91 |    1001 | 底特律活塞            |
...
|     10036 |    1002 | 阿利兹-约翰逊                      |   2.06 |    1003 | 亚特兰大老鹰          |
|     10036 |    1002 | 阿利兹-约翰逊                      |   2.06 |    1002 | 印第安纳步行者        |
|     10036 |    1002 | 阿利兹-约翰逊                      |   2.06 |    1001 | 底特律活塞            |
|     10037 |    1002 | 伊凯·阿尼博古                      |   2.08 |    1003 | 亚特兰大老鹰          |
|     10037 |    1002 | 伊凯·阿尼博古                      |   2.08 |    1002 | 印第安纳步行者        |
|     10037 |    1002 | 伊凯·阿尼博古                      |   2.08 |    1001 | 底特律活塞            |
+-----------+---------+------------------------------------+--------+---------+-----------------------+
```

如果多张表进行交叉连接，比如表 t1，表 t2，表 t3 进行交叉连接，可以写成下面这样

```sql
SELECT * FROM t1 CROSS JOIN t2 CROSS JOIN t3;
```



## 等值连接👍



### SQL92

❤️两张表的等值连接就是用两张表中都存在的列进行连接❤️。我们也可以对多张表进行等值连接。

针对 player 表和 team 表都存在 team_id 这一列，我们可以用等值连接进行查询

```sql
mysql> SELECT player_id, player.team_id, player_name, height, team_name FROM player, team WHERE player.team_id = team.team_id;
+-----------+---------+------------------------------------+--------+-----------------------+
| player_id | team_id | player_name                        | height | team_name             |
+-----------+---------+------------------------------------+--------+-----------------------+
|     10001 |    1001 | 韦恩-艾灵顿                        |   1.93 | 底特律活塞            |
|     10002 |    1001 | 雷吉-杰克逊                        |   1.91 | 底特律活塞            |
...
|     10036 |    1002 | 阿利兹-约翰逊                      |   2.06 | 印第安纳步行者        |
|     10037 |    1002 | 伊凯·阿尼博古                      |   2.08 | 印第安纳步行者        |
+-----------+---------+------------------------------------+--------+-----------------------+
```

他本质上也是笛卡尔连接，但是连接的两张表中都存在相同的列，可以用来作为条件，减少没必要的交叉，所以最终查询到37条

```sql

mysql> SELECT count(*) FROM player, team WHERE player.team_id = team.team_id;
+----------+
| count(*) |
+----------+
|       37 |
+----------+
```



>  我们在进行等值连接的时候，可以使用表的别名，这样会让 SQL 语句更简洁

```sql
# 使用了别名
SELECT player_id, a.team_id, player_name, height, team_name FROM player AS a, team AS b WHERE a.team_id = b.team_id;
# 没有使用别名
SELECT player_id, player.team_id, player_name, height, team_name FROM player, team WHERE player.team_id = team.team_id;
```



### inner join(SQL99)❤️

> 上面这种写法是SQL92并不符合规范，可能只对某些数据库管用，如sqlserver,mysql。推荐最好不要这样写。最好写成inner join的写法

```sql
# SQL92的等值连接
SELECT player_id, a.team_id, player_name, height, team_name FROM player AS a, team AS b WHERE a.team_id = b.team_id;

#SQL99
SELECT player_id, a.team_id, player_name, height, team_name FROM player AS a inner join team AS b on a.team_id = b.team_id;
```



### cross join(SQL99)

使用inner join和cross join效果一样

```sql
SELECT player_id, a.team_id, player_name, height, team_name FROM player AS a cross join team AS b on a.team_id = b.team_id;
```



### 自然连接(SQL99)❤️

可以把自然连接理解为 SQL92 中的等值连接。它会帮你自动查询两张连接表中所有相同的字段，然后进行等值连接。

把 player 表和 team 表进行等值连接，相同的字段是 team_id。

在 SQL92 标准中

```sql
SELECT player_id, a.team_id, player_name, height, team_name FROM player as a, team as b WHERE a.team_id = b.team_id
```

SQL99标准中

```sql
mysql> SELECT player_id, team_id, player_name, height, team_name FROM player NATURAL JOIN team;
+-----------+---------+------------------------------------+--------+-----------------------+
| player_id | team_id | player_name                        | height | team_name             |
+-----------+---------+------------------------------------+--------+-----------------------+
|     10001 |    1001 | 韦恩-艾灵顿                        |   1.93 | 底特律活塞            |
|     10002 |    1001 | 雷吉-杰克逊                        |   1.91 | 底特律活塞            |
|     10003 |    1001 | 安德烈-德拉蒙德                    |   2.11 | 底特律活塞            |
...
|     10035 |    1002 | 达文-里德                          |   1.98 | 印第安纳步行者        |
|     10036 |    1002 | 阿利兹-约翰逊                      |   2.06 | 印第安纳步行者        |
|     10037 |    1002 | 伊凯·阿尼博古                      |   2.08 | 印第安纳步行者        |
+-----------+---------+------------------------------------+--------+-----------------------+
```

> 在 SQL99 中用 NATURAL JOIN 替代了 `WHERE player.team_id = team.team_id`



## using连接

当我们进行连接的时候，可以用 USING 指定数据表里的同名字段进行等值连接。

```sql
mysql> SELECT player_id, team_id, player_name, height, team_name FROM player JOIN team USING(team_id);
+-----------+---------+------------------------------------+--------+-----------------------+
| player_id | team_id | player_name                        | height | team_name             |
+-----------+---------+------------------------------------+--------+-----------------------+
|     10001 |    1001 | 韦恩-艾灵顿                        |   1.93 | 底特律活塞            |
|     10002 |    1001 | 雷吉-杰克逊                        |   1.91 | 底特律活塞            |
|     10003 |    1001 | 安德烈-德拉蒙德                    |   2.11 | 底特律活塞            |
...
|     10035 |    1002 | 达文-里德                          |   1.98 | 印第安纳步行者        |
|     10036 |    1002 | 阿利兹-约翰逊                      |   2.06 | 印第安纳步行者        |
|     10037 |    1002 | 伊凯·阿尼博古                      |   2.08 | 印第安纳步行者        |
+-----------+---------+------------------------------------+--------+-----------------------+
```

与自然连接 NATURAL JOIN 不同的是，USING 指定了具体的相同的字段名称，你需要在 USING 的括号 () 中填入要指定的同名字段。同时使用 JOIN USING 可以简化 JOIN ON 的等值连接，它与下面的 SQL 查询结果是相同的

```sql
SELECT player_id, player.team_id, player_name, height, team_name FROM player JOIN team ON player.team_id = team.team_id;
```



## 非等值连接

当我们进行多表查询的时候，如果连接多个表的条件是等号时，就是等值连接，其他的运算符连接就是非等值查询

> player 表中有身高 height 字段，如果想要知道每个球员的身高的级别，可以采用非等值连接查询

```sql
mysql> SELECT p.player_id, p.player_name, p.height, h.height_level
    -> FROM player AS p, height_grades AS h
    -> WHERE p.height BETWEEN h.height_lowest AND h.height_highest;
+-----------+------------------------------------+--------+--------------+
| player_id | player_name                        | height | height_level |
+-----------+------------------------------------+--------+--------------+
|     10001 | 韦恩-艾灵顿                        |   1.93 | B            |
|     10002 | 雷吉-杰克逊                        |   1.91 | B            |
|     10003 | 安德烈-德拉蒙德                    |   2.11 | A            |
...
|     10035 | 达文-里德                          |   1.98 | B            |
|     10036 | 阿利兹-约翰逊                      |   2.06 | A            |
|     10037 | 伊凯·阿尼博古                      |   2.08 | A            |
+-----------+------------------------------------+--------+--------------+
```



## 自连接❤️

### SQL92

自连接可以对多个表进行操作，也可以对同一个表进行操作。也就是说查询条件使用了当前表的字段。

> 比如我们想要查看`布雷克-格里芬`高的球员都有谁，以及他们的对应身高：

```sql
mysql> SELECT b.player_name, b.height FROM player as a , player as b WHERE a.player_name = '布雷克-格里芬' and a.height < b.height;
+---------------------------+--------+
| player_name               | height |
+---------------------------+--------+
| 安德烈-德拉蒙德           |   2.11 |
| 索恩-马克                 |   2.16 |
| 扎扎-帕楚里亚             |   2.11 |
| 亨利-埃伦森               |   2.11 |
| 多曼塔斯-萨博尼斯         |   2.11 |
| 迈尔斯-特纳               |   2.11 |
+---------------------------+--------+
```



### SQL99

```sql
mysql> SELECT b.player_name, b.height FROM player as a JOIN player as b ON a.player_name = '布雷克-格里芬' and a.height < b.height;
+---------------------------+--------+
| player_name               | height |
+---------------------------+--------+
| 安德烈-德拉蒙德           |   2.11 |
| 索恩-马克                 |   2.16 |
| 扎扎-帕楚里亚             |   2.11 |
| 亨利-埃伦森               |   2.11 |
| 多曼塔斯-萨博尼斯         |   2.11 |
| 迈尔斯-特纳               |   2.11 |
+---------------------------+--------+
```



## 外连接😘

在 SQL92 中采用（+）代表从表所在的位置，而且在 SQL92 中，只有左外连接和右外连接，没有全外连接。

在SQL99 的外连接包括了三种形式：

1. 左外连接：LEFT JOIN 或 LEFT OUTER JOIN
2. 右外连接：RIGHT JOIN 或 RIGHT OUTER JOIN
3. 全外连接：FULL JOIN 或 FULL OUTER JOIN（**MySQL不支持**）

### 左连接

> 左外连接，就是指**左边的表是主表**，需要显示左边表的全部行，而右侧的表是从表

- SQL92: （+）表示哪个是从表

```sql
mysql> SELECT * FROM player, team where player.team_id = team.team_id(+);
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near ')' at line 1
```

可以看到mysql不支持SQL92的外连接

- SQL99的：左外连接

```sql
mysql> SELECT * FROM player LEFT JOIN team on player.team_id = team.team_id;
+-----------+---------+------------------------------------+--------+---------+-----------------------+
| player_id | team_id | player_name                        | height | team_id | team_name             |
+-----------+---------+------------------------------------+--------+---------+-----------------------+
|     10001 |    1001 | 韦恩-艾灵顿                        |   1.93 |    1001 | 底特律活塞            |
|     10002 |    1001 | 雷吉-杰克逊                        |   1.91 |    1001 | 底特律活塞            |
|     10003 |    1001 | 安德烈-德拉蒙德                    |   2.11 |    1001 | 底特律活塞            |
...
|     10035 |    1002 | 达文-里德                          |   1.98 |    1002 | 印第安纳步行者        |
|     10036 |    1002 | 阿利兹-约翰逊                      |   2.06 |    1002 | 印第安纳步行者        |
|     10037 |    1002 | 伊凯·阿尼博古                      |   2.08 |    1002 | 印第安纳步行者        |
+-----------+---------+------------------------------------+--------+---------+-----------------------+
```



### 右连接

右外连接，指的就是右边的表是主表，需要显示右边表的全部行，而左侧的表是从表

- SQL92: （+）表示哪个是从表

  ```sql
  mysql> SELECT * FROM player, team where player.team_id(+) = team.team_id;
  ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near ') = team.team_id' at line 1
  ```

- SQL99：

  ```sql
  mysql> SELECT * FROM player RIGHT JOIN team on player.team_id = team.team_id;
  +-----------+---------+------------------------------------+--------+---------+-----------------------+
  | player_id | team_id | player_name                        | height | team_id | team_name             |
  +-----------+---------+------------------------------------+--------+---------+-----------------------+
  |     10020 |    1001 | 卡林-卢卡斯                        |   1.85 |    1001 | 底特律活塞            |
  |     10019 |    1001 | 扎克-洛夫顿                        |   1.93 |    1001 | 底特律活塞            |
  |     10018 |    1001 | 斯维亚托斯拉夫-米凯卢克            |   2.03 |    1001 | 底特律活塞            |
  ...
  |     10023 |    1002 | 多曼塔斯-萨博尼斯                  |   2.11 |    1002 | 印第安纳步行者        |
  |     10022 |    1002 | 博扬-博格达诺维奇                  |   2.03 |    1002 | 印第安纳步行者        |
  |     10021 |    1002 | 维克多-奥拉迪波                    |   1.93 |    1002 | 印第安纳步行者        |
  |      NULL |    NULL | NULL                               |   NULL |    1003 | 亚特兰大老鹰          |
  +-----------+---------+------------------------------------+--------+---------+-----------------------+
  ```

  可以看到右边表球队全部查询出来了，左边没有对应的球员数据，显示为NULL.





## 小结

主流 RDBMS，比如 MySQL、Oracle、SQL Sever、DB2、PostgreSQL 等都支持 SQL 语言，也就是说它们的使用符合大部分 SQL 标准，但很难完全符合，因为这些数据库管理系统都在 SQL 语言的基础上，根据自身产品的特点进行了扩充。即使这样，SQL 语言也是目前所有语言中半衰期最长的，在 1992 年，Windows3.1 发布，SQL92 标准也同时发布，如今我们早已不使用 Windows3.1 操作系统，而 SQL92 标准却一直持续至今。

注意到 SQL 标准的变化，以及不同数据库管理系统使用时的差别，比如 Oracle 对 SQL92 支持较好，而 MySQL 则不支持 SQL92 的外连接。





## 测试SQL资源

[NBA球员表 ](https://github.com/cystanford/sql_nba_data)

:::: code-group
::: code-group-item play表

```sql
DROP TABLE IF EXISTS `player`;
CREATE TABLE `player`  (
  `player_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '球员ID',
  `team_id` int(11) NOT NULL COMMENT '球队ID',
  `player_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '球员姓名',
  `height` float(3, 2) NULL DEFAULT NULL COMMENT '球员身高',
  PRIMARY KEY (`player_id`) USING BTREE,
  UNIQUE INDEX `player_name`(`player_name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of player
-- ----------------------------
INSERT INTO `player` VALUES (10001, 1001, '韦恩-艾灵顿', 1.93);
INSERT INTO `player` VALUES (10002, 1001, '雷吉-杰克逊', 1.91);
INSERT INTO `player` VALUES (10003, 1001, '安德烈-德拉蒙德', 2.11);
INSERT INTO `player` VALUES (10004, 1001, '索恩-马克', 2.16);
INSERT INTO `player` VALUES (10005, 1001, '布鲁斯-布朗', 1.96);
INSERT INTO `player` VALUES (10006, 1001, '兰斯顿-加洛韦', 1.88);
INSERT INTO `player` VALUES (10007, 1001, '格伦-罗宾逊三世', 1.98);
INSERT INTO `player` VALUES (10008, 1001, '伊斯梅尔-史密斯', 1.83);
INSERT INTO `player` VALUES (10009, 1001, '扎扎-帕楚里亚', 2.11);
INSERT INTO `player` VALUES (10010, 1001, '乔恩-洛伊尔', 2.08);
INSERT INTO `player` VALUES (10011, 1001, '布雷克-格里芬', 2.08);
INSERT INTO `player` VALUES (10012, 1001, '雷吉-巴洛克', 2.01);
INSERT INTO `player` VALUES (10013, 1001, '卢克-肯纳德', 1.96);
INSERT INTO `player` VALUES (10014, 1001, '斯坦利-约翰逊', 2.01);
INSERT INTO `player` VALUES (10015, 1001, '亨利-埃伦森', 2.11);
INSERT INTO `player` VALUES (10016, 1001, '凯里-托马斯', 1.91);
INSERT INTO `player` VALUES (10017, 1001, '何塞-卡尔德隆', 1.91);
INSERT INTO `player` VALUES (10018, 1001, '斯维亚托斯拉夫-米凯卢克', 2.03);
INSERT INTO `player` VALUES (10019, 1001, '扎克-洛夫顿', 1.93);
INSERT INTO `player` VALUES (10020, 1001, '卡林-卢卡斯', 1.85);
INSERT INTO `player` VALUES (10021, 1002, '维克多-奥拉迪波', 1.93);
INSERT INTO `player` VALUES (10022, 1002, '博扬-博格达诺维奇', 2.03);
INSERT INTO `player` VALUES (10023, 1002, '多曼塔斯-萨博尼斯', 2.11);
INSERT INTO `player` VALUES (10024, 1002, '迈尔斯-特纳', 2.11);
INSERT INTO `player` VALUES (10025, 1002, '赛迪斯-杨', 2.03);
INSERT INTO `player` VALUES (10026, 1002, '达伦-科里森', 1.83);
INSERT INTO `player` VALUES (10027, 1002, '韦斯利-马修斯', 1.96);
INSERT INTO `player` VALUES (10028, 1002, '泰瑞克-埃文斯', 1.98);
INSERT INTO `player` VALUES (10029, 1002, '道格-迈克德莫特', 2.03);
INSERT INTO `player` VALUES (10030, 1002, '科里-约瑟夫', 1.91);
INSERT INTO `player` VALUES (10031, 1002, '阿龙-霍勒迪', 1.85);
INSERT INTO `player` VALUES (10032, 1002, 'TJ-利夫', 2.08);
INSERT INTO `player` VALUES (10033, 1002, '凯尔-奥奎因', 2.08);
INSERT INTO `player` VALUES (10034, 1002, '埃德蒙-萨姆纳', 1.96);
INSERT INTO `player` VALUES (10035, 1002, '达文-里德', 1.98);
INSERT INTO `player` VALUES (10036, 1002, '阿利兹-约翰逊', 2.06);
INSERT INTO `player` VALUES (10037, 1002, '伊凯·阿尼博古', 2.08);
```
:::
::: code-group-item team表

```sql
DROP TABLE IF EXISTS `team`;
CREATE TABLE `team`  (
  `team_id` int(11) NOT NULL COMMENT '球队ID',
  `team_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '球队名称',
  PRIMARY KEY (`team_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of team
-- ----------------------------
INSERT INTO `team` VALUES (1001, '底特律活塞');
INSERT INTO `team` VALUES (1002, '印第安纳步行者');
INSERT INTO `team` VALUES (1003, '亚特兰大老鹰');

```
:::

::: code-group-item height_grades表

```sql
DROP TABLE IF EXISTS `height_grades`;
CREATE TABLE `height_grades`  (
  `height_level` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '身高等级',
  `height_lowest` float(3, 2) NOT NULL COMMENT '该等级范围中的最低身高',
  `height_highest` float(3, 2) NOT NULL COMMENT '该等级范围中的最高身高'
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of height_grades
-- ----------------------------
INSERT INTO `height_grades` VALUES ('A', 2.00, 2.50);
INSERT INTO `height_grades` VALUES ('B', 1.90, 1.99);
INSERT INTO `height_grades` VALUES ('C', 1.80, 1.89);
INSERT INTO `height_grades` VALUES ('D', 1.60, 1.79);
```

:::

::::