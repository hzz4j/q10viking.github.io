---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

为了实现volatile内存语义，JMM会分别限制这两种类型的重排序类型。

下图是JMM针对编译器制定的volatile重排序规则表。

| 第一个操作 | 第二个操作：普通读写 | 第二个操作：volatile读 | 第二个操作：volatile写 |
| ---------- | -------------------- | ---------------------- | ---------------------- |
| 普通读写   | 可以重排             | 可以重排               | 不可以重排             |
| volatile读 | 不可以重排           | 不可以重排             | 不可以重排             |
| volatile写 | 可以重排             | 不可以重排             | 不可以重排             |

1. 当第一个为普通写，第二个也为普通写时，可以重排

   ```java
   public class Jmm06_MemoryBarrier {
       int a = 0;
       int c = 0;
       public volatile int m1 = 1;
       public volatile int m2 = 2;
   
       public void readAndWrite() {
          int i = m1;   // 第一个volatile读
          int j = m2;   // 第二个volatile读
          //-------------------可以重排-----------------------------
          a = i + j;    // 普通写
   	   c = 2
          //-------------------可以重排-----------------------------
          m1 = i + 1;   // 第一个volatile写
          m2 = j * 2;   // 第二个 volatile写
       }
   
   }
   ```

2. 当第一个为普通读写，第二个为volatile读，可以重排

   ```java
   public class Jmm06_MemoryBarrier {
       int a = 0;
       int c = 0;
       public volatile int m1 = 1;
       public volatile int m2 = 2;
   
       public void readAndWrite() {
          int i = m1;   // 第一个volatile读
          int j = m2;   // 第二个volatile读
          //-------------------可以重排-----------------------------
          a = i + j;    // 普通写
   	   c = m1;		//	volatile读，普通写
          //-------------------可以重排-----------------------------
          m1 = i + 1;   // 第一个volatile写
          m2 = j * 2;   // 第二个 volatile写
       }
   
   }
   ```

   3. 第一个为普通读写，第二个volatile写，不可以重排

      ```java
      public class Jmm06_MemoryBarrier {
          int a = 0;
          int c = 0;
          public volatile int m1 = 1;
          public volatile int m2 = 2;
      
          public void readAndWrite() {
             int i = m1;   // 第一个volatile读
             int j = m2;   // 第二个volatile读
             //-------------------不可以重排-----------------------------
             a = i + j;    // 普通写
      	   m1 = 3;		//	volatile写
             //-------------------不可以重排-----------------------------
             m1 = i + 1;   // 第一个volatile写
             m2 = j * 2;   // 第二个 volatile写
          }
      
      }
      ```

      4. 当第二个操作是volatile写时，不管第一个操作是什么，都不能重排序。这个规则确保volatile写之前的操作不会被编译器重排序到volatile写之后。
      5. 当第一个操作是volatile读时，不管第二个操作是什么，都不能重排序。这个规则确保volatile读之后的操作不会被编译器重排序到volatile读之前。
      6. 当第一个操作是volatile写，第二个操作是volatile读或写时，不能重排序。

为了实现volatile的内存语义，编译器在生成字节码时，会在指令序列中插入内存屏障来禁止特定类型的处理器重排序。对于编译器来说，发现一个最优布置来最小化插入屏障的总数几乎不可能。为此，JMM采取保守策略。下面是基于保守策略的JMM内存屏障插入策略。

> - - ·在每个volatile写操作的前面插入一个StoreStore屏障。
>   - ·在每个volatile写操作的后面插入一个StoreLoad屏障。
>   - ·在每个volatile读操作的后面插入一个LoadLoad屏障。
>   - ·在每个volatile读操作的后面插入一个LoadStore屏障。

volatile写**插入内存屏障**后生成的指令序列示意图

![img](/images/concurrency/14400)

上面图中，StoreStore屏障可以保证在volatile写之前，其前面的所有普通写操作**已经对任意处理器可见了**。这是**因为StoreStore屏障将保障上面所有的普通写在volatile写之前刷新到主内存**。

这里比较有意思的是，volatile写后面的StoreLoad屏障。此屏障的作用是避免volatile写与 后面可能有的volatile读/写操作重排序。因为编译器常常无法准确判断在一个volatile写的后面 是否需要插入一个StoreLoad屏障（比如，一个volatile写之后方法立即return）。**为了保证能正确 实现volatile的内存语义，JMM在采取了保守策略**：在每个volatile写的后面，或者在每个volatile 读的前面插入一个StoreLoad屏障。从整体执行效率的角度考虑，JMM最终选择了在每个 volatile写的后面插入一个StoreLoad屏障。因为volatile写-读内存语义的常见使用模式是：一个 写线程写volatile变量，多个读线程读同一个volatile变量。当读线程的数量大大超过写线程时，选择在volatile写之后插入StoreLoad屏障将带来可观的执行效率的提升。从这里可以看到JMM 在实现上的一个特点：首先确保正确性，然后再去追求执行效率。

----------

volatile读插入内存屏障后生成的指令序列示意图

![img](/images/concurrency/14399.png)

上述volatile写和volatile读的内存屏障插入策略非常保守。在实际执行时，只要不改变 volatile写-读的内存语义，**编译器可以根据具体情况省略不必要的屏障**。下面通过具体的示例

```java
class VolatileBarrierExample {
       int a;
       volatile int v1 = 1;
       volatile int v2 = 2;
       void readAndWrite() {
           int i = v1;　　    // 第一个volatile读
           int j = v2;    　  // 第二个volatile读
           a = i + j;         // 普通写
           v1 = i + 1;     　 // 第一个volatile写
          v2 = j * 2;    　  // 第二个 volatile写
       }
}
```

针对readAndWrite()方法，编译器在生成字节码时可以做如下的优化。

![img](/images/concurrency/14402.png)

最后的StoreLoad屏障不能省略。因为第二个volatile写之后，方法立即return。**此时编 译器可能无法准确断定后面是否会有volatile读或写，为了安全起见，编译器通常会在这里插 入一个StoreLoad屏障**。

