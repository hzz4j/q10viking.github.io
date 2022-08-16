---

---



::: tip

[23. 合并K个升序链表 - 力扣（LeetCode）](https://leetcode.cn/problems/merge-k-sorted-lists/)

:::



## 分而治之

::: tip

分而治之很好的案例

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

