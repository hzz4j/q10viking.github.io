---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---

## 常用数据结构

```
Stack(栈) = LPUSH + LPOP
Queue(队列）= LPUSH + RPOP
Blocking MQ(阻塞队列）= LPUSH + BRPOP
```



## 微博和微信公号消息流

> 有序的

![](/images/Redis/image-20211114054613236.png)

![](/images/Redis/image-20211114054632488.png)

> 诸葛老师关注了MacTalk，备胎说车等大V

```java
// MacTalk发微博，消息ID为10018
LPUSH  msg:{诸葛老师-ID}  10018
// 备胎说车发微博，消息ID为10086
LPUSH  msg:{诸葛老师-ID} 10086
// 查看最新微博消息
LRANGE  msg:{诸葛老师-ID}  0  4
```

