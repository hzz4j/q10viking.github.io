---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Algorithm/
typora-root-url: ..\.vuepress\public
---



[621. 任务调度器 - 力扣（LeetCode）](https://leetcode.cn/problems/task-scheduler/)

以考虑使用贪心：每次都是优先（贪心）选择不在冷却中并且剩余执行次数最多的那个任务，并且让这个类型的任务两次执行的时间间隔至少要等于大于n，再在这个时间间隔内填充其他的任务。

以示例1的 tasks = ["A","A","A","B","B","B"], n = 2为例来说明

​                               ![image-20230422083653967](/images/algorithm/image-20230422083653967.png)

我们先安排出现次数最多的任务"A",并且让两次执行"A"的时间间隔为2。在这个时间间隔内，我们用其他任务类型去填充，当然是继续选择出现次数最多的任务，这里是任务B，B也是需要2个时间间隔的，但是继续选择下去并没有其他任务可供选择了，因此额外需要一个冷却时间间隔。

示例3的tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"], n = 2按照这种方法则如下图：

 ![image-20230422083723916](/images/algorithm/image-20230422083723916.png)

但是不管是示例1还是示例3，图中一共占用的方格即为完成所有任务需要的时间，就是：

> (最大执行次数-1)*(n+1)+拥有最大执行次数的任务类型数。

但是如果出现类似这种情况呢？

 ![image-20230422083744666](/images/algorithm/image-20230422083744666.png)

为了符合我们上面的计算公式，表格填入的方法如上图，这样根据公式算出来的值是 (3-1)*(2+1)+2 = 8，但是实际的数组长度为10，这就说明当可选择的任务类型超过了n的值，或者n的值为0时，上面的公式算出来的值要小于数组长度，这种情况的实际意义其实也就是在安排时无需冷却时间。

这种只需要在一个任务的两次出现间只需要填充其他任务，而无冷却时间这种情况下，所需要的时间即为tasks的长度，大于公式结果值。而可以根据公式正确获得结果的情况里，因为存在着冷却时间，tasks是要小于公式结果值的，所以在获得最终结果时，要取“tasks的长度”和“公式结果值”两者的较大值。



```java
class Solution {
    public int leastInterval(char[] tasks, int n) {
        int[] charOccurenceCountArr = new int[26];
        /*统计各个字母出现的次数*/
        for(char c: tasks) charOccurenceCountArr[c-'A']+=1;
        /*找到最大次数*/
        int max = 0;
        for(int v: charOccurenceCountArr) max = Math.max(max, v);

        int result = (max-1)*(n+1);// 最大任务数类型有多少种	
        for(int v: charOccurenceCountArr) {
        	if(max == v) result++;
        }

        return Math.max(tasks.length, result);
    }
}
```

