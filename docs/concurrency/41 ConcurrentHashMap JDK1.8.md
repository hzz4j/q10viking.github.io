---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## 并发安全控制

java8中 ConcurrentHashMap**基于分段锁+CAS保证线程安全**，分**段锁基于synchronized关键字实现**

![img](/images/concurrency/16135-1.png)

## 源码分析

### 重要成员变量

- LOAD_FACTOR: 负载因子, 默认75%, 当table使用率达到75%时, 为减少table的hash碰撞, tabel长度将扩容一倍。负载因子计算: 元素总个数%table.lengh
- TREEIFY_THRESHOLD: 默认8, 当链表长度达到8时, 将结构转变为红黑树。
- UNTREEIFY_THRESHOLD: 默认6, 红黑树转变为链表的阈值。
- MIN_TRANSFER_STRIDE: 默认16, table扩容时, 每个线程最少迁移table的槽位个数。
- MOVED: 值为-1, 当Node.hash为MOVED时, 代表着table正在扩容
- TREEBIN, 置为-2, 代表此元素后接红黑树。
- nextTable: table迁移过程临时变量, 在迁移过程中将元素全部迁移到nextTable上。
- sizeCtl: 用来标志table初始化和扩容的,不同的取值代表着不同的含义:

- - - 0: table还没有被初始化
    - -1: table正在初始化
    - 小于-1: 实际值为resizeStamp(n)<
    - 大于0: 初始化完成后, 代表table最大存放元素的个数, 默认为0.75*n

- transferIndex: table容量从n扩到2n时, 是从索引n->1的元素开始迁移, transferIndex代表当前已经迁移的元素下标
- ForwardingNode: 一个特殊的Node节点, 其hashcode=MOVED, 代表着此时table正在做扩容操作。扩容期间, 若table某个元素为null, 那么该元素设置为ForwardingNode, 当下个线程向这个元素插入数据时, 检查hashcode=MOVED, 就会帮着扩容。

## PUT数据过程

> 初始化hash表的过程放在了put操作中

### 初始化Hash表

```java
private final Node<K,V>[] initTable() {
        Node<K,V>[] tab; int sc;
        while ((tab = table) == null || tab.length == 0) {		//	相当于自旋
            if ((sc = sizeCtl) < 0)
                Thread.yield(); // lost initialization race; just spin 其他线程在整初始化数组
            else if (U.compareAndSwapInt(this, SIZECTL, sc, -1)) {	//	CAS  SIZECTL -1: table正在初始化
                try {
                    if ((tab = table) == null || tab.length == 0) {
                        int n = (sc > 0) ? sc : DEFAULT_CAPACITY;
                        @SuppressWarnings("unchecked")
                        Node<K,V>[] nt = (Node<K,V>[])new Node<?,?>[n];
                        table = tab = nt;
                        sc = n - (n >>> 2);
                    }
                } finally {
                    sizeCtl = sc;		// 大于0: 初始化完成后, 代表table最大存放元素的个数, 默认为0.75*n
                }
                break;
            }
        }
        return tab;
    }
```

### Bucket为空时（CAS）

该桶bucket还没有元素的情况null ，当T1,T2同时放入数据时，避免覆盖，采用CAS算法

```java
for (Node<K,V>[] tab = table;;) {		// 自旋
            Node<K,V> f; int n, i, fh;
            if (tab == null || (n = tab.length) == 0)
                tab = initTable();	// 初始化
            else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
                if (casTabAt(tab, i, null,
                             new Node<K,V>(hash, key, value, null)))
                    break;                   // no lock when adding to empty bin	// CAS
            }
 // ... ...    
}
```

### 插入链表或红黑树

当桶bucket不为空时,**给该槽的元素进行加锁**，然后进行链表插入，使用的是**尾部插入**，其中使用了分段锁，这里的分段锁使用的是synchronized,锁住第一个元素

```java
          
V oldVal = null;
synchronized (f) {		// f = tabAt(tab, i = (n - 1)   当前槽的元素 加锁
    if (tabAt(tab, i) == f) {
        if (fh >= 0) {			//	链表的处理
            binCount = 1;
            for (Node<K,V> e = f;; ++binCount) {	//	遍历链表
                K ek;
                if (e.hash == hash &&
                    ((ek = e.key) == key ||
                     (ek != null && key.equals(ek)))) {
                    oldVal = e.val;
                    if (!onlyIfAbsent)
                        e.val = value;			// put的时候更新值
                    break;
                }
                Node<K,V> pred = e;
                if ((e = e.next) == null) {		//	添加新值  如果不加锁，这里会出现并发问题，如T1,T2都put一个新值，此时都判断 == null，那么后执行的T就会破坏前面pred.next = 的值
                    pred.next = new Node<K,V>(hash, key,
                                              value, null);
                    break;
                }
            }
        }
        else if (f instanceof TreeBin) {	//	红黑树的处理
            Node<K,V> p;
            binCount = 2;
            if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key,
                                                  value)) != null) {
                oldVal = p.val;
                if (!onlyIfAbsent)
                    p.val = value;
            }
        }
    }
}

```

