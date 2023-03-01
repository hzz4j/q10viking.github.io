---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## ABA问题

王百万： 打算往自己账户100w,先查一下自w己账户：有多少钱->100W,在柜台查的，撩妹->耽误时间（1小时），

撩妹聊完了，又查了一下自己的户头，100w；

张三：去老王账户100w->非法转入股票市场户口(此时老王账户0)->炒股做T的高手(低买高卖)-->150w->100W又转回老王的户头，张三赚了50w

```java
@Slf4j
public class AtomicAbaProblemRunner {
    static AtomicInteger atomicInteger = new AtomicInteger(1);

    public static void main(String[] args) {
        Thread main = new Thread(new Runnable() {
            @Override
            public void run() {
                int a = atomicInteger.get();
                log.info("操作线程"+Thread.currentThread().getName()+"--修改前操作数值:"+a);
                try {
                    Thread.sleep(3000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                boolean isCasSuccess = atomicInteger.compareAndSet(a,2);
                if(isCasSuccess){
                    log.info("操作线程"+Thread.currentThread().getName()+"--Cas修改后操作数值:"+atomicInteger.get());
                }else{
                    log.info("CAS修改失败");
                }
            }
        },"主线程");

        Thread other = new Thread(new Runnable() {
            @Override
            public void run() {
                atomicInteger.incrementAndGet();// 1+1 = 2;
                log.info("操作线程"+Thread.currentThread().getName()+"--increase后值:"+atomicInteger.get());
                atomicInteger.decrementAndGet();// atomic-1 = 2-1;
                log.info("操作线程"+Thread.currentThread().getName()+"--decrease后值:"+atomicInteger.get());
            }
        },"干扰线程");

        main.start();
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        other.start();

    }
}
/**
 23:06:35.891 [主线程] INFO com.yg.edu.atomic.AtomicAbaProblemRunner - 操作线程主线程--修改前操作数值:1
 23:06:36.389 [干扰线程] INFO com.yg.edu.atomic.AtomicAbaProblemRunner - 操作线程干扰线程--increase后值:2
 23:06:36.389 [干扰线程] INFO com.yg.edu.atomic.AtomicAbaProblemRunner - 操作线程干扰线程--decrease后值:1
 23:06:38.894 [主线程] INFO com.yg.edu.atomic.AtomicAbaProblemRunner - 操作线程主线程--Cas修改后操作数值:2
 */
```

## ABA问题解决AtomicStampedReference

添加版本号

> A0->B1->A3-C4->A5

```java
//	初始值，版本号
new AtomicStampedReference<>(1, 0)
```

```java
public class AtomicStampedRerenceRunner {

    private static AtomicStampedReference<Integer> atomicStampedRef =
            new AtomicStampedReference<>(1, 0);

    public static void main(String[] args){
        Thread main = new Thread(() -> {
            int stamp = atomicStampedRef.getStamp(); //获取当前标识别
            System.out.println("操作线程" + Thread.currentThread()+ " stamp="+stamp + ",初始值 a = " + atomicStampedRef.getReference());
            try {
                Thread.sleep(3000); //等待1秒 ，以便让干扰线程执行
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            boolean isCASSuccess = atomicStampedRef.compareAndSet(1,2,stamp,stamp +1);  //此时expectedReference未发生改变，但是stamp已经被修改了,所以CAS失败
            System.out.println("操作线程" + Thread.currentThread() + " stamp="+stamp + ",CAS操作结果: " + isCASSuccess);
        },"主操作线程");

        Thread other = new Thread(() -> {
            int stamp = atomicStampedRef.getStamp();
            atomicStampedRef.compareAndSet(1,2,stamp,stamp+1);
            System.out.println("操作线程" + Thread.currentThread() + " stamp="+atomicStampedRef.getStamp() +",【increment】 ,值 a= "+ atomicStampedRef.getReference());
            stamp = atomicStampedRef.getStamp();
            atomicStampedRef.compareAndSet(2,1,stamp,stamp+1);
            System.out.println("操作线程" + Thread.currentThread() + " stamp="+atomicStampedRef.getStamp() +",【decrement】 ,值 a= "+ atomicStampedRef.getReference());
        },"干扰线程");

        main.start();
        LockSupport.parkNanos(1000000);
        other.start();
    }
}
/**
 操作线程Thread[主操作线程,5,main] stamp=0,初始值 a = 1
 操作线程Thread[干扰线程,5,main] stamp=1,【increment】 ,值 a= 2
 操作线程Thread[干扰线程,5,main] stamp=2,【decrement】 ,值 a= 1
 操作线程Thread[主操作线程,5,main] stamp=0,CAS操作结果: false
 */
```

