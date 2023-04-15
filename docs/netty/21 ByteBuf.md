---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /netty/
typora-root-url: ..\.vuepress\public
---





## ByteBuf

- 它可以被用户自定义的缓冲区类型扩展；
- 通过内置的复合缓冲区类型实现了透明的零拷贝；
- 容量可以按需增长（类似于JDK 的StringBuilder）；
- 在读和写这两种模式之间切换不需要调用ByteBuffer 的flip()方法；
- 读和写使用了不同的索引；
- 支持方法的链式调用；
- 支持引用计数；
- 支持池化。

> ByteBuf 维护了两个不同的索引，名称以read 或者write 开头的ByteBuf 方法，将会推进其对应的索引，而名称以set 或者get 开头的操作则不会



:::: code-group
::: code-group-item NettyByteBuf

```java
import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufUtil;
import io.netty.buffer.Unpooled;

public class NettyByteBuf {
    static String msg = "hello";
    public static void main(String[] args) {
        // 创建byteBuf对象，该对象内部包含一个字节数组byte[10]
        // 通过readerindex和writerIndex和capacity，将buffer分成三个区域
        // 已经读取的区域：[0,readerindex)
        // 可读取的区域：[readerindex,writerIndex)
        // 可写的区域: [writerIndex,capacity)
        ByteBuf buffer = Unpooled.buffer(10);
        System.out.println(ByteBufUtil.prettyHexDump(buffer));
        for (int i = 0; i < msg.length(); i++) {
            buffer.writeByte(msg.charAt(i));
        }
        System.out.println(ByteBufUtil.prettyHexDump(buffer));
        System.out.println("------------------");
        for(int i = 0;i<msg.length();i++){
            System.out.println((char)buffer.getByte(i));
        }
        System.out.println(ByteBufUtil.prettyHexDump(buffer));
        System.out.println("------------------");

        for(int i = 0;i<msg.length();i++){
            System.out.println((char)buffer.readByte());
        }
        System.out.println(ByteBufUtil.prettyHexDump(buffer));
        System.out.println("------------------");
    }
}
/**
 *
 +-------------------------------------------------+
 |  0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f |
 +--------+-------------------------------------------------+----------------+
 |00000000| 68 65 6c 6c 6f                                  |hello           |
 +--------+-------------------------------------------------+----------------+
 ------------------
 h
 e
 l
 l
 o
 +-------------------------------------------------+
 |  0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f |
 +--------+-------------------------------------------------+----------------+
 |00000000| 68 65 6c 6c 6f                                  |hello           |
 +--------+-------------------------------------------------+----------------+
 ------------------
 h
 e
 l
 l
 o

 ------------------

 */
```
:::
::: code-group-item NettyByteBuf2
```java
public class NettyByteBuf2 {
    public static void main(String[] args) {
        ByteBuf bytebuf = Unpooled.copiedBuffer("Hello World", Charset.forName("utf-8"));
        System.out.println(ByteBufUtil.prettyHexDump(bytebuf));

        if(bytebuf.hasArray()){
            byte[] content = bytebuf.array();
            //将content转成字符串
            System.out.println(new String(content, Charset.forName("utf-8")));
            System.out.println(ByteBufUtil.prettyHexDump(bytebuf));

            System.out.println("readable bytes = "+bytebuf.readableBytes());

            // 范围读取
            System.out.println(bytebuf.getCharSequence(0,5,Charset.forName("utf-8")));
            System.out.println(bytebuf.getCharSequence(6,5,Charset.forName("utf-8")));
            System.out.println(ByteBufUtil.prettyHexDump(bytebuf));
        }
    }
}
/**
 *          +-------------------------------------------------+
 *          |  0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f |
 * +--------+-------------------------------------------------+----------------+
 * |00000000| 48 65 6c 6c 6f 20 57 6f 72 6c 64                |Hello World     |
 * +--------+-------------------------------------------------+----------------+
 * Hello World
 *          +-------------------------------------------------+
 *          |  0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f |
 * +--------+-------------------------------------------------+----------------+
 * |00000000| 48 65 6c 6c 6f 20 57 6f 72 6c 64                |Hello World     |
 * +--------+-------------------------------------------------+----------------+
 * readable bytes = 11
 * Hello
 * World
 *          +-------------------------------------------------+
 *          |  0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f |
 * +--------+-------------------------------------------------+----------------+
 * |00000000| 48 65 6c 6c 6f 20 57 6f 72 6c 64                |Hello World     |
 * +--------+-------------------------------------------------+----------------+
 */
```
:::
::::



## 使用模式

### **堆缓冲区**

最常用的ByteBuf 模式是将数据存储在JVM 的堆空间中。这种模式被称为支撑数组（backing array），它能在没有使用池化的情况下提供快速的分配和释放。可以由hasArray()来判断检查ByteBuf 是否由数组支撑。如果不是，则这是一个直接缓冲区。



