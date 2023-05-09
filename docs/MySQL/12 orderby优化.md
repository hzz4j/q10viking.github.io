---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---





## order by工作原理

假设你要查询城市是“杭州”的所有人名字，并且按照姓名排序返回前 1000 个人的姓名、年龄

```sql
CREATE TABLE `t` (
  `id` int(11) NOT NULL,
  `city` varchar(16) NOT NULL,
  `name` varchar(16) NOT NULL,
  `age` int(11) NOT NULL,
  `addr` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `city` (`city`)
) ENGINE=InnoDB;
```

```sql
select city,name,age from t where city='杭州' order by name limit 1000 ;
```

### 全字段排序

![image-20230509223336436](/images/MySQL/image-20230509223336436.png)

Extra 这个字段中的“Using filesort”表示的就是需要排序，MySQL 会给每个线程分配一块内存用于排序，称为 sort_buffer

![image-20230509223414968](/images/MySQL/image-20230509223414968.png)

这个语句执行流程如下所示 ：

1. 初始化 sort_buffer，确定放入 name、city、age 这三个字段；
2. 从索引 city 找到第一个满足 city='杭州’条件的主键 id，也就是图中的 ID_X；
3. 到主键 id 索引取出整行，取 name、city、age 三个字段的值，存入 sort_buffer 中；
4. 从索引 city 取下一个记录的主键 id；
5. 重复步骤 3、4 直到 city 的值不满足查询条件为止，对应的主键 id 也就是图中的 ID_Y；
6. 对 sort_buffer 中的数据按照字段 name 做快速排序；
7. 按照排序结果取前 1000 行返回给客户端。

我们暂且把这个排序过程，称为全字段排序

![image-20230509223519670](/images/MySQL/image-20230509223519670.png)

“按 name 排序”这个动作，可能在内存中完成，也可能需要使用外部排序(临时文件)，这取决于排序所需的内存和参数 sort_buffer_size

### rowid排序

在上面这个算法过程里面，只对原表的数据读了一遍，剩下的操作都是在 sort_buffer 和临时文件中执行的。但这个算法有一个问题，就是如果查询要返回的字段很多的话，那么 sort_buffer 里面要放的字段数太多，这样内存里能够同时放下的行数很少，要分成很多个临时文件，排序的性能会很差。

所以如果单行很大，这个方法效率不够好

max_length_for_sort_data，是 MySQL 中专门控制用于排序的行数据的长度的一个参数。它的意思是，如果单行的长度超过这个值，MySQL 就认为单行太大，要换一个算法。

city、name、age 这三个字段的定义总长度是 36，我把 max_length_for_sort_data 设置为 16，我们再来看看计算过程有什么改变。

新的算法放入 sort_buffer 的字段，只有要排序的列（即 name 字段）和主键 id。

排序的结果就因为少了 city 和 age 字段的值，不能直接返回了，整个执行流程就变成如下所示的样子：

1. 初始化 sort_buffer，确定放入两个字段，即 name 和 id；
2. 从索引 city 找到第一个满足 city='杭州’条件的主键 id，也就是图中的 ID_X；
3. 到主键 id 索引取出整行，取 name、id 这两个字段，存入 sort_buffer 中；
4. 从索引 city 取下一个记录的主键 id；
5. 重复步骤 3、4 直到不满足 city='杭州’条件为止，也就是图中的 ID_Y；
6. 对 sort_buffer 中的数据按照字段 name 进行排序；
7. 遍历排序结果，取前 1000 行，并按照 id 的值回到原表中取出 city、name 和 age 三个字段返回给客户端。

这个执行流程的示意图如下，我把它称为 rowid 排序。



![image-20230509223849375](/images/MySQL/image-20230509223849375.png)



### 使用联合索引进行优化

如果能够保证从 city 这个索引上取出来的行，天然就是按照 name 递增排序的话，是不是就可以不用再排序了呢

可以在这个市民表上创建一个 city 和 name 的联合索引，对应的 SQL 语句是

```sql
alter table t add index city_user(city, name);
```

![image-20230509224107211](/images/MySQL/image-20230509224107211.png)

在这个索引里面，我们依然可以用树搜索的方式定位到第一个满足 city='杭州’的记录，并且额外确保了，接下来按顺序取“下一条记录”的遍历过程中，只要 city 的值是杭州，name 的值就一定是有序的。

这样整个查询过程的流程就变成了：

1. 从索引 (city,name) 找到第一个满足 city='杭州’条件的主键 id；
2. 到主键 id 索引取出整行，取 name、city、age 三个字段的值，作为结果集的一部分直接返回；
3. 从索引 (city,name) 取下一个记录主键 id；
4. 重复步骤 2、3，直到查到第 1000 条记录，或者是不满足 city='杭州’条件时循环结束

![image-20230509224225525](/images/MySQL/image-20230509224225525.png)



可以看到，这个查询过程不需要临时表，也不需要排序。接下来，我们用 explain 的结果来印证一下。

![image-20230509224322269](/images/MySQL/image-20230509224322269.png)

Extra 字段中没有 Using filesort 了，也就是不需要排序了。因为 (city,name) 这个联合索引本身有序



### 使用覆盖索引优化

**覆盖索引是指，索引上的信息足够满足查询请求，不需要再回到主键索引上去取数据。**

按照覆盖索引的概念，我们可以再优化一下这个查询语句的执行流程。

针对这个查询，我们可以创建一个 city、name 和 age 的联合索引，对应的 SQL 语句就是

