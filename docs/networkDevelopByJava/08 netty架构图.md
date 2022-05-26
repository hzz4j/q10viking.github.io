---
typora-root-url: images
---

## Netty架构图

![85277netty.png](/85277netty.png)

----------



NioEventLoopGroup

NioEventLoop

构造函数分析 SelectorProvider

线程池分析

ChannelFuture分析

bind方法

initAndRegister

doBind0

## ServerBootStrap启动源码分析

https://www.processon.com/view/link/628d07f00e3e747f1e8d0420

[(27条消息) netty 启动绑定时为什么给ServerSocketChanel注册的ops为 0 而不是OP_ACCEPT（16） 解析 + 代码位置：io.netty.channel_代码蒲蒲的博客-CSDN博客](https://blog.csdn.net/qq_41082092/article/details/114360597)

```
SelectionKey的作用
selectionKey.interestOps(interestOps | readInterestOp)
```

```
DefaultChannelHandlerContext
```

```java
// 方法重载  
// https://blog.csdn.net/qq_57399395/article/details/122359009
public abstract class ChannelInitializer<C extends Channel>{
    private boolean initChannel(ChannelHandlerContext ctx) throws Exception
	protected abstract void initChannel(C ch) throws Exception;
}

```

----------



## 客户端连接服务端处理

1. 连接建立SocketChannel
2. 创建pipe

客户端发数据，服务端响应

https://www.processon.com/view/link/628d07f00e3e747f1e8d0420

-----------

Netty零拷贝





![image-20220525153611042](/image-20220525153611042.png)





## 自己画一个netty线程模型图

单线程没有任务跑哪里去了

百万连接的分析处理

https://www.processon.com/view/link/628f12a0e0b34d41d954a181



![netty线程模型](/netty线程模型.png)

## Java代码学习

反射修改

```
interface = new Interface[12];

```

netty线程的流转
