---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /nacos/
typora-root-url: ..\.vuepress\public
---

## 内存注册表

Service 就是微服务

```java
Map<namespace,Map<group::serviceName,Service>>
```

namespace起到隔离的作用，如生产环境prod,测试环境dev

group::serviceName 也起到隔离作用 group建议所有的服务都用同一个group (通常用于配置中心),不同组的调用是不能调通的

Service中又有一个map,集群，是互通的（在ribbon负载均衡算法时，尽量使用同一集群的节点）

```java
// Service
Map<String,Cluster>
```

集群下默认有持久实例和临时实例

![image-20210819215828454](/images/nacos/image-20210819215828454.png)



### 内存注册表开发使用

![img](/images/nacos/99347.png)

