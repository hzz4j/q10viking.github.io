---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Algorithm/
typora-root-url: ..\.vuepress\public
---

[300. 最长递增子序列 - 力扣（LeetCode）](https://leetcode.cn/problems/longest-increasing-subsequence/)



这个问题用动态规划怎么解决呢？定义数组为dp[i]，i表示了当前遍历到原始数组nums中的第i个元素，dp[i]自然就表示到达DP数组当前元素目前最长上升子序列的长度，那状态转移公式呢？根据我们以往的做题经验和直觉，dp[i]应该和dp[i-1]相关，更远一点，可能还和dp[i-2]相关。

但是这里并不是，这是因为，题目要求我们的是求子序列的长度，而子序列中的组成元素在原始数组中完全可以相隔很远，而且相邻的两个元素完全可以属于不同的子序列，比如示例2，nums = [0,1,0,3,2,3]，第一个元素3可以属于子序列0、3或者1、3，元素2可以属于0、1、2或者0、2。这就意味着，在我们遍历原始数组并填充DP数组的的过程中，每遇到一个元素，其实都要从头遍历原始数组以确定当前元素能够构成的最长上升子序列和长度。

所以状态转移公式需要放在一个两层循环中：

```java
nums = [0,1,0,3,2,3]

​    for (int i = 0; i < nums.length; i++) {

​       for (int j = 0; j < i; j++) {

​        if (nums[i] > nums[j])

​          dp[i] = Math.max(dp[i], dp[j] + 1);

​      }

​    }

Dp[0]=1,dp[1]=2,db[2]=0,dp[3]=2 dp[4]=2 dp[5]=2
```

 

i用来遍历原始数组，j用来每遇到一个元素时往前寻找，当前元素能够组成的最长子序列，并在这个过程中填充DP数组。

dp[i] 则可以将所有元素置 1作为初始值，含义是每个元素都至少可以单独成为子序列，此时长度都为 1。

当遍历完原始数组和填充完DP数组后，就可以遍历DP数组找到其中的最大值作为结果返回。



```java
/*标准DP实现*/
public int lengthOfLIS(int[] nums) {
    int[] dp = new int[nums.length];
    Arrays.fill(dp, 1);
    for (int i = 0; i < nums.length; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[i] > nums[j])
                dp[i] = Math.max(dp[i], dp[j] + 1);
        }
    }
    int res = 0;
    for (int i = 0; i < dp.length; i++) {
        res = Math.max(res, dp[i]);
    }
    return res;
}
```

