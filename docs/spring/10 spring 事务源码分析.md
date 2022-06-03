---
typora-root-url: images
---



## Spring 事务以及事务传播机制源码分析

https://www.processon.com/view/link/629840591e085332a215dc39

## @Transactional

1. UserService的类或者方法上有没有加这个注解@Transactional
2. @EnableTransactional

配置

![image-20220601215429465](/image-20220601215429465.png)



## 开启事务

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

```sql
show status like '%Threads_connected%';  -- 查看当前连接mysql的线程数
```

## 部分失败全局回滚：

同一个连接里面，要么同时提交，要么同时回滚



![image-20220601215503670](C:\Users\11930\AppData\Roaming\Typora\typora-user-images\image-20220601215503670.png)



## 强制回滚

TransactionSynchronizationManager.getCurrent  事务的名字

![image-20220601223950821](/image-20220601223950821.png)





## 提交时强制回滚

TransactionInfo是**TransactionAspectSupport**的一个内部类

```java
@Transactional
public void test(){
    jdbcTemplate.execute
    try{
        //比如远程调用rpc call
        throw new NullPointerException();
    }catch(Exception e){
        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly
        return new Result()
    }
}
```



```java
@Transactional
public void test(){
    jdbcTemplate.execute
    try{
        userService.a();  
    }catch(Exception e){  // 就算被catch主了，同样test方法也回滚。底层是部分失败全局回滚实现的
        return new Result()
    }
}

@Transactional 
public void a(){
    throw RuntimeException();
}
```





## Java代码学习

```
Collections.singleton

（UserService）null???
```

[(28条消息) Spring 事务扩展机制 TransactionSynchronization_carl-zhao的博客-CSDN博客](https://blog.csdn.net/u012410733/article/details/108659198)





## SavePoint

数据库级别

```sql
begin:
 insert into  t2 values(1,"hzz")
 insert into  t2 values(2,"hzz2");
 
 savepoint x;
 insert into  t2 values(3,"hzz3")
 rollback to x;
 
 commit;
```



