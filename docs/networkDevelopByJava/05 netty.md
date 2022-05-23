---
typora-root-url: images
---



## ChannelPipleline与ChannelHandler

在运行时，入站和出站会能够区分入站事件和出站事件。

AbstractChannelHandler 

在分属出栈和入站不同的Handler,是可以不用考虑顺序的。



**在同属于一个方向的Handler则是有顺序的**





![image-20220523043133088](/image-20220523043133088.png)





## ChannelHandler与ChannelHandlerContext

contxt.write | context.pipeline().write() | context.channel().write() 的区别

## Handler的共享和并发性

## ByteBuf资源管理SimpleChannelInBoundHandler

Netty在Pipeline中会默认添加一个head和tial handler

会在tail handler做ByteBuf的资源释放

要么往后传递，要么自己释放，自己释放比较麻烦就可以使用SimpleChannel...Handler.(入站时会有内存泄漏)

一个Channel的创建都会建立对应一个Pipeline

## ChannelDuplexHandler

处理了入站和出站数据

## ChannelOption

SO_BACKLOG: tcp的连接数，已经完成tcp连接的数量。半连接是另外的一个参数

SO_REUSEADDR: TCP关闭时有一个timewait状态：即使一个端口处于timewait的状态，强制重用。但是会产生问题，会收到上一个连接的发送的数据包（网速比较慢）

SO_SNDBUF | SO_RCVBUF: 调整缓冲区默认的大小

SO_LINGER: 关闭socket连接时，操作系统会等到发送缓冲区的数据全部发送完毕后，才关闭

TCP_NODELAY: 提高网络带宽的利用率，报文大小的发送时机。

## ByteBuf

## TCP粘包与半包（分包）

多个报文合成了一个

tcp将大的消息进行了分包，tcp发送消息的大小，也会动态改变，滑动窗口

发生原因：

应用程序写入数据的字节大小大于套接字发送缓冲区的大小

进行MSS大小的TCP分段

解决思路：



- 换行符：上面两个问题只能在应用层进行处理。比如处理时以分隔符来处理，netty中提供了LineBaseFrameDecoder的handler。

- 自定义换行符：netty也提供了自定分隔符DelimiterBasedFrameDecoder

- 以固定长度进行通信：FixedLength，
- 以自定义长度进行通信LengthfieldBaseFrameDecoder,

## channelRead和channelReadComplete

channelRead处理应用层报文，再用应用层看来是发送完一次完整的数据，正确处理了粘包半包后的数据。

channelReadComplete是netty从socket缓冲区读取的次数

## 编解码器

解码器：netty提供了ByteToMessageDecoder和MessageToMessageDecoder



## HTTPweb服务器

## 序列化

实战序列化

实战自己的通信框架，空闲检测，重连，监控，日志

异步转同步



单机netty支持百万连接

TCP参数的连接backlog参数（队列的大小）,已经完成的连接，如果用户进去取走了，那就再操作系统中的队列中移除

OS层面: 一个进程打开的文件数是有限定的，破除linux对进程允许打开的最大文件句柄数，因为在linux中一切皆文件，socket也不例外。linux默认是65535；linux打开的总文件数也是有限制的（cat /proc/sys/fs/file-max），所以也要进行处理 [(24条消息) linux端口支持多大,Linux系统支持的最大TCP连接是多少？_weixin_39970064的博客-CSDN博客](https://blog.csdn.net/weixin_39970064/article/details/116629782)

netty层面： 线程数的调整，心跳报文的处理。socket缓冲要适当跳小一点

尽可能使用内存池，netty中只要不是new出来的buffer,它自己会维护了一个内存池。IO与业务线程做分离，做流量控制

JVM做好调优：尽可能减少FullGC