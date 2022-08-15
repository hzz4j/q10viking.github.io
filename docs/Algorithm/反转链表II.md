---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Algorithm/
typora-root-url: ..\.vuepress\public
---

::: tip

[92. 反转链表 II - 力扣（LeetCode）](https://leetcode.cn/problems/reverse-linked-list-ii/)

:::



初始状态

![image-20220816021918545](/images/algorithm/image-20220816021918545.png)

第一轮循环

![image-20220816021941026](/images/algorithm/image-20220816021941026.png)

![image-20220816021958852](/images/algorithm/image-20220816021958852.png)

![image-20220816022025387](/images/algorithm/image-20220816022025387.png)

![image-20220816022038818](/images/algorithm/image-20220816022038818.png)

第二轮循环

![image-20220816022207238](/images/algorithm/image-20220816022207238.png)

![image-20220816022224110](/images/algorithm/image-20220816022224110.png)

![image-20220816022336156](/images/algorithm/image-20220816022336156.png)

![image-20220816022404574](/images/algorithm/image-20220816022404574.png)

最终结果：

![image-20220816022431518](/images/algorithm/image-20220816022431518.png)

```java
public class ReverseLinkedListII_92 {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode temp = new ListNode(0);
        temp.next = head;
        ListNode pre = temp;
        for (int i = 0; i < left - 1; i++) {
            pre = pre.next;
        }
        ListNode cur = pre.next;
        ListNode next = cur.next;

        for (int i = 0; i < right - left; i++) {
           cur.next = next.next;
           next.next = pre.next;
           pre.next = next;
           next = cur.next;
        }
        return temp.next;
    }
}
```

