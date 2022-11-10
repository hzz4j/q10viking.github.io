---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



::: tip

在windows上安装Docker Desktop

:::

## Docker Desktop集成的功能

[Docker Desktop | Docker Documentation](https://docs.docker.com/desktop/)

```sh
Docker Engine
Docker CLI client
Docker Buildx
Docker Compose
Docker Content Trust
Kubernetes
Credential Helper
```



## 安装Docker Desktop

> win11系统开启`适用于Linux的Windows子系统`之后，就满足`WSL 2 backend`的环境条件，可以直接安装Docker Desktop

[Install on Windows | Docker Documentation](https://docs.docker.com/desktop/install/windows-install/)

这是我之前在windows安装的ubuntu

![image-20221110202310663](/images/Docker/image-20221110202310663.png)

安装Docker Desktop之后，并且第一次启动,它会创建windows下的子系统。

![image-20221110202822168](/images/Docker/image-20221110202822168.png)

## Docker镜像存储路径更改

::: tip

避免docker的子系统占用C盘的空间，将它转移到另外的位置

:::



### 导出发行版

[WSL 的基本命令 | Microsoft Learn： export-a-distribution-to-a-tar-file](https://learn.microsoft.com/zh-cn/windows/wsl/basic-commands#export-a-distribution-to-a-tar-file)

```sh
# 需要停止运行
PS C:\> wsl -l -v
  NAME                   STATE           VERSION
* Ubuntu                 Stopped         2
  docker-desktop-data    Stopped         2
  docker-desktop         Stopped         2
# 将分发版导出到 tar 文件。
PS C:\> wsl --export docker-desktop-data "E:\wsl\docker\docker-desktop-data.tar"
PS C:\> wsl --export docker-desktop "E:\wsl\docker\docker-desktop.tar"
```

### 注销(卸载)发行版

[WSL 的基本命令 | Microsoft Learn： unregister-or-uninstall-a-linux-distribution](https://learn.microsoft.com/zh-cn/windows/wsl/basic-commands#unregister-or-uninstall-a-linux-distribution)

```sh
PS C:\> wsl --unregister docker-desktop-data
正在注销...
PS C:\> wsl --unregister docker-desktop
正在注销...
PS C:\> wsl -l -v  # 查看已经卸载成功
  NAME      STATE           VERSION
* Ubuntu    Stopped         2
```

### 导入发行版

[WSL 的基本命令 | Microsoft Learn：import-a-new-distribution](https://learn.microsoft.com/zh-cn/windows/wsl/basic-commands#import-a-new-distribution)

```sh
# 发行版名称  安装的位置  导入发行版的文件 使用的wsl版本2
PS C:\> wsl --import docker-desktop "E:\wsl\docker\docker-desktop" "E:\wsl\docker\docker-desktop.tar" --version 2
PS C:\> wsl --import docker-desktop-data "E:\wsl\docker\docker-desktop-data" "E:\wsl\docker\docker-desktop-data.tar" --version 2
```

## 查看docker

```sh
PS C:\Users\11930\Desktop> docker version
Client:
 Cloud integration: v1.0.29
 Version:           20.10.20
 API version:       1.41
 Go version:        go1.18.7
 Git commit:        9fdeb9c
 Built:             Tue Oct 18 18:28:44 2022
 OS/Arch:           windows/amd64
 Context:           default
 Experimental:      true

Server: Docker Desktop 4.13.1 (90346)
 Engine:
  Version:          20.10.20
  API version:      1.41 (minimum version 1.12)
  Go version:       go1.18.7
  Git commit:       03df974
  Built:            Tue Oct 18 18:18:35 2022
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.6.8
  GitCommit:        9cd3357b7fd7218e4aec3eae239db1f68a5a6ec6
 runc:
  Version:          1.1.4
  GitCommit:        v1.1.4-0-g5fd4c4d
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```

