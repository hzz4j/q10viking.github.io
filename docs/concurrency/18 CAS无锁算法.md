---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

## CAS算法

为了保证共享的资源在并发访问时的数据安全。除了对共享资源进行加锁以外，还可以使用CAS无锁算法。

CAS（Compare And Swap）**是一种乐观的并发控制机制**，它的核心原理是基于硬件层面的原子性保证。CAS操作包含三个操作数——内存位置（V）、预期原值（A）和新值（B）。它的**工作原理**是：

1. 在将新值写入内存之前，CAS操作会先比较内存位置的值是否与预期原值相匹配。
2. 如果内存位置的值与预期原值相匹配，那么处理器会自动将该位置的值更新为新值。
3. 如果内存位置的值与预期原值不匹配，则CAS操作失败，不会修改内存值。

**CAS的优势在于它没有阻塞状态，不会引起线程上下文的切换和调度问题。**然而，CAS也存在一些缺点，例如**ABA问题和开销问题**。ABA问题是指一个值原来是A，变成了B，又变成了A，那么使用CAS进行检查时会发现它的值没有发生变化，但是实际上却变化了。开销问题则是因为CAS自旋操作需要不断轮询内存位置，直到成功为止，这会消耗大量的CPU资源。

**CAS 比较和交换是一个原子操作**

### CAS的过程举例

两个线程读取一个变量，然后同时进行修改

1. 此时threadB进行修改，将值变成了1

![image-20210621003240611](/images/concurrency/image-20210621003240611.png)

2. 此时threadA准备去修改为2，但是expect的值已经不是当初threadA读取的值了，被threadB修改过，发生了变化。则放弃此次修改。

![image-20210621003625624](/images/concurrency/image-20210621003625624.png)

3. threadA需要重新读取主内存的值，然后计算，刷新会主存中
   ![image-20210621003940765](/images/concurrency/image-20210621003940765.png)

----------



## CAS的实现Unsafe支持

```java
//	对象，偏移量，oldValue,newValue   
public final native boolean compareAndSwapObject(Object var1, long var2, Object var4, Object var5);

public final native boolean compareAndSwapInt(Object var1, long var2, int var4, int var5);

public final native boolean compareAndSwapLong(Object var1, long var2, long var4, long var6);
```

底层是需要汇编指令cmpxchg

### Unsafe实现CAS

可以看到5个线程的并发执行，最终只有一个线程抢到了锁

```java
public class UnsafeInstance {
    public static Unsafe reflectGetUnsafe() {
        try {
            Field field = Unsafe.class.getDeclaredField("theUnsafe");
            field.setAccessible(true);
            return (Unsafe) field.get(null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

```java
@Slf4j
public class Juc04_Thread_Cas {
    /**
     * 当前加锁状态,记录加锁的次数
     */
    private volatile int state = 0;
    private static CyclicBarrier cyclicBarrier = new CyclicBarrier(5);
    private static Juc04_Thread_Cas cas = new Juc04_Thread_Cas();

    private static final Unsafe unsafe = UnsafeInstance.reflectGetUnsafe();
    //  偏移量
    private static final long stateOffset;

    static {
        try {
            //  获取到偏移量
            stateOffset = unsafe.objectFieldOffset(Juc04_Thread_Cas.class.getDeclaredField("state"));
        } catch (Exception e) {
            throw new Error();
        }
    }
    
    /**
     * 原子操作
     * @param oldValue
     *        oldvalue:线程工作内存当中的值
     * @param
     *        newValue:要替换的新值
     * @return
     */
    public final boolean compareAndSwapState(int oldValue,int newValue){
        return unsafe.compareAndSwapInt(this,stateOffset,oldValue,newValue);
    }

    public static void main(String[] args) {
        new Thread(new Worker(),"t-0").start();
        new Thread(new Worker(),"t-1").start();
        new Thread(new Worker(),"t-2").start();
        new Thread(new Worker(),"t-3").start();
        new Thread(new Worker(),"t-4").start();
    }

    static class Worker implements Runnable{
        @Override
        public void run() {
            log.info("请求:{}到达预定点,准备开始抢state:)",Thread.currentThread().getName());
            try {
                //  线程栅栏，使得线程同时运行
                cyclicBarrier.await();
                if(cas.compareAndSwapState(0,1)){
                    log.info("当前请求:{},抢到锁!",Thread.currentThread().getName());
                }else{
                    log.info("当前请求:{},抢锁失败!",Thread.currentThread().getName());
                }
            } catch (InterruptedException|BrokenBarrierException e) {
                e.printStackTrace();
            }
        }

    }
}
/**
 00:48:42.271 [t-3] INFO com.yg.edu.lock.Juc04_Thread_Cas - 请求:t-3到达预定点,准备开始抢state:)
 00:48:42.271 [t-4] INFO com.yg.edu.lock.Juc04_Thread_Cas - 请求:t-4到达预定点,准备开始抢state:)
 00:48:42.271 [t-0] INFO com.yg.edu.lock.Juc04_Thread_Cas - 请求:t-0到达预定点,准备开始抢state:)
 00:48:42.271 [t-2] INFO com.yg.edu.lock.Juc04_Thread_Cas - 请求:t-2到达预定点,准备开始抢state:)
 00:48:42.271 [t-1] INFO com.yg.edu.lock.Juc04_Thread_Cas - 请求:t-1到达预定点,准备开始抢state:)
 00:48:42.276 [t-1] INFO com.yg.edu.lock.Juc04_Thread_Cas - 当前请求:t-1,抢到锁!
 00:48:42.277 [t-4] INFO com.yg.edu.lock.Juc04_Thread_Cas - 当前请求:t-4,抢锁失败!
 00:48:42.277 [t-3] INFO com.yg.edu.lock.Juc04_Thread_Cas - 当前请求:t-3,抢锁失败!
 00:48:42.277 [t-0] INFO com.yg.edu.lock.Juc04_Thread_Cas - 当前请求:t-0,抢锁失败!
 00:48:42.277 [t-2] INFO com.yg.edu.lock.Juc04_Thread_Cas - 当前请求:t-2,抢锁失败!
 */
```

