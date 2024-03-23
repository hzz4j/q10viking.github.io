---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---



1. **UNION：**UNION用于合并两个或多个查询结果集，并去除重复的行。它将多个查询的结果**合并为一个结果集，并自动去除重复的行。**在执行UNION操作时，数据库会进行额外的去重操作，这可能会带来一定的性能开销。

```sql
-- 使用UNION
SELECT * FROM test_user u
UNION
SELECT * FROM test_user u;
```

使用 UNION ALL，可以看到查询结果有 5条数据

![image-20240323171628979](/images/MySQL/image-20240323171628979.png)

2. **UNION ALL：**UNION ALL同样**用于合并查询结果集，但不去除重复的行。**它将多个查询的结果简单地合并在一起，包括重复的行。相比于UNION，UNION ALL不进行去重操作，因此执行效率更高。

   ```sql
   -- 使用UNION ALL
   SELECT * FROM test_user u
   UNION ALL
   SELECT * FROM test_user u;
   ```

   使用 UNION ALL，可以看到查询结果有 10 条数据

   ![image-20240323171653778](/images/MySQL/image-20240323171653778.png)