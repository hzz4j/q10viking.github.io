---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /rabbitmq/
typora-root-url: ..\.vuepress\public
---



## 安装⭐

::: tip

[Messaging that just works — RabbitMQ](https://www.rabbitmq.com/)

在`192.168.187.135`机器上，准备安装的版本：

1. RabbitMQ 3.8.15    
2. Erlang版本选择23.x系列

:::

```sh
#=====================官网有两种安装方式，这里采用第二种，通过下载rpm包进行安装====================================
# 下载对应的erlang包
wget --content-disposition https://packagecloud.io/rabbitmq/erlang/packages/el/7/erlang-23.3.4-1.el7.x86_64.rpm/download.rpm
# 下载对应的rabbitmq包
wget --content-disposition https://packagecloud.io/rabbitmq/rabbitmq-server/packages/el/7/rabbitmq-server-3.8.15-1.el7.noarch.rpm/download.rpm


#======================================安装===================================================================

# 安装erlang
yum install erlang-23.3.4-1.el7.x86_64.rpm

## install these dependencies from standard OS repositories
yum install socat logrotate -y

# This example assumes the CentOS 8 version of the package, suitable for
# Red Hat 8, CentOS 8 and modern Fedora releases.
# el8对应centos el7对应centos7
# For Red Hat 7 or CentOS 7, replace "el8" with "el7".  
# yum install rabbitmq-server-3.9.8-1.el8.noarch.rpm
yum install rabbitmq-server-3.8.15-1.el7.noarch.rpm
```



## 查看对应的版本

[RabbitMQ Erlang Version Requirements — RabbitMQ](https://www.rabbitmq.com/which-erlang.html)

准备安装的版本：

1. RabbitMQ 3.8.15    
2. Erlang版本选择23.x系列

![image-20211030190803667](/images/RabbitMQ/image-20211030190803667.png)



## 下载rpm包

从官网推荐的地方下载[rabbitmq - Repositories · packagecloud](https://packagecloud.io/rabbitmq/)

最终下载的到的包

```sh
erlang-23.3.4-1.el7.x86_64.rpm
rabbitmq-server-3.8.15-1.el7.noarch.rpm
```

### 下载Erlang的rpm包

erlang-23.3.4-1.el7.x86_64.rpm

[el/7/erlang-23.3.4-1.el7.x86_64.rpm - rabbitmq/erlang · packagecloud](https://packagecloud.io/rabbitmq/erlang/packages/el/7/erlang-23.3.4-1.el7.x86_64.rpm)

![image-20211030192358422](/images/RabbitMQ/image-20211030192358422.png)

```sh
wget --content-disposition https://packagecloud.io/rabbitmq/erlang/packages/el/7/erlang-23.3.4-1.el7.x86_64.rpm/download.rpm
```

![image-20211030192523717](/images/RabbitMQ/image-20211030192523717.png)

### 下载RabbitMq的rpm包

[Releases · rabbitmq/rabbitmq-server (github.com)](https://github.com/rabbitmq/rabbitmq-server/releases?page=3) 下载之后再传递到linux上

![image-20211030193122808](/images/RabbitMQ/image-20211030193122808.png)

也可以在

[el/7/rabbitmq-server-3.8.15-1.el7.noarch.rpm - rabbitmq/rabbitmq-server · packagecloud](https://packagecloud.io/rabbitmq/rabbitmq-server/packages/el/7/rabbitmq-server-3.8.15-1.el7.noarch.rpm) 下载

![image-20211030194126041](/images/RabbitMQ/image-20211030194126041.png)

```sh
wget --content-disposition https://packagecloud.io/rabbitmq/rabbitmq-server/packages/el/7/rabbitmq-server-3.8.15-1.el7.noarch.rpm/download.rpm
```

![image-20211030193925715](/images/RabbitMQ/image-20211030193925715.png)





## 安装具体说明❤️

[Installing on RPM-based Linux (RedHat Enterprise Linux, CentOS, Fedora, openSUSE) — RabbitMQ](https://www.rabbitmq.com/install-rpm.html)

RabbitMQ所依赖的环境

![image-20211030194420144](/images/RabbitMQ/image-20211030194420144.png)

系统中已经下载好了所需要的包
![image-20211030194624692](/images/RabbitMQ/image-20211030194624692.png)

### 安装erlang

```sh
[root@localhost rabbitmq]# yum install erlang-23.3.4-1.el7.x86_64.rpm
Loaded plugins: fastestmirror
Examining erlang-23.3.4-1.el7.x86_64.rpm: erlang-23.3.4-1.el7.x86_64
Marking erlang-23.3.4-1.el7.x86_64.rpm to be installed
Resolving Dependencies
--> Running transaction check
---> Package erlang.x86_64 0:23.3.4-1.el7 will be installed
--> Finished Dependency Resolution

Dependencies Resolved

============================================================================================================================================================
 Package                       Arch                          Version                               Repository                                          Size
============================================================================================================================================================
Installing:
 erlang                        x86_64                        23.3.4-1.el7                          /erlang-23.3.4-1.el7.x86_64                         34 M

Transaction Summary
============================================================================================================================================================
Install  1 Package

Total size: 34 M
Installed size: 34 M
Is this ok [y/d/N]: y
Downloading packages:
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Installing : erlang-23.3.4-1.el7.x86_64                                                                                                               1/1
  Verifying  : erlang-23.3.4-1.el7.x86_64                                                                                                               1/1

Installed:
  erlang.x86_64 0:23.3.4-1.el7

Complete!
```

查看版本

```sh
[root@localhost rabbitmq]# yum list | grep erlang
erlang.x86_64                               23.3.4-1.el7               @/erlang-23.3.4-1.el7.x86_64
```

符合23.x

--------

### 安装socat  logrotate

这需要联网安装这两个

```sh
[root@localhost rabbitmq]# yum install socat logrotate -y
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
 * base: mirrors.bupt.edu.cn
 * extras: mirrors.163.com
 * updates: mirrors.bupt.edu.cn
Package logrotate-3.8.6-19.el7.x86_64 already installed and latest version
Resolving Dependencies
--> Running transaction check
---> Package socat.x86_64 0:1.7.3.2-2.el7 will be installed
--> Finished Dependency Resolution

Dependencies Resolved

============================================================================================================================================================
 Package                            Arch                                Version                                     Repository                         Size
============================================================================================================================================================
Installing:
 socat                              x86_64                              1.7.3.2-2.el7                               base                              290 k

Transaction Summary
============================================================================================================================================================
Install  1 Package

Total download size: 290 k
Installed size: 1.1 M
Downloading packages:
socat-1.7.3.2-2.el7.x86_64.rpm                                                                                                       | 290 kB  00:00:00
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Installing : socat-1.7.3.2-2.el7.x86_64                                                                                                               1/1
  Verifying  : socat-1.7.3.2-2.el7.x86_64                                                                                                               1/1

Installed:
  socat.x86_64 0:1.7.3.2-2.el7

Complete!
```

---------

### 安装RabbitMQ Server

```sh
[root@localhost rabbitmq]# yum install rabbitmq-server-3.8.15-1.el7.noarch.rpm
Loaded plugins: fastestmirror
Examining rabbitmq-server-3.8.15-1.el7.noarch.rpm: rabbitmq-server-3.8.15-1.el7.noarch
Marking rabbitmq-server-3.8.15-1.el7.noarch.rpm to be installed
Resolving Dependencies
--> Running transaction check
---> Package rabbitmq-server.noarch 0:3.8.15-1.el7 will be installed
--> Finished Dependency Resolution

Dependencies Resolved

============================================================================================================================================================
 Package                            Arch                      Version                         Repository                                               Size
============================================================================================================================================================
Installing:
 rabbitmq-server                    noarch                    3.8.15-1.el7                    /rabbitmq-server-3.8.15-1.el7.noarch                     16 M

Transaction Summary
============================================================================================================================================================
Install  1 Package

Total size: 16 M
Installed size: 16 M
Is this ok [y/d/N]: y
Downloading packages:
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Installing : rabbitmq-server-3.8.15-1.el7.noarch                                                                                                      1/1
  Verifying  : rabbitmq-server-3.8.15-1.el7.noarch                                                                                                      1/1

Installed:
  rabbitmq-server.noarch 0:3.8.15-1.el7

Complete!
```

--------



## 开启管理界面及配置

```sql
rabbitmq-plugins enable rabbitmq_management
```

http://learning.hzz.org:15672/

防火墙开放端口 15672 和 代码5672   firewall-cmd --zone=public --add-port=5672/tcp --permanent

```sh
[root@localhost ~]# firewall-cmd --query-port=15672/tcp
no
[root@localhost ~]# firewall-cmd --zone=public --add-port=15672/tcp --permanent
success
[root@localhost ~]# firewall-cmd --zone=public --add-port=5672/tcp --permanent
success
[root@localhost ~]# firewall-cmd --reload
success
```

### 设置guest用户登录⭐

默认guest用户只能通过localhost登录，**User can only log in via localhost**


1. 以前的版本是可以直接找到的，现在得去手动复制一下，[github.com](https://github.com/rabbitmq/rabbitmq-server/blob/v3.8.x/deps/rabbit/docs/rabbitmq.conf.example)，这个连接样例配置文件
2. 复制里面的配置内容到本地，重命名为`rabbitmq.conf`
3. 放到/etc/rabbitmq/ 目录下

\# 比如修改密码、配置等等，例如：允许guest用户远程访问

```sh
## The default "guest" user is only permitted to access the server
## via a loopback interface (e.g. localhost).
## {loopback_users, [<<"guest">>]},
##
# loopback_users.guest = true

## Uncomment the following line if you want to allow access to the
## guest user from anywhere on the network.
loopback_users.guest = false     
```

### 创建用户

**其自带了guest/guest的 用户名和密码；如果需要创建自定义用户；那么也可以登录管理界面后，如下操作**⭐

![image-20211030220423146](/images/RabbitMQ/image-20211030220423146.png)

#### 角色说明

1.  超级管理员(administrator)： 可登陆管理控制台，可查看所有的信息，并且可以对用户，策略(policy)进行操 作。
2.  监控者(monitoring):  可登陆管理控制台，同时可以查看rabbitmq节点的相关信息(进程数，内存使用 情况，磁盘使用情况等)
3.  策略制定者(policymaker): 可登陆管理控制台, 同时可以对policy进行管理。但无法查看节点的相关信息
4.  普通管理者(management): 仅可登陆管理控制台，无法看到节点信息，也无法对策略进行管理。
5.  其他: 无法登陆管理控制台，通常就是普通的生产者和消费者。

## RabbitMQ启动与关闭❤️

```sh
service rabbitmq-server start
service rabbitmq-server restart
service rabbitmq-server stop
```

![image-20220814064717674](/images/RabbitMQ/image-20220814064717674.png)

### 用户名与密码❤️

```sh
192.168.187.135:15672
hzz root.123456
或者
guest guest
```

