---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---

## 对象缓存

![](/images/Redis/image-202111140455157431)

```
HMSET  user  {userId}:name  zhuge  {userId}:balance  1888
HMSET  user  1:name  zhuge  1:balance  1888
HMGET  user  1:name  1:balance  
```

![](/images/Redis/image-20211114051904893.png)



## 电商购物车⭐

![](/images/Redis/image-20211114052022532.png)

>  购物车操作

```java
// 添加商品 cart:{userId} goodsId
hset cart:1001 10088 1
// 增加数量
hincrby cart:1001 10088 1
// 商品总数
hlen cart:1001
// 删除商品
hdel cart:1001 10088
// 获取购物车所有商品
hgetall cart:1001
```

