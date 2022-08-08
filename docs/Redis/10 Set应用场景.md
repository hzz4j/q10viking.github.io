---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---

## 微信抽奖小程序⭐

```java
// 1）点击参与抽奖加入集合
SADD key {userlD}
// 2）查看参与抽奖所有用户
SMEMBERS key	  
// 3）抽取count名中奖者
SRANDMEMBER key [count]
SPOP key [count]
```

![](/images/Redis/image-20211114061333406.png)



## 微信微博点赞，收藏，标签⭐

```java
// 1) 点赞
SADD  like:{消息ID}  {用户ID}
// 2) 取消点赞
SREM like:{消息ID}  {用户ID}
// 3) 检查用户是否点过赞
SISMEMBER  like:{消息ID}  {用户ID}
// 4) 获取点赞的用户列表
SMEMBERS like:{消息ID}
// 5) 获取点赞用户数 
SCARD like:{消息ID}
```

![](/images/Redis/image-20211114061613473.png)

## 微博微信关注模型⭐

![](/images/Redis/image-20211114062143318.png)

```java
// 1) 诸葛老师关注的人: 
zhugeSet-> {guojia, xushu}
// 2) 杨过老师关注的人:
yangguoSet--> {zhuge, baiqi, guojia, xushu}
// 3) 郭嘉老师关注的人: 
guojiaSet-> {zhuge, yangguo, baiqi, xushu, xunyu)
// 4) 我和杨过老师共同关注: 
SINTER zhugeSet yangguoSet --> {guojia, xushu}
// 5) 我关注的人也关注他(杨过老师): 
SISMEMBER guojiaSet yangguo 
SISMEMBER xushuSet yangguo
// 6) 我可能认识的人: 
SDIFF yangguoSet zhugeSet ->(zhuge, baiqi}
```

![](/images/Redis/image-20211114062621754.png)

----------

## 电商商品筛选

> 筛选功能

```
SADD  brand:huawei  P40
SADD  brand:xiaomi  mi-10
SADD  brand:iPhone iphone12
SADD  os:android  P40  mi-10
SADD  cpu:brand:intel  P40  mi-10
SADD  ram:8G  P40  mi-10  iphone12

SINTER  os:android  cpu:brand:intel  ram:8G ->  {P40，mi-10}
```

![](/images/Redis/image-20211114062941688.png)

