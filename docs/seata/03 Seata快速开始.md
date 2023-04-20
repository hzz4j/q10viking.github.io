---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /seata/
typora-root-url: ..\.vuepress\public
---



::: tip

Seata分TC、TM和RM三个角色，TC（Server端）为单独服务端部署，TM和RM（Client端）由业务系统集成

:::



## **Seata Server（TC）环境搭建**

**Server端存储模式（store.mode）支持三种：**

- file：单机模式，全局事务会话信息内存中读写并持久化本地文件root.data，性能较高
- db：高可用模式，全局事务会话信息通过db共享，相应性能差些
- redis：1.3及以上版本支持,性能较高,存在事务信息丢失风险,请提前配置适合当前场景的redis持久化配置



> **db存储模式+Nacos(注册&配置中心)方式部署**



### 下载seata server

[下载安装包](https://github.com/seata/seata/releases)

![image-20230420105837580](/images/seata/image-20230420105837580.png)

> tar -zxvf seata-server-1.5.1.tar.gz

### **建表(db模式)**

创建数据库seata，执行sql脚本，[https://github.com/seata/seata/tree/v1.5.1/script/server/db](https://github.com/seata/seata/tree/v1.5.1/script/server/db)

![image-20230420110315652](/images/seata/image-20230420110315652.png)

::: details

```sql
-- -------------------------------- The script used when storeMode is 'db' --------------------------------
-- the table to store GlobalSession data
CREATE TABLE IF NOT EXISTS `global_table`
(
    `xid`                       VARCHAR(128) NOT NULL,
    `transaction_id`            BIGINT,
    `status`                    TINYINT      NOT NULL,
    `application_id`            VARCHAR(32),
    `transaction_service_group` VARCHAR(32),
    `transaction_name`          VARCHAR(128),
    `timeout`                   INT,
    `begin_time`                BIGINT,
    `application_data`          VARCHAR(2000),
    `gmt_create`                DATETIME,
    `gmt_modified`              DATETIME,
    PRIMARY KEY (`xid`),
    KEY `idx_status_gmt_modified` (`status` , `gmt_modified`),
    KEY `idx_transaction_id` (`transaction_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- the table to store BranchSession data
CREATE TABLE IF NOT EXISTS `branch_table`
(
    `branch_id`         BIGINT       NOT NULL,
    `xid`               VARCHAR(128) NOT NULL,
    `transaction_id`    BIGINT,
    `resource_group_id` VARCHAR(32),
    `resource_id`       VARCHAR(256),
    `branch_type`       VARCHAR(8),
    `status`            TINYINT,
    `client_id`         VARCHAR(64),
    `application_data`  VARCHAR(2000),
    `gmt_create`        DATETIME(6),
    `gmt_modified`      DATETIME(6),
    PRIMARY KEY (`branch_id`),
    KEY `idx_xid` (`xid`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- the table to store lock data
CREATE TABLE IF NOT EXISTS `lock_table`
(
    `row_key`        VARCHAR(128) NOT NULL,
    `xid`            VARCHAR(128),
    `transaction_id` BIGINT,
    `branch_id`      BIGINT       NOT NULL,
    `resource_id`    VARCHAR(256),
    `table_name`     VARCHAR(32),
    `pk`             VARCHAR(36),
    `status`         TINYINT      NOT NULL DEFAULT '0' COMMENT '0:locked ,1:rollbacking',
    `gmt_create`     DATETIME,
    `gmt_modified`   DATETIME,
    PRIMARY KEY (`row_key`),
    KEY `idx_status` (`status`),
    KEY `idx_branch_id` (`branch_id`),
    KEY `idx_xid_and_branch_id` (`xid` , `branch_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `distributed_lock`
(
    `lock_key`       CHAR(20) NOT NULL,
    `lock_value`     VARCHAR(20) NOT NULL,
    `expire`         BIGINT,
    primary key (`lock_key`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('AsyncCommitting', ' ', 0);
INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('RetryCommitting', ' ', 0);
INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('RetryRollbacking', ' ', 0);
INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('TxTimeoutCheck', ' ', 0);
```

:::

![image-20230420110540320](/images/seata/image-20230420110540320.png)

### seata配置nacos

注册中心可以说是微服务架构中的”通讯录“，它记录了服务和服务地址的映射关系。在分布式架构中，服务会注册到注册中心，当服务需要调用其它服务时，就到注册中心找到服务的地址，进行调用。比如Seata Client端(TM,RM)，发现Seata Server(TC)集群的地址,彼此通信。

注意：Seata的注册中心是作用于Seata自身的，和Spring  Cloud的注册中心无关

![img](/images/seata/54137.png)

**配置将Seata Server注册到Nacos，修改conf/application.yml文件**

![image-20230420124043389](/images/seata/image-20230420124043389.png)

```yml
 registry:
    # support: nacos, eureka, redis, zk, consul, etcd3, sofa
    type: nacos
    nacos:
      application: seata-server
      server-addr: 192.168.135.1:8848
      group: SEATA_GROUP
      namespace: 7e1cb2ef-3967-4fe6-b1e0-d889a01d08a8
      data-id: seataServer.properties
      cluster: default
      username:
      password:
```

> 配置成功后nacos的显示效果

![image-20230420124118968](/images/seata/image-20230420124118968.png)

![image-20230420124316544](/images/seata/image-20230420124316544.png)

### **上传配置至Nacos配置中心**

[https://github.com/seata/seata/tree/v1.5.1/script/config-center](https://github.com/seata/seata/tree/v1.5.1/script/config-center)

获取/seata/script/config-center/config.txt，修改为db存储模式，并修改mysql连接配置

![image-20230420124631007](/images/seata/image-20230420124631007.png)

在store.mode=db，由于seata是通过jdbc的executeBatch来批量插入全局锁的，根据MySQL官网的说明，连接参数中的rewriteBatchedStatements为true时，在执行executeBatch，并且操作类型为insert时，jdbc驱动会把对应的SQL优化成`insert into () values (), ()`的形式来提升批量插入的性能。 根据实际的测试，该参数设置为true后，对应的批量插入性能为原来的10倍多，因此在数据源为MySQL时，建议把该参数设置为true。



----------

配置事务分组， 要与client配置的事务分组一致

- 事务分组：seata的资源逻辑，可以按微服务的需要，在应用程序（客户端）对自行定义事务分组，每组取一个名字。
- 集群：seata-server服务端一个或多个节点组成的集群cluster。 应用程序（客户端）使用时需要指定事务逻辑分组与Seata服务端集群的映射关系。

​    ![0](/images/seata/53977.png)

事务分组如何找到后端Seata集群（TC）？

1. 首先应用程序（客户端）中配置了事务分组（GlobalTransactionScanner 构造方法的txServiceGroup参数）。若应用程序是SpringBoot则通过seata.tx-service-group 配置。
2. 应用程序（客户端）会通过用户配置的配置中心去寻找service.vgroupMapping .[事务分组配置项]，取得配置项的值就是TC集群的名称。若应用程序是SpringBoot则通过seata.service.vgroup-mapping.事务分组名=集群名称 配置
3. 拿到集群名称程序通过一定的前后缀+集群名称去构造服务名，各配置中心的服务名实现不同（前提是Seata-Server已经完成服务注册，且Seata-Server向注册中心报告cluster名与应用程序（客户端）配置的集群名称一致）
4. 拿到服务名去相应的注册中心去拉取相应服务名的服务列表，获得后端真实的TC服务列表（即Seata-Server集群节点列表）

----------

在nacos配置中心中新建配置，dataId为seataServer.properties，配置内容为上面修改后的config.txt中的配置信息

从v1.4.2版本开始，seata已支持从一个Nacos dataId中获取所有配置信息,你只需要额外添加一个dataId配置项。

​    ![0](/images/seata/54003.png)



---------



### 启动

```sh
    bin/seata-server.sh 
```



### 支持的启动参数

| 参数 | 全写         | 作用                       | 备注                                                         |
| ---- | ------------ | -------------------------- | ------------------------------------------------------------ |
| -h   | --host       | 指定在注册中心注册的 IP    | 不指定时获取当前的 IP，外部访问部署在云环境和容器中的 server 建议指定 |
| -p   | --port       | 指定 server 启动的端口     | 默认为 8091                                                  |
| -m   | --storeMode  | 事务日志存储方式           | 支持file,db,redis，默认为 file 注:redis需seata-server 1.3版本及以上 |
| -n   | --serverNode | 用于指定seata-server节点ID | 如 1,2,3..., 默认为 1                                        |
| -e   | --seataEnv   | 指定 seata-server 运行环境 | 如 dev, test 等, 服务启动时会使用 registry-dev.conf 这样的配置 |

比如：

```sh
    bin/seata-server.sh -p 8091 -h 127.0.0.1 -m db              
```





##  **Seata Client快速开始**

::: tip

**Spring Cloud Alibaba整合Seata AT模式实战**

:::

**业务场景**

用户下单，整个业务逻辑由三个微服务构成：

- 库存服务：对给定的商品扣除库存数量。
- 订单服务：根据采购需求创建订单。
- 帐户服务：从用户帐户中扣除余额。



![https://note.youdao.com/yws/public/resource/c480b9d259db401acff9fdd30a770d64/xmlnote/174DF4D5850D46D4A11920DF78129626/54076](/images/seata/54076.png)



### **环境准备**

- 父pom指定微服务版本

| Spring Cloud Alibaba Version | Spring Cloud Version     | Spring Boot Version | Seata Version |
| ---------------------------- | ------------------------ | ------------------- | ------------- |
| 2.2.8.RELEASE                | Spring Cloud Hoxton.SR12 | 2.3.12.RELEASE      | 1.5.1         |

- 启动Seata Server(TC)端，Seata Server使用nacos作为配置中心和注册中心
- 启动nacos服务





