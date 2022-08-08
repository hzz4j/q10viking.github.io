---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---

## 排行榜⭐

```java
// 1）点击新闻
ZINCRBY  hotNews:20190819  1  守护香港
// 2）展示当日排行前十
ZREVRANGE  hotNews:20190819  0  9  WITHSCORES 
// 3）七日搜索榜单计算
ZUNIONSTORE  hotNews:20190813-20190819  7 
hotNews:20190813  hotNews:20190814... hotNews:20190819
// 4）展示七日排行前十
ZREVRANGE hotNews:20190813-20190819  0  9  WITHSCORES
```

![](/images/Redis/image-20211114064629643.png)

