---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---

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