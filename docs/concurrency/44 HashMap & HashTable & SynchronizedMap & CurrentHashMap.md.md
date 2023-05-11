---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## HashMap和HashTable

- HashMap方法没有synchronized修饰，线程非安全，HashTable线程安全；
- HashMap允许key和value为null，而HashTable不允许

```java
#HashTable
public synchronized V put(K key, V value) {}
```

### 底层实现

底层实现：数组+链表实现

jdk8开始链表高度到8、数组长度超过64，链表转变为红黑树，元素以内部类Node节点存在

- 计算key的hash值，二次hash然后对数组长度取模，对应到数组下标，
- 如果没有产生hash冲突(下标位置没有元素)，则直接创建Node存入数组，
- 如果产生hash冲突，先进行equal比较，相同则取代该元素，不同，则判断链表高度插入链表，链表高度达到8，并且数组长度到64则转变为红黑树，长度低于6则将红黑树转回链表
- key为null，存在下标0的位置





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