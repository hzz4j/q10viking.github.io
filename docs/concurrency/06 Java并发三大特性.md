---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

## 可见性

1. 可见性指的是**当一个线程修改了某个共享变量的值，其他线程是否能够马上得知这个修改的值**。对于串行程序来说，可见性是不存在的，因为我们在任何一个操作中修改了某个变量的值，后续的操作中都能读取这个变量值，并且是修改过的新值。

2. 但在多线程环境中可就不一定了，前面我们分析过，由于线程对共享变量的操作都是线程拷贝到各自的工作内存进行操作后才写回到主内存中的，这就可能存在一个线程A修改了共享变量x的值，还未写回主内存时，另外一个线程B又对主内存中同一个共享变量x进行操作，但此时A线程工作内存中共享变量x对线程B来说并不可见，这种工作内存与主内存同步延迟现象就造成了可见性问题。

3. 另外指令重排以及编译器优化也可能导致可见性问题，通过前面的分析，我们知道无论是编译器优化还是处理器优化的重排现象，在多线程环境下，确实会导致程序轮序执行的问题，从而也就导致可见性问题

### 可见性问题分析

> 尽管线程threadB修改了initFlag变量的值，但是threadA还是使用着自己线程的工作内存中的initFlag值，导致程序一直没结束

```java
@Slf4j
public class Jmm03_CodeVisibility {
    //  共享变量
    private static boolean initFlag = false;
    
    private  static int counter = 0;

    public static void refresh(){
        log.info("refresh data.......");
        initFlag = true;
        log.info("refresh data success.......");
    }

    public static void main(String[] args){
        Thread threadA = new Thread(()->{
            //  判断的时threadA工作内存的变量
            while (!initFlag){
                //System.out.println("runing");
                counter++;
            }
            log.info("线程：" + Thread.currentThread().getName()
                    + "当前线程嗅探到initFlag的状态的改变");
        },"threadA");
        threadA.start();

        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        Thread threadB = new Thread(()->{
            refresh();
        },"threadB");
        threadB.start();
    }
}
```

![image-20210619183837861](/images/concurrency/image-20210619183837861.png)

#### 分析

threadA感知不到变量initFlag的更新，所以需要threadB线程更新initFlag值之后，需要通知到threadA，需要**volatile**修饰

1. **volatile能够保证可见性（及时）**

```java
@Slf4j
public class Jmm03_CodeVisibility {
    //  共享变量 添加volatile关键字
    private volatile static boolean initFlag = false;

    private static int counter = 0;

    public static void refresh(){
        log.info("refresh data.......");
        initFlag = true;
        log.info("refresh data success.......");
    }

    public static void main(String[] args){
        Thread threadA = new Thread(()->{
            //  判断的时threadA工作内存的变量
            while (!initFlag){
                //System.out.println("runing");
                counter++;
            }
            log.info("线程：" + Thread.currentThread().getName()
                    + "当前线程嗅探到initFlag的状态的改变");
        },"threadA");
        threadA.start();

        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        Thread threadB = new Thread(()->{
            refresh();
        },"threadB");
        threadB.start();
    }
}
```



#### 奇怪的可见性1

此时volatile不修饰initFlag而是修饰counter,threadA也能看到threadB更新的initFlag值

原因： 有可能counter与initFlag都在同一个缓存行中，当counter更新时，由于空间局部性，读取counter时又顺带读取了initFlag更新后的值。

```java
@Slf4j
public class Jmm03_CodeVisibility {
    //  共享变量
    private static boolean initFlag = false;
   //  添加volatile关键字
   //  private  static int counter = 0;
    private volatile static int counter = 0;

    public static void refresh(){
        log.info("refresh data.......");
        initFlag = true;
        log.info("refresh data success.......");
    }

    public static void main(String[] args){
        Thread threadA = new Thread(()->{
            //  判断的时threadA工作内存的变量
            while (!initFlag){
                //System.out.println("runing");
                counter++;
            }
            log.info("线程：" + Thread.currentThread().getName()
                    + "当前线程嗅探到initFlag的状态的改变");
        },"threadA");
        threadA.start();

        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        Thread threadB = new Thread(()->{
            refresh();
        },"threadB");
        threadB.start();
    }
}
```

#### 奇怪的可见性2

将counter从int类型转化为Integer类型，也能使得threadA感知到threadB的对initFlag的更新

原因