![image-20210630171516944](/images/concurrency/image-20210630171516944.png)



### 插入数据时候发现增在扩容

当T3插入元素的时候，恰好T2触发了扩容，扩容是会把槽的头部节点变成ForwardingNode,并且其hash改为MOVED。那么这种情况T3也会帮助T2进行迁移

1. 如T2正在迁移0-15，那么T3就会帮助迁移16-31

```java
 else if ((fh = f.hash) == MOVED)
                tab = helpTransfer(tab, f);
```



## 扩容机制

- 一个线程插完元素后, 检查table使用率, 若超过阈值, 调用transfer进行扩容
- 一个线程插入数据时, 发现table对应元素的hash=MOVED, 那么调用helpTransfer()协助扩容。

### 协助扩容helpTransfer（了解）

- 检查是否扩容完成

- 对sizeCtrl = sizeCtrl+1, 然后调用transfer()进行真正的扩容。

```java
final Node<K,V>[] helpTransfer(Node<K,V>[] tab, Node<K,V> f) { //table扩容
        Node<K,V>[] nextTab; int sc;
        if (tab != null && (f instanceof ForwardingNode) &&
            (nextTab = ((ForwardingNode<K,V>)f).nextTable) != null) {
            // 根据 length 得到一个标识符号
            int rs = resizeStamp(tab.length);
            while (nextTab == nextTable && table == tab &&
                   (sc = sizeCtl) < 0) {//说明还在扩容
                //判断是否标志发生了变化||  扩容结束了
                if ((sc >>> RESIZE_STAMP_SHIFT) != rs || sc == rs + 1 ||
                     //达到最大的帮助线程 ||  判断扩容转移下标是否在调整（扩容结束）
                    sc == rs + MAX_RESIZERS || transferIndex <= 0)
                    break;
                // 将 sizeCtl + 1, （表示增加了一个线程帮助其扩容）
                if (U.compareAndSwapInt(this, SIZECTL, sc, sc + 1)) {
                    transfer(tab, nextTab);
                    break;
                }
            }
            return nextTab;
        }
        return table;
}
```

### 扩容transfer(了解)

