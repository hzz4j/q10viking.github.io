---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



### 

## asList

将数组转化成list

```java
// 会生成[[3,20]]
List<int[]> ints = Arrays.asList(new int[]{3, 20});
// 生成[3,20]  一般我们使用这种方式
List<Integer> integers = Arrays.asList(3, 20);
```



### equals

```java
int[] A = { 1, 2, 3, 4, 5 };
int[] B = { 1, 2, 3, 4, 5 };
Arrays.equals(A,B)
```



### deepEquals

```java
int[][] A = { { 1, 2, 3 }, { 3, 4, 5 }, { 6, 7, 8 } };
int[][] B = { { 1, 2, 3 }, { 3, 4, 5 }, { 6, 7, 8 } };
Arrays.deepEquals(A, B)
```

