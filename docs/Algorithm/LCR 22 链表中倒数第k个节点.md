---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Algorithm/
typora-root-url: ..\.vuepress\public
---

::: tip

[LCR 126. 斐波那契数 - 力扣（LeetCode）](https://leetcode.cn/problems/fei-bo-na-qi-shu-lie-lcof/description/)

:::



## 散列表

最朴素的想法，我们使用Hash表，表中的条目是<结点的位置，存放的是哪个节点>。这说明散列表中每条记录的主键是结点在链表中的位置，值是该结点的地址。

为了创建散列表，当遍历链表时，可以得到链表的长度。令n表示链表的长度，这样就将寻找链表的倒数第k个结点的问题，转换为寻找链表正数第n-k+1个结点。因为已知链表的长度，所以求解这个问题只需要返回散列表中主键为n-k+1的值即可。

时间复杂度为O(n)，主要是遍历链表创建Hash表的时间开销。空间复杂度为O(n)，因为需要建立一个大小为m的散列表



## 遍历

从表头结点开始遍历链表，就能得到链表的长度。得到长度后，计算n-k+1的值，然后从表头开始再遍历一次就能得到第n-k+1个结点。这个方法需要两次遍历：一次用于确定链表的长度，另一次用于找到从表头开始的第n-k+1个结点。

时间复杂度还是O(n)，所以空间复杂度变为O(1)。



## 双指针

使用快慢双指针， pKthNode和 pTemp。首先，两个指针都指向链表的表头结点。仅当pTemp(沿着链表)进行了k-1次移动后，pKthNode才开始移动。然后两个指针同时移动直至 pTemp到达表尾。这时pNthNode指针所指的结点就是所求的结点，也就是链表的倒数第k个结点

![image-20230923220106381](/images/algorithm/image-20230923220106381.png)

```java
public class Solution {
    public static void main(String[] args) {
        Solution solution = new Solution();
        ListNode test = new ListNode(6);
        test.setNext(new ListNode(0))
                .setNext(new ListNode(11))
                .setNext(new ListNode(8))
                .setNext(new ListNode(9))
                .setNext(new ListNode(5))
                .setNext(new ListNode(4))
                .setNext(new ListNode(1));
        System.out.println(solution.trainingPlan(test,3).val);

    }
    public ListNode trainingPlan(ListNode head, int cnt) {
        // pTemp为参考系
        ListNode pKthNode = head,pTemp = head;
        // pTemp为参考系先动cnt-1次数
        while(cnt - 1 > 0){
            pTemp = pTemp.next;
            cnt--;
        }

        while(pTemp.next != null){
            pTemp = pTemp.next;
            pKthNode = pKthNode.next;
        }

        return pKthNode;
    }
}
// 5
```

