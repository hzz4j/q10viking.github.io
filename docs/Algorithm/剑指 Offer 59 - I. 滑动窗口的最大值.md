---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Algorithm/
typora-root-url: ..\.vuepress\public
---

::: tip

[剑指 Offer 59 - I. 滑动窗口的最大值](https://leetcode.cn/problems/hua-dong-chuang-kou-de-zui-da-zhi-lcof/)

:::



```
输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3
输出: [3,3,5,5,6,7] 
解释: 

  滑动窗口的位置                最大值
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
```



## 单调队列解决

> Java 中ArrayDeque是双端队列
>
> [ArrayDeque基本API说明](https://www.javatpoint.com/java-deque-arraydeque)

```java
public class Solution {
    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println(Arrays.toString(solution.maxSlidingWindow(new int[]{1,3,-1,-3,5,3,6,7},3)));
        System.out.println(Arrays.toString(solution.maxSlidingWindow(new int[]{1,-1},1)));
    }

    public int[] maxSlidingWindow(int[] nums, int k) {
        Deque<Integer> deque = new ArrayDeque<>();
        int[] ans = new int[nums.length - k + 1];
        for(int i = 0; i < nums.length; i++){
            // 保证队列中元素在窗口内
            if(!deque.isEmpty() && i - deque.peek() + 1 > k){
                deque.poll();
            }
            // 确保单调性 3 2 1 一旦4这个元素进来，那么此时队列中会移除比4小的元素，最终队列中只能剩下4
            while(!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]){
                deque.pollLast();
            }
            deque.offer(i);
            if(i >= k - 1){
                ans[ i - k + 1] = nums[deque.peek()];
            }
        }
        return ans;
    }
}
/**
 * [3, 3, 5, 5, 6, 7]
 * [1, -1]
 */
```

