---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---



## GTID介绍

> GTID(global transaction identifieds)全局事务标识：从MySQL 5.6.5 开始新增了一种基于 GTID 的复制方式。通过 GTID 保证了每个在主库上提交的事务在集群中有一个唯一的ID。这种方式强化了数据库的主备一致性，故障恢复以及容错能力。

[MySQL :: MySQL 5.7 Reference Manual :: 16.1.3.2 GTID Life Cycle](https://dev.mysql.com/doc/refman/5.7/en/replication-gtids-lifecycle.html)

```
GTID = server_uuid:transaction_id
示例：3E11FA47-71CA-11E1-9E33-C80AA9429562:1
```

GTID实际上是由UUID+TID组成的。其中UUID是一个MySQL实例的唯一标识。TID代表了该实例上已经提交的事务数量，并且随着事务提交单调递增。server_uuid 一般是发起事务的uuid, 标识了该事务执行的源节点，存储在数据目录中的auto.cnf文件中，transaction_id 是在该主库上生成的事务序列号，从1开始，1-2代表第二个事务；第1-n代表n个事务。
示例中 `3E11FA47-71CA-11E1-9E33-C80AA9429562` 是这个节点的`server_uuid`，1为这个节点上提交的第1个事务的事务号，如果提交了10个事务，GTID会是这样： `3E11FA47-71CA-11E1-9E33-C80AA9429562:1-10`



> GTID （server_uuid:transaction_id）分成两部分，一部分是服务的UUid,UUID保存在[mysql](https://cloud.tencent.com/product/cdb?from=20065&from_column=20065)数据目录的auto.cnf文件中,UUID是一个MySQL实例的唯一标识。TID代表了该实例上已经提交的事务数量

```sh
[root@k8s-master mysql]# pwd
/var/lib/mysql
[root@k8s-master mysql]# cat auto.cnf
[auto]
server-uuid=5b95b05d-af9b-11ed-8760-000c29a45a0d
```

也可以通过命令查看

```sql
mysql> select @@server_uuid;
+--------------------------------------+
| @@server_uuid                        |
+--------------------------------------+
| 5b95b05d-af9b-11ed-8760-000c29a45a0d |
+--------------------------------------+
```



当在主库上提交事务或者被从库应用时，可以定位和追踪每一个事务，对DBA来说意义就很大了，我们可以适当的解放出来，不用手工去可以找偏移量的值了，而是通过`CHANGE MASTER TO MASTER_HOST='xxx', MASTER_AUTO_POSITION=1`的即可方便的搭建从库，在故障修复中也可以采用`MASTER_AUTO_POSITION=‘X’`的方式



## 为什么有GTID

![image-20230510162910657](/images/MySQL/image-20230510162910657.png)

1. 在主从复制中，尤其是半同步复制中， 由于Master 的dump进程一边要发送binlog给Slave，一边要等待Slave的ACK消息，这个过程是串行的，即前一个事物的ACK没有收到消息，那么后一个事物只能排队候着； 这样将会极大地影响性能；有了GTID后，SLAVE就直接可以通过数据流获得GTID信息，而且可以同步；

2. 另外，主从故障切换中，如果一台MASTER down，需要提取拥有最新日志的SLAVE做MASTER，这个是很好判断，而有了GTID，就只要以GTID为准即可方便判断；而有了GTID后，SLAVE就不需要一直保存这bin-log 的文件名和Position了；只要启用MASTER_AUTO_POSITION即可。

3. 当MASTER crash的时候，GTID有助于保证数据一致性，因为每个事物都对应唯一GTID，如果在恢复的时候某事物被重复提交，SLAVE会直接忽略；

从架构设计的角度，GTID是一种很好的分布式ID实践方式，通常来说，**分布式ID**有两个基本要求：

1）全局唯一性

2）趋势递增

这个ID因为是全局唯一，所以在分布式环境中很容易识别，因为趋势递增，所以ID是具有相应的趋势规律，在必要的时候方便进行顺序提取，行业内适用较多的是基于Twitter的ID生成算法snowflake,所以换一个角度来理解GTID，其实是一种优雅的分布式设计。



## GTID工作原理

1. master更新数据时，会在事务前产生GTID，一同记录到binlog日志中。 
2. slave端的i/o 线程将变更的binlog，写入到本地的relay log中。 
3. sql线程从relay log中获取GTID，然后对比slave端的binlog是否有记录。 
4. 如果有记录，说明该GTID的事务已经执行，slave会忽略。 
5. 如果没有记录，slave就会从relay log中执行该GTID的事务，并记录到binlog。 
6. 在解析过程中会判断是否有主键，如果没有就用二级索引，如果没有就用全部扫描。



## 优点

1. 一个事务对应一个唯一GTID，一个GTID在一个[服务器](https://cloud.tencent.com/product/cvm?from=20065&from_column=20065)上只会执行一次 
2. **GTID是用来代替传统复制的方法，GTID复制与普通复制模式的最大不同就是不需要指定二进制文件名和位置** 
3. 减少手工干预和降低服务故障时间，当主机挂了之后通过软件从众多的备机中提升一台备机为主机



> 搭建主从传统模式:需要指定二进制文件名和位置

```sql
CHANGE MASTER TO
MASTER_HOST='192.168.135.132',       
MASTER_PORT=3306,
MASTER_USER='root',
MASTER_PASSWORD='Root.123456',
MASTER_LOG_FILE='master-bin.000001',
MASTER_LOG_POS=535,
GET_MASTER_PUBLIC_KEY=1;
```

> 使用GTID搭建的主从，不需要指定需要指定二进制文件名和位置

```sql
mysql> change master to 
    -> master_host='192.168.197.128',
    -> master_user='root',
    -> master_password='Root.123456',
    -> master_port=,
    -> master_auto_position=;
```



## 缺点

1. 不支持非事务引擎 

2. 不支持`create table ... select` 语句复制(主库直接报错) 

   原理：（ 会生成两个sql，一个是DDL创建表SQL，一个是insert into 插入数据的sql。 由于DDL会导致自动提交，所以这个sql至少需要两个GTID，但是GTID模式下，只能给这个sql生成一个GTID ） 

3. 不允许一个SQL同时更新一个事务引擎表和非事务引擎表 

4. 开启GTID需要重启（5.7除外） 

5. 对于create temporary table 和 drop temporary table语句不支持 

6. 不支持sql_slave_skip_counter



## 搭建环境测试

```sql
server1   192.168.197.128  3306   Master
server2   192.168.197.137  3306   Slave
server3   192.168.197.136  3306   Slave
```

> 配置参数,开启GTID需要启用这三个参数：

```sql
# /etc/my.cnf
gtid_mode = on 
enforce_gtid_consistency = 1
log_slave_updates   = 1
```

> 主节点: 在主节点上创建复制用户

```sql
mysql> GRANT REPLICATION SLAVE ON *.* TO 'root'@'%' identified by 'Root.123456';
```

> 从节点：搭建主从

```sql
mysql> change master to 
    -> master_host='192.168.197.128',
    -> master_user='root',
    -> master_password='Root.123456',
    -> master_port=,
    -> master_auto_position=;
```

> 搭建成功后，在主节点197.128上查看从节点是否加入：

```sql
mysql> show slave hosts;
+-----------+------+------+-----------+--------------------------------------+
| Server_id | Host | Port | Master_id | Slave_UUID                           |
+-----------+------+------+-----------+--------------------------------------+
|         3 |      | 3306 |          | 969488f5-c486-11e8-adb7-000c29bf2c97 |
|         2 |      | 3306 |          | bb874065-c485-11e8-8b52-000c2934472e |
+-----------+------+------+-----------+--------------------------------------+
 rows in set (. sec)
```

> 查看连接

```sql
mysql> show processlist;
+----+----------+------------------+------+------------------+------+---------------------------------------------------------------+------------------+
| Id | User     | Host             | db   | Command          | Time | State                                                         | Info             |
+----+----------+------------------+------+------------------+------+---------------------------------------------------------------+------------------+
|   | root     | localhost        | NULL | Query            |    0 | starting                                                      | show processlist |
|  3 | repluser | work_NAT_4:60051 | NULL | Binlog Dump GTID |  | Master has sent all binlog to slave; waiting for more updates | NULL             |
|   | repluser | work_NAT_5: | NULL | Binlog Dump GTID | 5970 | Master has sent all binlog to slave; waiting for more updates | NULL             |
+----+----------+------------------+------+------------------+------+---------------------------------------------------------------+------------------+
 rows in set (. sec)
```

> 三台测试环境的UUID分别是

```sql
197.128
mysql> select @@server_uuid;
+--------------------------------------+
| @@server_uuid                        |
+--------------------------------------+
| bd0d-8691-11e8-afd6-4c3e51db5828 |
+--------------------------------------+
 row in set (0.00 sec)

197.137
mysql> select @@server_uuid;
+--------------------------------------+
| @@server_uuid                        |
+--------------------------------------+
| bb874065-c485-11e8-8b52-000c2934472e |
+--------------------------------------+
 row in set (0.00 sec)

197.136
mysql> select @@server_uuid;
+--------------------------------------+
| @@server_uuid                        |
+--------------------------------------+
| f5-c486-11e8-adb7-000c29bf2c97 |
+--------------------------------------+
 row in set (0.00 sec)
```



### 测试复制的故障转移

> 首先将server 3的复制过程停掉

```sql
mysql> stop slave;
Query OK, 0 rows affected (0.01 sec)
```



> 在server 1上创建一些数据

```sql
mysql> create table yyy.a(id int);
Query OK, 0 rows affected (0.03 sec)

mysql> create table yyy.b(id int);
Query OK, 0 rows affected (0.02 sec)

mysql> create table yyy.c(id int);
Query OK, 0 rows affected (0.02 sec)
```

> 在另外两台上面查看数据结果：

```sql
server 
mysql> show tables from yyy;
+---------------+
| Tables_in_yyy |
+---------------+
| a             |
| b             |
| c             |
+---------------+
 rows in set (0.00 sec)

server 
mysql> show tables from yyy;
Empty set (0.00 sec)
```

此时可以发现，server 2 的数据相比较server 3，它的数据比较新，此时停止server 1，模拟主服务器宕机：

```sql
[root@work_NAT_1 init.d]# service mysqld stop
Shutting down MySQL............                            [  OK  ]
```

此时我们发现其他两个节点已经不能访问server 1了

```sql
mysql> show slave status\G
*************************** 1. row ***************************
               Slave_IO_State: Reconnecting after a failed master event read
                  Master_Host: 192.168.197.128
                  Master_User: repluser
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000006
          Read_Master_Log_Pos: 1364
               Relay_Log_File: mysql-relay-bin.000004
                Relay_Log_Pos: 1569
        Relay_Master_Log_File: mysql-bin.000006
             Slave_IO_Running: Connecting
            Slave_SQL_Running: Yes
          Exec_Master_Log_Pos: 1364
              Relay_Log_Space: 2337 
               Master_SSL_Key: 
        Seconds_Behind_Master: NULL
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 2003
                Last_IO_Error: error reconnecting to master 'root@192.168.197.128:3306' - retry-time: 60  retries: 1
               Last_SQL_Errno: 0
```

> ❤️我们需要设置server 2为server 3的主库，因为server 2的数据比较新。此时如果采用以前的办法，需要计算之前主库的log_pos和当前要设置成主库的log_pos，很有可能出错。所以出现了一些高可用性的工具如MHA，MMM等解决问题❤️
>
> 👍👍在MySQL5.6之后，很简单的解决了这个难题。因为同一事务的GTID在所有节点上的值一致，那么根据server3当前停止点的GTID就能定位到server2上的GTID，所以直接在server3上执行change即可

```sql
mysql> change master to 
    -> master_host='192.168.197.137',
    -> master_user='root',
    -> master_password='Root.123456',
    -> master_port=,
    -> master_auto_position=;
Query OK,  rows affected,  warnings (0.01 sec)
```

> 此时查看server 3上的数据，可以发现，数据已经同步过来了;

```sql
mysql> start slave;
Query OK,  rows affected (. sec)

mysql> show tables from yyy;
+---------------+
| Tables_in_yyy |
+---------------+
| a             |
| b             |
| c             |
+---------------+
 rows in set (. sec)
```



### **复制错误跳过**

> 上面的测试中，最终的结果是server 2是主节点，server 3是从节点，下面我们来验证复制错误跳过的办法
>
> 首先我们在从节点上执行一个drop的语句，让两边的数据不一致，如下：

```sql
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| DBAs               |
| customer           |
| inc_db             |
| mysql              |
| performance_schema |
| sys                |
| testdb             |
| yeyz               |
| yyy                |
+--------------------+
 rows in set (. sec)

mysql> drop database yyy;
Query OK,  rows affected (. sec)

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| DBAs               |
| customer           |
| inc_db             |
| mysql              |
| performance_schema |
| sys                |
| testdb             |
| yeyz               |
+--------------------+
 rows in set (. sec)
```

> 然后我们在server 2上执行drop database yyy的操作，如下：

```sql
mysql> drop database yyy;
Query OK, 3 rows affected (0.02 sec)
```

> 此时我们看到server 3上已经出现了主从不同步的错误警告，因为它上面并没有yyy的[数据库](https://cloud.tencent.com/solution/database?from=20065&from_column=20065)(前一步已经删除)，错误情况如下;

```sql
mysql> show slave status\G
*************************** . row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 192.168.197.137
                  Master_User: repluser
                  Master_Port: 
                Connect_Retry: 
              Master_Log_File: mysql-bin.
          Read_Master_Log_Pos: 
               Relay_Log_File: mysql-relay-bin.
                Relay_Log_Pos: 
        Relay_Master_Log_File: mysql-bin.
             Slave_IO_Running: Yes
            Slave_SQL_Running: No
                   Last_Errno: 
                   Last_Error: Error 'Can't drop database 'yyy'; database doesn't exist' on query. Default database: 'yyy'. Query: 'drop database yyy'
                 Skip_Counter: 
          Exec_Master_Log_Pos: 
              Relay_Log_Space: 
               Last_SQL_Error: Error 'Can't drop database 'yyy'; database doesn't exist' on query. Default database: 'yyy'. Query: 'drop database yyy'
  Replicate_Ignore_Server_Ids: 
             Master_Server_Id: 
                  Master_UUID: bb874065-c485-e8-b52-c2934472e
             Master_Info_File: mysql.slave_master_info
           Retrieved_Gtid_Set: bd0d--e8-afd6-c3e51db5828:-,
bb874065-c485-e8-b52-c2934472e:
            Executed_Gtid_Set: db33b36-e51-f-a61d-c99756e90155:-,
bd0d--e8-afd6-c3e51db5828:-,
f5-c486-e8-adb7-c29bf2c97:
                Auto_Position: 
         Replicate_Rewrite_DB: 
                 Channel_Name: 
           Master_TLS_Version: 
 row in set (0.00 sec)
```

> 当我们使用传统的方法来跳过这个错误的时候，会提示出GTID模式下不被允许，如下

```sql
mysql> set global sql_slave_skip_counter=;
ERROR  (HY000): sql_slave_skip_counter can not be set when the server is running with @@GLOBAL.GTID_MODE = ON. Instead, for each transaction that you want to skip, generate an empty transaction with the same GTID as the transaction
```

那么这种方式下应该如何跳过这个错误呢？

因为我们是通过GTID来进行复制的，也需要跳过这个事务从而继续复制，这个事务可以到主上的binlog里面查看：因为不知道找哪个GTID上出错，所以也不知道如何跳过哪个GTID。但是我们可以在show slave status里的信息里找到在执行Master里的POS:2012，现在我们拿着这个pos:2012去server 2的日志里面找，可以发现如下信息：

```sql
# at 2012
#190305 20:59:07 server id 2  end_log_pos 2073  GTID    last_committed=9        sequence_number=10      rbr_only=no
SET @@SESSION.GTID_NEXT= 'bb874065-c485-11e8-8b52-000c2934472e:1'/*!*/;
# at 2073
#190305 20:59:07 server id 2  end_log_pos 2158  Query   thread_id=3     exec_time=0     error_code=0
SET TIMESTAMP=/*!*/;
drop database yyy
/*!*/;
```

> 我们可以看到GTID_NEXT的值是,然后我们通过下面的方法来重新恢复主从复制：

```sql
mysql> stop slave;
Query OK,  rows affected (0.00 sec)

mysql> set session gtid_next='bb874065-c485-11e8-8b52-000c2934472e:1';
Query OK,  rows affected (0.00 sec)

mysql> begin;
Query OK,  rows affected (0.00 sec)

mysql> commit;
Query OK,  rows affected (0.01 sec)

mysql> set session gtid_next=automatic;
Query OK,  rows affected (0.00 sec)

mysql> start slave;
Query OK,  rows affected (0.00 sec)

mysql> show slave status\G
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 192.168.197.137
                  Master_User: repluser
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000002
          Read_Master_Log_Pos: 2158
               Relay_Log_File: mysql-relay-bin.000003
                Relay_Log_Pos: 478
        Relay_Master_Log_File: mysql-bin.000002
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
          Exec_Master_Log_Pos: 2158
              Relay_Log_Space: 1527
              Until_Condition: None
             Master_Server_Id: 2
                  Master_UUID: bb874065-c485-11e8-8b52-000c2934472e
             Master_Info_File: mysql.slave_master_info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Slave has read all relay log; waiting for more updates
           Master_Retry_Count: 
           Retrieved_Gtid_Set: bd0d-8691-11e8-afd6-4c3e51db5828:-7,
bb874065-c485-11e8-8b52-000c2934472e:
            Executed_Gtid_Set: db33b36-0e51-409f-a61d-c99756e90155:-14,
bd0d-8691-11e8-afd6-4c3e51db5828:-7,
f5-c486-11e8-adb7-000c29bf2c97:,
bb874065-c485-11e8-8b52-000c2934472e:
                Auto_Position: 
         Replicate_Rewrite_DB: 
                 Channel_Name: 
           Master_TLS_Version: 
 row in set (0.00 sec)
```

