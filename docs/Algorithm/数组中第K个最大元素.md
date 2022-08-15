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

[快速排序 & 堆排序](https://q10viking.github.io/Algorithm/%E5%8D%81%E5%A4%A7%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95.html)

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



## 堆实现

::: tip

[Source Code KthInArray_215_HeapSort.java](https://github.com/Q10Viking/learncode/blob/main/algorithm/src/main/java/org/hzz/array/KthInArray_215_HeapSort.java)

在学习堆排序的时候，我们知道，许多应用程序都需要处理有序的元素，但不一定要求他们全部有序，或者不一定要一次就将他们排序，很多时候，我们每次只需要操作数据中的最大元素（最小元素）。这里刚好就是堆排序的运用场景，所以这个题目还可以使用堆排序来实现。

:::

建立一个最大堆，做 k−1 次删除操作后堆顶元素就是我们要找的答案。

**虽然基于堆排序的实现比基于快速排序分区的实现性能上要慢，但是基于快速排序分区的实现必须把所有的数据读入内存中，基于堆排序的实现在数据量很大的时候，不用一下子把所有数据读入内存，这就有很大的用武之地了**

```java
public class KthInArray_215_HeapSort {
    private static int len;
    public int findKthLargest(int[] nums, int k) {
        len = nums.length;
        buildMaxHeap(nums);
        System.out.println(Arrays.toString(nums));
        for (int i = 0; i<k;i++){
            swap(nums,0,len - 1);
            len--;
            adjustHeap(nums,0);
            System.out.println(Arrays.toString(nums));
        }
        return nums[nums.length - k];
    }

    private void buildMaxHeap(int[] arrays){
        for (int i= len/2-1;i>=0;i--){
            adjustHeap(arrays,i);
        }
    }

    private void adjustHeap(int[] arrays,int index){
        int maxIndex = index;
        int left = index*2 + 1;
        int right = 2*(index+1);

        if(left < len && arrays[left] > arrays[maxIndex]){
            maxIndex = left;
        }

        if(right<len && arrays[right] > arrays[maxIndex]){
            maxIndex = right;
        }

        if (maxIndex != index){
            swap(arrays,maxIndex,index);
            adjustHeap(arrays,maxIndex);
        }
    }

    private void swap(int[] arrays,int i,int j){
        int temp = arrays[i];
        arrays[i] = arrays[j];
        arrays[j] = temp;
    }

    public static void main(String[] args) {
        System.out.println(new KthInArray_215_HeapSort().findKthLargest(new int[]{3, 2, 1, 5, 6, 4}, 2));
    }
}
/**
 * [6, 5, 4, 3, 2, 1]
 * [5, 3, 4, 1, 2, 6]
 * [4, 3, 2, 1, 5, 6]
 * 5
 */
```

