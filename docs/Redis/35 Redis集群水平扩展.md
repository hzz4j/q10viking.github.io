---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---

## 原来的集群

Redis3.0以后的版本虽然有了集群功能，提供了比之前版本的哨兵模式更高的性能与可用性，但是集群的水平扩展却比较麻烦，今天就来带大家看看redis高可用集群如何做水平扩展，原始集群(见下图)由6个节点组成，6个节点分布在三台机器上，采用三主三从的模式

![](/images/Redis/55284.png)

```sh
# 机器集群分配规划实验
192.168.187.135:8001
192.168.187.135:8004
192.168.187.130:8002
192.168.187.130:8005
192.168.187.132:8003
192.168.187.132:8006
```

![](/images/Redis/image-20211115063108517.png)

从上图可以看出，整个集群运行正常，三个master节点和三个slave节点，8001端口的实例节点存储0-5460这些hash槽，8002端口的实例节点存储5461-10922这些hash槽，8003端口的实例节点存储10923-16383这些hash槽，**这三个master节点存储的所有hash槽组成redis集群的存储槽位**，**slave点是每个主节点的备份从节点，不显示存储槽位**  



## 水平扩容

我们在原始集群基础上再增加一主(8007)一从(8008)，增加节点后的集群参见下图，新增节点用虚线框表示

![](/images/Redis/55313.png)

### 规划

```sh
# 机器集群分配规划实验
192.168.187.130:8007
192.168.187.130:8008
```

### 配置

```sh
# 创建目录
 mkdir -p /usr/redis-cluster/8007 
 mkdir -p /usr/redis-cluster/8008
# 复制
cp /usr/redis/redis-6.2.6/redis.conf /usr/redis-cluster/8007/
cp /usr/redis/redis-6.2.6/redis.conf /usr/redis-cluster/8008/
#============================================================================================
# 分别修改8007和8007，如修改8007如下内容：
（1）daemonize yes
（2）port 8007（分别对每个机器的端口号进行设置）
（3）pidfile /var/run/redis_8007.pid  # 把pid进程号写入pidfile配置的文件
（4）dir /usr/redis-cluster/8007  #（指定数据文件存放位置，必须要指定不同的目录位置，不然会丢失数据）
（5）cluster-enabled yes（启动集群模式）
（6）cluster-config-file nodes-8007.conf（集群节点信息文件，这里800x最好和port对应上）
（7）cluster-node-timeout 10000
 (8) # bind 127.0.0.1（bind绑定的是自己机器网卡的ip，如果有多块网卡可以配多个ip，代表允许客户端通过机器的哪些网卡ip去访问，内网一般可以不配置bind，注释掉即可）
 (9) protected-mode  no   （关闭保护模式）
 (10) appendonly yes
 如果要设置密码需要增加如下配置：
 (11) requirepass Root.123456     (设置redis访问密码)
 (12) masterauth Root.123456      (设置集群节点间访问密码，跟上面一致)

#============================================================================================

```

### 启动redis实例

```sh
# 启动8007和8008俩个服务并查看服务状态
/usr/redis/redis-6.2.6/src/redis-server  /usr/redis-cluster/8007/redis.conf
/usr/redis/redis-6.2.6/src/redis-server  /usr/redis-cluster/8008/redis.conf
ps -el | grep redis
```

![](/images/Redis/image-20211115065640341.png)



### **配置8007为集群主节点**

使用add-node命令新增一个主节点8007(master)，前面的ip:port为新增节点，后面的ip:port为已知存在节点，看到日志最后有`"[OK] New node added correctly"`提示代表新节点加入成功

1. 已存在的节点(`192.168.187.135:8001`)发送meet指令给新的节点（`192.168.187.130:8007`），邀请它加入集群当中

```sh
/usr/redis/redis-6.2.6/src/redis-cli -a Root.123456 --cluster add-node 192.168.187.130:8007 192.168.187.135:8001
```

![](/images/Redis/image-20211115070551497.png)

> 查看此时的集群状态
>
> 注意：**当添加节点成功以后，新增的节点不会有任何数据，因为它还没有分配任何的slot(hash槽)，我们需要为新节点手工分配hash槽**

![](/images/Redis/image-20211115070825856.png)

#### 给8007分配槽位⭐

 使用redis-cli命令为8007分配hash槽，找到集群中的任意一个主节点，对其进行重新分片工作。

```sh
/usr/redis/redis-6.2.6/src/redis-cli -a Root.123456 --cluster reshard 192.168.187.130:8007
```

输出如下：

```sh
How many slots do you want to move (from 1 to 16384)? 600
(ps:需要多少个槽移动到新的节点上，自己设置，比如600个hash槽)
What is the receiving node ID? 2728a594a0498e98e4b83a537e19f9a0a3790f38
(ps:把这600个hash槽移动到哪个节点上去，需要指定节点id,此处为8007节点的id)
Please enter all the source node IDs.
  Type 'all' to use all the nodes as source nodes for the hash slots.
  Type 'done' once you entered all the source nodes IDs.
Source node 1:all
(ps:输入all为从所有主节点(8001,8002,8003)中分别抽取相应的槽数指定到新节点中，抽取的总槽数为600个)
 ... ...
Do you want to proceed with the proposed reshard plan (yes/no)? yes
(ps:输入yes确认开始执行分片任务)
```

