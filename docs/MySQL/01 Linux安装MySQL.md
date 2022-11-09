---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---

## 安装wget

```sh
 yum install wget
```

## 安装mysql

### 官网找到mysql下载

[how to install mysql on centos7](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-centos-7)

```sh
# mysql下载地址
https://dev.mysql.com/downloads/
```

**选择yum下载方式**

![image-20211024202517488](/images/MySQL/image-20211024202517488.png)

![image-20211024202732730](/images/MySQL/image-20211024202732730.png)

![](/images/MySQL/image-20211024202824155.png)



```sh
# wget https://dev.mysql.com/get/mysql80-community-release-el8-1.noarch.rpm   这是linux7
wget https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
```

### 校验一下md5

![image-20211024194644485](/images/MySQL/image-20211024194644485.png)

```sh
md5sum mysql80-community-release-el8-1.noarch.rpm
```

## 安装这个package的repos

安装这个repos到system

```sh
rpm -ivh mysql80-community-release-el7-3.noarch.rpm
```

---------

```sh
# You can check that the MySQL Yum repository has been successfully added by the following command 
yum repolist enabled | grep "mysql.*-community.*"

[root@localhost mysql]# yum repolist enabled | grep "mysql.*-community.*"
mysql-connectors-community/x86_64       MySQL Connectors Community           154
mysql-tools-community/x86_64            MySQL Tools Community                 75
mysql80-community/x86_64                MySQL 8.0 Community Server           189
```



```sh
[root@localhost ~]# rpm -qa | grep mysql   #查看安装的
mysql80-community-release-el7-3.noarch
[root@localhost ~]# yum remove mysql80-community-release-el7-3.noarch    # 卸载，这样系统就没有这个mysql相关的repos了
```



### 安装mysql

```sh
yum install mysql-server
```



## 安装遇到的问题

![image-20211024203937760](/images/MySQL/image-20211024203937760.png)

### 解决方案

1. 清楚rpm install 的repos

   ```sh
   [root@localhost ~]# rpm -qa | grep mysql   #查看安装的
   mysql80-community-release-el8-1.noarch
   [root@localhost ~]# yum remove mysql80-community-release-el8-1.noarch    # 卸载，这样系统就没有这个mysql相关的repos了
   ```