```sql
alter table t add index city_user_age(city, name, age);
```

这时，对于 city 字段的值相同的行来说，还是按照 name 字段的值递增排序的，此时的查询语句也就不再需要排序了。这样整个查询语句的执行流程就变成了：

1. 从索引 (city,name,age) 找到第一个满足 city='杭州’条件的记录，取出其中的 city、name 和 age 这三个字段的值，作为结果集的一部分直接返回；
2. 从索引 (city,name,age) 取下一个记录，同样取出这三个字段的值，作为结果集的一部分直接返回；
3. 重复执行步骤 2，直到查到第 1000 条记录，或者是不满足 city='杭州’条件时循环结束

![image-20230509224556144](/images/MySQL/image-20230509224556144.png)



然后，我们再来看看 explain 的结果。

![image-20230509224651104](/images/MySQL/image-20230509224651104.png)

可以看到，Extra 字段里面多了“Using index”，表示的就是使用了覆盖索引，性能上会快很多。

当然，这里并不是说要为了每个查询能用上覆盖索引，就要把语句中涉及的字段都建上联合索引，毕竟索引还是有维护代价的。这是一个需要权衡的决定



## **Order by与Group by优化**

## case 1

```sql
EXPLAIN SELECT * from employees where name='LiLei' and position='dev' ORDER BY age;
```

![image-20211027180626737](/images/MySQL/image-20211027180626737.png)

利用最左前缀法则：中间字段不能断，因此查询用到了name索引，从key_len=74也能看出，age索引列用在排序过程中，因为Extra字段里没有using filesort

## case 2

```sql
EXPLAIN SELECT * from employees where name='LiLei' ORDER BY position;
```

![image-20211027180839402](/images/MySQL/image-20211027180839402.png)

从explain的执行结果来看：key_len=74，查询使用了name索引，由于用了position进行排序，跳过了age，出现了Using filesort。

## case 3

```sql
EXPLAIN SELECT * from employees where name='LiLei' ORDER BY age,position;
```

![image-20211027181052233](/images/MySQL/image-20211027181052233.png)

查找只用到索引name，age和position没用于排序，无Using filesort。

## case 4

```sql
EXPLAIN SELECT * from employees where name='LiLei' ORDER BY position,age;
```

![image-20211027181156066](/images/MySQL/image-20211027181156066.png)

和Case 3中explain的执行结果一样，但是出现了Using filesort，因为索引的创建顺序为name,age,position，但是排序的时候age和position颠倒位置了。



## case 5

```sql
EXPLAIN SELECT * from employees where name='LiLei' and age='18' ORDER BY position,age;
```

![image-20211027181408834](/images/MySQL/image-20211027181408834.png)

与Case 4对比，在Extra中并未出现Using filesort，因为age为常量，在排序中被优化，所以索引未颠倒，不会出现Using filesort。



## case 6

```sql
EXPLAIN SELECT * from employees where name='zhuge' ORDER BY age ASC,position DESC;
```

![image-20211027181604998](/images/MySQL/image-20211027181604998.png)

然排序的字段列与索引顺序一样，且order by默认升序，这里position desc变成了降序，导致与索引的排序方式不同，从而产生Using filesort



## case 7

```sql
EXPLAIN SELECT * from employees where name IN ('LiLei','zhuge') ORDER BY age,position;
```

![image-20211027182213478](/images/MySQL/image-20211027182213478.png)

对于排序来说，多个相等条件也是范围查询

## case 8

```sql
EXPLAIN SELECT * from employees where name>'a' ORDER BY name;
```

![image-20211027182619247](/images/MySQL/image-20211027182619247.png)

可以用覆盖索引优化

```sql
EXPLAIN SELECT name,age,position from employees where name>'a' ORDER BY name;
```

![image-20211027182707655](/images/MySQL/image-20211027182707655.png)



## 优化总结

1. MySQL支持两种方式的排序**filesort和index**，Using index是指MySQL扫描索引本身完成排序。index效率高，filesort效率低。
2. order by满足两种情况会使用Using index。
   1. **order by语句使用索引最左前列**
   2. **使用where子句与order by子句条件列组合满足索引最左前列**。
3. 尽量在索引列上完成排序，遵循索引建立（索引创建的顺序）时的最左前缀法则
4. 如果order by的条件不在索引列上，就会产生Using filesort
5. 能用覆盖索引尽量用覆盖索引
6. group by与order by很类似，其实质是先排序后分组，遵照索引创建顺序的最左前缀法则。对于group by的优化如果不需要排序的可以加上**order by null禁止排序**。注意，where高于having，能写在where中的限定条件就不要去having限定了。



## **filesort文件排序方式**

- **单路排序**：是一次性取出满足条件行的所有字段，然后在sort buffer中进行排序；用trace工具可以看到sort_mode信息里显示< sort_key, additional_fields >或者< sort_key, packed_additional_fields >
- **双路排序**（又叫**回表**排序模式）：是首先根据相应的条件取出相应的**排序字段**和**可以直接定位行数据的行 ID**，然后在 sort buffer 中进行排序，排序完后需要再次取回其它需要的字段；用trace工具可以看到sort_mode信息里显示< sort_key, rowid >

MySQL 通过比较系统变量 max_length_for_sort_data(**默认1024字节**) 的大小和需要查询的字段总大小来判断使用哪种排序模式。

- 如果 字段的总长度小于max_length_for_sort_data ，那么使用 单路排序模式；
- 如果 字段的总长度大于max_length_for_sort_data ，那么使用 双路排序模·式