---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /netty/
typora-root-url: ..\.vuepress\public
---



## 字符串

```java
channelRead0(ChannelHandlerContext ctx, ByteBuf msg) 
    
    msg.toString(CharsetUtil.UTF_8) // io.netty.util.CharsetUtil
    //底层就是
	msg.toString(Charset.forName("UTF-8"))    
```



