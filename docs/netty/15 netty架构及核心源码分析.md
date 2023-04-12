---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /netty/
typora-root-url: ..\.vuepress\public
---

## Netty架构图

![85277netty.png](/images/netty/85277netty.png)

----------





## ServerBootStrap启动源码分析

[Link](https://www.processon.com/view/link/628d07f00e3e747f1e8d0420)

<common-progresson-snippet src="https://www.processon.com/view/link/628d07f00e3e747f1e8d0420"/>

[netty 启动绑定时为什么给ServerSocketChanel注册的ops为 0 而不是OP_ACCEPT](https://blog.csdn.net/qq_41082092/article/details/114360597)

![image-20230411214308635](/images/netty/image-20230411214308635.png)

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

[link](https://www.processon.com/view/link/628d07f00e3e747f1e8d0420)

<common-progresson-snippet src="https://www.processon.com/view/link/628d07f00e3e747f1e8d0420"/>

-----------



## 自己画一个netty线程模型图

[Link](https://www.processon.com/view/link/628f12a0e0b34d41d954a181)

<common-progresson-snippet src="https://www.processon.com/view/link/628f12a0e0b34d41d954a181"/>



![netty线程模型](/images/netty/netty线程模型.png)

## Java代码学习

反射修改

```
interface = new Interface[12];

```

netty线程的流转
