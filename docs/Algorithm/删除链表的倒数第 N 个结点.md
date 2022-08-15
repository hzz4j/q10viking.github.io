---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Algorithm/
typora-root-url: ..\.vuepress\public
---



::: tip

[19. 删除链表的倒数第 N 个结点 - 力扣（LeetCode）](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

:::



![image-20220816014130445](/images/algorithm/image-20220816014130445.png)

> 使用快慢指针一次遍历,**添加了一个头节点**

```java
public class RemoveNthNode_19 {
    // 注意[1] 1的情况
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode startNode = new ListNode(0);
        ListNode slow =  startNode, fast = startNode;
        startNode.next = head;
        // 先移动fast
        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }
        while (fast!=null){
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        // 不能返回return head 因为[1] 1的情况，head还是指向这1
        return startNode.next;
    }
}
```

