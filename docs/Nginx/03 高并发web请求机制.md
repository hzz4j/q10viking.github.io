---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Nginx/
typora-root-url: ..\.vuepress\public
---



::: tip

Nginx高并发处理请求的原因

1. worker抢占机制
2. 使用多路复用epoll模型

:::

## Work抢占机制

```sh
# nginx.conf配置工作线程为3的情况
worker_processes  3;
```

客户端（如浏览器）发送一个请求过来，那么这3个work就需要抢占这个这个请求(有一个锁)，建立相应的关系。（解析请求，处理，响应）

![image-20220810013354959](/images/nginx/image-20220810013354959.png)

## Nginx事件处理

阻塞模型中，worker工作进程在处理一个客户端请求的时候会发生阻塞，此时其他的客户端请求会就阻塞等待。直到worker处理完这个请求完毕，才接着处理下一个请求

![image-20220810013821503](/images/nginx/image-20220810013821503.png)

::: tip

nginx采用了lepoll模型机制(异步非阻塞)

:::

worker接收了一个请求，尽管还没有处理完成，但是仍然还会接收请求，不会发生阻塞

```sh
# ngnix.conf
events {
    # 默认的多路复用linux epoll
    use	epoll;
    # 每个worker允许客户端最大连接数
    worker_connections  10240;
}
```

