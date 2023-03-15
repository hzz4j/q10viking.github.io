---
prev:
  text: Back To 目录
  link: /topicNav/
typora-root-url: ..\.vuepress\public
---

## Nacos介绍

一个更易于构建云原生应用的动态**服务发现（Nacos Discovery）**,**服务配置（Nacos Config）**和**服务管理平台**

- 注册中心
- 配置中心
- 服务管理

Nacos 的关键特性包括:

- 服务注册
- 服务心跳
- 服务同步
- 服务发现
- 服务健康检查



## 项目中引入Nacos的好处

1. **客户端能够感知provider节点是否可用，不可用时应该需要进行服务的剔除**

2. 直接使用RestTemplate调用服务的话，无法进行客户端负载均衡的技术

```java
String url = "http://localhost:8020/order/findOrderByUserId/"+id;
R result = restTemplate.getForObject(url,R.class);
```

![image-20210720142131391](/images/nacos/image-20210720142131391.png)

## 项目架构示例

![image-20210819224140023](/images/nacos/image-20210819224140023.png)