2. 采用 rpm bundle tar的方式[MySQL :: MySQL 8.0 Reference Manual :: 2.5.4 Installing MySQL on Linux Using RPM Packages from Oracle](https://dev.mysql.com/doc/refman/8.0/en/linux-installation-rpm.html)

![image-20211024214349373](/images/MySQL/image-20211024214349373.png)

###    下载rpm bundle tar并安装mysql

1. 查看linux版本

   ```sh
   [root@localhost mysql]# rpm -q centos-release
   centos-release-7-9.2009.1.el7.centos.x86_64
   ```

2. 选择对应的版本下载[MySQL :: Download MySQL Community Server](https://dev.mysql.com/downloads/mysql/)![image-20211024215205460](/images/MySQL/image-20211024215205460.png)

3. 卸载之前安装rpm方式repos

   ```sh
   [root@localhost ~]# rpm -qa | grep mysql   #查看安装的
   mysql80-community-release-el7-3.noarch
   [root@localhost ~]# yum remove mysql80-community-release-el7-3.noarch    # 卸载，这样系统就没有这个mysql相关的repos了
   ```

4. 解压刚刚下载的文件

   ```sh
   [root@localhost mysql]# ll
   total 817748
   -rw-r--r--. 1 root root 837345280 Oct 24 09:46 mysql-8.0.27-1.el7.x86_64.rpm-bundle.tar
   -rw-r--r--. 1 root root     26024 Apr 24  2019 mysql80-community-release-el7-3.noarch.rpm  # 之前的文件
   [root@localhost mysql]# tar -xvf mysql-8.0.27-1.el7.x86_64.rpm-bundle.tar
   ```

   ```sh
   [root@localhost mysql]# ll   # 解压后的文件
   total 1635440
   -rw-r--r--. 1 root root  837345280 Oct 24 09:46 mysql-8.0.27-1.el7.x86_64.rpm-bundle.tar
   -rw-r--r--. 1 7155 31415  55178328 Sep 29 03:33 mysql-community-client-8.0.27-1.el7.x86_64.rpm
   -rw-r--r--. 1 7155 31415   5932800 Sep 29 03:34 mysql-community-client-plugins-8.0.27-1.el7.x86_64.rpm
   -rw-r--r--. 1 7155 31415    641616 Sep 29 03:34 mysql-community-common-8.0.27-1.el7.x86_64.rpm
   -rw-r--r--. 1 7155 31415   7760100 Sep 29 03:34 mysql-community-devel-8.0.27-1.el7.x86_64.rpm
   -rw-r--r--. 1 7155 31415  23637616 Sep 29 03:34 mysql-community-embedded-compat-8.0.27-1.el7.x86_64.rpm
   -rw-r--r--. 1 7155 31415   4935900 Sep 29 03:34 mysql-community-libs-8.0.27-1.el7.x86_64.rpm
   -rw-r--r--. 1 7155 31415   1264256 Sep 29 03:34 mysql-community-libs-compat-8.0.27-1.el7.x86_64.rpm
   -rw-r--r--. 1 7155 31415 470252428 Sep 29 03:36 mysql-community-server-8.0.27-1.el7.x86_64.rpm
   -rw-r--r--. 1 7155 31415 267724484 Sep 29 03:38 mysql-community-test-8.0.27-1.el7.x86_64.rpm
   ```

5. 按照官网安装[MySQL :: MySQL 8.0 Reference Manual :: 2.5.4 Installing MySQL on Linux Using RPM Packages from Oracle](https://dev.mysql.com/doc/refman/8.0/en/linux-installation-rpm.html)

   ```sh
   yum install mysql-community-{server,client,common,libs}-*
   ```

   ![image-20211024221557813](/images/MySQL/image-20211024221557813.png)

6. 提示安装成功

   ![image-20211024221749241](/images/MySQL/image-20211024221749241.png)

### 启动mysql❤️

```sh
[root@localhost mysql]# systemctl start mysqld
[root@localhost mysql]# systemctl status mysqld    # 查看mysql启动状态
● mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: active (running) since Sun 2021-10-24 10:20:54 EDT; 8s ago
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
  Process: 52900 ExecStartPre=/usr/bin/mysqld_pre_systemd (code=exited, status=0/SUCCESS)
 Main PID: 52976 (mysqld)
   Status: "Server is operational"
    Tasks: 38
   Memory: 534.1M
   CGroup: /system.slice/mysqld.service
           └─52976 /usr/sbin/mysqld

Oct 24 10:20:44 localhost.localdomain systemd[1]: Starting MySQL Server...
Oct 24 10:20:54 localhost.localdomain systemd[1]: Started MySQL Server.
```



### 获取临时密码登录

During the installation process, a temporary password is generated for the MySQL root user. Locate it in the `mysqld.log` with this command:

```sh
[root@localhost mysql]# grep 'temporary password' /var/log/mysqld.log
2021-10-24T14:20:50.709554Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: 1y7wESrOlh.Z
```

1. 使用临时密码登录，并设置新的密码

   ```sh
   [root@localhost ~]# mysql_secure_installation
   
   Securing the MySQL server deployment.
   
   Enter password for user root:   # 使用临时密码
   
   The existing password for the user account root has expired. Please set a new password.
   
   New password:Root.123456
   ```



### 登录

```sh
[root@localhost ~]# mysql -u root -pRoot.123456
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 18
Server version: 8.0.27 MySQL Community Server - GPL

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```



### 开放root用户为远程登录

1. 设置root用户允许远程登录

   ```
   use mysql;
   
   select host,user from user;
   
   update user set host='%' where user ='root';
   
   # 刷新权限
   flush privileges;
   ```

2. 开放防火墙端口

   ```sh
   [root@localhost ~]# firewall-cmd --query-port=3306/tcp    # 查看防火墙是否开启3306端口
   no
   [root@localhost ~]# firewall-cmd --zone=public --add-port=3306/tcp --permanent   # 开启端口
   success
   [root@localhost ~]# firewall-cmd --reload   # 重新加载防火墙
   success
   [root@localhost ~]# firewall-cmd --query-port=3306/tcp  # 再次查看
   yes
   ```

   

### Navicat连接

密码： Root.123456

![image-20211024224313061](/images/MySQL/image-20211024224313061.png)