![](/images/Redis/image-20211115071510521.png)

> 查看下最新的集群状态

![](/images/Redis/image-20211115071704645.png)

如上图所示，现在我们的8007已经有hash槽了，也就是说可以在8007上进行读写数据啦！到此为止我们的8007已经加入到集群中，并且是主节点(Master)



### **配置8008为8007的从节点**

添加从节点8008到集群中去并查看集群状态

```sh
/usr/redis/redis-6.2.6/src/redis-cli -a Root.123456 --cluster add-node 192.168.187.130:8008 192.168.187.135:8001
```

> 默认加入集群是一个master节点，没有被分配任何的hash槽

![](/images/Redis/image-20211115071929601.png)

我们需要执行replicate命令来指定当前节点(从节点)的主节点id为哪个,首先需要连接新加的8008节点的客户端，然后使用集群命令进行操作，把当前的8008(slave)节点指定到一个主节点下(这里使用之前创建的8007主节点)

```sh
#后面字符串id为8007的节点id
[root@localhost 8007]# /usr/redis/redis-6.2.6/src/redis-cli -a Root.123456 -c -h 192.168.187.130 -p 8008
Warning: Using a password with '-a' or '-u' option on the command line interface may not be safe.
192.168.187.130:8008> cluster replicate efa40357ed54d4e4f0093379d993a28bfd5bf592
OK
192.168.187.130:8008>
```

> 查看集群状态，8008节点已成功添加为8007节点的从节点

![](/images/Redis/image-20211115072525981.png)





## 水平缩容

### **删除8008从节点**

用del-node删除从节点8008，指定删除节点ip和端口，以及节点id(为8008节点id)

```sh
/usr/redis/redis-6.2.6/src/redis-cli -a Root.123456 --cluster del-node 192.168.187.130:8008 4b569f22a04687ba02736334210343f8b859f43d

#=====================输出信息==================================
Warning: Using a password with '-a' or '-u' option on the command line interface may not be safe.
>>> Removing node 4b569f22a04687ba02736334210343f8b859f43d from cluster 192.168.187.130:8008
>>> Sending CLUSTER FORGET messages to the cluster...
>>> Sending CLUSTER RESET SOFT to the deleted node.
```

再次查看集群状态，如下图所示，8008这个slave节点已经移除

![](/images/Redis/image-20211115073015813.png)



### 删除8007主节点⭐

最后，我们尝试删除之前加入的主节点8007，这个步骤相对比较麻烦一些，**因为主节点的里面是有分配了hash槽的，所以我们这里必须先把8007里的hash槽放入到其他的可用主节点中去**，然后再进行移除节点操作，不然会出现数据丢失问题(目前只能把master的数据迁移到一个节点上，暂时做不了平均分配功能)，执行命令如下：

```sh
/usr/redis/redis-6.2.6/src/redis-cli -a Root.123456 --cluster reshard 192.168.187.130:8007
```

>  将8007的hash槽迁移到8001主节点

```sh
How many slots do you want to move (from 1 to 16384)? 600
What is the receiving node ID? 36eed9057c01ea7840ff4c8ee6ca6117ab745d56
(ps:这里是需要把数据移动到哪？8001的主节点id)
Please enter all the source node IDs.
  Type 'all' to use all the nodes as source nodes for the hash slots.
  Type 'done' once you entered all the source nodes IDs.
Source node 1:efa40357ed54d4e4f0093379d993a28bfd5bf592
(ps:这里是需要数据源，也就是我们的8007节点id)
Source node 2:done
(ps:这里直接输入done 开始生成迁移计划)
 ... ...
Do you want to proceed with the proposed reshard plan (yes/no)? Yes
(ps:这里输入yes开始迁移)
```

至此，我们已经成功的把8007主节点的数据迁移到8001上去了，我们可以看一下现在的集群状态如下图，你会发现8007下面已经没有任何hash槽了，证明迁移成功！

![](/images/Redis/image-20211115074414440.png)



> 最后我们直接使用del-node命令删除8007主节点即可

```sh
/usr/redis/redis-6.2.6/src/redis-cli -a Root.123456 --cluster del-node 192.168.187.130:8007 efa40357ed54d4e4f0093379d993a28bfd5bf592
```

> 查看集群状态，一切还原为最初始状态啦！大功告成！

![image-20211115074653629](/images/Redis/image-20211115074653629.png)

## **查看redis集群的命令帮助**

```sh
 /usr/redis/redis-6.2.6/src/redis-cli --cluster help
```

![](/images/Redis/image-20211115070000097.png)

