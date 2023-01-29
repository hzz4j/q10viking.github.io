---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



## 安装MySQL

> 用Docker Desktop来操作非常方便

```sh
# 拉取镜像
docker pull mysql:8.0.32
```

在Docker Desktop中设置镜像启动的环境变量,待会登录的时候用于使用

```
-e MYSQL_ROOT_PASSWORD=Root.123456
```

打开终端

```sql
# 第一次登陆为root用户设置一个密码
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Root.123456';
#添加远程登录用户
CREATE USER 'hzz'@'%' IDENTIFIED WITH mysql_native_password BY 'Root.123456';
GRANT ALL PRIVILEGES ON *.* TO 'hzz'@'%';
```

接下来就可以使用Navicat连接MySQL了

```sh
mysql> status
--------------
mysql  Ver 8.0.32 for Linux on x86_64 (MySQL Community Server - GPL)

Connection id:          14
Current database:
Current user:           root@localhost
SSL:                    Not in use
Current pager:          stdout
Using outfile:          ''
Using delimiter:        ;
Server version:         8.0.32 MySQL Community Server - GPL
Protocol version:       10
Connection:             Localhost via UNIX socket
Server characterset:    utf8mb4
Db     characterset:    utf8mb4
Client characterset:    latin1
Conn.  characterset:    latin1
UNIX socket:            /var/run/mysqld/mysqld.sock
Binary data as:         Hexadecimal
Uptime:                 17 min 18 sec

Threads: 3  Questions: 22  Slow queries: 0  Opens: 168  Flush tables: 3  Open tables: 87  Queries per second avg: 0.021
--------------
```

