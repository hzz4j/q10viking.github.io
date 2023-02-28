---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## AQS唤醒线程的方式

1.  `LockSupport.unpark(t0);`
2.  `to.interrupt();` 中断
    1. Thread.interrupted() 对中断信号进行检测和**清除**
    2. 如果中断信号没有清除，该线程不会再被park住



## 线程中断interrupt

> 存在的意义，中断会给一个线程打入一个标记，避免强制杀死线程，需要开发者自己去处理中断发生的信号

唤醒线程的

 添加中断，发现LockSupport.park（） 对t0线程不再生效。当线程发生中断后需要对线程中断的标记进行清除，LockSupport.park才能park住



```java
@Slf4j
public class Juc01_Thread_LockSupport {

    public static void main(String[] args) {
        Thread t0 = new Thread(new Runnable() {
            @Override
            public void run() {
                Thread current = Thread.currentThread();
                log.info("{},开始执行!",current.getName());
                for(;;){//spin 自旋
                    log.info("准备park住当前线程：{}....",current.getName());
                    LockSupport.park();
                    log.info("当前线程{}已经被唤醒....",current.getName());
                    if(Thread.interrupted()){	//	对中断进行清除
                        log.info("当前{}线程被中断了",current.getName());
                    }
                }
            }
        },"t0");

        t0.start();

        try {
            Thread.sleep(2000);
            log.info("准备唤醒{}线程!",t0.getName());
            LockSupport.unpark(t0);
            Thread.sleep(2000);
            t0.interrupt();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
/**
 09:58:54.843 [t0] INFO com.yg.edu.lock.Juc01_Thread_LockSupport - t0,开始执行!
 09:58:54.846 [t0] INFO com.yg.edu.lock.Juc01_Thread_LockSupport - 准备park住当前线程：t0....
 09:58:56.844 [main] INFO com.yg.edu.lock.Juc01_Thread_LockSupport - 准备唤醒t0线程!
 09:58:56.844 [t0] INFO com.yg.edu.lock.Juc01_Thread_LockSupport - 当前线程t0已经被唤醒....
 09:58:56.844 [t0] INFO com.yg.edu.lock.Juc01_Thread_LockSupport - 准备park住当前线程：t0....
 09:58:58.844 [t0] INFO com.yg.edu.lock.Juc01_Thread_LockSupport - 当前线程t0已经被唤醒....
 09:58:58.844 [t0] INFO com.yg.edu.lock.Juc01_Thread_LockSupport - 当前t0线程被中断了
 09:58:58.844 [t0] INFO com.yg.edu.lock.Juc01_Thread_LockSupport - 准备park住当前线程：t0....
 */
```



## AQS处理线程的中断方式

检测到该线程是由于中断被唤醒的，再次自我进行中断一次，将内部中断的信号传递出来给AQS外部的业务代码去处理。

队列中的线程由于被中断唤醒，然后通过自旋又去获取锁，结果没有获取到，则又被进行阻塞住，但是此时在该线程的线程栈中interrupted被标记为了true,方便传递给外部。相当于延迟中断的发生

```java
final boolean acquireQueued(final Node node, int arg) {
        boolean failed = true;
        try {
            boolean interrupted = false;
            for (;;) {
                final Node p = node.predecessor();
                if (p == head && tryAcquire(arg)) {
                    setHead(node);
                    p.next = null; // help GC
                    failed = false;
                    return interrupted;		//	获取锁之后返回该线程是否被中断过
                }
                if (shouldParkAfterFailedAcquire(p, node) &&
                    parkAndCheckInterrupt())
                    interrupted = true;		//	如果是中断唤醒 interrupted 被标记为true
            }
        } finally {
            if (failed)
                cancelAcquire(node);
        }
    }
```



```java
private final boolean parkAndCheckInterrupt() {
    LockSupport.park(this);			//	线程被唤醒，看看是不是由于中断被唤醒的
    return Thread.interrupted();	//	会获取线程中断的标记，获取后清楚掉
}
```

