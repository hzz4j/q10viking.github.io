---
prev:
  text: Back To 目录
  link: /topicNav/
typora-root-url: ..\.vuepress\public
---





## Nginx

1. 主要功能反向代理
2. 通过配置文件可以实现集群和负载均衡
3. 静态资源虚拟化



## 正向代理

::: tip

- 客户端请求目标服务器之间的一个代理服务器
- 请求会先经过代理服务器，然后再转发请求到目标服务器，获得内容后最后响应给客户端

:::

![](/images/nginx/image-20210313111057159.png)

## 反向代理

::: tip

用户请求目标服务器，由代理服务器决定访问哪个IP

:::

![](/images/nginx/image-20210313113900253.png)
