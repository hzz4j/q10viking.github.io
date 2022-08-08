---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---

## List常用操作

![](/images/Redis/image-20211114054128423.png)

```java
// 将一个或多个值value插入到key列表的表头(最左边)
LPUSH  key  value [value ...] 		
// 将一个或多个值value插入到key列表的表尾(最右边)
RPUSH  key  value [value ...]	
// 移除并返回key列表的头元素
LPOP  key
// 移除并返回key列表的尾元素
RPOP  key
// 返回列表key中指定区间内的元素，区间以偏移量start和stop指定
LRANGE  key  start  stop		
// 从key列表表头弹出一个元素，若列表中没有元素，阻塞等待timeout秒,如果timeout=0,一直阻塞等待
BLPOP  key  [key ...]  timeout
// 从key列表表尾弹出一个元素，若列表中没有元素，阻塞等待timeout秒,如果timeout=0,一直阻塞等待
BRPOP  key  [key ...]  timeout 	

```

