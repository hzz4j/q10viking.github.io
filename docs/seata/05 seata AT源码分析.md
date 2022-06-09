---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /seata/
typora-root-url: ..\.vuepress\public
---



@GlobalTransaction依赖本地事务

TM: 如何获取全局事务ID

xid需要传递 SeataFeignClient



## Feign调用异常，调用层如何接收下层的抛出的异常信息？



## Netty seata中的通信





## 前置镜像后置镜像的生成

seata是读未提交

```
io.seata.config.ConfigurationProvider
```





## 事务管理者TM创建全局事务

db存储模式下建立的session就是往数据库中插入一条数据

```sql
insert into global_table(xid, transaction_id, status, application_id, transaction_service_group, transaction_name, timeout, begin_time, application_data, gmt_create, gmt_modified) values (?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now())
```

![image-20220609083842913](/images/seata/image-20220609083842913.png)



## OrderService RM注册分支事务



### 获取连接断点位置

```java
io.seata.rm.datasource.DataSourceProxy#getConnection()
```

现在目标找ConnectionProxy如何被创建

mapper执行，会最终执行到MapperProxy,然后进入到mybatis的执行逻辑

Mybatis与Spring结合时，有这么一个类SqlSessionTemplate 内部类SqlSessionInterceptor

SpringManagedTransaction从这个事务管理器获取链接

```java
new ConnectionProxy(this, targetConnection)
```



## 回到Seata

DataSourceProxy ConnectionProxy PreparedStatementProxy

PreparedStatementProxy.execute































