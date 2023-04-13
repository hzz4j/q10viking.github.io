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