```java
@Slf4j
public class Jmm03_CodeVisibility {
    //  共享变量
    private static boolean initFlag = false;
   //  添加volatile关键字
   //  private  static int counter = 0;
    private static Integer counter = 0;

    public static void refresh(){
        log.info("refresh data.......");
        initFlag = true;
        log.info("refresh data success.......");
    }

    public static void main(String[] args){
        Thread threadA = new Thread(()->{
            //  判断的时threadA工作内存的变量
            while (!initFlag){
                //System.out.println("runing");
                counter++;
            }
            log.info("线程：" + Thread.currentThread().getName()
                    + "当前线程嗅探到initFlag的状态的改变");
        },"threadA");
        threadA.start();

        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        Thread threadB = new Thread(()->{
            refresh();
        },"threadB");
        threadB.start();
    }
}
```

----------



#### 奇怪的可见性3

在threadA中添加一句代码，但是具有延迟性。可能原因：是引起了线程上下文切换

```java
public class Jmm03_CodeVisibility {
    //  共享变量
    private static boolean initFlag = false;

//    private  static int counter = 0;
    public static void refresh(){
        System.out.println(initFlag);
        initFlag = true;
        System.out.println(initFlag);
    }

    public static void main(String[] args){
        Thread threadA = new Thread(()->{
            //  判断的时threadA工作内存的变量
            System.out.println("A: "+initFlag);
            while (!initFlag){
                //	添加输出
                System.out.println("runing");
                //counter++;
            }
            System.out.println("A: "+initFlag);
        },"threadA");
        threadA.start();

        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        Thread threadB = new Thread(()->{
            refresh();
        },"threadB");
        threadB.start();
    }
}
```

#### 奇怪的可见性4

现在的代码，线程A是能够看到变量改变的。因为程序现在运行太快了。但是打开注释后，就不可见了。

```java
public class Jmm03_CodeVisibility {
    //  共享变量
    private static boolean initFlag = false;

    public static void refresh(){
        System.out.println(initFlag);
        initFlag = true;
        System.out.println(initFlag);
    }

    public static void main(String[] args){
        Thread threadA = new Thread(()->{
            //  判断的时threadA工作内存的变量
            System.out.println("A: "+initFlag);
            int counter=0;
            while (!initFlag){
                counter++;
            }
            System.out.println("A: "+initFlag);
            System.out.println(counter);
        },"threadA");
        threadA.start();
          // 现在的代码是可见的，但是如果加上这段代码就不可见了，
         // 主要是现在线程运行太快了
//        try {
//            Thread.sleep(10);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }

        Thread threadB = new Thread(()->{
            refresh();
        },"threadB");
        threadB.start();
    }
}
```



## 原子性

原子性指的是一个操作是不可中断的，即使是在多线程环境下，一个操作一旦开始就不会被其他线程影响

在java中，对**基本数据类型的变量的读取和赋值操作是原子性操作**

有点要注意的是，对于32位系统的来说，**long类型数据和double类型数据(**对于基本数据类型，byte,short,int,float,boolean,char读写是原子操作)，**它们的读写并非原子性的**，也就是说如果存在两条线程同时对long类型或者double类型的数据进行读写是存在相互干扰的，因为对于32位虚拟机来说，每次原子读写是32位的，而long和double则是64位的存储单元，这样会导致一个线程在写时，操作完前32位的原子操作后，轮到B线程读取时，恰好只读取到了后32位的数据，这样可**能会读取到一个既非原值又不是线程修改值的变量，它可能是“半个变量”的数值**，即64位数据被两个线程分成了两次读取。但也不必太担心，因为读取到“半个变量”的情况比较少见，至少在目前的商用的虚拟机中，几乎都把64位的数据的读写操作作为原子操作来执行，因此对于这个问题不必太在意，知道这么回事即可。

```java
//-----------------是原子操作---------------------------
X=10;  //原子性（简单的读取、将数字赋值给变量）

//-----------------不是原子操作-------------------------
Y = x;  //变量之间的相互赋值
X++;  //对变量进行计算操作 
X = x+1; 
```



### 原子性问题分析

虽然volatile保证了counter可见性，**但是却没有保证原子性**

原因

> counter++; // **分三步- 读，自加，写回**

thread1线程的cpu时间片段用完，恰好停留在了counter的读完（如此时为1000，马上要进行加1），此时轮流到thread2进行执行如此时读取的也为1000，然后进行加1，此时为1001，更新回内存。由于counter是volatile修饰保证可见性，轮到thread1再次恢复执行时，counter失效了，需要重新去内存中读取1001，而之前的自加操作就无效了，这样thread1就无效了一次加。导致总结果减少。



