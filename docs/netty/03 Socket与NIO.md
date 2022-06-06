## 网络通信

连接（客户端连接服务器，服务器等待和接收连接），读网络数据，写网络数据

## Socket与BIO

> **Socket是底层操作系统的门面模式，编程的socket是应用层面的。**

服务器与客户端建立连接，（源IP,目标IP,协议号，源端口，目标端口）

BIO尽管可以结合线程池，但是遇到磁盘IO还是不太能够支持高并发的场景。



## NIO的多路复用

> NIO是同步非阻塞的

BIO面向流，阻塞

**NIO面向缓冲，非阻塞**

> NIO最主要的优点是Reactor模型，得益于底层linux的I/O复用模型的支持，而linux的I/O复用有三种：select，poll，epoll 都是 IO 多路复用的机制
>
> I/O 多路复用就是通过一种机制，**一个进 程可以监视多个描述符**，一旦某个描述符就绪（一般是读就绪或者写就绪），能够通知程序 进行相应的读写操作

注册感兴趣的事件--->扫面发生的事件---->通知注册中对应的人

多路复用：就是一个单线程处理了所有的连接

**NIO三大核心组件**：Selector,Channel,Buffer



## IO复用模型

![image-20220502133810657](C:\Users\11930\AppData\Roaming\Typora\typora-user-images\image-20220502133810657.png)

### epoll

```c
int epoll_create(int size)； // 可以理解为对应于 JDK NIO 编程里的 selector = Selector.open()
// 可以理解为对应于 JDK NIO 编程里的 socketChannel.register();
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event)；
// 可以理解为对应于 JDK NIO 编程里的 selector.select();
int epoll_wait(int epfd, struct epoll_event * events, int maxevents, int timeout)
```



## select、poll、epoll 的比较

> select，poll，epoll 都是 操作系统实现 IO 多路复用的机制。

支持一个进程所能打开的最大连接数



### epoll

有一个实现了一个中间层eventpoll,里面有socket的链表，与进程的队列



## 进程间六种通信方式

信号(kill -9)，管道，共享内存，消息队列，domain socket
