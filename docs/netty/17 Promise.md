---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /netty/
typora-root-url: ..\.vuepress\public
---



服务端关闭channel,

客户端在等待关闭

```java
ChannelFuture f = bootstrap.connect().sync();
f.channel().closeFuture().sync();
```

如何被唤醒的？

![image-20230412124136650](/images/netty/image-20230412124136650.png)



## 检测到socket关闭

调试代码channelInactive









## Promise的阻塞与唤醒

```java
synchronized (this) {
    while (!isDone()) {
        incWaiters();
        try {
            wait();
        } finally {
            decWaiters();
        }
    }
}
```



```java
private synchronized boolean checkNotifyWaiters() {
        if (waiters > 0) {
            notifyAll();
        }
        return listeners != null;
    }

```

执行listener