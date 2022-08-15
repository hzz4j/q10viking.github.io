---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Algorithm/
typora-root-url: ..\.vuepress\public
---



::: tip

[347. 前 K 个高频元素 - 力扣（LeetCode）](https://leetcode.cn/problems/top-k-frequent-elements/)

:::

既然只要返回前K个高频元素，自然堆排序就是我们可以考虑使用的方法。使用JDK的PriorityQueue来快速实现堆。

```java
public class TopKFrequent_347 {
     class Element{
        private int val;
        private int frequent;
        public Element(int val,int frequent){
            this.val = val;
            this.frequent = frequent;
        }

        @Override
        public String toString() {
            return "Element{" +
                    "val=" + val +
                    ", frequent=" + frequent +
                    '}';
        }
    }
    public int[] topKFrequent(int[] nums, int k) {
        // count frequent
        Map<Integer,Integer> map = new HashMap<>();
        for (int num:
             nums) {
            map.put(num,map.getOrDefault(num,0)+1);
        }
        System.out.println(map);
        PriorityQueue<Element> pq = new PriorityQueue<>(k,(a,b)->a.frequent - b.frequent);
        for (Map.Entry<Integer,Integer> entry:
             map.entrySet()) {
            if(pq.size() == k){
                if (pq.peek().frequent < entry.getValue()){
                    pq.poll();
                    pq.offer(new Element(entry.getKey(),entry.getValue()));
                }
            }else{
                pq.offer(new Element(entry.getKey(),entry.getValue()));
            }
        }
        int[] res = new int[k];
        System.out.println(pq);
        for (int i = 0; i < k; i++) {
            res[i] = pq.poll().val;
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(
                new TopKFrequent_347().topKFrequent(new int[]{1, 1, 1, 2, 2, 3}, 2)
        ));
    }
}
/**
 * {1=3, 2=2, 3=1}
 * [Element{val=2, frequent=2}, Element{val=1, frequent=3}]
 * [2, 1]
 */
```





## PriorityQueue

::: tip

底层是堆实现，默认是自然顺序的升序

:::

```java
public class PriorityQueueTest {
    public static void main(String args[])
    {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for(int i=0;i<3;i++){
            pq.add(i);
            pq.add(1);
        }
        while(!pq.isEmpty()){
            System.out.print(pq.poll()+" ");
        }
        System.out.println("");
    }
}
/**
 * 0 1 1 1 1 2
 */
```

使用Comparator实现一个最大堆

```java
public class PriorityQueueTest2 {
    public static void main(String args[])
    {
        PriorityQueue<Integer> pq = new PriorityQueue<>((a, b)->b-a);
        for(int i=0;i<3;i++){
            pq.add(i);
            pq.add(1);
        }
        while(!pq.isEmpty()){
            System.out.print(pq.poll()+" ");
        }
        System.out.println("");
    }
}
/**
 * 2 1 1 1 1 0 
 */
```

