---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



## hashCode介绍

hashCode() 的作用是获取哈希码，也称为散列码；它实际上是返回一个int整数。这个哈希码的作用是确定该对象在哈希表中的索引位置。hashCode() 定义在JDK的Object.java中，Java中的任何类都包含有hashCode() 函数。

```java
// Object类是一个本地方法
public native int hashCode();
// String类
public int hashCode() {
    int h = hash;
    if (h == 0 && value.length > 0) {
        char val[] = value;

        for (int i = 0; i < value.length; i++) {
            h = 31 * h + val[i];
        }
        hash = h;
    }
    return h;
}
```

散列表存储的是键值对(key-value)，它的特点是：能根据“键”快速的检索出对应的“值”。这其中就利用到了散列码！（可以快速找到所需要的对象）



### 为什么要有hashCode

以“HashSet如何检查重复”为例子来说明为什么要有hashCode：

对象加入HashSet时，HashSet会先计算对象的hashcode值来判断对象加入的位置，看该位置是否有值，

如果没有、HashSet会假设对象没有重复出现。

但是如果发现有值，**这时会调用equals（）方法来检查两个对象是否真的相同**。如果两者相同，HashSet就不会让其加入操作成功。如果不同的话，就会重新散列到其他位置。这样就大大减少了equals的次数，相应就大大提高了执行速度。





## 建议

- 如果两个对象相等，则hashcode一定也是相同的
- 两个对象相等,对两个对象分别调用equals方法都返回true
- 两个对象有相同的hashcode值，它们也不一定是相等的（因为会出现hash冲突）
  因此，equals方法被覆盖过，则hashCode方法也必须被覆盖，hashCode()的默认行为是对堆上的对象产生独特值。如果没有重写hashCode()，则该class的两个对象无论如何都不会相等（即使这两个对象指向相同的数据）

**两个不相等的对象有可能具有相同的哈希码。**哈希码是由对象的哈希函数生成的一个整数值，用于支持快速查找和比较对象。

然而，由于哈希码的范围通常比对象的数量小得多，因此不同的对象可能会产生相同的哈希码。这种情况被称为哈希冲突。

哈希算法设计的目标是将不同的输入均匀分布在哈希码空间中，但无法避免完全消除冲突。因此，当发生哈希冲突时，哈希算法会使用特定的策略（例如链表或树结构）来处理这些冲突，以确保不同的对象可以存储在同一个哈希桶中。

哈希码仅用于初步判断对象是否可能相等，最终的相等性检查还需要通过 equals() 方法进行。因此，在重写 equals() 方法时，也应该相应地重写 hashCode() 方法，以尽量减少哈希冲突的发生
