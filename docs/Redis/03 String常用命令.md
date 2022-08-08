---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---



## 字符串常用操作

```java
SET  key  value 					    //存入字符串键值对
MSET  key  value [key value ...] 		 //批量存储字符串键值对
SETNX  key  value 					    //存入一个不存在的字符串键值对
GET  key 							   //获取一个字符串键值
MGET  key  [key ...]	 			    //批量获取字符串键值
DEL  key  [key ...] 				    //删除一个键
EXPIRE  key  seconds 				    //设置一个键的过期时间(秒)
```



## 原子加减

```java
INCR  key					   //将key中储存的数字值加1
DECR  key 					   //将key中储存的数字值减1
INCRBY  key  increment			//将key所储存的值加上increment
DECRBY  key  decrement 		    //将key所储存的值减去decrement
```