```java
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        selfInterrupt();	//	检测到该线程是由于中断被唤醒的，再次自我进行中断一次，将内部中断的信号传递出来给AQS外部的代码
}

static void selfInterrupt() {
    Thread.currentThread().interrupt();	//	进行中断
}
```

https://cgiirw.github.io/2018/05/27/Interrupt_Ques/

----------



## lockInterruptibly直接抛异常

lockInterruptibly与lock不同

1. lock在线程被中断唤醒的时候，将中断信号进行了清除，当该线程获取到锁的时候，才继续打上中断信号
2. lockInterruptibly在检车到线程是被中断唤醒之后，则直接抛出中断异常

```java
private void doAcquireInterruptibly(int arg)
        throws InterruptedException {
        final Node node = addWaiter(Node.EXCLUSIVE);
        boolean failed = true;
        try {
            for (;;) {
                final Node p = node.predecessor();
                if (p == head && tryAcquire(arg)) {
                    setHead(node);
                    p.next = null; // help GC
                    failed = false;
                    return;
                }
                if (shouldParkAfterFailedAcquire(p, node) &&
                    parkAndCheckInterrupt())
                    throw new InterruptedException();	//	直接抛出中断异常
            }
        } finally {
            if (failed)
                cancelAcquire(node);
        }
    }
```

### waitStatus变成CANCEL状态

从上面的代码，可以看到，发生中断finally中的cancelAcquire会被执行

剔除死亡（CANCEL）的节点

![image-20210622103107372](/images/concurrency/image-20210622103107372.png)

```java
private void cancelAcquire(Node node) {
        // Ignore if node doesn't exist
        if (node == null)
            return;

        node.thread = null;

        // Skip cancelled predecessors
        Node pred = node.prev;
        while (pred.waitStatus > 0)
            node.prev = pred = pred.prev;

        // predNext is the apparent node to unsplice. CASes below will
        // fail if not, in which case, we lost race vs another cancel
        // or signal, so no further action is necessary.
        Node predNext = pred.next;

        // Can use unconditional write instead of CAS here.
        // After this atomic step, other Nodes can skip past us.
        // Before, we are free of interference from other threads.
        node.waitStatus = Node.CANCELLED;

        // If we are the tail, remove ourselves.
        if (node == tail && compareAndSetTail(node, pred)) {
            compareAndSetNext(pred, predNext, null);
        } else {
            // If successor needs signal, try to set pred's next-link
            // so it will get one. Otherwise wake it up to propagate.
            int ws;
            if (pred != head &&
                ((ws = pred.waitStatus) == Node.SIGNAL ||
                 (ws <= 0 && compareAndSetWaitStatus(pred, ws, Node.SIGNAL))) &&
                pred.thread != null) {
                Node next = node.next;
                if (next != null && next.waitStatus <= 0)
                    compareAndSetNext(pred, predNext, next);
            } else {
                unparkSuccessor(node);
            }

            node.next = node; // help GC
        }
    }
```

### CANCEL状态节点的剔除过程

直接在cancelAcquire方法中利用CAS方法进行剔除

如果CAS失败，则会唤醒下一个节点的线程，唤醒的节点通过自旋，去执行shouldParkAfterFailedAcquire的方法（因为要获取锁需要其prev节点必须是head节点），在该方法中进行剔除

```java
private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {
        int ws = pred.waitStatus;
        if (ws == Node.SIGNAL)
            /*
             * This node has already set status asking a release
             * to signal it, so it can safely park.
             */
            return true;
        if (ws > 0) {	//	进行剔除
            /*
             * Predecessor was cancelled. Skip over predecessors and
             * indicate retry.
             */
            do {
                node.prev = pred = pred.prev;
            } while (pred.waitStatus > 0);
            pred.next = node;
        } else {
            /*
             * waitStatus must be 0 or PROPAGATE.  Indicate that we
             * need a signal, but don't park yet.  Caller will need to
             * retry to make sure it cannot acquire before parking.
             */
            compareAndSetWaitStatus(pred, ws, Node.SIGNAL);
        }
        return false;
    }
```

