---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---

## Hash常用操作

```java
HSET  key  field  value								//存储一个哈希表key的键值
HSETNX  key  field  value 							//存储一个不存在的哈希表key的键值
HMSET  key  field  value [field value ...] 		   	  //在一个哈希表key中存储多个键值对
HGET  key  field 								    //获取哈希表key对应的field键值
HMGET  key  field  [field ...] 		 				 //批量获取哈希表key中多个field键值
HDEL  key  field  [field ...] 						 //删除哈希表key中的field键值
HLEN  key										   //返回哈希表key中field的数量
HGETALL  key								        //返回哈希表key中所有的键值

HINCRBY  key  field  increment 				         //为哈希表key中field键的值加上增量increment

```



## Hash优点

1. **同类数据归类整合储存**，方便数据管理
2. 相比string操作消耗内存与cpu更小
3. 相比string储存更节省空间



## Hash缺点

1. **过期功能不能使用在field上，只能用在key上**
2. Redis集群架构下不适合大规模使用，需要注意到key计算后，会导致数据倾斜

> Redis集群下，数据存储的方式

![](/images/Redis/image-202111140536485011)

