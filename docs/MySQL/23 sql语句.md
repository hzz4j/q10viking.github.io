---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---



## 删除

## 删除表所有数据

```sql
TRUNCATE table course_1;
```



## 获取表信息

```sql
# course是表名称
DESCRIBE course
```





## on duplicate key update

> 业务上有这样的需求，A、B 两个用户，如果互相关注，则成为好友。设计上是有两张表，一个是 like 表，一个是 friend 表，like 表有 user_id、liker_id 两个字段，我设置为复合唯一索引即 uk_user_id_liker_id。语句执行逻辑是这样的：
>
> 以 A 关注 B 为例：
>
> 第一步，先查询对方有没有关注自己（B 有没有关注 A）
>
> `select * from like where user_id = B and liker_id = A;`
>
> 如果有，则成为好友
>
> `insert into friend;`
>
> 没有，则只是单向关注关系
>
> `insert into like;`
>
> 但是如果 A、B 同时关注对方，会出现不会成为好友的情况。因为上面第 1 步，双方都没关注对方。第 1 步即使使用了排他锁也不行，因为记录不存在，行锁无法生效。请问这种情况，在 MySQL 锁层面有没有办法处理？

```sql
CREATE TABLE `like` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `liker_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id_liker_id` (`user_id`,`liker_id`)
) ENGINE=InnoDB;
 
CREATE TABLE `friend` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `friend_1_id` int(11) NOT NULL,
  `friend_2_id` int(11) NOT NULL,
  UNIQUE KEY `uk_friend` (`friend_1_id`,`friend_2_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
```



![image-20230510142025596](/images/MySQL/image-20230510142025596.png)

由于一开始 A 和 B 之间没有关注关系，所以两个事务里面的 select 语句查出来的结果都是空。

因此，session 1 的逻辑就是“既然 B 没有关注 A，那就只插入一个单向关注关系”。session 2 也同样是这个逻辑。

这个结果对业务来说就是 bug 了。因为在业务设定里面，这两个逻辑都执行完成以后，是应该在 friend 表里面插入一行记录的。

> 改进



要给“like”表增加一个字段，比如叫作 relation_ship，并设为整型，取值 1、2、3。

```sql
alter table `like` add column relation_ship int;
```

> 值是 1 的时候，表示 user_id 关注 liker_id;
> 值是 2 的时候，表示 liker_id 关注 user_id;
> 值是 3 的时候，表示互相关注。

然后，当 A 关注 B 的时候，逻辑改成如下所示的样子：

应用代码里面，比较 A 和 B 的大小，如果 A<B，就执行下面的逻辑

```sqlite
 begin; /* 启动事务 */
insert into `like`(user_id, liker_id, relation_ship) values(A, B, 1) on duplicate key update relation_ship=relation_ship | 1;
select relation_ship from `like` where user_id=A and liker_id=B;
/* 代码中判断返回的 relation_ship，
  如果是 1，事务结束，执行 commit
  如果是 3，则执行下面这两个语句：
  */
insert ignore into friend(friend_1_id, friend_2_id) values(A,B);
commit;
```

如果 A>B，则执行下面的逻辑

```sql
mysql> begin; /* 启动事务 */
insert into `like`(user_id, liker_id, relation_ship) values(B, A, 2) on duplicate key update relation_ship=relation_ship | 2;
select relation_ship from `like` where user_id=B and liker_id=A;
/* 代码中判断返回的 relation_ship，
  如果是 2，事务结束，执行 commit
  如果是 3，则执行下面这两个语句：
*/
insert ignore into friend(friend_1_id, friend_2_id) values(B,A);
commit;
```

> 什么时候变成3的，就在后面的语句。relation_ship = relation_ship | 1 。relation_ship = relation_ship | 2
>
> ```
> 0001
> 或
> 0010
> 等于
> 0011  == 3
> ```

### 演示

演示假设A(3),B(10)

```sql
#A(3)关注B(10)
insert into `like`(user_id, liker_id, relation_ship) values(3, 10, 1) on duplicate key update relation_ship=relation_ship | 1;
#B(10)关注A(3)
insert into `like`(user_id, liker_id, relation_ship) values(3, 10, 2) on duplicate key update relation_ship=relation_ship | 2;

 select * from `like`;
```

![image-20230510145242895](/images/MySQL/image-20230510145242895.png)



### 小结

- `UNIQUE KEY `uk_user_id_liker_id` (`user_id`,`liker_id`)`建立了联合索引，方便使用行锁
- 从设计上引入`relation_ship`表示关系
- 使用或进行更新。

### 参考

[ON DUPLICATE KEY UPDATE 用法与说明](https://blog.csdn.net/qq_22771739/article/details/84668620)





## 参考

[MySQL replace语句 - MySQL教程 (yiibai.com)](https://www.yiibai.com/mysql/replace.html)

