---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /FileSystem/
typora-root-url: ..\.vuepress\public
---



## Basic Usage

Using a `Buffer` to read and write data typically follows this little 4-step process

1. Write data into the Buffer
2. Call `buffer.flip()`
3. Read data out of the Buffer
4. Call `buffer.clear()` or `buffer.compact()`

> When you write data into a buffer, the buffer keeps track of how much data you have written. Once you need to read the data, you need to switch the buffer from writing mode into reading mode using the `flip()` method call. In reading mode the buffer lets you read all the data written into the buffer. 
>
> --- from [Java NIO Buffer (jenkov.com)](https://jenkov.com/tutorials/java-nio/buffers.html)

```java
public class ReadAndWriteByteChannel {
    public static void main(String[] args) throws IOException {
        Path readPath = Paths.get("tmp\\chapter04\\small.txt");
        Path writePath = Paths.get("tmp\\chapter04\\small-channel.txt");

        try(SeekableByteChannel inChannel = Files.newByteChannel(readPath);
            SeekableByteChannel outChannel = Files.newByteChannel(writePath, StandardOpenOption.CREATE,StandardOpenOption.WRITE)){
            final int BUFFER_CAPACITY = 10;
            ByteBuffer byteBuffer = ByteBuffer.allocate(BUFFER_CAPACITY);
            // 1. write data into Buffer
            while(inChannel.read(byteBuffer) > 0){
                // 2. Call flip
                byteBuffer.flip();
                // 3. Read data out of Buffer
                outChannel.write(byteBuffer);
                // 4. Call buffer.clear() or buffer.compact()
                byteBuffer.clear();
            }
        }
    }
}
```

## Capacity, Position and Limit

position和limit代表的意思，取决于是读模式还是写模式

![image-20221009215315193](/images/filesystem/image-20221009215315193.png)

### Position

When you write data into the `Buffer`, you do so at a certain position. Initially the position is 0. When a byte, long etc. has been written into the `Buffer` the position is advanced to point to the next cell in the buffer to insert data into. Position can maximally become `capacity - 1`. 写到哪，算哪

When you read data from a `Buffer` you also do so from a given position. When you flip a `Buffer` from writing mode to reading mode, the position is reset back to 0. As you read data from the `Buffer` you do so from `position`, and `position` is advanced to next position to read. 也就是，读的时候，通过flip将position置为0。



### Limit

In write mode the limit of a `Buffer` is the limit of how much data you can write into the buffer. In write mode the limit is equal to the capacity of the `Buffer`.

When flipping the `Buffer` into read mode, limit means the limit of how much data you can read from the data. Therefore, when flipping a `Buffer` into read mode, limit is set to write position of the write mode. In other words, you can read as many bytes as were written (limit is set to the number of bytes written, which is marked by position). 在读模式的时候，通过flip，可以将limit设置到写的模式时的位置。



----------



## wrapper

> wrapper method is used to wraps a byte array into a buffer

重下面的例子来看，wrapper并没有改变position的位置。和初始化时的一样，都是最开始的写模式。只不过默认填充了数据而已。

```java
public class ByteBufferWrapper {
    public static void main(String[] args) {
        ByteBuffer defaultBuffer = ByteBuffer.allocate(11);
        printPositionAndLimit(defaultBuffer);  // position = 0; limit = 11

        ByteBuffer buffer = ByteBuffer.wrap("Hello World".getBytes(StandardCharsets.UTF_8));
        // wrap byte array
        printPositionAndLimit(buffer);  // position = 0; limit = 11
        buffer.position(3);  // 手动改变position
        printPositionAndLimit(buffer);  // position = 3; limit = 11
        // array并没有改变position,和position没有关系，只是复制值。
        System.out.println(Arrays.toString(buffer.array()));
        printPositionAndLimit(buffer);  // position = 0; limit = 11

    }

    public static void printPositionAndLimit(ByteBuffer buffer){
        System.out.format("position = %s; limit = %s%n",buffer.position(),buffer.limit());
    }
}
/**
 * position = 0; limit = 11
 * position = 0; limit = 11
 * position = 3; limit = 11
 * [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]
 * position = 3; limit = 11
 */
```



## rewind

```java
public class ByteBufferRewind {
    public static void main(String[] args) {
        ByteBuffer byteBuffer = ByteBuffer.allocate(4);

        byteBuffer.put((byte)20);
        byteBuffer.put((byte)'a');
        printPositionAndLimit(byteBuffer);
        byteBuffer.rewind(); // 将position重置为了0,但是limit没有变化，还是为写模式时的capcacity
        printPositionAndLimit(byteBuffer);

        int i = 0;
        while(byteBuffer.hasRemaining()){
            byteBuffer.get();
            i++;
        }
        System.out.format("执行了 %d 次 %n",i);
    }

    public static void printPositionAndLimit(ByteBuffer buffer){
        System.out.format("position = %s; limit = %s%n",buffer.position(),buffer.limit());
    }
}
/**
 * position = 2; limit = 4
 * position = 0; limit = 4
 * 执行了 4 次
 */
```



## flip

::: tip

与rewind的相同的地方：都会重置position

不同的地方在于：flip会重置limit到position,而rewind则不会。

:::

```java
public class ByteBufferFlip {
    public static void main(String[] args) {
        ByteBuffer byteBuffer = ByteBuffer.allocate(4);

        byteBuffer.put((byte)20);
        byteBuffer.put((byte)'a');
        printPositionAndLimit(byteBuffer);
        byteBuffer.flip(); // 将position重置为了0,limit重置到position的位置
        printPositionAndLimit(byteBuffer);

        int i = 0;
        while(byteBuffer.hasRemaining()){
            byteBuffer.get();
            i++;
        }
        System.out.format("执行了 %d 次 %n",i);
    }

    public static void printPositionAndLimit(ByteBuffer buffer){
        System.out.format("position = %s; limit = %s%n",buffer.position(),buffer.limit());
    }
}
/**
 * position = 2; limit = 4
 * position = 0; limit = 2
 * 执行了 2 次 
 */
```

