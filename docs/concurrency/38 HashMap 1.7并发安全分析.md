---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

## Hashtable的数据结构

### JDK1.7

数组+链表

### JDK1.8

数组+链表+红黑树

### HashMap的容量

> ```elm
> The default initial capacity - MUST be a power of two.
> static final int DEFAULT_INITIAL_CAPACITY = 1 << 4;
> ```

数组的大小

```java
new HashMap<>() 	//	默认大小是16 
DEFAULT_INITIAL_CAPACITY = 1<<4;

new HashMap<>(11) 	//	自定义初始容量
```

如果传入进来的不是2的幂次方，那么会通过roundUpToPowerOf2(size)，转化规则

1. 必须是最接近size,11
2. 必须大于size
3. 是2的指数次幂

为什么是2的指数次幂呢？

进行的位运算，为了让hash更加的散列

```java
  264       static int hash(int h) {
  265           // This function ensures that hashCodes that differ only by
  266           // constant multiples at each bit position have a bounded
  267           // number of collisions (approximately 8 at default load factor).
  268           h ^= (h >>> 20) ^ (h >>> 12);
  269           return h ^ (h >>> 7) ^ (h >>> 4);
  270       }
```

然后计算index索引

```java
static int indexFor(int h,int length){
	return h & (length-1);
}

h = 
    0001 0101 0110 0010 1101 
    0000 0000 0000 0001 0000  // 不减一最终得出的结果不是16就是0
    
    0001 0101 0110 0010 1101  // 减一的情况
    0000 0000 0000 0000 1111  // 能够确保后面&的结果
```



## 时间复杂度

```java
get,put的时间复杂度都是O(1)
```

key.hashCode 是不确定的，有符号的整型值

key.hashCode % 16 = [0- 15] = index  = 3

hash并不是用取模计算index的，而是用位运算，因为位运算的效率高于取模

```java
public class BitAndModulus {

    @Test
    public void bit() {
        int number = 100 * 1000;//分别取值10万、100万、1000万、1亿
        int a = 1;
        long start = System.currentTimeMillis();
        for(int i = number; i > 0 ; i++) {
            a = a & i;
        }
        long end = System.currentTimeMillis();
        System.out.println("位运算耗时： " + (end - start));
    }


    @Test
    public void modulus() {
        int number = 100 * 1000;//分别取值10万、100万、1000万、1亿
        int a = 1;
        long start = System.currentTimeMillis();
        for(int i = number; i > 0; i++) {
            a %= i;
        }
        long end = System.currentTimeMillis();
        System.out.println("取模运算耗时： " + (end - start));
    }
}
/**
 位运算耗时： 698
 取模运算耗时： 15669
 */
```

![image-20210630011054625](/images/concurrency/image-20210630011054625.png)

### 取模之后hash碰撞

为了解决hash冲突，引入了链表，采用头部插入法

![image-20210630011531634](/images/concurrency/image-20210630011531634.png)

## HashMap扩容原理

### 重要成员变量

- DEFAULT_INITIAL_CAPACITY = 1 << 4; Hash表默认初始容量
- MAXIMUM_CAPACITY = 1 << 30; 最大Hash表容量
- DEFAULT_LOAD_FACTOR = 0.75f；默认加载因子
- TREEIFY_THRESHOLD = 8；**链表转红黑树阈值**
- UNTREEIFY_THRESHOLD = 6；红黑树转链表阈值
- MIN_TREEIFY_CAPACITY = 64；链表转红黑树时hash表最小容量阈值，达不到优先扩容。

threshold扩容阈值 = capacity * 扩容比率 0.75 = 16 * 0.75 = 12

扩容为原来的2倍（2的指数幂）

扩容之后，transfer移动元素

> 在转移的过程中，会把原来的链表顺序颠倒过来存储到新的HashMap中

```java
void transfer(Entry[] newTable, boolean rehash) {
        int newCapacity = newTable.length;
        for (Entry<K,V> e : table) {
            while(null != e) {
                Entry<K,V> next = e.next;
                if (rehash) { 
                    e.hash = null == e.key ? 0 : hash(e.key);//再一次进行hash计算？
                }
                int i = indexFor(e.hash, newCapacity);
                e.next = newTable[i];	//	链表的头插法
                newTable[i] = e;
                e = next;
            }
        }
    }
```



### 单线程扩容

**假设：**hash算法就是简单的key与length(数组长度)求余。hash表长度为2，如果不扩容， 那么元素key为3,5,7按照计算(key%table.length)的话都应该碰撞到table[1]上。

