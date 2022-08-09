---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---

## Redis集群原理

Redis Cluster 将所有数据划分为 16384 个 slots(槽位)，每个节点负责其中一部分槽位。**槽位的信息存储于每个节点中。**

当 Redis Cluster 的客户端来连接集群时，它也会得到一份集群的槽位配置信息并将其缓存在客户端本地。这样当客户端要查找某个 key 时，可以直接定位到目标节点。同时因为槽位的信息可能会存在客户端与服务器不一致的情况，**还需要纠正机制来实现槽位信息的校验调整。**



## **槽位定位算法**

Cluster 默认会对 key 值使用 crc16 算法进行 hash 得到一个整数值，然后用这个整数值对 16384 进行取模来得到具体槽位。

```java
HASH_SLOT = CRC16(key) mod 16384
```

::: tip

[Source Code CRC16.java](https://github.com/Q10Viking/learncode/blob/main/redis/_01_java_redis/src/main/java/org/hzz/CRC16.java)

:::

```java
/**
 * Redis分片算法
 */
public class CRC16 {
    public static void main(String[] args) {
        String key="user:q10viking";
        // 4132
        System.out.println(JedisClusterCRC16.getCRC16(key) % 16384);
    }
}
```



## **跳转重定位**

当客户端向一个错误的节点发出了指令，该节点会发现指令的 key 所在的槽位并不归自己管理，这时它会向客户端发送一个特殊的**跳转指令携带目标操作的节点地址**，告诉客户端去连这个节点去获取数据。客户端收到指令后除了跳转到正确的节点上去操作，**还会同步更新纠正本地的槽位映射表缓存**，后续所有 key 将使用新的槽位映射表。

<img src="/images/Redis/image-20211115052035574.png" alt="image-20211115052035574" style="zoom:80%;" />

