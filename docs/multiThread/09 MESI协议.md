---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /multiThread/
---

## **一致性协议（Coherence protocol）**

一致性协议在多处理器系统中应用于高速缓存一致性。为了保持一致性，人们设计了各种模型和协议，如MSI、MESI(又名Illinois)、MOSI、MOESI、MERSI、MESIF、write-once、Synapse、Berkeley、Firefly和Dragon协议

## **MESI协议**

::: tip

**MESI协议**是一个基于写失效的缓存一致性协议，是支持回写（write-back）缓存的最常用协议

:::

缓存行有4种不同的状态:

1. **已修改Modified (M)**: 缓存行是脏的（*dirty*），与主存的值不同。如果别的CPU内核要读主存这块数据，该缓存行必须回写到主存，状态变为共享(S).
2. **独占Exclusive (E)**: 缓存行只在当前缓存中，但是干净的--缓存数据同于主存数据。当别的缓存读取它时，状态变为共享；当前写数据时，变为已修改状态
3. **共享Shared (S)**: 缓存行也存在于其它缓存中且是未修改的。缓存行可以在任意时刻抛弃。
4. **无效Invalid (I)**: 缓存行是无效的

当块标记为 M (已修改), 在其他缓存中的数据副本被标记为I(无效).

![image-20220302142749654](https://gitee.com/q10viking/PictureRepos/raw/master/images//202203021427647.png)

## 伪装共享问题

如果多个核的线程在操作同一个缓存行中的不同变量数据，**那么就会出现频繁的缓存失效**，即使在代码层面看这两个线程操作的数据之间完全没有关系。这种不合理的资源竞争情况就是伪共享（False Sharing）。

