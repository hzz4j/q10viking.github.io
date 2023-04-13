---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



```
DefaultThreadFactory
```

io.netty.channel.MultithreadEventLoopGroup#newDefaultThreadFactory

## JDK中的默认的工厂

```java
Executors.defaultThreadFactory()
```



## 实现

> 既然是线程工厂，生产线程，那么生产出来的线程，名称上就要有一些规律

- 定义一个poolId，代表工厂id
- 定义一个nextId，代表线程的id
- 线程名字，以class name来处理

[Source Code](https://github.com/Q10Viking/learncode/tree/main/threads/_03-netty-thread/netty-thread/src/main/java/org/hzz/factory)

```java
/**
 * 线程工厂
 */
public class DefaultThreadFactory implements ThreadFactory {
    private static final AtomicInteger poolId = new AtomicInteger();
    private final AtomicInteger threadId = new AtomicInteger(0);
    private final String prefix;
    private final boolean daemon;
    private final int priority;
    private final ThreadGroup group;


    public DefaultThreadFactory(Class<?> poolType) {
        this(poolType, false, Thread.NORM_PRIORITY);
    }

    public DefaultThreadFactory(Class<?> poolType, boolean daemon,int priority) {
        this(toPoolName(poolType), daemon, Thread.NORM_PRIORITY);
    }

    public DefaultThreadFactory(String poolName, boolean daemon,int priority) {
       this(poolName,daemon,priority,Thread.currentThread().getThreadGroup());
    }

    public DefaultThreadFactory(String poolName, boolean daemon,int priority,ThreadGroup group) {
        this.prefix = poolName + '-' + poolId.incrementAndGet() + "-thread-";
        this.priority = priority;
        this.daemon = daemon;
        this.group = group;
    }

    public static String toPoolName(Class<?> poolType){
        if(poolType == null){
            throw new NullPointerException("poolType");
        }
        String simpleName = poolType.getSimpleName();
        if(Character.isUpperCase(simpleName.charAt(0)) && Character.isLowerCase(simpleName.charAt(1))){
            return Character.toLowerCase(simpleName.charAt(0)) + simpleName.substring(1);
        }else{
            return simpleName;
        }
    }

    @Override
    public Thread newThread(Runnable r) {
        Thread t = new Thread(group, r, prefix + threadId.incrementAndGet());
        if(t.isDaemon() != daemon){
            t.setDaemon(daemon);
        }

        if(t.getPriority()!=priority){
            t.setPriority(priority);
        }
        return t;
    }
}

```

> 测试

```java
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class TestDefaultFactory {
    public static void main(String[] args) {
        DefaultThreadFactory threadFactory = new DefaultThreadFactory(TestDefaultFactory.class);
        threadFactory.newThread(new Runnable() {
            @Override
            public void run() {
                log.info("hello");
            }
        }).start();
    }
}
/**
 * 11:37:02.741 [testDefaultFactory-1-thread-1] INFO org.hzz.factory.TestDefaultFactory - hello
 */
```

