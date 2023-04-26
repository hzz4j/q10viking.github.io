---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /zk/
typora-root-url: ..\.vuepress\public
---



## 命令

可以通过在zkServer.sh设置系统参数`-Dzookeeper.skipACL=yes`进行配置，默认是no,可以配置为true, 则配置过的ACL将不再进行权限检测。

```
getAcl：获取某个节点的acl权限信息
setAcl：设置某个节点的acl权限信息
addauth: 输入认证授权信息，相当于注册用户信息，注册时输入明文密码，zk将以密文的形式存储 
```



## 生成授权ID

代码生成ID:

```sh
@Test
public void generateSuperDigest() throws NoSuchAlgorithmException {
    String sId = DigestAuthenticationProvider.generateDigest("hzz:Root.123456");
    System.out.println(sId);//  gj:X/NSthOB0fD/OT6iilJ55WJVado=
}
```

或者在控制台生成授权ID

```sh
echo -n <user>:<password> | openssl dgst -binary -sha1 | openssl base64
# 如
[root@localhost apache-zookeeper-3.5.8-bin]# echo -n hzz:Root.123456 | openssl dgst -binary -sha1 | openssl base64
UGx4PDnbuDRSn/JjZwR3U/YXmbI=
```



## 设置ACL

> 拿到授权ID来设置ACL

### 创建节点设置acl

**节点创建的同时设置ACL**

```sh
create /zk-node datatest digest:hzz:UGx4PDnbuDRSn/JjZwR3U/YXmbI=:cdrwa
```

添加授权信息后，不能直接访问，直接访问将报如下异常

```sh
[zk: localhost:2181(CONNECTED) 15] get /zk-node
org.apache.zookeeper.KeeperException$NoAuthException: KeeperErrorCode = NoAuth for /zk-node
```

访问前需要添加授权信息

```sh
addauth digest hzz:Root.123456
```

####  auth 明文授权⭐

使用之前需要先`addauth  digest username:password`  注册用户信息，后续可以直接用明文授权，而不用像上面那样先生成那一长字符串

```sh
addauth digest q10viking:Root.123456
create /node-1  auth:q10viking:Root.123456:cdwra
create /node-1 node1data auth:q10viking:Root.123456:cdwra
```



## setacl授权方式

```sh
[zk: localhost:2181(CONNECTED) 4] addauth digest q10viking:Root.123456
[zk: localhost:2181(CONNECTED) 5] setAcl /node-1 auth:q10viking:Root.123456:cdwra
```



## IP授权模式

```sh
setAcl /node-ip ip:192.168.109.128:cdwra
create /node-ip  data  ip:192.168.109.128:cdwra

# 多个指定IP可以通过逗号分隔， 如 
setAcl /node-ip  ip:IP1:rw,ip:IP2:a
```



## Super 超级管理员模式

这是一种特殊的Digest模式， 在Super模式下超级管理员用户可以对Zookeeper上的节点进行任何的操作。

需要在zkServer.sh启动了上通过JVM 系统参数开启：

```sh
-Dzookeeper.DigestAuthenticationProvider.superDigest=super:<base64encoded(SHA1(password))
# 如
-Dzookeeper.DigestAuthenticationProvider.superDigest=hzz:UGx4PDnbuDRSn/JjZwR3U/YXmbI=
```

