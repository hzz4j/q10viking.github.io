---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Algorithm/
typora-root-url: ..\.vuepress\public
---





::: tip

[215. 数组中的第K个最大元素 - 力扣（LeetCode）](https://leetcode.cn/problems/kth-largest-element-in-an-array/)

:::



不完全排序完数组，即可拿到结果值。

## 快排特性

::: tip

[Source Code KthInArray_215_QuickSelect.java](https://github.com/Q10Viking/learncode/blob/main/algorithm/src/main/java/org/hzz/array/KthInArray_215_QuickSelect.java)

:::

![image-20220815215106531](/images/algorithm/image-20220815215106531.png)

在快排的分区操作中，每次分区操作结束都会返回一个点，也就是我们代码中数据分割成独立的两部分时，从哪儿分区的指示器，**这个指示器的下标和最终排序之后有序数组中这个元素所在的下标是一致的**。

利用这个特性，我们可以不断的划分数组区间，最终找到第K大的元素。比如将数组执行升序排列，执行一次分区操作以后，如果这个元素的下标比K小，那么接着就在后边的区间继续执行分区操作;如果这个元素的下标比K大，那么就在左边的区间继续执行分区操作;如果相等就直接输出这个下标对应的数组元素即可。

```java
public class KthInArray_215_QuickSelect {

    public int findKthLargest(int[] nums, int k) {
        int target = nums.length - k;
        int start = 0,end = nums.length - 1;
        while(true){
            int zoneIndex = partion(nums,start,end);
            if(zoneIndex == target){
                return nums[target];
            }else if(zoneIndex < target){
                start = zoneIndex + 1;
            } else{
                end = zoneIndex - 1;
            }
        }
    }

    private int partion(int[] nums,int start,int end){
        if(start == end) return start;
        // 基准数的选择，会提升优化的效率
        int pivot = (int) (start + Math.random() * (end - start + 1));
        int zoneIndex = start - 1;
        swap(nums,pivot,end);
        for (int i = start; i <= end; i++) {
            // 注意等于
            if(nums[i] <= nums[end]){
                zoneIndex++;
                if(i > zoneIndex){
                    swap(nums,i,zoneIndex);
                }
            }
        }
        return zoneIndex;
    }

    private void swap(int[] arrays,int i,int j){
        int temp = arrays[i];
        arrays[i] = arrays[j];
        arrays[j] = temp;
    }

}
```

