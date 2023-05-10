---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---

## 理论

### 数据安全

给主服务增加一个数据备份。基于这个目的，可以搭建主从架构，或者也可以基于主从架构搭建互主的架构。

### 读写分离

对于大部分的JAVA业务系统来说，都是读多写少的，读请求远远高于写请求。这时，当主服务的访问压力过大时，可以将数据读请求转为由从服务来分担，主服务只负责数据写入的请求，这样大大缓解数据库的访问压力。

要理解，**MySQL的主从架构只是实现读写分离的一个基础。实现读写分离还是需要一些中间件来支持，比如ShardingSphere**



### 故障转移-高可用

当MySQL主服务宕机后，可以由一台从服务切换成为主服务，继续提供数据读写功能。对于高可用架构，主从数据的同步也只是实现故障转移的一个前提条件，**要实现MySQL主从切换，还需要依靠一些其他的中间件来实现。比如MMM、MHA、MGR。**



在一般项目中，如果数据库的访问压力没有那么大，那读写分离不一定是必须要做的，但是，主从架构和高可用架构则是必须要搭建的。

## 主从同步原理

MySQL服务的主从架构一般都是通过binlog日志文件来进行的。即在主服务上打开binlog记录每一步的数据库操作，然后从服务上会有一个IO线程，负责跟主服务建立一个TCP连接，请求主服务将binlog传输过来。这时，主库上会有一个IO dump线程，负责通过这个TCP连接把Binlog日志传输给从库的IO线程。接着从服务的IO线程会把读取到的binlog日志数据写入自己的relay日志文件中。然后从服务
上另外一个SQL线程会读取relay日志里的内容，进行操作重演，达到还原数据的目的。我们通常对MySQL做的读写分离配置就必须基于主从架构来搭建。

![image-20211024234212583](/images/MySQL/image-20211024234212583.png)

>  MySQL的binlog不光可以用于主从同步，还可以用于缓存数据同步等场景。
>
>  例如Canal，可以模拟一个slave节点，向MySQL发起binlog同步，然后将数据落地到Redis、Kafka等其他组件，**实现数据实时流转。**

![image-20230510162910657](/images/MySQL/image-20230510162910657.png)

一个事务日志同步的完整过程是这样的：

1. 在备库 B 上通过 change master 命令，设置主库 A 的 IP、端口、用户名、密码，以及要从哪个位置开始请求 binlog，这个位置包含文件名和日志偏移量。
2. 在备库 B 上执行 start slave 命令，这时候备库会启动两个线程，就是图中的 io_thread 和 sql_thread。其中 io_thread 负责与主库建立连接。
3. 主库 A 校验完用户名、密码后，开始按照备库 B 传过来的位置，从本地读取 binlog，发给 B。
4. 备库 B 拿到 binlog 后，写到本地文件，称为中转日志（relay log）。
5. sql_thread 读取中转日志，解析出日志里的命令，并执行。

## 搭建主从

搭建主从集群时，有两个必要的要求：

1. 双方MySQL必须版本一致。至少需要主服务的版本低于从服务
2. 两节点间的时间需要同步。

### 集群规划

```
192.168.187.132  主
192.168.187.135  从
```

### 主节点配置

> 配置说明：主要需要修改的是以下几个属性：
> server-id：服务节点的唯一标识。需要给集群中的每个服务分配一个单独的ID。
> log_bin：打开Binlog日志记录，并指定文件名。
> log_bin-index：Binlog日志文件

```sh
# /etc/my.cnf
server-id=47
#开启binlog
log_bin=master-bin
log_bin-index=master-bin.index
```

```sh
#登录主数据库
mysql -u root -pRoot.123456
GRANT REPLICATION SLAVE ON *.* TO 'root'@'%';
flush privileges;
#查看主节点同步状态：
show master status;
```

![image-20211025014416837](/images/MySQL/image-20211025014416837.png)

### 从节点配置

> 配置说明：主要需要关注的几个属性：
> server-id：服务节点的唯一标识
> relay-log：打开从服务的relay-log日志。
> log-bin：打开从服务的bin-log日志记录。

```sh
# /etc/my.cnf
#主库和从库需要不一致
server-id=48
#打开MySQL中继日志
relay-log-index=slave-relay-bin.index
relay-log=slave-relay-bin

#打开从服务二进制日志
log-bin=mysql-bin
#使得更新的数据写进二进制日志中
log-slave-updates=1
```

