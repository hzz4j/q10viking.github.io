---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Algorithm/
typora-root-url: ..\.vuepress\public

---

::: tip

[470. 用 Rand7() 实现 Rand10()](https://leetcode.cn/problems/implement-rand10-using-rand7/)

:::

rand7()等概率地产生1，2，3，4，5，6，7。要想得到rand10()即等概率的生成1-10。解题思路是先构造一个randN()，这个N必须是10的整数倍，然后randN %10就可以得到rand10()了。

所以可以从rand7()先构造出rand49()，再把rand49()中大于等于40的都过滤掉，这样就得到了rand40()，在对10取余即可。

具体构造步骤，rand7() --> rand49()--> rand40() --> rand10()：

1. rand7()等概率地产生1，2，3，4，5，6，7；

2. rand7() - 1等概率地产生[0，1，2，3，4，5，6]；

3. (rand7() - 1) *7等概率地产生0，7，14，21，28，35，42；

4. (rand7 () - 1)*7 +(rand7() - 1)等概率地产生[0~48]这49个数字；

5. 如果步骤4的结果大于等于40，那么就重复步骤4，直到产生的数小于40；

6. 把步骤5的结果mod 10再加1，就会等概率的随机生成[1~10]；

```java
class Solution extends SolBase {
    public int rand10() {
        int num = 40;
        while(num >= 40){
            num = (rand7() - 1) + (rand7() - 1) * 7;
        }
        return num % 10 + 1;
        
    }
}
```

这道题完全可以推广到生成任意数的随机数问题，用randN()实现randM()，M>N。步骤如下:

1．用randN()先实现randX()，其中X≥M，X是N的整数倍。如这题中的N=7，X=49，M=10；

2．再用randX()生成randY()，其中Y是M的整数倍，如这题中Y=40，M=10；

3．将randY()的值mod M 再加1，就是我们需要的randM()的结果。

举个例子，用rand3()生成rand11()，可以先生成rand27()，然后变成以22为界限，因为22是11的倍数。具体步骤：

1. rand3()等概率地产生1，2，3；

2. rand3() - 1等概率地产生0，1，2；

3. (rand3() - 1) * 3等概率地产生0，3，6；

4. (rand3() - 1) * 3 *3等概率地产生0，9，18；
5. 3 * 3 * (rand3() - 1) + 3 * (rand3() - 1)+(rand3() - 1)等概率地产生[0~26]这27个数字

6. 如果步骤5的结果大于等于22，那么就重复步骤5，直到产生的数小于22；
7. 把步骤5的结果mod 11再加1，就会等概率的随机生成[1~11]；