---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

atomic底层是基于无锁的算法,基于魔术类Unsafe提供的三大API

```java
AtomicInteger num = new AtomicInteger(0);
num.getAndIncrement();
```

基于硬件原语CMPXCHG实现的原子CAS

```java
    public final native boolean compareAndSwapObject(Object var1, long var2, Object var4, Object var5);

    public final native boolean compareAndSwapInt(Object var1, long var2, int var4, int var5);

    public final native boolean compareAndSwapLong(Object var1, long var2, long var4, long var6);
```



## 原理图

![Compare And Swap](/images/concurrency/Compare And Swap.jpg)



## 底层源码

```java
// AtomicInteger
private volatile int value;
private static final long valueOffset;

static {
    try {
        valueOffset = unsafe.objectFieldOffset
            (AtomicInteger.class.getDeclaredField("value"));
    } catch (Exception ex) { throw new Error(ex); }
}

public final int getAndIncrement() {
    //	valueOffset偏移量
    return unsafe.getAndAddInt(this, valueOffset, 1);
}
```

```java
//UnSafe
public final int getAndAddInt(Object var1, long var2, int var4) {
        int var5;
        do {
            var5 = this.getIntVolatile(var1, var2);
        } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));

        return var5;
    }
```

## 偏移量

![offset](/images/concurrency/offset.png)

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
public class AtomicStudentAgeUpdater {
    private String name ;
    private volatile int age;

    public AtomicStudentAgeUpdater(String name,int age){
        this.name = name;
        this.age = age;
    }

    public int getAge(){
        return this.age;
    }

    public static void main(String[] args) {
        AtomicStudentAgeUpdater updater = new AtomicStudentAgeUpdater("hzz",18);

        System.out.println(ClassLayout.parseInstance(updater).toPrintable());

        updater.compareAndSwapAge(18,56);
        System.out.println("真实的hzz年龄---"+updater.getAge());
    }

    private static final Unsafe unsafe = UnsafeInstance.reflectGetUnsafe();
    private static final long valueOffset;

    static {
        try {
            valueOffset = unsafe.objectFieldOffset(AtomicStudentAgeUpdater.class.getDeclaredField("age"));
            System.out.println("valueOffset:--->"+valueOffset);
        } catch (Exception e) {
            throw new Error(e);
        }
    }

    public void compareAndSwapAge(int old,int target){
        unsafe.compareAndSwapInt(this,valueOffset,old,target);
    }
}
/**
 valueOffset:--->12
 com.yg.edu.atomic.AtomicStudentAgeUpdater object internals:
 OFFSET  SIZE               TYPE DESCRIPTION                               VALUE
 0     4                    (object header)                           01 00 00 00 (00000001 00000000 00000000 00000000) (1)
 4     4                    (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
 8     4                    (object header)                           05 c1 00 f8 (00000101 11000001 00000000 11111000) (-134168315)
 12     4                int AtomicStudentAgeUpdater.age               18
 16     4   java.lang.String AtomicStudentAgeUpdater.name              (object)
 20     4                    (loss due to the next object alignment)
 Instance size: 24 bytes
 Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
 */
```

可以看到属性age在对象内存空间的OFFSET 12