```sh
#设置同步主节点：在mysql命令行中输入以下sql语句
CHANGE MASTER TO
MASTER_HOST='192.168.135.132',       
MASTER_PORT=3306,
MASTER_USER='root',
MASTER_PASSWORD='Root.123456',
MASTER_LOG_FILE='master-bin.000001',
MASTER_LOG_POS=535,
GET_MASTER_PUBLIC_KEY=1;


#开启slave
start slave;
#查看主从同步状态
show slave status;
或者用 show slave status \G; 这样查看比较简洁
```

![image-20211025014803641](/images/MySQL/image-20211025014803641.png)

配置完后重新启动mysql

```sh
service mysqld restart
```



## 主从测试

测试时，我们先用`show databases`，查看下两个MySQL服务中的数据库情况

![image-20211025020248891](/images/MySQL/image-20211025020248891.png)

然后我们在主服务器上创建一个数据库

```sql
create database syncdemo;
```

然后我们再用show databases，来看下这个syncdemo的数据库是不是已经同步到了从服务。

![image-20211025020446698](/images/MySQL/image-20211025020446698.png)

接下来我们继续在syncdemo这个数据库中创建一个表，并插入一条数据。

```sql
mysql> use syncdemo;
Database changed
mysql> create table demoTable(id int not null);
Query OK, 0 rows affected (0.02 sec)
mysql> insert into demoTable value(1);
Query OK, 1 row affected (0.01 sec)

```

然后我们也同样到主服务与从服务上都来查一下这个demoTable是否同步到了从服务。

![image-20211025020725019](/images/MySQL/image-20211025020725019.png)

从上面的实验过程看到，我们在主服务中进行的数据操作，就都已经同步到了从服务上。这样，我们一个主从集群就搭建完成了。

> 另外，这个主从架构是有可能失败的，如果在slave从服务上查看slave状态，发现Slave_SQL_Running=no，就表示主从同步失败了。这有可能是因为在从数据库上进行了写操作，与同步过来的SQL操作冲突了，也有可能是slave从服务重启后有事务回滚了。
> 如果是因为slave从服务事务回滚的原因，可以按照以下方式重启主从同步：
>
> ```sh
> mysql> stop slave ;
> mysql> set GLOBAL SQL_SLAVE_SKIP_COUNTER=1;
> mysql> start slave ;
> ```
>
> 而另一种解决方式就是重新记录主节点的binlog文件消息
>
> ```sh
> mysql> stop slave ;
> mysql> change master to .....
> mysql> start slave ;
> ```
>
> 但是这种方式要注意binlog的文件和位置，如果修改后和之前的同步接不上，那就会丢失部分数据。所以不太常用。

---------

停止掉从节点，接着往主节点插入数据，当重新启动从节点后，仍然会同步数据

```sh
service mysqld stop
```



## 全库同步与部分同步

之前提到，我们目前配置的主从同步是针对全库配置的，而实际环境中，一般并不需要针对全库做备份，而只需要对一些特别重要的库或者表来进行同步。那如何、针对库和表做同步配置呢？

首先在Master端：在my.cnf中，可以通过以下这些属性指定需要针对哪些库或者哪些表记录binlog

```sh
#需要同步的二进制数据库名
binlog-do-db=syncdemo
#只保留7天的二进制日志，以防磁盘被日志占满(可选)
expire-logs-days = 7
#不备份的数据库
binlog-ignore-db=information_schema
binlog-ignore-db=performation_schema
binlog-ignore-db=sys
```

```sh
mysql> show master status \G;
*************************** 1. row ***************************
             File: master-bin.000002
         Position: 156
     Binlog_Do_DB: syncdemo
 Binlog_Ignore_DB: information_schema,performation_schema,sys
Executed_Gtid_Set:
1 row in set (0.00 sec)
```

然后在Slave端：在my.cnf中，需要配置备份库与主服务的库的对应关系。

```sh
#如果salve库名称与master库名相同，使用本配置
replicate-do-db=syncdemo
#如果master库名[mastdemo]与salve库名[mastdemo01]不同，使用以下配置[需要做映射]
replicate-rewrite-db=syncdemo -> syncdemo01
#如果不是要全部同步[默认全部同步]，则指定需要同步的表
replicate-wild-do-table=masterdemo01.t_dict
replicate-wild-do-table=masterdemo01.t_num
```

![image-20211025023356777](/images/MySQL/image-20211025023356777.png)

向同步的库syncdemo，继续写入数据，发现是同步的，而新建一个数据库，则发现没有同步过去

![image-20211025023841827](/images/MySQL/image-20211025023841827.png)



## 补充

```sql
# 在mysql从节点中操作
# 停止从节点
stop slave
# 重置从节点
reset slave
```









