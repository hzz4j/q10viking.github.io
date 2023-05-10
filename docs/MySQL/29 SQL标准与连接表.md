---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---



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





## 笛卡尔积

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











## 测试SQL资源



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

::: code-group-item height_grades

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