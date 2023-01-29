---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /win11/
typora-root-url: ..\.vuepress\public
---





::: tip

win11下安装了DockerDesktop来通过docker到处centos的版本，从而通过wsl来安装

:::



```sh
docker pull centos:centos7.9.2009

C:\Users\11930>docker images
REPOSITORY   TAG              IMAGE ID       CREATED         SIZE
mysql        8.0.32           cdf3aa69f5f0   33 hours ago    517MB
redis        latest           7614ae9453d1   13 months ago   113MB
centos       centos7.9.2009   eeb6ee3f44bd   16 months ago   204MB

# 创建并启动容器
C:\Users\11930>docker run -d -i -t eeb6ee3f44bd /bin/bash
8ef3409d696fe20bff062ddf082929c4882bf2148f6cfe71f57daa47e5383617
# ===========================到这里就可以到进入容器centos中了========================
C:\Users\11930>docker exec -it 8ef3409d696 bash
```

现在已经启动了centos容器了，接下来到处这个容器

```sh
# 到处容器到当前文件夹中 docker export containerID -o 文件名
E:\wsl\centos7\first>docker export 8ef3409d696fe20bff062ddf082929c4882bf2148f6cfe71f57daa47e5383617 -o centos.tar
```

以上部分就是从docker中导出centos容器，接下使用wsl导入这个centos子系统

```sh
E:\wsl\centos7\first>wsl --import centos7.9.2009 "E:\wsl\centos7\first" "E:\wsl\centos7\first\centos.tar" --version 2
正在导入，这可能需要几分钟时间。
操作成功完成。
```

查看导入成功

```sh
E:\wsl\centos7\first>wsl -l -v
  NAME                   STATE           VERSION
* docker-desktop         Running         2
  docker-desktop-data    Running         2
  centos7.9.2009         Stopped         2
```



进入centos

```
wsl -d centos7.9.2009
```



## 参考

[导入要与 WSL 一起使用的任何 Linux 发行版 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/use-custom-distro)

