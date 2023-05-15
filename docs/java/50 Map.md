---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



[Source Code](https://github.com/Q10Viking/learncode/tree/main/javabasic/src/org/hzz/collection/map)

集合有两个大接口：Collection 和 Map

![](/images/java/e9786a20-e691-11e9-80c2-21d8cc9d922e)



## EnumMap

因为`HashMap`是一种通过对key计算`hashCode()`，通过空间换时间的方式，直接定位到value所在的内部数组的索引，因此，查找效率非常高。

如果作为key的对象是`enum`类型，那么，还可以使用Java集合库提供的一种`EnumMap`，它在内部以一个非常紧凑的数组存储value，并且根据`enum`类型的key直接定位到内部数组的索引，并不需要计算`hashCode()`，不但效率最高，而且没有额外的空间浪费

但是一般不建议使用，比如Android的官网

> 不建议使用enums，占用内存多（Enums often require more than twice as much memory as static constants.）

```java
public enum DayOfWeek {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY;
}
```

完全可以用静态常量替换

```java
public interface DayOfWeekConsts {
    int MONDAY = 0; int TUESDAY = 1; int WEDNESDAY = 2; 
    int THURSDAY = 3;int FRIDAY = 4; int SATURDAY = 5; int SUNDAY = 6;
}
```



> 测试

```java
public class EnumMapTest {
    public static void main(String[] args) {
        Map<DayOfWeek,String> map = new EnumMap<>(DayOfWeek.class);
        map.put(DayOfWeek.MONDAY,"星期一");
        map.put(DayOfWeek.TUESDAY, "星期二");
        map.put(DayOfWeek.WEDNESDAY, "星期三");
        map.put(DayOfWeek.THURSDAY, "星期四");
        map.put(DayOfWeek.FRIDAY, "星期五");
        map.put(DayOfWeek.SATURDAY, "星期六");
        map.put(DayOfWeek.SUNDAY, "星期日");
        System.out.println(map);
        System.out.println(map.get(DayOfWeek.MONDAY));
    }
}
/**
 * {MONDAY=星期一, TUESDAY=星期二, WEDNESDAY=星期三, THURSDAY=星期四, FRIDAY=星期五, SATURDAY=星期六, SUNDAY=星期日}
 * 星期一
 */
```

----------

```java
private static void test2(){
    Map<Integer,String> map = new HashMap<>();
    map.put(DayOfWeekConsts.MONDAY,"星期一");
    map.put(DayOfWeekConsts.TUESDAY, "星期二");
    map.put(DayOfWeekConsts.WEDNESDAY, "星期三");
    map.put(DayOfWeekConsts.THURSDAY, "星期四");
    map.put(DayOfWeekConsts.FRIDAY, "星期五");
    map.put(DayOfWeekConsts.SATURDAY, "星期六");
    map.put(DayOfWeekConsts.SUNDAY, "星期日");
    System.out.println(map);
    System.out.println(map.get(DayOfWeekConsts.MONDAY));
}
/**
     * {0=星期一, 1=星期二, 2=星期三, 3=星期四, 4=星期五, 5=星期六, 6=星期日}
     * 星期一
     */
```



## TreeMap

> 默认是根据key升序排序

```java
Map<String, Integer> map = new TreeMap<>();
map.put("orange", 1);
map.put("apple", 2);
map.put("pear", 3);
System.out.println(map); // {apple=2, orange=1, pear=3}
```

### TreeMap 怎么实现根据 value 值倒序

先把 TreeMap 转换为 ArrayList，在使用 Collections.sort() 根据 value进行倒序牌排序

```java
public class TreeMapDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new TreeMap<>();
        map.put("orange", 1);
        map.put("apple", 2);
        map.put("pear", 3);
        System.out.println(map); // {apple=2, orange=1, pear=3}
        orderValueDesc(map);
    }

    private static void orderValueDesc(Map<String,Integer> map){
        List<Map.Entry<String, Integer>> list = new ArrayList(map.entrySet());

        // 定义一个比较器Comparator
        Comparator<Map.Entry<String, Integer>> descValue = (item1,item2)
                -> item2.getValue().compareTo(item1.getValue());

        list.sort(descValue);
        System.out.println(list); // [pear=3, apple=2, orange=1]
    }
}
```



## HashMap 和 Hashtable 有什么区别

HashMap 和 Hashtable 区别如下：

  * Hashtable 使用了 synchronized 关键字来保障线程安全，而 HashMap 是非线程安全的；
  * HashMap 允许 K/V 都为 null，而 Hashtable K/V 都不允许 null；
  * HashMap 继承自 AbstractMap 类；而 Hashtable 继承自 Dictionary 类。



### 

## 有哪些方法可以解决哈希冲突

  * 开放定址法：当关键字的哈希地址 p=H（key）出现冲突时，以 p 为基础，产生另一个哈希地址 p1，如果 p1 仍然冲突，再以 p 为基础，产生另一个哈希地址 p2，循环此过程直到找出一个不冲突的哈希地址，将相应元素存入其中。
  * 再哈希法：这种方法是同时构造多个不同的哈希函数，当哈希地址 Hi=RH1（key）发生冲突时，再计算 Hi=RH2（key），循环此过程直到找到一个不冲突的哈希地址，这种方法唯一的缺点就是增加了计算时间。
  * 链地址法：这种方法的基本思想是将所有哈希地址为 i 的元素构成一个称为同义词链的单链表，并将单链表的头指针存在哈希表的第 i 个单元中，因而查找、插入和删除主要在同义词链中进行。链地址法适用于经常进行插入和删除的情况。
  * 建立公共溢出区：将哈希表分为基本表和溢出表两部分，凡是和基本表发生冲突的元素，一律填入溢出表。



## HashMap 的扩容为什么是 `2^n`

这样做的目的是为了让散列更加均匀，从而减少哈希碰撞，以提供代码的执行效率。



## 有哈希冲突的情况下 HashMap 如何取值

如果有哈希冲突，HashMap 会循环链表中的每项 key 进行 equals 对比，返回对应的元素。相关源码如下：

```java
do {
    if (e.hash == hash &&
        ((k = e.key) == key || (key != null && key.equals(k)))) // 比对时还是先看 hash 值是否相同、再看地址或 equals
        return e; // 如果当前节点 e 的键对象和 key 相同，那么返回 e
} while ((e = e.next) != null); // 看看是否还有下一个节点，如果有，继续下一轮比对，否则跳出循环
```



## 为什么重写 equals() 时一定要重写 hashCode()

因为 Java 规定，如果两个对象 equals 比较相等（结果为 true），那么调用 hashCode 也必须相等。如果重写了 equals()
但没有重写 hashCode()，就会与规定相违背
