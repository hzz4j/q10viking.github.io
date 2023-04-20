---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /JVM/
typora-root-url: ..\.vuepress\public
---

##  1. JVM内存参数设置

<img src="/images/jvm/image-202103260018046911" alt="image-20210326001804691"  />

```shell
java -Xms2048M -Xmx2048M -Xmn1024M -Xss512K -XX:MetaspaceSize=256M -XX:MaxMetaspaceSize=256M -jar microservice-eureka-server.jar
```

### 1.1 堆相关JVM参数

| 参数              | 说明                                                         |
| ----------------- | ------------------------------------------------------------ |
| -Xms              | 初始堆大小，默认物理内存的1/64                               |
| -Xmx              | 最大堆大小，默认物理内存的1/4                                |
| -Xmn              | 新生代大小                                                   |
| -XX:NewRatio      | 默认2表示新生代占年老代的1/2，占整个堆内存的1/3              |
| -XX:NewSize       | 设置新生代初始大小                                           |
| -XX:SurvivorRatio | 默认8表示一个survivor区占用1/8的Eden内存，即1/10的新生代内存 |

### 1.2 栈JVM参数

| 参数 | 说明                       |
| ---- | -------------------------- |
| -Xss | 每个线程的栈大小，默认是1M |

### 1.3 元空间的JVM参数

| 参数                      | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| **-XX：MaxMetaspaceSize** | 设置元空间最大值， 默认是-1， 即不限制， 或者说只受限于本地内存大小 |
| **-XX：MetaspaceSize**    | 指定元空间触发Fullgc的初始阈值(元空间无固定初始大小)， 以字节为单位，默认是21M左右，达到该值就会触发full gc进行类型卸载， 同时收集器会对该值进行调整： 如果释放了大量的空间， 就适当降低该值； 如果释放了很少的空间， 那么在不超过-XX：MaxMetaspaceSize（如果设置了的话） 的情况下， 适当提高该值 |

> 由于调整元空间的大小需要Full GC，这是非常昂贵的操作，如果应用在启动的时候（项目非常大）发生大量Full GC，通常都是由于**永久代**或**（方法区）元空间**发生了大小调整，基于这种情况，一般建议在JVM参数中将MetaspaceSize和MaxMetaspaceSize设置成一样的值，并设置得比初始值要大，对于8G物理内存的机器来说，一般我会将这两个值都设置为256M



### seata的配置❤️

```sh
JAVA_OPT="${JAVA_OPT} -server -Xmx${JVM_XMX:="1024m"} -Xms${JVM_XMS:="1024m"} -Xmn${JVM_XMN:="512m"} -Xss${JVM_XSS:="512k"} -XX:SurvivorRatio=10 -XX:MetaspaceSize=${JVM_MetaspaceSize:="128m"} -XX:MaxMetaspaceSize=${JVM_MaxMetaspaceSize:="256m"} -XX:MaxDirectMemorySize=${JVM_MaxDirectMemorySize:=1024m} -XX:-OmitStackTraceInFastThrow -XX:-UseAdaptiveSizePolicy"
JAVA_OPT="${JAVA_OPT} -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=${BASEDIR}/logs/java_heapdump.hprof -XX:+DisableExplicitGC -XX:+CMSParallelRemarkEnabled -XX:+UseCMSInitiatingOccupancyOnly -XX:CMSInitiatingOccupancyFraction=75"

```





## 2. StackOverflow演示

> -Xss设置越小count值越小，说明一个线程栈里能分配的栈帧就越少，但是对JVM整体来说能开启的线程数会更多

```java
// JVM设置 -Xss128k(默认1M)
public class StackOverflowTest {

    static int count = 0;

    static void redo() {
        count++;
        redo();
    }

    public static void main(String[] args) {
        try {
            redo();
        } catch (Throwable t) {
            t.printStackTrace();
            System.out.println(count);
        }
    }
}
/**
 * 默认情况 在本地机器中 23300左右
 * 设置 -Xss128k后 1084 左右
 */
```



## 疑问

1. 什么是永久代？

   在Java1.7叫永久代，1.8后改为元空间