---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /nginx/
typora-root-url: ..\.vuepress\public
---



::: tip

Nignx进程模型

:::



## nginx.conf配置worker

```sh
#user  nobody;
worker_processes  1;
```



## nginx进程关系

::: tip

master 主进程

worker进程： 工作进程

:::

```sh
[root@localhost sbin]# ps -ef | grep nginx
root       4381      1  0 13:07 ?        00:00:00 nginx: master process ./nginx
nobody     4382   4381  0 13:07 ?        00:00:00 nginx: worker process
```



![](/images/nginx/image-20210313124312653.png)



![](/images/nginx/image-20210313124336249.png)