### **直接缓冲区**

直接缓冲区是另外一种ByteBuf 模式。

直接缓冲区的主要缺点是，相对于基于堆的缓冲区，它们的分配和释放都较为昂贵。



### **复合缓冲区**

复合缓冲区CompositeByteBuf，它为多个ByteBuf 提供一个聚合视图。比如HTTP 协议，分为消息头和消息体，这两部分可能由应用程序的不同模块产生，各有各的ByteBuf，将会在消息被发送的时候组装为一个ByteBuf，此时可以将这两个ByteBuf聚合为一个CompositeByteBuf，然后使用统一和通用的ByteBuf API来操作。





## 分配

> 如何在我们的程序中获得ByteBuf的实例，并使用它呢？Netty提供了两种方式



### **ByteBufAllocator 接口**

Netty 通过interface ByteBufAllocator分配我们所描述过的任意类型的ByteBuf 实例

| 名称              | 描述                                                         |
| ----------------- | ------------------------------------------------------------ |
| buffer()          | 返回一个基于堆或者直接内存存储的ByteBuf                      |
| heapBuffer()      | 返回一个基于堆内存存储的ByteBuf                              |
| directBuffer()    | 返回一个基于直接内存存储的ByteBuf                            |
| compositeBuffer() | 返回一个可以通过添加最大到指定数目的基于堆的或者直接内存存储的缓冲区来扩展的CompositeByteBuf |
| ioBuffer()        | 返回一个用于套接字的I/O 操作的ByteBuf，当所运行的环境具有sun.misc.Unsafe 支持时，返回基于直接内存存储的ByteBuf，否则返回基于堆内存存储的ByteBuf；当指定使用PreferHeapByteBufAllocator 时，则只会返回基于堆内存存储的ByteBuf。 |

可以通过Channel（每个都可以有一个不同的ByteBufAllocator 实例）或者绑定到ChannelHandler 的ChannelHandlerContext 获取一个到ByteBufAllocator 的引用。

Netty提供了两种ByteBufAllocator的实现：PooledByteBufAllocator和Unpooled-ByteBufAllocator。前者池化了ByteBuf的实例以提高性能并最大限度地减少内存碎片。后者的实现不池化ByteBuf实例，并且在每次它被调用时都会返回一个新的实例。



### Unpooled缓冲区

Netty 提供了一个简单的称为Unpooled 的工具类，它提供了静态的辅助方法来创建未池化的ByteBuf实例。

- buffer()  返回一个未池化的基于堆内存存储的ByteBuf
- directBuffer()返回一个未池化的基于直接内存存储的ByteBuf
- wrappedBuffer() 返回一个包装了给定数据的ByteBuf
- copiedBuffer() 返回一个复制了给定数据的ByteBuf

Unpooled 类还可用于ByteBuf 同样可用于那些并不需要Netty 的其他组件的非网络项目



## 字符串

```java
channelRead0(ChannelHandlerContext ctx, ByteBuf msg) 
    
    msg.toString(CharsetUtil.UTF_8) // io.netty.util.CharsetUtil
    //底层就是
	msg.toString(Charset.forName("UTF-8"))    
```



----------



## 随机/顺序访问索引



如同在普通的Java 字节数组中一样，ByteBuf 的索引是从零开始的：第一个字节的索引是0，最后一个字节的索引总是capacity() - 1。使用那些需要一个索引值参数(**随机访问**,也即是数组下标)的方法（的其中）之一来访问数据既不会改变readerIndex 也不会改变writerIndex。如果有需要，也可以通过调用readerIndex(index)或者writerIndex(index)来手动移动这两者。**顺序访问**通过索引访问

有两种类别的读/写操作：

- get()和set()操作，从给定的索引开始，并且保持索引不变；get+数据字长（bool.byte,int,short,long,bytes）

- read()和write()操作，从给定的索引开始，并且会根据已经访问过的字节数对索引进行调整。

### ByteBuf操作

- isReadable() 如果至少有一个字节可供读取，则返回true
- isWritable() 如果至少有一个字节可被写入，则返回true
- readableBytes() 返回可被读取的字节数
- writableBytes() 返回可被写入的字节数
- capacity() 返回ByteBuf 可容纳的字节数。在此之后，它会尝试再次扩展直到达到maxCapacity()
- maxCapacity() 返回ByteBuf 可以容纳的最大字节数
- hasArray() 如果ByteBuf 由一个字节数组支撑，则返回true
- array() 如果 ByteBuf 由一个字节数组支撑则返回该数组；否则，它将抛出一个UnsupportedOperationException 异常



## 可丢弃的字节

可丢弃字节的分段包含了已经被读过的字节。通过调用discardReadBytes()方法，可以丢弃它们并回收空间。这个分段的初始大小为0，存储在readerIndex 中，会随着read 操作的执行而增加（get*操作不会移动readerIndex）。

