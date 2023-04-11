---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /netty/
typora-root-url: ..\.vuepress\public
---



## Linux下的IO复用编程

select，poll，epoll都是IO多路复用的机制。I/O多路复用就是通过一种机制，一个进程可以监视多个描述符，一旦某个描述符就绪（一般是读就绪或者写就绪），能够通知程序进行相应的读写操作。但select，poll，epoll本质上都是同步I/O，因为他们都需要在读写事件就绪后自己负责进行读写，并等待读写完成



## 文件描述符

在Linux操作系统中，可以将一切都看作是文件，包括普通文件，目录文件，字符设备文件（如键盘，鼠标…），块设备文件（如硬盘，光驱…），套接字等等，所有一切均抽象成文件，提供了统一的接口，方便应用程序调用。

既然在Linux操作系统中，你将一切都抽象为了文件，那么对于一个打开的文件，我应用程序怎么对应上呢？文件描述符应运而生。

文件描述符：File descriptor,简称fd，当应用程序请求内核打开/新建一个文件时，内核会返回一个文件描述符用于对应这个打开/新建的文件，其fd本质上就是一个非负整数。实际上，它是一个索引值，指向内核为每一个进程所维护的该进程打开文件的记录表。当程序打开一个现有文件或者创建一个新文件时，内核向进程返回一个文件描述符。在程序设计中，一些涉及底层的程序编写往往会围绕着文件描述符展开。但是文件描述符这一概念往往只适用于UNIX、Linux这样的操作系统。

系统为了维护文件描述符建立了3个表：进程级的文件描述符表、系统级的文件描述符表、文件系统的i-node表。所谓进程级的文件描述符表，指操作系统为每一个进程维护了一个文件描述符表，该表的索引值都从从0开始的，所以在不同的进程中可以看到相同的文件描述符，这种情况下相同的文件描述符可能指向同一个实际文件，也可能指向不同的实际文件。



## linux IO复用提供的api

### select

```c++
int select (int n, fd_set \*readfds, fd_set \*writefds, fd_set \*exceptfds, struct timeval \*timeout);
```

select 函数监视的文件描述符分3类，分别是writefds、readfds、和exceptfds。调用后select函数会阻塞，直到有描述副就绪（有数据 可读、可写、或者有except），或者超时（timeout指定等待时间，如果立即返回设为null即可），函数返回。当select函数返回后，可以 通过遍历fdset，来找到就绪的描述符。

select目前几乎在所有的平台上支持，其良好跨平台支持也是它的一个优点。select的一 个缺点在于单个进程能够监视的文件描述符的数量存在最大限制，在Linux上一般为1024，可以通过修改宏定义甚至重新编译内核的方式提升这一限制，但是这样也会造成效率的降低

### poll

```c++
int poll (struct pollfd *fds, unsigned int nfds, int timeout);
```

不同与select使用三个位图来表示三个fdset的方式，poll使用一个 pollfd的指针实现。

pollfd结构包含了要监视的event和发生的event，不再使用select“参数-值”传递的方式。同时，pollfd并没有最大数量限制（但是数量过大后性能也是会下降）。 和select函数一样，poll返回后，需要轮询pollfd来获取就绪的描述符。



### epoll

epoll是在2.6内核中提出的，是之前的select和poll的增强版本。相对于select和poll来说，可以看到epoll做了更细致的分解，包含了三个方法，使用上更加灵活。

```c++
int epoll_create(int size);
```

创建一个epoll的句柄，size用来告诉内核这个监听的数目一共有多大，这个参数不同于select()中的第一个参数，给出最大监听的fd+1的值，参数size并不是限制了epoll所能监听的描述符最大个数，只是对内核初始分配内部数据结构的一个建议。当创建好epoll句柄后，它就会占用一个fd值，在linux下如果查看/proc/进程id/fd/，是能够看到这个fd的，所以在使用完epoll后，必须调用close()关闭，否则可能导致fd被耗尽。

作为类比，可以理解为对应于JDK NIO编程里的`selector = Selector.open()`;

--------

```c++
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event);
```

函数是对指定描述符fd执行op操作。

- epfd：是epoll_create()的返回值。

- op：表示op操作，用三个宏来表示：添加EPOLL_CTL_ADD，删除EPOLL_CTL_DEL，修改EPOLL_CTL_MOD。分别添加、删除和修改对fd的监听事件。

- fd：是需要监听的fd（文件描述符）

- epoll_event：是告诉内核需要监听什么事，有具体的宏可以使用，比如EPOLLIN ：表示对应的文件描述符可以读（包括对端SOCKET正常关闭）；EPOLLOUT：表示对应的文件描述符可以写；

作为类比，可以理解为对应于JDK NIO编程里的`socketChannel.register();`

```c++
int epoll_wait(int epfd, struct epoll_event * events, int maxevents, int timeout);
```

等待epfd上的io事件，最多返回maxevents个事件。

参数events用来从内核得到事件的集合，maxevents告之内核这个events有多大，这个maxevents的值不能大于创建epoll_create()时的size，参数timeout是超时时间（毫秒，0会立即返回，-1将不确定，也有说法说是永久阻塞）。该函数返回需要处理的事件数目，如返回0表示已超时。

作为类比，可以理解为对应于JDK NIO编程里的`selector.select();`

### 小结

select，poll，epoll都是 操作系统实现IO多路复用的机制。 我们知道，I/O多路复用就通过一种机制，可以监视多个描述符，一旦某个描述符就绪（一般是读就绪或者写就绪），能够通知程序进行相应的读写操作。那么这三种机制有什么区别呢

- 支持一个进程所能打开的最大连接数

