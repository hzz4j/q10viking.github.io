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

## git

大多数适用于 Linux 的 Windows 子系统发行版已安装了 Git，只需要我们配置以下基本信息即可

```sh
git config --global user.name "q10viking"
git config --global user.email "1193094618@qq.com"
```

使用https的方式克隆项目，这样简单点。结合vscode git插件就能方便上传代码



## java环境搭建

::: tip

使用SDKMAN管理多版本的spring-cli，java,maven

:::

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

### maven搭建

```sh
sdk install maven
```

下载在如下位置

```sh
q10viking@LAPTOP-PJLAUUSP:~/.sdkman/candidates/maven$ pwd
/home/q10viking/.sdkman/candidates/maven
q10viking@LAPTOP-PJLAUUSP:~/.sdkman/candidates/maven$ ls -l
total 4
drwxr-xr-x 6 q10viking q10viking 4096 Mar 15 09:39 3.9.1
lrwxrwxrwx 1 q10viking q10viking    5 Mar 22 12:15 current -> 3.9.1
```

> 配置/etc/profile

```sh
JAVA_HOME=/home/q10viking/.sdkman/candidates/java/current
CLASSPATH=.:$JAVA_HOME/lib/
MAVEN_HOME=/home/q10viking/.sdkman/candidates/maven/current
PATH=$JAVA_HOME/bin:$MAVEN_HOME/bin:$PATH
export PATH JAVA_HOME CLASSPATH MAVEN_HOME
```

> maven配置仓库和阿里镜像

```xml
<localRepository>/home/q10viking/.sdkman/candidates/maven/repository</localRepository>
```



### spring-cli安装

安装了两个版本

```sh
sdk install springboot 2.6.5
sdk install springboot 3.0.4
```

安装完成后可以看到自己就注册到path当中，不需要我们自己再配置

![image-20230322163944976](/images/win11/image-20230322163944976.png)

#### 切换spring-cli版本❤️

```sh
sdk default springboot 3.0.4
sdk default springboot 2.6.5
```

验证

```sh
q10viking@LAPTOP-PJLAUUSP:~$ spring --version
Spring CLI v3.0.4
```

### 创建springboot项目

::: tip

使用springboot cli

:::

[Spring Boot CLI官网](https://docs.spring.io/spring-boot/docs/current/reference/html/cli.html#cli)

常用命令：

```sh
# 罗列出可用的依赖
spring init --list
# 创建一个项目
spring init --build=maven --group-id=org.hzz --java-version=17 --dependencies=web --name=helloworld helloworld
#命令帮助
spring --help init
```

### vscode设置

> maven指定使用maven的配置文件

![image-20230322174652234](/images/win11/image-20230322174652234.png)

最关键的也要设置这个插件的settings.xml
![image-20230322193723493](/images/win11/image-20230322193723493.png)



## vsode常用开发

|    快捷键    | 描述                                             |
| :----------: | ------------------------------------------------ |
|   ctrl+k z   | 切换禅模式                                       |
|    ctrl+p    | 搜索文件❤️，前面加#能够搜索jar的源文件            |
| ctrl+shift+p | 命令                                             |
|    ctrl+b    | 配合禅模式使用，切换左边侧边栏                   |
|    ctrl+j    | 配合禅模式使用，切换底部栏                       |
|  ctrl+alt+b  | 配合禅模式使用，切换右边的自定侧边栏             |
| ctrl+shift+⬇️ | 快速复制当前行                                   |
| ctrl+shift+k | 快速删除当前行                                   |
|  ctrl+enter  | 定位到下一个空行。Github copilot则是提示它的建议 |
| alt+左右箭头 | 历史记录文件浏览                                 |



### ctrl+p很强大

![image-20230322212616449](/images/win11/image-20230322212616449.png)





## vscode配置java开发

[redhat-developer/vscode-java: Java Language Support for Visual Studio Code (github.com)](https://github.com/redhat-developer/vscode-java)

[Getting Started with Java in Visual Studio Code](https://code.visualstudio.com/docs/java/java-tutorial)
