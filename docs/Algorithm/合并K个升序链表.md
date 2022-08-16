---

---



::: tip

[23. 合并K个升序链表 - 力扣（LeetCode）](https://leetcode.cn/problems/merge-k-sorted-lists/)

:::



## 分而治之

::: tip

分而治之很好的案例

[Source Code MergeKSortLists_23.java](https://github.com/Q10Viking/learncode/blob/main/algorithm/src/main/java/org/hzz/linkedlist/MergeKSortLists_23.java)

:::

```java
public class MergeKSortLists_23 {
    public ListNode mergeKLists(ListNode[] lists) {
        return merge(lists,0,lists.length-1);
    }

    private ListNode merge(ListNode[] lists,int left,int right){
        if(left == right) return lists[left];
        if(left > right) return null;

        int mid = (left + right) >> 1;
        return mergeTwoList(merge(lists,left,mid),merge(lists,mid+1,right));
    }

    private ListNode mergeTwoList(ListNode l1,ListNode l2){
        if(l1 == null) return l2;
        if(l2 == null) return l1;
        ListNode head = new ListNode(),p = head;
        while(l1 != null && l2 != null){
            if(l1.val < l2.val){
                p.next = l1;  // 直接等于l1
                l1 = l1.next;
            }else{
                p.next = l2;
                l2 = l2.next;
            }
            p = p.next;
        }

        if(l1 != null) p.next = l1;
        if(l2 != null) p.next = l2;

        return head.next;
    }

}
```



## 堆❤️

::: tip

在LRU我们体会到了Map+LinkedList

这里我们使用❤️堆+LinkedList❤️

[Source Code MergeKSortLists_23V2.java](https://github.com/Q10Viking/learncode/blob/main/algorithm/src/main/java/org/hzz/linkedlist/MergeKSortLists_23V2.java)

:::

使用上堆排序的思想，维护一个K大小的最小堆，每次都从链表中取出最小的那个元素，也就是每个链表排在最前面的元素放入最小堆，然后不停的从拿出堆顶的元素组成一个新链表。当把所有的链表中的元素都放入堆后，新链表就是我们需要的结果

> 用堆好巧妙啊，因为从堆中获取的元素是ListNode.可以从这个ListNode.next直接获取到下一个节点。而这个下一个节点是谁则直接取决于获取的ListNode.

```java
public class MergeKSortLists_23V2 {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists.length == 0) return null;
        // 最小堆
        PriorityQueue<ListNode> queue = new PriorityQueue<ListNode>(lists.length,(f,s)->f.val - s.val);

        // 初始化
        for (ListNode node : lists) {
            if(node != null) queue.offer(node);
        }

        ListNode head = new ListNode(),cur = head;
        while (!queue.isEmpty()){
            cur.next = queue.poll();
            cur = cur.next;
            if(cur.next != null){
                queue.offer(cur.next);
            }
        }
        return head.next;
    }
}
```

