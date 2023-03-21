---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /win11/
typora-root-url: ..\.vuepress\public
---

## 安装Ubuntu

> 选择Ubuntu 18.04 LTS版本安装。
>
> 用户：q10viking,密码Root.***

```sh
C:\Users\11930>wsl -l -o
以下是可安装的有效分发的列表。
使用 'wsl.exe --install <Distro>' 安装。

NAME                                   FRIENDLY NAME
Ubuntu                                 Ubuntu
Debian                                 Debian GNU/Linux
kali-linux                             Kali Linux Rolling
Ubuntu-18.04                           Ubuntu 18.04 LTS
Ubuntu-20.04                           Ubuntu 20.04 LTS
Ubuntu-22.04                           Ubuntu 22.04 LTS
OracleLinux_8_5                        Oracle Linux 8.5
OracleLinux_7_9                        Oracle Linux 7.9
SUSE-Linux-Enterprise-Server-15-SP4    SUSE Linux Enterprise Server 15 SP4
openSUSE-Leap-15.4                     openSUSE Leap 15.4
openSUSE-Tumbleweed                    openSUSE Tumbleweed

C:\Users\11930>wsl --install -d Ubuntu-18.04
正在安装: Ubuntu 18.04 LTS
[====                       7.0%                           ]
```

### 更新

```sh
sudo apt update && sudo apt upgrade
```



## wsl结合vscode

> windows linux子系统结合vscode使用

可以在linux子系统中直接输入`code .`能够打开windows上安装的vscode

同时也可以在vscode上连接lwindows的子系统linux。需要安装插件[Remote Development - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)

![image-20230322005416840](/images/win11/image-20230322005416840.png)