| select | 单个进程所能打开的最大连接数有FD_SETSIZE宏定义，其大小是32个整数的大小（在32位的机器上，大小就是32*32，同理64位机器上FD_SETSIZE为32*64），当然我们可以对进行修改，然后重新编译内核，但是性能可能会受到影响。 |
| ------ | ------------------------------------------------------------ |
| poll   | poll本质上和select没有区别，但是它没有最大连接数的限制，原因是它是基于链表来存储的 |
| epoll  | 虽然连接数基本上只受限于机器的内存大小                       |

- FD剧增后带来的IO效率问题

| select | 因为每次调用时都会对连接进行线性遍历，所以随着FD的增加会造成遍历速度慢的“线性下降性能问题”。 |
| ------ | ------------------------------------------------------------ |
| poll   | 同上                                                         |
| epoll  | 因为epoll内核中实现是根据每个fd上的callback函数来实现的，只有活跃的socket才会主动调用callback，所以在活跃socket较少的情况下，使用epoll没有前面两者的线性下降的性能问题，但是所有socket都很活跃的情况下，可能会有性能问题。 |

- 消息传递方式

| select | 内核需要将消息传递到用户空间，都需要内核拷贝动作 |
| ------ | ------------------------------------------------ |
| poll   | 同上                                             |
| epoll  | epoll通过内核和用户空间共享一块内存来实现的。    |

> 综上，在选择select，poll，epoll时要根据具体的使用场合以及这三种方式的自身特点。
>
> 1. 表面上看epoll的性能最好，但是在连接数少并且连接都十分活跃的情况下，select和poll的性能可能比epoll好，毕竟epoll的通知机制需要很多函数回调。
> 2. select低效是因为**每次它都需要轮询**。但低效也是相对的，视情况而定，也可通过良好的设计改善。



## **epoll高效原理和底层机制分析**

### **网卡接收数据**

一个典型的计算机结构图，计算机由CPU、存储器（内存）、网络接口等部件组成。了解epoll本质的第一步，要从硬件的角度看计算机怎样接收网络数据。

![https://note.youdao.com/yws/public/resource/4499dc41109fc444d647af81e868e011/xmlnote/OFFICED94700A466A04A8FAFDBA5A14E5F75F3/10043](/images/netty/10043.png)

网卡收到网线传来的数据；经过硬件电路的传输；最终将数据写入到内存中的某个地址上。这个过程涉及到DMA传输、IO通路选择等硬件有关的知识，但我们只需知道：网卡会把接收到的数据写入内存。操作系统就可以去读取它们

![img](/images/netty/10044.png)

当网卡把数据写入到内存后，网卡向cpu发出一个中断信号，操作系统便能得知有新数据到来，再通过网卡中断程序去处理数据。

对于网络模块来说，由于处理过程比较复杂和耗时，如果在中断函数中完成所有的处理，将会导致中断处理函数（优先级过高）将过度占据CPU，将导致CPU无法响应其它设备，例如鼠标和键盘的消息。

因此Linux中断处理函数是分上半部和下半部的。上半部是只进行最简单的工作，快速处理然后释放CPU，接着CPU就可以允许其它中断进来。剩下将绝大部分的工作都放到下半部中，可以慢慢从容处理。2.4以后的内核版本采用的下半部实现方式是软中断，由ksoftirqd内核线程全权处理。和硬中断不同的是，硬中断是通过给CPU物理引脚施加电压变化，而软中断是通过给内存中的一个变量的二进制值以通知软中断处理程序

![https://note.youdao.com/yws/public/resource/4499dc41109fc444d647af81e868e011/xmlnote/OFFICE625475CB41AC4B7C8F4B3AC411409956/10049](/images/netty/10049.png)

### **内核收包的概览**

![https://note.youdao.com/yws/public/resource/4499dc41109fc444d647af81e868e011/xmlnote/OFFICEDCE9A40F92414C149C901807CED2A75B/10045](/images/netty/10045.png)



### epoll设计思路

当某个进程调用epoll_create方法时，内核会创建一个eventpoll对象（也就是程序中epfd所代表的对象）。eventpoll对象也是文件系统中的一员，和socket一样，它也会有等待队列。

创建epoll对象后，可以用epoll_ctl添加或删除所要监听的socket。以添加socket为例，如下图，如果通过epoll_ctl添加sock1、sock2和sock3的监视，内核会将eventpoll添加到这三个socket的等待队列中。

![https://note.youdao.com/yws/public/resource/4499dc41109fc444d647af81e868e011/xmlnote/OFFICE6BACEEE1499245358834C61F09C4C5B1/10051](/images/netty/10051.png)

当socket收到数据后，中断程序会操作eventpoll对象，而不是直接操作进程。中断程序会给eventpoll的“就绪列表”添加socket引用。如下图展示的是sock2和sock3收到数据后，中断程序让rdlist引用这两个socket。

----------

eventpoll对象相当于是socket和进程之间的中介，socket的数据接收并不直接影响进程，而是通过改变eventpoll的就绪列表来改变进程状态。

当程序执行到epoll_wait时，如果rdlist已经引用了socket，那么epoll_wait直接返回，如果rdlist为空，阻塞进程。

假设计算机中正在运行进程A和进程B，在某时刻进程A运行到了epoll_wait语句。如下图所示，内核会将进程A放入eventpoll的等待队列中，阻塞进程。

![https://note.youdao.com/yws/public/resource/4499dc41109fc444d647af81e868e011/xmlnote/OFFICE6DB971A5485548799754B281C45B64CA/10053](/images/netty/10053.png)

当socket接收到数据，中断程序一方面修改rdlist，另一方面唤醒eventpoll等待队列中的进程，进程A再次进入运行状态。也因为rdlist的存在，进程A可以知道哪些socket发生了变化。