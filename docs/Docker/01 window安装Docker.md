---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



::: tip

我的电脑是window11

:::



## WSL介绍

::: tip

Windows Subsystem for Linux

[使用 WSL 在 Windows 上安装 Linux](https://learn.microsoft.com/zh-cn/windows/wsl/install)

:::

需要开启`适用于Linux的Windows子系统`，开启之后`wsl`命令生效

![image-20221110190540863](/images/Docker/image-20221110190540863.png)

![image-20221110190637674](/images/Docker/image-20221110190637674.png)



### 实战安装Ubuntu

在win11中集成了wsl命令，可以不用借助VMware,来直接安装Linux操作系统

```sh
PS C:\Users\11930\Desktop> wsl --install
适用于 Linux 的 Windows 子系统已安装。

以下是可安装的有效分发的列表。
请使用“wsl --install -d <分发>”安装。

NAME               FRIENDLY NAME
Ubuntu             Ubuntu
Debian             Debian GNU/Linux
kali-linux         Kali Linux Rolling
SLES-12            SUSE Linux Enterprise Server v12
SLES-15            SUSE Linux Enterprise Server v15
Ubuntu-18.04       Ubuntu 18.04 LTS
Ubuntu-20.04       Ubuntu 20.04 LTS
OracleLinux_8_5    Oracle Linux 8.5
OracleLinux_7_9    Oracle Linux 7.9
PS C:\Users\11930\Desktop> wsl --install -d Ubuntu
正在安装: Ubuntu
[==========================84.0%=================          ]
```

![image-20221110184722355](/images/Docker/image-20221110184722355.png)

```
用户名：q10viking
密码：123456
```

### wsl关闭发行版⭐

```sh
PS C:\> wsl -l -v 	# 查看当前的linux子系统
  NAME      STATE           VERSION
* Ubuntu    Running         2
PS C:\> wsl -t Ubuntu # 关闭
PS C:\> wsl -l -v
  NAME      STATE           VERSION
* Ubuntu    Stopped         2
```

### wsl启动发行版⭐

```sh
wsl #直接启动默认的发行版
```

### 移动ubuntu安装位置到其他盘

::: tip

默认是在C盘

:::

[Move WSL to Another Drive (iany.me)](https://blog.iany.me/2020/06/move-wsl-to-another-drive/)



## 参考

[适用于 Linux 的 Windows 子系统文档 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/)

[Windows11 Docker镜像存储路径更改（非C盘路径）-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/980658)

[Docker 容器简介](https://learn.microsoft.com/zh-cn/training/modules/intro-to-docker-containers/)



## wsl常用命令

[WSL 的基本命令](https://learn.microsoft.com/zh-cn/windows/wsl/basic-commands?source=recommendations)

### 启动或进入指定的发行版

```sh
PS C:\Users\11930\Desktop> wsl -l -v
  NAME                   STATE           VERSION
* Ubuntu                 Stopped         2
  docker-desktop-data    Running         2
  docker-desktop         Running         2
PS C:\Users\11930\Desktop> wsl --distribution docker-desktop
```

### 查看当前发行版状态

```sh
PS C:\> wsl -l -v
  NAME                   STATE           VERSION
* Ubuntu                 Stopped         2
  docker-desktop-data    Stopped         2
  docker-desktop         Stopped         2
```



## Linux发行版

[旧版 WSL 的手动安装步骤 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/install-manual#downloading-distributions)

- [Ubuntu](https://aka.ms/wslubuntu)
- [Ubuntu 22.04 LTS](https://aka.ms/wslubuntu2204)
- [Ubuntu 20.04](https://aka.ms/wslubuntu2004)
- [Ubuntu 20.04 ARM](https://aka.ms/wslubuntu2004arm)
- [Ubuntu 18.04](https://aka.ms/wsl-ubuntu-1804)
- [Ubuntu 18.04 ARM](https://aka.ms/wsl-ubuntu-1804-arm)
- [Ubuntu 16.04](https://aka.ms/wsl-ubuntu-1604)
- [Debian GNU/Linux](https://aka.ms/wsl-debian-gnulinux)
- [Kali Linux](https://aka.ms/wsl-kali-linux-new)
- [SUSE Linux Enterprise Server 12](https://aka.ms/wsl-sles-12)
- [SUSE Linux Enterprise Server 15 SP2](https://aka.ms/wsl-SUSELinuxEnterpriseServer15SP2)
- [SUSE Linux Enterprise Server 15 SP3](https://aka.ms/wsl-SUSELinuxEnterpriseServer15SP3)
- [openSUSE Tumbleweed](https://aka.ms/wsl-opensuse-tumbleweed)
- [openSUSE Leap 15.3](https://aka.ms/wsl-opensuseleap15-3)
- [openSUSE Leap 15.2](https://aka.ms/wsl-opensuseleap15-2)
- [Oracle Linux 8.5](https://aka.ms/wsl-oraclelinux-8-5)
- [Oracle Linux 7.9](https://aka.ms/wsl-oraclelinux-7-9)
- [Fedora Remix for WSL](https://github.com/WhitewaterFoundry/WSLFedoraRemix/releases/)
