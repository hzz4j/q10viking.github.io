---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---

## 单值缓存

```
SET  key  value 	
GET  key 
```



## 对象缓存

![](/images/Redis/image-20211114045515743.png)

方式1: 直接json存储,存储简单，但是更新user字段的时候比较麻烦

```java
SET  user:1  value(json格式数据)
```

方式2：key设计+属性，分开存储，虽然存储麻烦，但是更新字段时比较方便

```java
MSET  user:1:name  zhuge   user:1:balance  1888
MGET  user:1:name   user:1:balance 
```



## 分布式锁

SETNX当前仅当key不存在时，才可以设置成功

```java
SETNX  product:10001  true 					//返回1代表获取锁成功
SETNX  product:10001  true 					//返回0代表获取锁失败
。。。执行业务操作
DEL  product:10001			   			    //执行完业务释放锁

SET product:10001 true  ex  10  nx			//防止程序意外终止导致死锁 ex 指定过期时间seconds nx SETNX的分开写法
```

## 计数器

![image-20211114050136198](/images/Redis/image-20211114050136198.png)

```
INCR article:readcount:{文章id}  	
GET article:readcount:{文章id} 
```

## Web集群session共享

spring session + redis实现session共享



## 分布式系统全局序列号 

```java
// 相比使用incr orderId 一个个递增，对redis性能压榨比较厉害
INCRBY  orderId  1000		//redis批量生成序列号提升性能
```

