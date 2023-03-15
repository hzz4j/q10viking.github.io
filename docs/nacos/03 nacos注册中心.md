---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /nacos/
typora-root-url: ..\.vuepress\public
---

## 注册中心演变

![img](/images/nacos/16490.png)



## 注册中心架构



![img](/images/nacos/16570.png)



## 注册中心的设计

1. 心跳（**服务续约**）：客户端向服务端定时发送心跳，服务端接收到心跳后，修改**服务的续约时间**
   1. 客户端定时发送心跳，如lastRegistryTime: 9:00  15s; 9:15  15s;
   2. 服务端进行服务检查进行服务剔除
      1. currentTime-lastRegistryTime>15s 修改存活状态 down
      2. currentTime-lastRegistryTime>30s delete 考虑到网络抖动，**进行的阈值保护**

![image-20210720142431892](/images/nacos/image-20210720142431892.png)

2. 注册instance
   1. 临时节点存储在内存
   2. 持久化节点
3. 配置数据存储到 derby,mysql

