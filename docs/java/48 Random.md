---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



## Random随机数

```java
// 产生[0,10)之间的随机数，左边闭区间，右边开区间
new Random().nextInt(10)
```



## 种子(伪随机数问题)

[Source Code](https://github.com/Q10Viking/learncode/tree/main/javabasic/src/org/hzz/random)

> 如果seed固定了，那么产生的随机数是伪随机数

```java
public class RandomTest {
    public static void main(String[] args) {
        int[] arr1 = new int[10];
        int[] arr2 = new int[10];
        long seed = 100l;
        for (int i = 0;i<10;i++){
            arr1[i] = new Random().nextInt(10);
            arr2[i] = new Random(seed).nextInt(10);
        }

        System.out.println(Arrays.toString(arr1));
        System.out.println(Arrays.toString(arr2));
    }
}
/**
 * [0, 1, 1, 9, 6, 6, 4, 2, 9, 0]
 * [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
 */
```

可以看到指定了seed，这个随机数有规律的。而无参的构造函数，它内部也会调用有参的构造函数传入一个seed，只不过这个seed不是固定的它和当前系统的时间有关

```java
public Random() {
    this(seedUniquifier() ^ System.nanoTime());
}
```



> 在看一个体现伪随机数的例子

```java
public class PseudoRandomNumberDemo {
    public static void main(String[] args) {
        int[] arr1 = new int[10];
        int[] arr2 = new int[10];
        // 种子都一样
        long seed = 100l;
        Random random1 = new Random(seed);
        Random random2 = new Random(seed);
        for (int i = 0;i<10;i++){
            arr1[i] = random1.nextInt(10);
            arr2[i] = random2.nextInt(10);
        }

        System.out.println(Arrays.toString(arr1));
        System.out.println(Arrays.toString(arr2));
    }
}
/**
 * [5, 0, 4, 8, 1, 6, 6, 8, 3, 3]
 * [5, 0, 4, 8, 1, 6, 6, 8, 3, 3]
 */
```

所以如果要使用种子，那么这个种子得保密，因为一旦暴露，比如黑客，就能根据这个种子生产出相同的随机数序列出来。