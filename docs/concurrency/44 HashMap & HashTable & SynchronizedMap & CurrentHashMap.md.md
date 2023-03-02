---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

![image-20210630161931174](/images/concurrency/image-20210630161931174.png)

```java
Map<String,String> m = new ConcurrentHashMap<>();
//  都会报NullPointerException
m.put("1",null);
m.put(null,"2");

 final V putVal(K key, V value, boolean onlyIfAbsent) {
        if (key == null || value == null) throw new NullPointerException();
```



```java
Map<String,String> map = new HashMap<>();
map.put("1","tom1");
map.put("2","tom2");
map.put("3","tom3");

Map<String,String> syncMap = Collections.synchronizedCollection(map);
```



1. Can Multiple thread write in the same segment?
   1. No.Thread acquires a lock on segment in put()  operation and at a time only one thread can write in that segment.
2. Can two threads write in the different segment?
   1. Yes.Two threads are allowed to write  concurrently in different segments.
3. Can Multiple thread read from the same segment?
   1. Yes.Thread doesn't acquire a lock on segment in get() operation and any number of threads can read from the same segment.