[https://www.zhenchao.org/2019/01/31/java/cas-based-concurrent-hashmap/](https://www.zhenchao.org/2019/01/31/java/cas-based-concurrent-hashmap/)

扩容的整体步骤就是新建一个nextTab, size是之前的2倍, 将table上的非空元素迁移到nextTab上面去

其中有两个变量需要了解下:

- advance: 表示是否可以向下一个轮元素进行迁移。
- finishing: table所有元素是否迁移完成。

大致做了如下事情:

- 确定线程每轮迁移元素的个数stride, 比如进来一个线程, 确定扩容table下标为(a,b]之间元素, 下一个线程扩容(b,c]。这里对b-a或者c-b也是由最小值16限制的。 也就是说每个线程最少扩容连续16个table的元素。而标志当前迁移的下标保存在transferIndex里面

- 检查nextTab是否完成初始化, 若没有的话, 说明是第一个迁移的线程, 先初始化nextTab, size是之前table的2倍。

- 进入while循环查找本轮迁移的table下标元素区间, 保存在(bound, i]中, 注意这里是半开半闭区间。

- 从i -> bound开始遍历table中每个元素, 这里是从大到小遍历的:

  - 若该元素为空, 则向该元素标写入ForwardingNode, 然后检查下一个元素。 当别的线程向这个元素插入数据时, 根据这个标志符知道了table正在被别的线程迁移, 在putVal中就会调用helpTransfer帮着迁移。
  - 若该元素的hash=MOVED, 代表次table正在处于迁移之中, 跳过。 按道理不会跑着这里的。
  - 否则说明该元素跟着的是一个链表或者是个红黑树结构, 若hash>0, 则说明是个链表, 若f instanceof TreeBin, 则说明是个红黑树结构。

- 链表迁移原理如下: 遍历链表每个节点。 若节点的f.hash&n==0成立, 则将节点放在i, 否则, 则将节点放在n+i上面。

  - 迁移前, 对该元素进行加锁。 遍历链表时, 这里使用lastRun变量, 保留的是上次hash的值, 假如整个链表全部节点f.hash&n==0, 那么第二次遍历, 只要找到lastRun的值, 那么认为之后的节点都是相同值, 减少了不必要的f.hash&n取值。遍历完所有的节点后, 此时形成了两条链表, ln存放的是f.hash&n=0的节点, hn存放的是非0的节点, 然后将ln存放在nextTable第i元素的位置, n+i存放在n+i的位置。

    蓝色节点代表:f.hash&n==0, 绿色节点代表f.hash&n!=0。 最终蓝色的节点仍在存放在(0, n)范围里, 绿的节点存放在(n, 2n-1)的范围之内。

- 迁移链表和红黑树的原理是一样的, 在红黑树中, 我们记录了每个红黑树的first(这个节点不是hash最小的节点)和每个节点的next, 根据这两个元素, 我们可以访问红黑树所有的元素, 红黑树此时也是一个链表, 红黑树和链表迁移的过程一样。红黑树根据迁移后拆分成了hn和ln, 根据链表长度确定链表是红黑树结构还是退化为了链表。

- .如何确定table所有元素迁移完成:

  ```java
  //表示当前线程迁移完成了
  if (U.compareAndSwapInt(this, SIZECTL, sc = sizeCtl, sc - 1)) {
       //注意此时sc的值并不等于sizeCtl，上一步，sizeCtl=sizeCtl-1了。这两个对象还是分割的
      if ((sc - 2) != resizeStamp(n) << RESIZE_STAMP_SHIFT)
          return;
      finishing = advance = true;
      i = n; // recheck before commit
  }
  ```

  第一个线程开始迁移时, 设置了sizeCtl= resizeStamp(n) << RESIZE_STAMP_SHIFT+2, 此后每个新来帮助迁移的线程都会sizeCtl=sizeCtl+1, 完成迁移后,sizeCtl-1, 那么只要有一个线程还处于迁移状态, 那么sizeCtl> resizeStamp(n) << RESIZE_STAMP_SHIFT+2一直成立, 当只有最后一个线程完成迁移之后, 等式两边才成立。 可能大家会有疑问, 第一个线程并没有对sizeCtl=sizeCtl+1, 此时完成后再减一, 那不是不相等了吗, 注意这里, sizeCtl在减一前, 将值赋给了sc, 等式比较的是sc。

```java
private final void transfer(Node<K,V>[] tab, Node<K,V>[] nextTab) {
    int n = tab.length, stride;
    if ((stride = (NCPU > 1) ? (n >>> 3) / NCPU : n) < MIN_TRANSFER_STRIDE)
       // subdivide range，每个线程最少迁移16个槽位，大的话，最多
        stride = MIN_TRANSFER_STRIDE;
    // initiating  才开始初始化新的nextTab
    if (nextTab == null) {
        try {
            @SuppressWarnings("unchecked")
            Node<K,V>[] nt = (Node<K,V>[])new Node<?,?>[n << 1];  //扩容2倍
            nextTab = nt;
        } catch (Throwable ex) {      // try to cope with OOME
            sizeCtl = Integer.MAX_VALUE;
            return;
        }
        nextTable = nextTab;
        transferIndex = n;//更新的转移下标，
    }
    int nextn = nextTab.length;
    ForwardingNode<K,V> fwd = new ForwardingNode<K,V>(nextTab);
    //是否能够向前推进到下一个周期
    boolean advance = true;
    // to ensure sweep before committing nextTab，完成状态，如果是，则结束此方法
    boolean finishing = false;
    for (int i = 0, bound = 0;;) {
        Node<K,V> f; int fh;
        while (advance) { //取下一个周期
            int nextIndex, nextBound;
            //本线程处理的区间范围为[bound, i),范围还没有处理完成，那么就继续处理
            if (--i >= bound || finishing)
                advance = false;
            //目前处理到了这里（从大到小， 下线），开始找新的一轮的区间
            else if ((nextIndex = transferIndex) <= 0) {
                i = -1;
                advance = false;
            }
            //这个条件改变的是transferIndex的值，从16变成了1
            else if (U.compareAndSwapInt
                     (this, TRANSFERINDEX, nextIndex,
                     //nextBound 是这次迁移任务的边界，注意，是从后往前
                      nextBound = (nextIndex > stride ?
                                   nextIndex - stride : 0))) {
                bound = nextBound; //一块区间最小桶的下标
                i = nextIndex - 1; //能够处理的最大桶的下标
                advance = false;
            }
        }
        if (i < 0 || i >= n || i + n >= nextn) { //每个迁移线程都能达到这里
            int sc;
            if (finishing) { //迁移完成
                nextTable = null;
                //直接把以前的table丢弃了，上面的MOVE等标志全部丢弃，使用新的
                table = nextTab;
                sizeCtl = (n << 1) - (n >>> 1); //扩大2n-0.5n = 1.50n, 更新新的容量阈值
                return;
            }
            //表示当前线程迁移完成了
            if (U.compareAndSwapInt(this, SIZECTL, sc = sizeCtl, sc - 1)) {
                 //注意此时sc的值并不等于sizeCtl，上一步，sizeCtl=sizeCtl-1了。这两个对象还是分割的
                if ((sc - 2) != resizeStamp(n) << RESIZE_STAMP_SHIFT)
                    return;
                finishing = advance = true;
                i = n; // recheck before commit
            }
        }
        //如果对应位置为null， 则将ForwardingNode放在对应的地方
        else if ((f = tabAt(tab, i)) == null)
            advance = casTabAt(tab, i, null, fwd);
        else if ((fh = f.hash) == MOVED) //别的线程已经在处理了，再推进一个下标
            advance = true; // already processed，推动到下一个周期，仍然会检查i与bound是否结束
        else { //说明位置上有值了，
            //需要加锁，防止再向里面放值，在放数据时，也会锁住。比如整个table正在迁移，还没有迁移到这个元素，另外一个线程向这个节点插入数据，此时迁移到这里了，会被阻塞住
            synchronized (f) {
                if (tabAt(tab, i) == f) {//判断i下标和f是否相同
                    Node<K,V> ln, hn; //高位桶， 地位桶
                    if (fh >= 0) {
                        int runBit = fh & n;//n为2^n, 取余后只能是2^n
                        Node<K,V> lastRun = f;
                        ///找到最后一个不和fn相同的节点
                        for (Node<K,V> p = f.next; p != null; p = p.next) {
                            int b = p.hash & n;
                            //只要找到这，之后的取值都是一样的，下次循环时，就不用再循环后面的
                            if (b != runBit) {
                                runBit = b;
                                lastRun = p;
                            }
                        }
                        if (runBit == 0) {
                            ln = lastRun;
                            hn = null;
                        }
                        else { //比如1，16，32,如果低位%16，那么肯定是0。
                            hn = lastRun;
                            ln = null;
                        }
                        for (Node<K,V> p = f; p != lastRun; p = p.next) {
                            int ph = p.hash; K pk = p.key; V pv = p.val;
                            if ((ph & n) == 0)
                                 //这样就把相同串的给串起来了
                                ln = new Node<K,V>(ph, pk, pv, ln);
                            else
                                //这样就把相同串的给串起来了，注意这里ln用法，第一个next为null，烦着串起来了。
                                hn = new Node<K,V>(ph, pk, pv, hn);
                        }
                        setTabAt(nextTab, i, ln); //反着给串起来了
                        setTabAt(nextTab, i + n, hn);
                        setTabAt(tab, i, fwd);
                        advance = true;
                    }
                    else if (f instanceof TreeBin) {// 如果是红黑树
                        TreeBin<K,V> t = (TreeBin<K,V>)f;
                        TreeNode<K,V> lo = null, loTail = null; //也是高低节点
                        TreeNode<K,V> hi = null, hiTail = null;//也是高低节点
                        int lc = 0, hc = 0;
                        for (Node<K,V> e = t.first; e != null; e = e.next) { //中序遍历红黑树
                            int h = e.hash;
                            TreeNode<K,V> p = new TreeNode<K,V>
                                (h, e.key, e.val, null, null);
                            if ((h & n) == 0) { //0的放低位
                                //注意这里p.prev = loTail，每一个p都是下一个的prev
                                if ((p.prev = loTail) == null)
                                    lo = p; //把头记住
                                else
                                    loTail.next = p;  //上一次的p的next是这次的p
                                loTail = p; //把上次p给记住
                                ++lc;
                            }
                            else { //高位
                                if ((p.prev = hiTail) == null)
                                    hi = p; //把尾记住
                                else
                                    hiTail.next = p;
                                hiTail = p;
                                ++hc;
                            }
                        }
                        ln = (lc <= UNTREEIFY_THRESHOLD) ? untreeify(lo) :// //判断是否需要转化为树
                            (hc != 0) ? new TreeBin<K,V>(lo) : t; //如果没有高低的话，则部分为两个树
                        hn = (hc <= UNTREEIFY_THRESHOLD) ? untreeify(hi) :
                            (lc != 0) ? new TreeBin<K,V>(hi) : t;
                        setTabAt(nextTab, i, ln);
                        setTabAt(nextTab, i + n, hn);
                        setTabAt(tab, i, fwd);
                        advance = true;
                    }
                }
            }
        }
    }
}
```



## JDK1.7 与JDK1.8锁粒度对比

1. 1.7中锁的是一个segment，而segment中对应的是一个小的hash表，这Hash表中有多个桶
2. 而1.8锁的是一个桶

