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

## java环境搭建

### SDKMAN安装

[Installation - SDKMAN! the Software Development Kit Manager](https://sdkman.io/install)

```sh
sudo apt install zip
sudo apt install unzip
curl -s "https://get.sdkman.io" | bash
source "/home/q10viking/.sdkman/bin/sdkman-init.sh"
```

```
sdk version
报错：
/home/q10viking/.sdkman/libexec/version: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.28' not found (required by /home/q10viking/.sdkman/libexec/version)
```

经过查阅是ubuntu发行版本低的缘故

```sh
q10viking@LAPTOP-PJLAUUSP:~$ lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 18.04.6 LTS
Release:        18.04
Codename:       bionic
```

进行升级

```sh
sudo apt purge snapd
sudo apt install update-manager-core
sudo apt update
sudo apt list --upgradable
sudo apt upgrade -y
sudo do-release-upgrade
```

```sh
q10viking@LAPTOP-PJLAUUSP:~$ lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 20.04.6 LTS
Release:        20.04
Codename:       focal
```

验证：

```sh
sdk version
SDKMAN!
script: 5.18.0
native: 0.1.3
```

### 安装并配置java环境

[用SDKMAN管理多版本java](https://blog.codeleak.pl/2020/01/manage-multiple-java-sdks-with-sdkman.html)

使用sdkman来管理多版本的java

```sh
sdk list java
```

选择合适的版本，这里我挑选了两个

```
sdk install java 17.0.6-oracle
sdk install java 8.0.302-open
```

sdkman安装的路径在`/home/q10viking/.sdkman/candidates/java`目录下,在这个目录下有一个current软连接，对应设置的jdk。

![image-20230322042320368](/images/win11/image-20230322042320368.png)

> /etc/profile配置

```sh
JAVA_HOME=/home/q10viking/.sdkman/candidates/java/current
CLASSPATH=.:$JAVA_HOME/lib/
PATH=$PATH:$JAVA_HOME/bin
export PATH JAVA_HOME CLASSPATH
```

### 切换Java环境❤️

```sh
q10viking@LAPTOP-PJLAUUSP:~$ sdk default java 17.0.6-oracle

Default java version set to 17.0.6-oracle
q10viking@LAPTOP-PJLAUUSP:~$ java -version
java version "17.0.6" 2023-01-17 LTS
Java(TM) SE Runtime Environment (build 17.0.6+9-LTS-190)
Java HotSpot(TM) 64-Bit Server VM (build 17.0.6+9-LTS-190, mixed mode, sharing)
q10viking@LAPTOP-PJLAUUSP:~$ sdk default java 8.0.302-open

Default java version set to 8.0.302-open
q10viking@LAPTOP-PJLAUUSP:~$ java -version
openjdk version "1.8.0_302"
OpenJDK Runtime Environment (build 1.8.0_302-b08)
OpenJDK 64-Bit Server VM (build 25.302-b08, mixed mode)
```

