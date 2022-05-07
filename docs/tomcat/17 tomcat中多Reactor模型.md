---
typora-root-url: images
---

## tomcat7中nio处理请求体响应的阻塞

tomcat7 nio中的处理：

1. 接收socket阻塞
2. 读数据（请求行，请求头）非阻塞
3. 请求体---阻塞，响应阻塞。

tomcat7为什么要在处理请求体，响应时设置为阻塞呢？是为了满足servlet3.0的规范。如果是非阻塞的话，nio socketchannel.read会返回零，表示读取不到数据，那么业务层的循环会跳出，但是我们的业务却并没有读取到完整的请求体。

```java
// 非阻塞
socketChannel.setBlock(false)
    
// 之前主Selector，在接收到连接后sockchannel,绑定到线程池中的一个Poller,在Poller中有一个Selector,会注册socketchannel的读事件。为了方便处理请求行和请求头时非阻塞
    
   // 在处理请求体的时候，需要从主Selector中注销socketchannel的读事件
 
// 那么如何处理获取请求体时的阻塞呢
辅助的Select------线程Poller ----- while 看看这个select有没有就绪事件过来，解阻塞。
servlet层的read
  1. socketchannel.read() // 没有读到数据才会走下面的
  2. 向辅助的selector注册一个读事件(selector就像是另外一个小本本)
  3. 加锁阻塞
  4. socketchannel.read()
```

## 对象池

> tomcat中广泛使用了对象池，便于复用

每一个SocketChannel对应一个NioChannel,这里设计到NioChannel复用的问题。因为socketchannel关闭之后，那么NioChannel对象为了不被GC处理掉，可以放入到**对象池**中。避免每次有新连接时，都new 一个NioChannel

```java
NioChannel channel = nioChannels.poll();//先从线程安全的一个无界队列（对象池）中获取一个channel
if(channel != null){  // 对象池中有NioChannel
    channel.setIOChannel(socket);
    channel.reset();//重置一下
}else{
    // 没有获取到
    channel = new NioChannel(socket,channel)
}
```

------------



## nio中接收到连接后多线程与多Reactor模式建立（nio线程模型）

> 我的理解**Reactor模式，就相当于是Java中的Selector注册socketchannel感兴趣的事件**。
>
> 每个线程，Poller对一个Reactor模式，多线就建立起来了多Reactor模式。

accept接收连接绑定到poller中，Poller也是Runnable

socketChannel与Poller是一对多的关系,因为每个Poller上都有一个Selector.

socketChannel1------绑定到------>Poller1线程 

socketChannel2------绑定到------>Poller1线程 

socketChannel3------绑定到------>Poller2线程 

socketChannel4------绑定到------>Poller2线程

.... ... 

众多的Poll组成一个Polls。这样能够加快事件的处理方式，提高了性能。因为如果只有一个Poller(Selector)那么就会处理众多socketchannel事件的时候，遍历的次数就会非常长。

![image-20220507221800202](/image-20220507221800202.png)

```java
// 当socketchannel来的时候，轮询选择一个poller进行绑定  NioEndpoint.java
public Poller getPoller0(){
    int idx = Max.abs(pollerRotater.incrementAndGet()) & pollers.length();
    return pollers[idx];
}
```



----------

## **NIO新连接绑定到Poller的过程以及在Selector中注册和处理事件**

> socketChannel绑定或者注册到Poller中

accept接收（阻塞的）到连接后，绑定到Poller中，构建了一个PollerEvent（也是一个Runnable）（此时含有了KeyAttachment,而KeyAttachment中有socketChannel）加入到Poller中的events队列。就结束了，然后接着去监听下一个请求。

PollerEvent是一个Runnable,在run方法中注册了OP_RAED事件。

Poller在的run方法中

```
1. 直接调用PollerEvent的run方法，注册事件
2. 然后selector.selector查询就绪事件
3. 处理就绪事件
	3.1 如果就绪的是读事件，那么就会在selector中注销掉读事件，为的就是在后面处理请求体的时候，给辅助的selector注册读事件。
	3.2 读取数据，封装为SocketProcessor
```

### 处理读事件

SocketProcessor（也是一个runnable），封装了socketchannel，以及相应的就绪事件,就会去处理解析http协议，请求体和响应体的处理

![image-20220507232142617](/image-20220507232142617.png)

![image-20220507233148035](/image-20220507233148035.png)