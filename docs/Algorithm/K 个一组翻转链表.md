---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Algorithm/
typora-root-url: ..\.vuepress\public
---



::: tip

[25. K 个一组翻转链表 - 力扣（LeetCode）](https://leetcode.cn/problems/reverse-nodes-in-k-group/)

与[反转链表II](https://q10viking.github.io/Algorithm/%E5%8F%8D%E8%BD%AC%E9%93%BE%E8%A1%A8II.html)很像，但是注意这里需要自己处理一下边界的情况

[Source Code ReverseNodesInKGroup_25.java](https://github.com/Q10Viking/learncode/blob/main/algorithm/src/main/java/org/hzz/linkedlist/ReverseNodesInKGroup_25.java)

:::

![img](/images/algorithm/reverse_ex1.jpg)

这题跟反转链表II很像

![image-20220816021918545](/images/algorithm/image-20220816021918545.png)

![image-20220816022038818](/images/algorithm/image-20220816022038818.png)

> 固定的两个pre,curr，只有next移动

```java
public class ReverseNodesInKGroup_25 {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode temp = new ListNode(),p = temp,begin = temp;
        temp.next = head;
        int i = 0;
        while(p != null){
            i++;
            p = p.next;
            if(i%k == 0 && p != null){  // 不够了则不反转 如反转两个，但是元素是5,null （5已经是尾部节点了）
                begin = reverse(begin,k);
                p = begin;
                PrintListNode.print(temp.next);
            }
        }
        return temp.next;
    }

    private ListNode reverse(ListNode begin,int k){
        ListNode prev = begin,cur = prev.next,next = cur.next;
        for (int i = 0; i < k-1; i++) { // k-1，比如要反转两个元素，只需要遍历一次即可
            cur.next = next.next;
            next.next = prev.next;
            prev.next = next;
            next = cur.next;
        }
        return cur;
    }

    public static void main(String[] args) {
        ListNode head = new ListNode(1),p = head;
        for(int i=2;i<=5;i++){
            p.next = new ListNode(i);
            p = p.next;
        }
        PrintListNode.print(head);
        head = new ReverseNodesInKGroup_25().reverseKGroup(head, 2);
        System.out.println("最终结果：");
        PrintListNode.print(head);
    }
}
/**
 * [1,2,3,4,5]
 * [2,1,3,4,5]
 * [2,1,4,3,5]
 * 最终结果：
 * [2,1,4,3,5]
 */
```

