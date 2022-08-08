---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---

## Redis主从架构

1. master主节点负责读写数据
2. slave节点负责同步master写入的数据，只能读不能写

![](/images/Redis/80584.png)



## **搭建主从架构**

```sh
1、复制一份redis.conf文件  redis-6380.config
cp redis.config ./config/redis-6380.config
2、将相关配置修改为如下值：
port 6380
pidfile /var/run/redis_6380.pid  # 把pid进程号写入pidfile配置的文件
logfile "6380.log"
dir /usr/redis/redis-6.2.6/data/6380  # 指定数据存放目录
# 需要注释掉bind
# bind 127.0.0.1（bind绑定的是自己机器网卡的ip，如果有多块网卡可以配多个ip，代表允许客户端通过机器的哪些网卡ip去访问，内网一般可以不配置bind，注释掉即可）

3、配置主从复制
replicaof 192.168.187.135 6379  # 从本机6379的redis实例复制数据，Redis 5.0之前使用slaveof
replica-read-only yes  # 配置从节点只读

4、启动从节点
src/redis-server ./config/redis-6380.config

5、连接从节点
src/redis-cli -p 6380

6、测试在6379实例上写数据，6380实例是否能及时同步新修改数据

7、可以自己再配置一个6381的从节点
```

![](/images/Redis/image-20211114094101521.png)

### 启动❤️

```sh
cd /usr/redis/redis-6.2.6
src/redis-server redis.conf   # 启动6379（主）
src/redis-server ./config/redis-6380.config # 启动6380（从）
src/redis-server ./config/redis-6381.config # 启动6381（从）
```

查看是否启动成功

```sh
[root@localhost redis-6.2.6]# ps -ef | grep redis
root       1616      1  0 11:30 ?        00:00:08 src/redis-server *:6379
root       1686      1  1 12:24 ?        00:00:00 src/redis-server *:6380
root       1696      1  2 12:24 ?        00:00:00 src/redis-server *:6381
root       1703   1654  0 12:24 pts/0    00:00:00 grep --color=auto redis
```

进入其中一台redis服务查看信息

```sh
src/redis-cli  -p 6379
> info
```

![image-20220809003502114](/images/Redis/image-20220809003502114.png)



## 缓解主从复制风暴

如果有很多从节点，为了缓解**主从复制风暴**(多个从节点同时复制主节点**导致主节点压力过大**)，可以做如下架构，让部分从节点与从节点(与主节点同步)同步数据

![](/images/Redis/102435.png)

