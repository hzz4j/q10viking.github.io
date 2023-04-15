---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /netty/
typora-root-url: ..\.vuepress\public
---



If the client has disconnected properly:

- `read()` will return -1
- `readLine()` returns null
- `readXXX()` for any other X throws `EOFException`.

The only really reliable way to detect a lost TCP connection is to write to it. Eventually this will throw an `IOException: connection reset`, but it takes at least two writes due to buffering.



select阻塞被唤醒，然后处理key,  进行read，发现是EOF则关闭线程。



[socket关闭| ProcessOn免费在线作图,在线流程图,在线思维导图](https://www.processon.com/view/link/643a0aa496a2d95a10083ab8)

<common-progresson-snippet src="https://www.processon.com/diagraming/643a011740a0dd65f6a74008"/>

![socket关闭](/images/netty/socket关闭.png)



```java
if (key.isReadable()) {
    ByteBuffer readBuffer = ByteBuffer.allocate(1024);
    int readBytes = sc.read(readBuffer);
    if (readBytes > 0) {
        readBuffer.flip();
        byte[] bytes = new byte[readBuffer.remaining()];
        readBuffer.get(bytes);
        String body = new String(bytes, "UTF-8");
        logger.info("客户端收到消息：" + body);
    } else if (readBytes < 0) {   // 会读取到-1
        logger.info("客户端关闭");
        key.cancel();
        sc.close();
    } else {
        //读到0字节，忽略
    }
}
```

