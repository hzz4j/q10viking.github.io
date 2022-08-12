---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /ElasticStack/
typora-root-url: ..\.vuepress\public
---

## 创建一个用户

::: tip

ES不能使用root用户来启动，必须使用普通用户来安装启动

📗我安装在了132机器上

:::

用户为hzz,密码为123456

```sh
先创建组, 再创建用户:
1）创建 elasticsearch 用户组
[root@localhost ~]# groupadd elasticsearch
		
2）创建用户 hzz 并设置密码
[root@localhost ~]# useradd hzz
[root@localhost ~]# passwd 123456

3）# 创建es文件夹，
并修改owner为hzz用户
mkdir -p /usr/es

4）用户hzz 添加到 elasticsearch 用户组
[root@localhost ~]# usermod -G elasticsearch hzz
 # 赋予用户权限，首先需要将elasticsearch的安装包进行解压， tar -zxvf elasticsearch-7.6.1-linux-x86_64.tar.gz
 # 解压后的文件夹为elasticsearch-7.6.1
[root@localhost ~]# chown -R hzz /usr/es/elasticsearch-7.6.1

5）设置sudo权限
#为了让普通用户有更大的操作权限，我们一般都会给普通用户设置sudo权限，方便普通用户的操作
#三台机器使用root用户执行visudo命令然后为hzz用户添加权限
[root@localhost ~]# visudo

#在root ALL=(ALL) ALL 一行下面
#添加hzz用户 如下:
hzz ALL=(ALL) ALL
			 
#添加成功保存后切换到hzz用户操作

[root@localhost ~]# su hzz
[hzz@haproxy es]$
```

赋予普通用户有更大的操作权限

![image-20210501234608875](/images/elasticsearch/image-20210501234608875.png)

```sh
# 也可以设置为sudo时不是使用密码授权
hzz ALL=(ALL) NOPASSWD:ALL
```

![image-20211112021926518](/images/elasticsearch/image-20211112021926518.png)



##  **修改elasticsearch.yml**

```sh
1) 创建两个目录
mkdir -p /usr/es/elasticsearch-7.6.1/log
mkdir -p /usr/es/elasticsearch-7.6.1/data

# 目录 /usr/es/elasticsearch-7.6.1/config
cd /usr/es/elasticsearch-7.6.1/config
vi elasticsearch.yml
# 将注释去掉，并修改为
cluster.name: my-application
node.name: node-1
path.data: /usr/es/elasticsearch-7.6.1/data
path.logs: /usr/es/elasticsearch-7.6.1/log
network.host: 0.0.0.0	# 任何IP都可以进行访问我们的es服务
http.port: 9200
discovery.seed_hosts: ["服务器IP"] # 此处为本机的IP地址如：discovery.seed_hosts: ["192.168.187.132"]
cluster.initial_master_nodes: ["node-1"] # 节点名称
# 添加一下信息，表示允许跨域
bootstrap.system_call_filter: false
bootstrap.memory_lock: false
http.cors.enabled: true
http.cors.allow-origin: "*"
```



##  **修改jvm.option**

修改jvm.option配置文件，调整jvm堆内存大小

```sh
# /usr/es/elasticsearch-7.6.1/config/jvm.options
# 在本地的虚拟机上设为3G
-Xms1g
-Xmx1g
```



## 启动elasticsearch⭐

```shell
# 不能使用root用户启动
# /usr/es/elasticsearch-7.6.1/bin
./elasticsearch -d

# 或者
nohup /usr/es/elasticsearch-7.6.1/bin/elasticsearch 2>&1 &
```

访问http://192.168.187.132:9200/，出现如下界面表示安装成功

![image-20211112030643587](/../../../../saas-yong/fullstack/Java架构师之路/Elastic Stack/imgs/image-20211112030643587.png)



## 启动发生的错误

![image-20211112025155698](/../../../../saas-yong/fullstack/Java架构师之路/Elastic Stack/imgs/image-20211112025155698.png)

**修复错误后需要重新启动服务器**

```sh
[1]: max file descriptors [4096] for elasticsearch process is too low, increase to at least [65535]
[2]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]

# 第三个暂时没有遇到
[3]: max number of threads [1024] for user [es] likely too low, increase to at least [4096]
```



#### 1.  **普通用户打开文件的最大数限制**

ES因为需要大量的创建索引文件，需要大量的打开系统的文件，所以我们需要解除linux系统当中打开文件最大数目的限制，不然ES启动就会抛错

```sh
[1]: max file descriptors [4096] for elasticsearch process is too low, increase to at least [65535]
```

打开文件`sudo vi /etc/security/limits.conf`，添加

```shell
* soft nofile 65536
* hard nofile 131072
* soft nproc 2048
* hard nproc 4096
```

⭐**此文件修改后需要重新登录用户，才会生效**⭐

---------

#### 2. **普通用户调大虚拟内存**

```scala
最大虚拟内存太小
[2]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
```

**每次启动机器都手动执行下**

```shell
sudo vi /etc/sysctl.conf
# 追加
vm.max_map_count=262144
# 保存后，执行刷新一下文件
sudo sysctl -p
```

#### 3. **普通用户启动线程数限制**

```sh
无法创建本地线程问题,用户最大可创建线程数太小
 max number of threads [1024] for user [es] likely too low, increase to at least [4096]
```

```
Centos6
sudo vi /etc/security/limits.d/90-nproc.conf
Centos7
sudo vi /etc/security/limits.d/20-nproc.conf
```

找到如下内容进行修改

```sh
* soft nproc 1024#修改为
* soft nproc 4096
```

### 重启elasticsearch⭐

```sh
# 找到进程号
ps -ef | grep elastic
# 结束该进程
kill -9 pid
```





## 防火墙设置⭐

```sh
# 查看是否开放端口
[root@localhost ~]# firewall-cmd --query-port=9200/tcp
no

# 需要防火墙开启该端口
[root@localhost ~]# firewall-cmd --zone=public --add-port=9200/tcp --permanent
success

# 重新加载防火墙
[root@localhost ~]# firewall-cmd --reload
success
```





