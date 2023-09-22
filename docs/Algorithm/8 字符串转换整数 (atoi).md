---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Algorithm/
typora-root-url: ..\.vuepress\public
---



::: tip

[字符串转换整数 (atoi)](https://leetcode.cn/problems/string-to-integer-atoi/)

:::

> 循环处理

```java
class Solution {

    public int myAtoi(String str) {
        if(str==null)
            return 0;
        str = str.trim();
        if(str.length()==0)
            return 0;
        
        long tmp = 0;
        int index=0;
        boolean isnegtive=false;
        if(str.charAt(0) == '-'){
            isnegtive = true;
            index++;
        }else if(str.charAt(0)=='+')
            index++;
        else if(!Character.isDigit(str.charAt(0)))
            return 0;


        for(int i=index;i<str.length();i++){
            char c = str.charAt(i);
            if(!Character.isDigit(c))
                break;

            int d = c-'0';
            if(tmp>(Integer.MAX_VALUE - d)/10){
                return (isnegtive)? Integer.MIN_VALUE:Integer.MAX_VALUE;
            }
            tmp = tmp*10+d;

        }
        int f = isnegtive ? -1:1;
        return (int)tmp*f;    
    }

}
```