❤️volatile底层通过缓存一致性协议（MESI）或导致thread1中的变量副本失效❤️。

还有一种情况是由于缓存一致性协议对寄存器无效，导致寄存器运算后又写回了缓存中，最后覆盖更新掉了主存的变量。

```java
public class Jmm04_CodeAtomic {

    private volatile static int counter = 0;
    static Object object = new Object();

    public static void main(String[] args) {

        for (int i = 0; i < 10; i++) {
            Thread thread = new Thread(()->{
                for (int j = 0; j < 1000; j++) {
                    counter++;
                }
            });
            thread.start();
        }

        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println(counter);

    }
}
//  输出的时8038，但是应该结果为10000
```

----------

解决方式添加synchronized

```java
public class Jmm04_CodeAtomic {

    private volatile static int counter = 0;
    static Object object = new Object();

    public static void main(String[] args) {

        for (int i = 0; i < 10; i++) {
            Thread thread = new Thread(()->{
                for (int j = 0; j < 1000; j++) {
                    //	添加synchronized
                    synchronized (object){
                        counter++;//分三步- 读，自加，写回
                    }
                }
            });
            thread.start();
        }

        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println(counter);

    }
}
```



## 有序性

有序性是指对于单线程的执行代码，我们总是认为代码的执行是按顺序依次执行的，这样的理解并没有毛病，毕竟对于单线程而言确实如此，但对于多线程环境，则可能出现乱序现象，因为**程序编译成机器码指令后可能会出现指令重排现象**，重排后的指令与原指令的顺序未必一致

在Java程序中，倘**若在本线程内，所有操作都视为有序行为，如果是多线程环境下，一个线程中观察另外一个线程，所有操作都是无序的，前半句指的是单线程内保证串行语义执行的一致性，后半句则指指令重排现象和工作内存与主内存同步延迟现象**。

### **指令重排序**

java语言规范规定JVM线程内部维持顺序化语义。即只要程序的最终结果与它顺序化情况的结果相等，那么指令的执行顺序可以与代码顺序不一致，此过程叫**指令的重排序**

指令重排序的意义是什么？JVM能根据处理器特性（CPU多级缓存系统、多核处理器等）适当的对机器指令进行重排序，**使机器指令能更符合CPU的执行特性，最大限度的发挥机器性能**

![img](/images/concurrency/14408.png)

### 指令重排案例

可能出现的结果(线程的cpu时间片用完)

（x = 0,y = 1）,(x = 1,y = 0),(x = 1,y = 1),由于指令重排现象会发生指令重排，产生（x = 0,y = 0）

![image-20210619195725307](/images/concurrency/image-20210619195725307.png)

```java
@Slf4j
public class Jmm05_CodeReorder {
    private  static int x = 0, y = 0;
    private  static int a = 0, b = 0;

    public static void main(String[] args) throws InterruptedException {
        int i = 0;
        for (;;){
            i++;
            x = 0; y = 0;
            a = 0; b = 0;
            Thread t1 = new Thread(new Runnable() {
                public void run() {
                    shortWait(10000);
                    a = 1;
                    x = b;
                }
            });

            Thread t2 = new Thread(new Runnable() {
                public void run() {
                    b = 1;
                    y = a;
                }
            });

            t1.start();
            t2.start();
            //  main线程需要等待t1,t2执行完才能继续往下执行
            t1.join();
            t2.join();

            String result = "第" + i + "次 (" + x + "," + y + "）";
            if(x == 0 && y == 0) {
                System.out.println(result);
                break;
            } else {
                log.info(result);
            }
        }

    }

    /**
     * 等待一段时间，时间单位纳秒
     * @param interval
     */
    public static void shortWait(long interval){
        long start = System.nanoTime();
        long end;
        do{
            end = System.nanoTime();
        }while(start + interval >= end);
    }
}
//19:59:23.559 [main] INFO com.yg.edu.jmm.Jmm05_CodeReorder - 第83012次 (0,1）
//第83013次 (0,0）
```

#### 解决方案volatile进行修饰

添加volatile,它能禁止指令重排

