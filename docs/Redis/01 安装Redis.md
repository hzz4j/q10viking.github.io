---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---



## Redis官网下载

下载：https://redis.io/download

安装介绍：[Redis Quick Start – Redis](https://redis.io/topics/quickstart#installing-redis)

## GCC环境准备

> 安装Redis，根据官网[Redis Quick Start – Redis](https://redis.io/topics/quickstart#installing-redis)，建议是从源码编译，因为它不需要而外的依赖，只需要GCC编译器和libc

在编译redis5.0.3版本的时候，gcc version 4.8.5就可以了

```sh
# 下载gcc 默认下载的是gcc version 4.8.5
yum install gcc
gcc -v
```

但是编译Redis6.2.6 需要升级gcc版本

```sh
yum -y install centos-release-scl
yum -y install devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-binutils
scl enable devtoolset-9 bash

# 查看版本
gcc -v
gcc version 9.3.1 20200408 (Red Hat 9.3.1-2) (GCC)
```

**scl 命令启用只是临时的，新开的会话默认还是原 gcc 版本（我们只使用一次来编译Redis,所以使用临时的就好）** 如果要长期使用 gcc 9.1 的话执行下面的命令即可：

```
echo -e "\nsource /opt/rh/devtoolset-9/enable" >>/etc/profile
```



## Redis安装

```sh
# 设置一个位置
mkdir -p /usr/redis
cd /usr/redis
# 下载redis
wget https://download.redis.io/releases/redis-6.2.6.tar.gz
# 解压
tar xvzf redis-6.2.6.tar.gz
# 进入目录并编译
cd redis-6.2.6
make
```



## 修改配置文件

```sh
# 修改配置
daemonize yes  #redis-server后台启动
protected-mode no  #关闭保护模式，方便其他机器连接;开启的话，只有本机才可以访问redis

# 需要注释掉bind  这样就默认允许来自所有机器连接
#bind 127.0.0.1（bind绑定的是自己机器网卡的ip，如果有多块网卡可以配多个ip，代表允许客户端通过机器的哪些网卡ip去访问，内网一般可以不配置bind，注释掉即可）

#在关闭保护模式的情况下，如果只允许指定的机器访问该redis,
#如 bind 192.168.1.100 10.0.0.1     # listens on two specific IPv4 addresses
```

在关闭了保护保护模式和注释了bind之后，我们就可以在windows上通过客户端工具进行连接了

## 防火墙设置

```sh
# 查询端口是否开放
firewall-cmd --query-port=6379/tcp
#	开放某个端口（这里开放了3306端口）
firewall-cmd --zone=public --add-port=6379/tcp --permanent
# 重新加载防火墙
firewall-cmd --reload
```



## 启动redis-server⭐

> redis-server 指定不同的配置文件，可以在一台机器上启动多个实例

```sh
cd /usr/redis/redis-6.2.6
# 启动服务
src/redis-server redis.conf
```



## 开启redis-cli

```
src/redis-cli
```



## 检查Redis是否启动成功

```sh
[root@localhost redis-6.2.6]# ps -ef | grep redis
root       6984      1  0 15:15 ?        00:00:00 src/redis-server *:6379
root       6990   2124  0 15:15 pts/0    00:00:00 grep --color=auto redis
```



## 结束redis-server

```sh
pkill redis-server
```


