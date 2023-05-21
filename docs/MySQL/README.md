---
prev:
  text: Back To 目录
  link: /topicNav/
typora-root-url: ..\.vuepress\public
---









## Java与Mysql类型对应



![img](/images/MySQL/types-mysql-java.png)





```sql
`created` datetime DEFAULT NULL COMMENT '创建时间',
```

对应

```
@TableField(value = "created")
private Date created;
```







## 资源

[MySQL Full Course for free 🐬 (2023) - YouTube](https://www.youtube.com/watch?v=5OdVJbNCSso)

[MySQL教程 (yiibai.com)](https://www.yiibai.com/mysql)

[MySQL :: MySQL Community Downloads](https://dev.mysql.com/downloads/)