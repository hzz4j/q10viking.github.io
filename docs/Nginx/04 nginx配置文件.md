---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /nginx/
typora-root-url: ..\.vuepress\public
---



## nginx.conf配置文件

[Progresson On](https://www.processon.com/view/link/62f2a1ad5653bb1344cca1fa)

![image-20220810020213337](/images/nginx/image-20220810020213337.png)



## 全局配置

```sh
# 指的linux中的用户，会涉及到nginx操作目录或文件的一些权限，默认为nobody
# 可以配置成user root  这样worker工作进程就有了root的权限
user  nobody;
worker_processes  2;
```

默认是nobody

```sh
[root@localhost sbin]# ps -ef | grep nginx
root      10003      1  0 Mar12 ?        00:00:00 nginx: master process ./nginx
nobody    10119  10003  0 02:32 ?        00:00:00 nginx: worker process
nobody    10120  10003  0 02:32 ?        00:00:00 nginx: worker process
```
修改配置文件后，我们再看看,配置成了root

```sh
[root@localhost sbin]# ./nginx -s reload  
[root@localhost sbin]# ps -ef | grep nginx
root      10003      1  0 Mar12 ?        00:00:00 nginx: master process ./nginx
root      10124  10003  0 02:32 ?        00:00:00 nginx: worker process
root      10125  10003  0 02:32 ?        00:00:00 nginx: worker process
```



## events模块

::: tip

nginx的事件处理

:::

```sh
events {
    # 默认的多路复用linux epoll
    use	epoll;
    # 每个worker允许客户端最大连接数
    worker_connections  10240;
}
```

## http模块配置

### include 引入外部配置❤️

::: tip

提高可读性，避免单个配置文件过大

:::

```sh
#引入mime类型的配置，mime.types文件与nginx.conf在同一个文件夹下（同路径）
include       mime.types;
```

![image-20220810022820855](/images/nginx/image-20220810022820855.png)
