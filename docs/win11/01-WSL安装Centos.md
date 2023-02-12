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



## wsl安装centos



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



## 进入centos❤️

```
wsl -d centos7.9.2009
```



## 停止

```sh
wsl --terminate centos7.9.2009
```



## 配置工作

### DNS配置

1. ping www.baidu.com域名不通，但是ping 183.232.231.174 IP地址是通的。



[WSL2 网络异常排查 ping 不通、网络地址异常、缺少默认路由、被宿主机防火墙拦截 ](https://www.jianshu.com/p/ba2cf239ebe0)

创建/etc/wsl.conf文件

```sh
[network]
generateResolvConf = false
```

删除/etc/resolv.conf文件（这是一个软连接）

```sh
[root@hzz etc]# rm resolv.conf
rm: remove symbolic link ‘resolv.conf’? y
[root@hzz etc]# touch resolv.conf
[root@hzz etc]# vi resolv.conf
```



```
nameserver 114.114.114.114
nameserver 223.5.5.5
nameserver 8.8.8.8
nameserver 8.8.4.4
```

测试：成功

```sh
[root@hzz etc]# ping www.baidu.com
PING www.baidu.com (183.232.231.174) 56(84) bytes of data.
64 bytes from 183.232.231.174 (183.232.231.174): icmp_seq=1 ttl=54 time=26.2 ms
64 bytes from 183.232.231.174 (183.232.231.174): icmp_seq=2 ttl=54 time=25.3 ms
64 bytes from 183.232.231.174 (183.232.231.174): icmp_seq=3 ttl=54 time=26.1 ms
64 bytes from 183.232.231.174 (183.232.231.174): icmp_seq=4 ttl=54 time=25.9 ms
^C
--- www.baidu.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 7075ms
rtt min/avg/max/mdev = 25.385/25.941/26.288/0.356 ms
```

### 安装网络工具

```sh
# 更新
yum update -y
# 安装工具
yum -y install net-tools
```

 172.18.110.175

## 参考

[导入要与 WSL 一起使用的任何 Linux 发行版 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/use-custom-distro)

[使用 WSL 访问网络应用程序 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/networking)
