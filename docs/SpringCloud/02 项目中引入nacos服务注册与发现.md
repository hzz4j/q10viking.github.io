---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /SpringCloud/
typora-root-url: ..\.vuepress\public
---

[Source Code](https://github.com/Q10Viking/springcloudalibaba/tree/main/02-learn-spring-cloud-alibaba)

## 介绍

项目中要想引入nacos,有两个步骤

1. 要部署nacos服务
2. 项目中引入nacos的客户端，以便于注册中心nacos通信

## 部署nacos

部署nacos看nacos注册中心章节，本文主要讲解项目中如何引入nacos客户端

为了开发学习，主要是在windows部署了一个单机版的nacos注册中心

## 项目中引入nacos客户端

### 服务注册

以mall-user子项目为例子

#### 引入依赖

```xml
<!--   引入nacos-服务发现与注册     -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

#### 配置application.yml文件

1. 指定服务的名称
2. 指定注册中心

```yml
spring:
  application:
    name: mall-user
  cloud:
    nacos:
      server-addr: http://192.168.88.1:8848
```

启动mall-user服务，可以看到日志

```
2021-08-21 20:42:20.410  INFO 40792 --- [           main] c.a.c.n.registry.NacosServiceRegistry    : nacos registry, DEFAULT_GROUP mall-user 192.168.88.1:8010 register finished
```

并且在nacos注册中心，能够看到mall-user已经注册进去了 http://192.168.88.1:8848/nacos

![image-20210821204436731](D:\Github\saas-yong\fullstack\Java架构师之路\SpringCloud\微服务实战系列\imgs\image-20210821204436731.png)

