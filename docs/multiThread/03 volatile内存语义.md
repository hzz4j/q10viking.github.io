---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /multiThread/
---

## **volatile的特性**

- 可见性：对一个volatile变量的读，总是能看到（任意线程）对这个volatile变量最后的写入。

- 原子性：对任意单个volatile变量的读/写具有原子性，但类似于volatile++这种复合操作不具有原子性（基于这点，我们通过会认为volatile不具备原子性）。volatile仅仅保证对单个volatile变量的读/写具有原子性，而锁的互斥执行的特性可以确保对整个临界区代码的执行具有原子性。 

  >  64位的long型和double型变量，只要它是volatile变量，对该变量的读/写就具有原子性。

- 有序性：对volatile修饰的变量的读写操作前后加上各种特定的内存屏障来禁止指令重排序来保障有序性。

  > 在JSR-133之前的旧Java内存模型中，虽然不允许volatile变量之间重排序，但旧的Java内存模型允许volatile变量与普通变量重排序。为了提供一种比锁更轻量级的线程之间通信的机制，JSR-133专家组决定增强volatile的内存语义：严格限制编译器和处理器对volatile变量与普通变量的重排序，确保volatile的写-读和锁的释放-获取具有相同的内存语义。



## **volatile可见性实现原理**

### **JMM内存交互层面实现**

volatile修饰的变量的read、load、use操作和assign、store、write必须是连续的，**即修改后必须立即同步回主内存，使用时必须从主内存刷新**，由此保证volatile变量操作对多线程的可见性。

### **硬件层面实现**

通过lock前缀指令，会锁定变量缓存行区域并写回主内存，这个操作称为“缓存锁定”，**缓存一致性机制会阻止同时修改被两个以上处理器缓存的内存区域数据**。**一个处理器的缓存回写到内存会导致其他处理器的缓存无效。**

### **volatile在hotspot的实现**

![image-20220222173638582](https://gitee.com/q10viking/PictureRepos/raw/master/images//202202221736716.png)

### **在linux系统x86中的实现**

x86处理器中利用lock实现类似内存屏障的效果。

```c++
inline void OrderAccess::storeload()  { fence(); }
inline void OrderAccess::fence() {
  if (os::is_MP()) {
    // always use locked addl since mfence is sometimes expensive
#ifdef AMD64
    __asm__ volatile ("lock; addl $0,0(%%rsp)" : : : "cc", "memory");
#else
    __asm__ volatile ("lock; addl $0,0(%%esp)" : : : "cc", "memory");
#endif
  }
```



## **lock前缀指令的作用**

1. 确保后续指令执行的原子性。在Pentium及之前的处理器中，带有lock前缀的指令在执行期间会锁住总线，使得其它处理器暂时无法通过总线访问内存，很显然，这个开销很大。在新的处理器中，Intel使用缓存锁定来保证指令执行的原子性，缓存锁定将大大降低lock前缀指令的执行开销。

2. LOCK前缀指令具有类似于内存屏障的功能，禁止该指令与前面和后面的读写指令重排序。

3. **LOCK前缀指令会等待它之前所有的指令完成、并且所有缓冲的写操作写回内存**(也就是将store buffer中的内容写入内存)之后才开始执行，**并且根据缓存一致性协议，刷新store buffer的操作会导致其他cache中的副本失效**。

