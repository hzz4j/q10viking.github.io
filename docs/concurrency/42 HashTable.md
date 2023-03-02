---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

只使用了一个锁

![image-20210630160527241](/images/concurrency/image-20210630160527241.png)

```java
public synchronized V put(K key, V value)
```

