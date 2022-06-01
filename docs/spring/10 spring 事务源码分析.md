

## @Transactional

1. UserService的类或者方法上有没有加这个注解@Transactional
2. @EnableTransactional

配置

```java


Datasource
```

加了一个Advisor

Auto

TransactionInterceptor



PointCut 判断UserService是否需要事务代理

RuleBasedTransactionAtrribute



准备阶段

解析阶段

执行阶段

	1. 隔离级别
	1. 事务传播机制





开启事务

```
Spring事务管理器，创建数据库连接
conn.autocommit = false
conn.隔离级别
conn 放入TreadLocal<Map>  key:DataSource,conn连接

执行方法target.test sql1,sql2 
		a()方法 新开一个事务
		    挂起对象---->conn连接拿出来放到挂起对象中
			Spring事务管理器，创建数据库连接
             conn1.autocommit = false
             conn1.隔离级别
             conn1 放入TreadLocal<Map>  key:DataSource,conn连接	
             执行sql
             conn1.提交
             恢复 放入TreadLocal<Map>
             如果rollback--->如果部分失败全局回滚。
    sql3
4. 提交commit() 会去判断a()方法 rollback时设置的值  回滚
```

jdbcTemplate怎么拿到事务管理建立的连接？需要把数据库连接放入ThreadLocal

TransactionInterceptor

```sql
show status like '%Threads_connected%';  -- 查看当前连接mysql的线程数
```

部分失败全局回滚：同一个连接里面，要么同时提交，要么同时回滚

![image-20220601215429465](C:\Users\11930\AppData\Roaming\Typora\typora-user-images\image-20220601215429465.png)

![image-20220601215503670](C:\Users\11930\AppData\Roaming\Typora\typora-user-images\image-20220601215503670.png)



TransactionSynchronizationManager.getCurrent  事物的名字



开启事务

![image-20220601222431647](C:\Users\11930\AppData\Roaming\Typora\typora-user-images\image-20220601222431647.png)

![image-20220601223950821](C:\Users\11930\AppData\Roaming\Typora\typora-user-images\image-20220601223950821.png)



save point

![image-20220601225253068](C:\Users\11930\AppData\Roaming\Typora\typora-user-images\image-20220601225253068.png)