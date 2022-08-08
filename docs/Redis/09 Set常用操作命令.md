---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---

## Set常用操作

```java
SADD  key  member  [member ...]			//往集合key中存入元素，元素存在则忽略，若key不存在则新建					
SREM  key  member  [member ...]			//从集合key中删除元素
SMEMBERS  key						   //获取集合key中所有元素
SCARD  key					  		   //获取集合key的元素个数
SISMEMBER  key  member				    //判断member元素是否存在于集合key中
SRANDMEMBER  key  [count]				//从集合key中选出count个元素，元素不从key中删除
SPOP  key  [count]			     		//从集合key中选出count个元素，元素从key中删除
```



## Set运算操作

```java
SINTER  key  [key ...] 							//交集运算
SINTERSTORE  destination  key  [key ..]			 //将交集结果存入新集合destination中
SUNION  key  [key ..] 						    //并集运算
SUNIONSTORE  destination  key  [key ...]		 //将并集结果存入新集合destination中
SDIFF  key  [key ...] 						    //差集运算
SDIFFSTORE  destination  key  [key ...]			 //将差集结果存入新集合destination中
```

![](/images/Redis/image-20211114061839333.png)

```
SINTER set1 set2 set3 -> { c }
SUNION set1 set2 set3 -> { a,b,c,d,e }
SDIFF set1 set2 set3 -> { a }
```

