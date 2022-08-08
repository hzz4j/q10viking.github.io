---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---



## AOF**（append-only file）**

**RDB快照功能并不是非常耐久**（durable）： 如果 Redis 因为某些原因而造成故障停机， 那么**服务器将丢失最近写入、且仍未保存到快照中的那些数据**。

从 1.1 版本开始， Redis 增加了一种完全耐久的持久化方式： AOF 持久化，将⭐**修改的每一条指令记录进文件appendonly.aof**⭐中(**先写入os cache，每隔一段时间fsync到磁盘**)

> 比如执行命令**“set zhuge 666”**，aof文件里会记录如下数据

```
*3
$3
set
$5
zhuge
$3
666
```

⭐**这是一种resp协议格式数据，星号后面的数字代表命令有多少个参数，$号后面的数字代表这个参数有几个字符**⭐

注意，如果执行带过期时间的set命令，aof文件里记录的是并不是执行的原始命令，而是记录key过期的**时间戳**

> 比如执行**“set tuling 888 ex 1000”**，对应aof文件里记录如下

```
*3
$3
set
$6
tuling
$3
888
*3
$9
PEXPIREAT
$6
tuling
$13
1604249786301
```



## 配置允许AOF

你可以通过修改配置文件来**打开 AOF 功能**：

```
# appendonly yes
```

从现在开始， 每当 Redis 执行一个改变数据集的命令时（比如 [SET](http://redisdoc.com/string/set.html#set)）， 这个命令就会被追加到 AOF 文件的末尾。这样的话， 当 Redis 重新启动时， 程序就可以通过重新执行 AOF 文件中的命令来达到重建数据集的目的。

你可以配置 **Redis 多久才将数据 fsync 到磁盘一次**

```
appendfsync always：每次有新命令追加到 AOF 文件时就执行一次 fsync ，非常慢，也非常安全。
appendfsync everysec：每秒 fsync 一次，足够快，并且在故障时只会丢失 1 秒钟的数据。
appendfsync no：从不 fsync ，将数据交给操作系统来处理。更快，也更不安全的选择。
```

**推荐（并且也是默认）的措施为每秒 fsync 一次， 这种 fsync 策略可以兼顾速度和安全性。**



## **AOF重写**

AOF文件里可能有太多没用指令，所以AOF会定期根据**内存的最新数据**生成aof文件

> 执行了如下几条命令：

```
127.0.0.1:6379> incr readcount
(integer) 1
127.0.0.1:6379> incr readcount
(integer) 2
127.0.0.1:6379> incr readcount
(integer) 3
127.0.0.1:6379> incr readcount
(integer) 4
127.0.0.1:6379> incr readcount
(integer) 5
```

> 重写后AOF文件里变成

```
*3
$3
SET
$2
readcount
$1
5
```



### 重写频率相关配置

如下两个配置可以控制AOF自动重写频率

```sh
# auto-aof-rewrite-min-size 64mb   //aof文件至少要达到64M才会自动重写，文件太小恢复速度本来就很快，重写的意义不大
# auto-aof-rewrite-percentage 100  //aof文件自上一次重写后文件大小增长了100%则再次触发重写
```



### bgrewriteaof

当然AOF还可以手动重写，进入redis客户端执行命令⭐**bgrewriteaof**⭐重写AOF

注意，**AOF重写redis会fork出一个子进程去做(与bgsave命令类似)，不会对redis正常命令处理有太多影响**



