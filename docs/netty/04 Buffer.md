---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /netty/
typora-root-url: ..\.vuepress\public
---



## 属性

### capacity

作为一个内存块，Buffer有一个固定的大小值，也叫“capacity”.你只能往里写capacity个byte、long，char等类型。一旦Buffer满了，需要将其清空（通过读数据或者清除数据）才能继续写数据往里写数据。

### position

当你写数据到Buffer中时，position表示当前能写的位置。初始的position值为0.当一个byte、long等数据写到Buffer后， position会向前移动到下一个可插入数据的Buffer单元。position最大可为capacity – 1.

当读取数据时，也是从某个特定位置读。当将Buffer从写模式切换到读模式，position会被重置为0. 当从Buffer的position处读取数据时，position向前移动到下一个可读的位置。

### limit

在写模式下，Buffer的limit表示你最多能往Buffer里写多少数据。 写模式下，limit等于Buffer的capacity。

当切换Buffer到读模式时， limit表示你最多能读到多少数据。因此，当切换Buffer到读模式时，limit会被设置成写模式下的position值。换句话说，你能读到之前写入的所有数据（limit被设置成已写数据的数量，这个值在写模式下就是position）



## Buffer的分配

要想获得一个Buffer对象首先要进行分配。 每一个Buffer类都有**allocate**方法(可以在堆上分配，也可以在直接内存上分配)。

- 分配48字节capacity的ByteBuffer的例子:ByteBuffer buf = ByteBuffer.allocate(48);

- 分配一个可存储1024个字符的CharBuffer：CharBuffer buf = CharBuffer.allocate(1024);

- **wrap方法**：把一个byte数组或byte数组的一部分包装成ByteBuffer：

```java
ByteBuffer wrap(byte [] array)

ByteBuffer wrap(byte [] array, int offset, int length) 
```



## 直接内存

HeapByteBuffer与DirectByteBuffer，在原理上，前者可以看出分配的buffer是在heap区域的，其实真正flush到远程的时候会先拷贝到直接内存，再做下一步操作；在NIO的框架下，很多框架会采用DirectByteBuffer来操作，这样分配的内存不再是在java heap上，经过性能测试，可以得到非常快速的网络交互，在大量的网络交互下，一般速度会比HeapByteBuffer要快速好几倍。

直接内存（Direct Memory）并不是虚拟机运行时数据区的一部分，也不是Java虚拟机规范中定义的内存区域，但是这部分内存也被频繁地使用，而且也可能导致OutOfMemoryError 异常出现。 

NIO可以使用Native 函数库直接分配堆外内存，然后通过一个存储在Java 堆里面的DirectByteBuffer 对象作为这块内存的引用进行操作。这样能在一些场景中显著提高性能，因为避免了在Java 堆和Native 堆中来回复制数据

### **直接内存（堆外内存）与堆内存比较**

直接内存申请空间耗费更高的性能，当频繁申请到一定量时尤为明显

直接内存IO读写的性能要优于普通的堆内存，在多次读写操作的情况下差异明显

## 

## Buffer读写

### 写入Buffer

- **读取Channel写到Buffer**

  ```java
  // 从Channel写到Buffer的例子
  int bytesRead = inChannel.read(buf); //read into buffer.
  ```

- **通过Buffer的put()方法写到Buffer里。**

  ```java
  // 从Channel写到Buffer的例子
  int bytesRead = inChannel.read(buf); //read into buffer.
  ```



### flip方法

flip方法将Buffer从写模式切换到读模式。调用flip()方法会将position设回0，并将limit设置成之前position的值。

换句话说，position现在用于标记读的位置，limit表示之前写进了多少个byte、char等 —— 现在能读取多少个byte、char等

### 读取Buffer

- **从Buffer读取数据写入到Channel**

  ```java
  // 从Buffer读取数据到Channel的例子：
  int bytesWritten = inChannel.write(buf);
  ```

- 使用get()方法从Buffer中读取数据的例子

  ```java
  byte aByte = buf.get();
  ```



### **使用Buffer读写数据常见步骤**

1. 写入数据到Buffer
2. 调用flip()方法
3. 从Buffer中读取数据
4. 调用clear()方法或者compact()方法，准备下一次的写入

当向buffer写入数据时，buffer会记录下写了多少数据。一旦要读取数据，需要通过flip()方法将Buffer从写模式切换到读模式。在读模式下，可以读取之前写入到buffer的所有数据。

一旦读完了所有的数据，就需要清空缓冲区，让它可以再次被写入。有两种方式能清空缓冲区：调用clear()或compact()方法。clear()方法会清空整个缓冲区。compact()方法只会清除已经读过的数据



### **rewind()方法**

Buffer.rewind()将position设回0，所以你可以重读Buffer中的所有数据。limit保持不变，仍然表示能从Buffer中读取多少个元素（byte、char等）



### **mark()与reset()方法**

通过调用Buffer.mark()方法，可以标记Buffer中的一个特定position。之后可以通过调用Buffer.reset()方法恢复到这个position。例如：

```java
buffer.mark();//call buffer.get() a couple of times, e.g. during parsing.

buffer.reset(); //set position back to mark.
```

### **equals()与compareTo()方法**

可以使用equals()和compareTo()方法两个Buffer。

#### **equals()**

当满足下列条件时，表示两个Buffer相等：

1. 有相同的类型（byte、char、int等）。
2. Buffer中剩余的byte、char等的个数相等。
3. Buffer中所有剩余的byte、char等都相同。

如你所见，equals只是比较Buffer的一部分，不是每一个在它里面的元素都比较。实际上，它只比较Buffer中的剩余元素。