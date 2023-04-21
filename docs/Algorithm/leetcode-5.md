---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Algorithm/
typora-root-url: ..\.vuepress\public
---

[5. 最长回文子串 - 力扣（LeetCode）](https://leetcode.cn/problems/longest-palindromic-substring/)



## 暴力解法

::: tip

中心旋转的处理方式

:::

既然是回文子串，特点是什么？一定是对称的，比如“aba”以b为轴对称，“bb”也是对称的，不过是基于空格对称，所以我们可以每次循环选择一个中心，进行左右扩展，判断左右字符是否相等。

但是在具体实现的时候，需要注意，字符串中字符的个数奇数和偶数两种，所以我们需要从一个字符开始扩展，或者从两个字符之间开始扩展，所以总共有 n（字符串个数）+n-1（字符之间空格的个数） 个中心。

```java
public class LongestPalindromic_5 {
    // badab
    public String longestPalindrome(String s) {
        int maxStart = 0, maxEnd = 0;
        for (int i = 0; i < s.length(); i++) {
            /*以当前字符为中心，进行左右扩展*/
            int charCenterLen = expandAroundCenter(s, i, i);
            /*以当前字符后的空白为中心，进行左右扩展*/
            int BlackCenterLen = expandAroundCenter(s, i, i + 1);
            int len = Math.max(charCenterLen, BlackCenterLen);
            /*更新最长的回文子串的长度*/
            if (len > maxEnd - maxStart) {
                maxStart = i - (len - 1) / 2;
                maxEnd = i + len / 2;
            }
        }
        return s.substring(maxStart, maxEnd + 1);
    }

    private int expandAroundCenter(String s, int left, int right) {
        /*从中心，进行左右扩展判断字符是否相等，每次步进一个字符*/
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        return right - left - 1;
    }


}
```



## 动态规划

当原始字符串只有一个字符时，它是回文子串，当原始字符串只有2个字符，且两个字符一样时，也是回文子串时。但是当原始字符串的字符大于2个时，就可以用DP来解决。

首先定义一个DP数组，要注意，这里DP数组需要定义为二维数组，为什么呢？因为长度为n的字符串的子串是从i到j，其中i可以从0到n-1，j也可以从0到n-1，那就是说子串的可能性有n2种，所以需要用n*n的二维数组来记录子串是否为回文串，其中的每个元素`dp[i][j]`，就表示子串 s[i..j] 是否为回文子串，很明显这个二维数组里当i=j时，`dp[i][j]`肯定为true，而这个也可以作为我们DP数组的初始化部分。而且因为j>i，这个二维数组里只有对角线的上半部分才有意义。

> `dp[左边start][右边end]`

![image-20230421114846545](/images/algorithm/image-20230421114846545.png)

那对于这个DP数组而言，状态转移公式是什么呢？是

`dp[i][j] = （dp[i][j-1]相关）||（dp[i-1][j-1]相关）||（dp[i-1][j]相关）`吗？都不是，仔细看看示例，aba是回文子串，此时i=1，j=3。按照前面所说根据头尾字符是否相等且i和j是递增量，我们可以知道，b是回文子串，当i=2，j=2时。那就说明状态转移公式应该是：

```
dp[i][j] = (s[i] == s[j]) and dp[i + 1][j - 1]
```

每当`dp[i][j] = true`，就需要记录子串的「长度」和「起始位置」，并且保存长度最大的那个。

最终形成的二维数组如下图所示：



```java
public class LongestPalindromic_DP_5 {
    public String longestPalindrome(String s) {
        /*特殊用例判断，原始字符串只有1个字符和只有2个字符时*/
        int len = s.length();
        if (len == 1) {
            return s;
        }
        char[] charArray = s.toCharArray();
        if(len ==2){
            if( charArray[1]==charArray[0]){
                return s;
            }else{
                return s.substring(0,1);
            }
        }
        /*记录回文子串的「长度」和「起始位置」*/
        int maxLen = 1;
        int begin = 0;

        /*dp[i][j] 表示 s[i, j] 是否是回文串*/
        boolean[][] dp = new boolean[len][len];
        /*dp[i][j]中i=j时，表示原始字符串中的每个字符，当然是回文串*/
        for (int i = 0; i < len; i++) {
            dp[i][i] = true;
        }
        /*填充dp数组，j总是要比i大*/
        for (int j = 1; j < len; j++) {
            for (int i = 0; i < j; i++) {
                if (charArray[i] != charArray[j]) {
                    dp[i][j] = false;
                } else {
                    /*因为i < j，j - i < 3的取值就是1和2，j和i组成的子串包括2个字符或者3个字符
                    j和i指向的两个字符又相等，当然是回文串*/
                    if (j - i < 3) {
                        dp[i][j] = true;
                    } else {
                        /*回文串将它首尾的两个字母去除之后，它仍然是个回文串
                        * 反过来，回文串首尾加上两个一样的字符，还是个回文串
                        * 同样，非回文串首尾加上两个一样的字符，还是个非回文串*/
                        dp[i][j] = dp[i + 1][j - 1];
                    }
                }

                /* 只要 dp[i][j] == true 成立，就表示子串 s[i..j] 是回文，此时记录回文长度和起始位置*/
                if (dp[i][j] && j - i + 1 > maxLen) {
                    maxLen = j - i + 1;
                    begin = i;
                }
            }
        }
        return s.substring(begin, begin + maxLen);
    }
}
```