缓冲区上调用discardReadBytes()方法后，可丢弃字节分段中的空间已经变为可写的了。频繁地调用discardReadBytes()方法以确保可写分段的最大化，但是请注意，这将极有可能会导致内存复制，因为可读字节必须被移动到缓冲区的开始位置。建议只在有真正需要的时候才这样做，例如，当内存非常宝贵的时候。



![img](/images/netty/10114.png)

### **可读字节**

ByteBuf 的可读字节分段存储了实际数据。新分配的、包装的或者复制的缓冲区的默认的readerIndex 值为0



### **可写字节**❤️

可写字节分段是指一个拥有未定义内容的、写入就绪的内存区域。新分配的缓冲区的writerIndex 的默认值为0。任何名称以write 开头的操作都将从当前的writerIndex 处开始写数据，并将它增加已经写入的字节数

![https://note.youdao.com/yws/public/resource/f71d324d40f6c4bfb67e419a8fb42862/xmlnote/OFFICEF514A94F437C4DB9A88C5A69C176BCEA/10115](/images/netty/10115.png)





## 索引管理

调用markReaderIndex()、markWriterIndex()、resetWriterIndex()和resetReaderIndex()来标记和重置ByteBuf 的readerIndex 和writerIndex。

也可以通过调用readerIndex(int)或者writerIndex(int)来将索引移动到指定位置。试图将任何一个索引设置到一个无效的位置都将导致一个IndexOutOfBoundsException。

可以通过调用clear()方法来将readerIndex 和writerIndex 都设置为0。注意，这并不会清除内存中的内容。



### 查找操作

- 在ByteBuf中有多种可以用来确定指定值的索引的方法。最简单的是使用indexOf()方法。

- 较复杂的查找可以通过调用forEachByte()。下面的代码展示了一个查找回车符`（\r）`的例子。

```java
ByteBuf buffer = .. .;

int index = buffer.forEachByte(ByteBufProcessor.FIND_CR);
```



## **派生缓冲区** 

派生缓冲区为ByteBuf 提供了以专门的方式来呈现其内容的视图。这类视图是通过以下方法被创建的：

```java
duplicate();
slice();
slice(int, int);
Unpooled.unmodifiableBuffer(…);
order(ByteOrder);
readSlice(int);
```

每个这些方法都将返回一个新的ByteBuf 实例，它具有自己的读索引、写索引和标记索引。其内部存储和JDK 的ByteBuffer 一样也是共享的。

**ByteBuf** 复制 如果需要一个现有缓冲区的真实副本，请使用copy()或者copy(int, int)方法。不同于派生缓冲区，由这个调用所返回的ByteBuf 拥有独立的数据副本。



## **引用计数** 

引用计数是一种通过在某个对象所持有的资源不再被其他对象引用时释放该对象所持有的资源来优化内存使用和性能的技术。

Netty 在第4 版中为ByteBuf引入了引用计数技术，` interface ReferenceCounted`



## 工具类❤️

**ByteBufUtil** 提供了用于操作ByteBuf 的静态的辅助方法。因为这个API 是通用的，并且和池化无关，所以这些方法已然在分配类的外部实现。

这些静态方法中最有价值的可能就是hexdump()方法，它以十六进制的表示形式打印ByteBuf 的内容。这在各种情况下都很有用，例如，出于调试的目的记录ByteBuf 的内容。十六进制的表示通常会提供一个比字节值的直接表示形式更加有用的日志条目，此外，十六进制的版本还可以很容易地转换回实际的字节表示。

另一个有用的方法是boolean equals(ByteBuf, ByteBuf)，它被用来判断两个ByteBuf实例的相等性。





## 资源释放

当某个ChannelInboundHandler 的实现重写channelRead()方法时，它要负责显式地释放与池化的ByteBuf 实例相关的内存。Netty 为此提供了一个实用方法ReferenceCountUtil.release()

Netty 将使用WARN 级别的日志消息记录未释放的资源，使得可以非常简单地在代码中发现违规的实例。但是以这种方式管理资源可能很繁琐。一个更加简单的方式是使用SimpleChannelInboundHandler，SimpleChannelInboundHandler 会自动释放资源。



> 对于入站请求，Netty的EventLoo在处理Channel的读操作时进行分配ByteBuf，对于这类ByteBuf，需要我们自行进行释放，有三种方式：

- 使用SimpleChannelInboundHandler
- 在重写channelRead()方法使用ReferenceCountUtil.release()
- 在重写channelRead()方法使用使用ctx.fireChannelRead继续向后传递；



> 对于出站请求，不管ByteBuf是否由我们的业务创建的，当调用了write或者writeAndFlush方法后，Netty会自动替我们释放，不需要我们业务代码自行释放