```java
@Slf4j
public class Jmm05_CodeReorder {
    private volatile static int x = 0, y = 0;
    private volatile static int a = 0, b = 0;

    public static void main(String[] args) throws InterruptedException {
        int i = 0;
        for (;;){
            i++;
            x = 0; y = 0;
            a = 0; b = 0;
            Thread t1 = new Thread(new Runnable() {
                public void run() {
                    shortWait(10000);
                    a = 1;
                    x = b;
                }
            });

            Thread t2 = new Thread(new Runnable() {
                public void run() {
                    b = 1;
                    y = a;
                }
            });

            t1.start();
            t2.start();
            //  main线程需要等待t1,t2执行完才能继续往下执行
            t1.join();
            t2.join();

            String result = "第" + i + "次 (" + x + "," + y + "）";
            if(x == 0 && y == 0) {
                System.out.println(result);
                break;
            } else {
                log.info(result);
            }
        }

    }

    /**
     * 等待一段时间，时间单位纳秒
     * @param interval
     */
    public static void shortWait(long interval){
        long start = System.nanoTime();
        long end;
        do{
            end = System.nanoTime();
        }while(start + interval >= end);
    }
}
```

#### 解决方案手动添加内存屏障Unsafe

手动添加内存屏障

```java
//	需要反射获取到Unsafe
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
public class Jmm05_CodeReorder {
    private  static int x = 0, y = 0;
    private  static int a = 0, b = 0;

    public static void main(String[] args) throws InterruptedException {
        int i = 0;
        for (;;){
            i++;
            x = 0; y = 0;
            a = 0; b = 0;
            Thread t1 = new Thread(new Runnable() {
                public void run() {
                    shortWait(10000);
                    a = 1;
                    //  手动添加内存屏障
                    UnsafeInstance.reflectGetUnsafe().fullFence();
                    x = b;
                }
            });

            Thread t2 = new Thread(new Runnable() {
                public void run() {
                    b = 1;
                    //   手动添加内存屏障
                    UnsafeInstance.reflectGetUnsafe().fullFence();
                    y = a;
                }
            });

            t1.start();
            t2.start();
            //  main线程需要等待t1,t2执行完才能继续往下执行
            t1.join();
            t2.join();

            String result = "第" + i + "次 (" + x + "," + y + "）";
            if(x == 0 && y == 0) {
                System.out.println(result);
                break;
            } else {
                log.info(result);
            }
        }

    }

    /**
     * 等待一段时间，时间单位纳秒
     * @param interval
     */
    public static void shortWait(long interval){
        long start = System.nanoTime();
        long end;
        do{
            end = System.nanoTime();
        }while(start + interval >= end);
    }
}
```



### 单例模式下的指令重排问题

```java
public class DoubleCheckLock {
    private volatile static DoubleCheckLock instance;
    private DoubleCheckLock(){}
    public static DoubleCheckLock getInstance(){
        //第一次检测
        if (instance==null){
            //同步
            synchronized (DoubleCheckLock.class){
                if (instance == null){
                    //多线程环境下可能会出现问题的地方
                    instance = new  DoubleCheckLock();
                }
            }
        }
        return instance;
    }
}
```

上述代码一个经典的单例的双重检测的代码，这段代码在单线程环境下并没有什么问题，但如果在多线程环境下就可以出现线程安全问题。原因在于**某一个线程执行到第一次检测，读取到的instance不为null时，instance的引用对象可能没有完成初始化**。

> 因为instance = new DoubleCheckLock();可以分为以下3步完成(伪代码)

```java
emory = allocate();//1.分配对象内存空间
instance(memory);//2.初始化对象
instance = memory;//3.设置instance指向刚分配的内存地址，此时instance！=null
```

由于步骤2和步骤3间可能会重排序，如下：

```java
memory=allocate();//1.分配对象内存空间
instance=memory;//3.设置instance指向刚分配的内存地址，此时instance！=null，但是对象还没有初始化完成！
instance(memory);//2.初始化对象
```

由于步骤2和步骤3**不存在数据依赖关系**，而且无论重排前还是重排后程序的执行结果在单线程中并没有改变，因此这种重排优化是允许的。但是指令重排只会保证串行语义的执行的一致性(单线程)，但**并不会关心多线程间的语义一致性**。所以当一条线程访问instance不为null时，由于instance实例未必已初始化完成，也就造成了线程安全问题（其他线程可能**拿到这个实例去调用它的方法**）。

如何解决

```java
 //禁止指令重排优化
private volatile static DoubleCheckLock instance;
```