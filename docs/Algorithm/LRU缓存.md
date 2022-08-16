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



```sh
实现思路
1. 最新的数据都在链表的头部
2. 尾部的数据都是最旧的数据，用于移除
```

```java
public class LRUCache {
    private Logger logger = Logger.getLogger(LRUCache.class.getName());
    /*双向链表的结点定义，凡是使用过的结点都会移动到链表的头部*/
    class LinkedNode{
        private int value;
        private int key;
        LinkedNode prev;
        LinkedNode next;

        @Override
        public String toString() {
            return value+"";
        }
    }

    LinkedNode head,tail;
    Map<Integer,LinkedNode> cache = new HashMap<>();
    public LRUCache(int capacity) {
        head = new LinkedNode();
        tail = new LinkedNode();
        /*用head结点的key存放容量
         * value存放当前链表中结点的实际数量*/
        head.key = capacity;
        head.value = 0;

        head.next = tail;
        tail.next = null;
        head.prev = null;
        tail.prev = head;
    }

    public int get(int key) {
        LinkedNode node = cache.get(key);
        if(node != null){
            moveToHead(node);
            return node.value;
        }
        return -1;
    }

    public void put(int key, int value) {
        LinkedNode node = cache.get(key);
        if(node == null){
            node = new LinkedNode();
            node.key = key;
            node.value = value;
            cache.put(key,node);
            // 添加到链表头部
            this.addNode(node);
            // 更新当前容器的node数量
            this.head.value++;
            // 检查容量
            if(this.head.value > this.head.key){
                logger.info("current size "+this.head.value + " is bigger than capacity "+ this.head.key);
                 node = removeTailNode();
                 cache.remove(node.key);
                 this.head.value--;
            }
        }else{
            /*更新结点数据，并移动到头部*/
            node.value = value;
            this.moveToHead(node);
        }
    }

    private void addNode(LinkedNode node){
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }

    private void removeNode(LinkedNode node){
        LinkedNode preNode = node.prev;
        LinkedNode nextNode = node.next;

        preNode.next = nextNode;
        if(nextNode != null ) nextNode.prev = preNode;
    }

    private void moveToHead(LinkedNode node){
        this.removeNode(node);
        this.addNode(node);
    }

    private LinkedNode removeTailNode(){
        LinkedNode node = this.tail.prev;
        this.removeNode(node);
        return node;
    }

    @Override
    public String toString() {
        return "LRUCache{" +
                "cache=" + cache +
                '}';
    }

    public static void main(String[] args) {
        LRUCache lRUCache = new LRUCache(2);
        lRUCache.put(1, 1); // 缓存是 {1=1}
        System.out.println(lRUCache); // LRUCache{cache={1=1}}
        lRUCache.put(2, 2);   // 缓存是 {1=1, 2=2}
        System.out.println(lRUCache); // LRUCache{cache={1=1, 2=2}}
        System.out.println(lRUCache.get(1));    // 返回 1
        lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
        System.out.println(lRUCache); // LRUCache{cache={1=1, 3=3}}
        System.out.println(lRUCache.get(2));    // 返回 -1 (未找到)
        lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
        System.out.println(lRUCache);  // LRUCache{cache={3=3, 4=4}}
        System.out.println(lRUCache.get(1));    // 返回 -1 (未找到)
        System.out.println(lRUCache.get(3));    // 返回 3
        System.out.println(lRUCache.get(4));    // 返回 4
        System.out.println(lRUCache); // LRUCache{cache={3=3, 4=4}}
    }
}
/**
 * LRUCache{cache={1=1}}
 * LRUCache{cache={1=1, 2=2}}
 * 1
 * 八月 16, 2022 1:56:39 下午 org.hzz.linkedlist.LRUCache put
 * 信息: current size 3 is bigger than capacity 2
 * 八月 16, 2022 1:56:39 下午 org.hzz.linkedlist.LRUCache put
 * 信息: current size 3 is bigger than capacity 2
 * LRUCache{cache={1=1, 3=3}}
 * -1
 * LRUCache{cache={3=3, 4=4}}
 * -1
 * 3
 * 4
 * LRUCache{cache={3=3, 4=4}}
 */
```

