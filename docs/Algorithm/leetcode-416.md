---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Algorithm/
typora-root-url: ..\.vuepress\public
---





> 背包问题的变形

- 在若干个物品中选出一些物品，每个物品只能使用一次，这些物品恰好能够填满容量sum/2的背包
- 0-1背包问题：在M件物品取出若干件放在体积为W的背包中，每件物品只有一件，它们有各自的体积和价值，问如何选择使得背包能够装下的物品的价值最多





> `db[i][j]`的状态表示很重要

![image-20230421204816520](/images/algorithm/image-20230421204816520.png)



```
初始化： dp[i][j] = false
输出：dp[len-1][sum/2] 
```

![image-20230421205932593](/images/algorithm/image-20230421205932593.png)



```java
class Solution {
    public boolean canPartition(int[] nums) {
        int len = nums.length;
        int sum = 0;
        for(int num: nums)	sum += num;
        
        if((sum & 1) == 1) return false;
        
        int target = sum / 2;
        boolean[][] dp = new boolean[len][target+1];  // 包括了0行
        dp[0][0] = true;
        if(nums[0]<=target) dp[0][nums[0]] = true;
        
        for(int i=1;i<len;i++){
            for(int j=0;j<=target;j++){
                // 状态先继承上一行的
                dp[i][j] = dp[i-1][j];
                if(nums[i]<j){
                    // 不放入和放入
                    dp[i][j] = dp[i-1][j] || dp[i-1][j-nums[i]];
                }
            }
            if(dp[i][target]) return true;
        }
        
        return dp[len-1][target];
    }
}
```





## 参考

[分割等和子集 - 分割等和子集 - 力扣（LeetCode）](https://leetcode.cn/problems/partition-equal-subset-sum/solution/fen-ge-deng-he-zi-ji-by-leetcode-solution/)