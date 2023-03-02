---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

## JDK1.8put元素

> 由于Jdk8引入了新的数据结构，所以put方法过程也有了一定改进，其过程如下图所示。

**当链表过长，超过阈值TREEIFY_THRESHOLD = 8,会转化为红黑树**

> 通过泊松分布，的概率统计算出来的8

并且当数组长度<=64时，优先选择扩容而不是转红黑树

```java
if (binCount >= TREEIFY_THRESHOLD - 1)
        treeifyBin(tab, hash);


final void treeifyBin(Node<K,V>[] tab, int hash) {
        int n, index; Node<K,V> e;
        if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
            resize();


```

![img](/images/concurrency/4171-1.png)

## 扩容不会产生链表循环

> Java8 HashMap扩容跳过了Jdk7扩容的坑，对源码进行了优化，采用高低位拆分转移方式，避免了链表环的产生。

不像之前jdk1.7采用头插法，而是使用**高低位指针**，分割成两个链表，进行直接移动，整个过程没有rehash,要满足高低位移动，数组的容量必须满足2的幂次方

```java
Node<K,V> loHead = null, loTail = null;
Node<K,V> hiHead = null, hiTail = null;
Node<K,V> next;
do {
    next = e.next;
    if ((e.hash & oldCap) == 0) {
        if (loTail == null)
            loHead = e;
        else
            loTail.next = e;
        loTail = e;
    }
    else {
        if (hiTail == null)
            hiHead = e;
        else
            hiTail.next = e;
        hiTail = e;
    }
} while ((e = next) != null);
if (loTail != null) {
    loTail.next = null;
    newTab[j] = loHead;
}
if (hiTail != null) {
    hiTail.next = null;
    newTab[j + oldCap] = hiHead;
}

```



![img](/images/concurrency/16193-1.png)

![img](/images/concurrency/4117-1.png)

## 线程安全问题

Data Race

![image-20210630155701579](/../../../../saas-yong/fullstack/Java架构师之路/Java并发编程/imgs/image-20210630155701579.png)

