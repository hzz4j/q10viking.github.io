---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Algorithm/
typora-root-url: ..\.vuepress\public
---



::: tip

[146. LRU 缓存 - 力扣（LeetCode）](https://leetcode.cn/problems/lru-cache/)

:::



缓存的实现我们用的比较多的一般都是Map类型容器，尤其是题目要求在O(1) 时间复杂度内完成get操作和put操作，但是需要实现LRU (最近最少使用) ，肯定还要借助其他的手段。大多数的情况下，我们都是用链表来做的

所以这个问题可以使用Map加双向链表来实现。在我们的实现中，新节点用头插法插入链表。**凡是被get或者put的数据，都被视为最近使用过，都应该移动到链表的头部。在put数据时，还要进行容量的检查，如果超过了容量限制，自然就要从尾部淘汰数据**。

![image-20220816051247453](/images/algorithm/image-20220816051247453.png)
