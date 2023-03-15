---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Ribbon/
typora-root-url: ..\.vuepress\public
---

## 饥饿加载

在进行服务调用的时候，如果网络情况不好，第一次调用会超时。

Ribbon默认懒加载，意味着只有在发起调用的时候才会创建客户端。

![img](/images/ribbon/13569.png)

## 配置

```yaml
server:
  port: 8010
spring:
  application:
    name: mall-user
  cloud:
    nacos:
      server-addr: http://192.168.88.1:8848
      discovery:
        cluster-name: BJ

mall-order:
  ribbon:
    NFLoadBalancerRuleClassName: com.alibaba.cloud.nacos.ribbon.NacosRule
ribbon:
  eager-load:
    # 配置mall-user使用ribbon饥饿加载，多个使用逗号分隔
    clients: mall-order
    enabled: true  # 开启ribbon饥饿加载
```

