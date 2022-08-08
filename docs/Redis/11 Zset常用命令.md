---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---

## ZSet常用操作

```java
ZADD key score member [[score member]…]					//往有序集合key中加入带分值元素
ZREM key member [member …]							   //从有序集合key中删除元素
ZSCORE key member 									  //返回有序集合key中元素member的分值
ZINCRBY key increment member						   //为有序集合key中元素member的分值加上increment 
ZCARD key											 //返回有序集合key中元素个数
ZRANGE key start stop [WITHSCORES]					   //正序获取有序集合key从start下标到stop下标的元素
ZREVRANGE key start stop [WITHSCORES]				   //倒序获取有序集合key从start下标到stop下标的元素
```

![](/images/Redis/image-20211114064019391.png)

```sh
zadd users 80 Steven 86 Eric 90 Lilei 98 Hanmeimei
```

----------

## Zset集合操作

```java
ZUNIONSTORE destkey numkeys key [key ...] 		//并集计算
ZINTERSTORE destkey numkeys key [key …]		    //交集计算
```

