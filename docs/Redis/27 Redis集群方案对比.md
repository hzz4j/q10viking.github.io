---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---

## 哨兵模式

在redis3.0以前的版本要实现集群一般是借助哨兵sentinel工具来监控master节点的状态，如果master节点异常，则会做主从切换，将某一台slave作为master，哨兵的配置略微复杂，并且性能和高可用性等各方面表现一般，特别是在主从切换的瞬间存在**访问瞬断**的情况，而且**哨兵模式只有一个主节点对外提供服务，没法支持很高的并发**，且**单个主节点内存也不宜设置得过大，否则会导致持久化文件过大**，影响数据恢复或主从同步的效率

![](/images/Redis/806342)



## **高可用集群模式**

redis集群是一个由**多个主从节点群组成的分布式服务器群**，它具有**复制、高可用和分片**特性。**Redis集群不需要sentinel哨兵·也能完成节点移除和故障转移的功能**。需要将每个节点设置成集群模式，这种集群模式没有中心节点，可水平扩展，据官方文档称可以线性扩展到上万个节点(**官方推荐不超过1000个节点**)。redis集群的性能和高可用性均优于之前版本的哨兵模式，且集群配置非常简单 

![](/images/Redis/image-20211114053648501.png)



### redis集群分片算法

::: tip

[Source Code CRC16.java]()

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

