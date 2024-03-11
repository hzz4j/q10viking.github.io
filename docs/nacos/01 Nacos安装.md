---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /nacos/
typora-root-url: ..\.vuepress\public
---



## 单机版

1. 下载地址：https://github.com/alibaba/Nacos/releases （根据组件版本选择对应的版本）

```sh
# 创建一个目录用于重放nacos
mkdir /usr/nacos
# 将压缩包上传到这个目录
```

```sh
[root@localhost nacos]# pwd
/usr/nacos
[root@localhost nacos]# ll
total 76156
-rw-r--r--. 1 root root 77982774 Oct 29 04:01 nacos-server-1.4.2.tar.gz
```

2. 解压缩

```sh
tar -zxvf nacos-server-1.4.2.tar.gz
```

![image-20211029173135051](/images/nacos/image-20211029173135051.png)

## 启动⭐

进入目录，进行启动

```sh
bin/startup.sh -m standalone
```

访问nocas的管理端：http://192.168.187.135:8848/nacos ，默认的用户名密码是 nacos/nacos

也可以修改默认启动方式

![image-20211029181551906](/images/nacos/image-20211029181551906.png)

### nacos启动成功

```sql
# 查看有没有8848的端口程序启动，如果有代表nacos启动成功了
netstat -nltp 
```

Linux中nacos启动成功了，但是浏览器不能访问则需要开放防火墙端口
![image-20211029181020804](/images/nacos/image-20211029181020804.png)

```
firewall-cmd --zone=public --add-port=8848/tcp --permanent
```

