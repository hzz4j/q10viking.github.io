---
prev:
  text: Back To 目录
  link: /ShardingJDBC/
typora-root-url: ..\.vuepress\public
---



::: tip

分库分表最核心的两点SQL 路由  、 SQL 改写

:::

## Route （路由）引擎

在实际查询当中，数据可能不只是存在一台MYSQL服务器上，

```sql
SELECT *  FROM t_order WHERE order _id IN(1,3,6)
```

数据分布：

```sql
ds0.t_order0 (1,3,5,7)

ds1.t_order0(2,4,6)
```

这个SELECT 查询就需要走2个database,如果这个SQL原封不动的执行，肯定会报错（表不存在），Sharding-jdbc 必须要对这个sql进行改写，将库名和表名 2个路由加上 

```sql
SELECT *  FROM ds0.t_order0  WHERE order _id IN(1,3)

SELECT *  FROM ds1.t_order0  WHERE order _id IN(6)
```

![img](/images/ShardingJDBC/show.png)