**扩容：**hash表长度会扩容为4重新hash，key=3 会落到table[3]上(3%4=3)， 当前e.next为key(7), 继续while循环重新hash，key=7 会落到table[3]上(7%4=3), 产生碰撞， 这里采用的是头插入法，所以key=7的Entry会排在key=3前面(这里可以具体看while语句中代码)当前e.next为key(5), 继续while循环重新hash，key=5 会落到table[1]上(5%4=1)， 当前e.next为null, 跳出while循环，resize结束。

![img](/images/concurrency/4136singleThread.png)



### ❤️多线程扩容问题❤️

**如thread1,thread2同时进行扩容，next指向并不一定就是元素的next指向的元素（头插法的原因），最终在整个移动元素的过程中会出现循环链表。因为每个线程都会创建一个新的数组**

**当形成环之后，再往里面put，元素时，恰好此时插入的元素有hash碰撞，由于需要遍历整个链表是否存在该元素，但是该链表是循环链表，导致一直再循环，出不来**

```java
while(null != e) {
      Entry<K,V> next = e.next;//第一行，线程1执行到此被调度挂起
      int i = indexFor(e.hash, newCapacity);//第二行
      e.next = newTable[i];//第三行
      newTable[i] = e;//第四行
      e = next;//第五行
}
```

![image-20210630133258242](/images/concurrency/image-20210630133258242.png)



#### 具体过程

```java
while(null != e) {
      Entry<K,V> next = e.next;//第一行，线程1执行到此被调度挂起
      int i = indexFor(e.hash, newCapacity);//第二行
      e.next = newTable[i];//第三行
      newTable[i] = e;//第四行
      e = next;//第五行
}
```

那么此时状态为

![img](/images/concurrency/4148-1.png)

从上面的图我们可以看到，因为线程1的 e 指向了 key(3)，而 next 指向了 key(7)，在线程2 rehash 后，就指向了线程2 rehash 后的链表。

然后线程1被唤醒了：

1. 执行e.next = newTable[i]，于是 key(3)的 next 指向了线程1的新 Hash 表，因为新 Hash 表为空，所以e.next = null
2. 执行newTable[i] = e，所以线程1的新 Hash 表第一个元素指向了线程2新 Hash 表的 key(3)。好了，e 处理完毕。
3. 执行e = next，将 e 指向 next，所以新的 e 是 key(7)

然后该执行 key(3)的 next 节点 key(7)了:

1. 现在的 e 节点是 key(7)，首先执行Entry next = e.next,那么 next 就是 key(3)了
2. 执行e.next = newTable[i]，于是key(7) 的 next 就成了 key(3)
3. 执行newTable[i] = e，那么线程1的新 Hash 表第一个元素变成了 key(7)
4. 执行e = next，将 e 指向 next，所以新的 e 是 key(3)

此时状态为：

<img src="/images/concurrency/4153-1.png" alt="img" style="zoom:50%;" />

然后又该执行 key(7)的 next 节点 key(3)了：

1. 现在的 e 节点是 key(3)，首先执行Entry next = e.next,那么 next 就是 null
2. 执行e.next = newTable[i]，于是key(3) 的 next 就成了 key(7)
3. 执行newTable[i] = e，那么线程1的新 Hash 表第一个元素变成了 key(3)
4. 执行e = next，将 e 指向 next，所以新的 e 是 key(7)

这时候的状态如图所示：

<img src="/images/concurrency/4156-1.png" alt="img" style="zoom:50%;" />

很明显，环形链表出现了。

## 加载因子

loadfactor = 0.75 为什么不是0.5？

> As a general rule, the default load factor (.75) offers a good tradeoff between time and space costs



## 循环链表案例

> JDK1.7情况下,会产生循环链表，导致程序一直运行

```java
public class MapDeadLock {

    public static void main(String[] args) {
        for (int i=0; i<10; i++){
            new Thread(new MultiThread()).start();
        }
    }
}
```

```java
public class MultiThread implements Runnable {
    private static Map<Integer,Integer> map = new ConcurrentHashMap<>(11);

    private static AtomicInteger atomicInteger = new AtomicInteger();

    public void run() {
        while(atomicInteger.get() < 1000000){
            map.put(atomicInteger.get(),atomicInteger.get());
            atomicInteger.incrementAndGet();
        }
    }
}
```

## HashMap线程不安全的原因

1. JDK1.7扩容多线程出现循环链表
2. JDK1.8和JDK1.7在put元素的时候，在多线程的情况下会产生数据丢失情况

![image-20210630155701579](/images/concurrency/image-20210630155701579.png)