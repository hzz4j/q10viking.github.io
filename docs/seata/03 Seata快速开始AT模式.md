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

[Releases · seata/seata (github.com)](https://github.com/seata/seata/releases)

![image-20230420183959655](/images/seata/image-20230420183959655.png)

> tar -zxvf seata-server-1.5.2.tar.gz

### **建表(db模式)**

创建数据库seata，执行sql脚本，[https://github.com/seata/seata/tree/v1.5.2/script/server/db](https://github.com/seata/seata/tree/v1.5.2/script/server/db)

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

[nacos (seata.io)](https://seata.io/zh-cn/docs/user/configuration/nacos.html)

注册中心可以说是微服务架构中的”通讯录“，它记录了服务和服务地址的映射关系。在分布式架构中，服务会注册到注册中心，当服务需要调用其它服务时，就到注册中心找到服务的地址，进行调用。比如Seata Client端(TM,RM)，发现Seata Server(TC)集群的地址,彼此通信。

注意：Seata的注册中心是作用于Seata自身的，和Spring  Cloud的注册中心无关

![img](/images/seata/54137.png)

**配置将Seata Server注册到Nacos，修改conf/application.yml文件**

```yml
seata:
  config:
    # support: nacos, consul, apollo, zk, etcd3
    type: nacos
    nacos:
      server-addr: 192.168.135.1:8848
      group : "SEATA_GROUP"
      namespace: c3f112d8-1c5e-419e-9c83-b0b26b987a42
      dataId: seataServer.properties
      username: nacos
      password: nacos
  registry:
    # support: nacos, eureka, redis, zk, consul, etcd3, sofa
    type: nacos
    nacos:
      application: seata-server
      server-addr: 192.168.135.1:8848
      group: SEATA_GROUP
      namespace: c3f112d8-1c5e-419e-9c83-b0b26b987a42
      data-id: seataServer.properties
      cluster: default
      username: nacos
      password: nacos
  store:
    # support: file 、 db 、 redis
    mode: db
```

> 配置成功后nacos的显示效果

![image-20230420200742678](/images/seata/image-20230420200742678.png)

![image-20230420200720491](/images/seata/image-20230420200720491.png)

### **上传配置至Nacos配置中心**

[seata/config.txt at v1.5.2 · seata/seata (github.com)](https://github.com/seata/seata/blob/v1.5.2/script/config-center/config.txt)

获取/seata/script/config-center/config.txt，修改为db存储模式，并修改mysql连接配置

> 使用mysql8
>
> ```sh
> 上传方式在：nacos配置中心自己创建一个配置，然后粘贴上去
> ```
> 
>

![image-20230420195417525](/images/seata/image-20230420195417525.png)

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

**在nacos配置中心中新建配置，dataId为seataServer.properties**，配置内容为上面修改后的config.txt中的配置信息

> 从v1.4.2版本开始，seata已支持从一个Nacos dataId中获取所有配置信息,你只需要额外添加一个dataId配置项。

​    ![0](/images/seata/54003.png)



::: details

```properties
#For details about configuration items, see https://seata.io/zh-cn/docs/user/configurations.html
#Transport configuration, for client and server
transport.type=TCP
transport.server=NIO
transport.heartbeat=true
transport.enableTmClientBatchSendRequest=false
transport.enableRmClientBatchSendRequest=true
transport.enableTcServerBatchSendResponse=false
transport.rpcRmRequestTimeout=30000
transport.rpcTmRequestTimeout=30000
transport.rpcTcRequestTimeout=30000
transport.threadFactory.bossThreadPrefix=NettyBoss
transport.threadFactory.workerThreadPrefix=NettyServerNIOWorker
transport.threadFactory.serverExecutorThreadPrefix=NettyServerBizHandler
transport.threadFactory.shareBossWorker=false
transport.threadFactory.clientSelectorThreadPrefix=NettyClientSelector
transport.threadFactory.clientSelectorThreadSize=1
transport.threadFactory.clientWorkerThreadPrefix=NettyClientWorkerThread
transport.threadFactory.bossThreadSize=1
transport.threadFactory.workerThreadSize=default
transport.shutdown.wait=3
transport.serialization=seata
transport.compressor=none

#Transaction routing rules configuration, only for the client
service.vgroupMapping.default_tx_group=default
#If you use a registry, you can ignore it
service.default.grouplist=127.0.0.1:8091
service.enableDegrade=false
service.disableGlobalTransaction=false

#Transaction rule configuration, only for the client
client.rm.asyncCommitBufferLimit=10000
client.rm.lock.retryInterval=10
client.rm.lock.retryTimes=30
client.rm.lock.retryPolicyBranchRollbackOnConflict=true
client.rm.reportRetryCount=5
client.rm.tableMetaCheckEnable=true
client.rm.tableMetaCheckerInterval=60000
client.rm.sqlParserType=druid
client.rm.reportSuccessEnable=false
client.rm.sagaBranchRegisterEnable=false
client.rm.sagaJsonParser=fastjson
client.rm.tccActionInterceptorOrder=-2147482648
client.tm.commitRetryCount=5
client.tm.rollbackRetryCount=5
client.tm.defaultGlobalTransactionTimeout=60000
client.tm.degradeCheck=false
client.tm.degradeCheckAllowTimes=10
client.tm.degradeCheckPeriod=2000
client.tm.interceptorOrder=-2147482648
client.undo.dataValidation=true
client.undo.logSerialization=jackson
client.undo.onlyCareUpdateColumns=true
server.undo.logSaveDays=7
server.undo.logDeletePeriod=86400000
client.undo.logTable=undo_log
client.undo.compress.enable=true
client.undo.compress.type=zip
client.undo.compress.threshold=64k
#For TCC transaction mode
tcc.fence.logTableName=tcc_fence_log
tcc.fence.cleanPeriod=1h

#Log rule configuration, for client and server
log.exceptionRate=100

#Transaction storage configuration, only for the server. The file, DB, and redis configuration values are optional.
store.mode=db
store.lock.mode=db
store.session.mode=db
#Used for password encryption
store.publicKey=

#If `store.mode,store.lock.mode,store.session.mode` are not equal to `file`, you can remove the configuration block.
store.file.dir=file_store/data
store.file.maxBranchSessionSize=16384
store.file.maxGlobalSessionSize=512
store.file.fileWriteBufferCacheSize=16384
store.file.flushDiskMode=async
store.file.sessionReloadReadSize=100

#These configurations are required if the `store mode` is `db`. If `store.mode,store.lock.mode,store.session.mode` are not equal to `db`, you can remove the configuration block.
store.db.datasource=druid
store.db.dbType=mysql
store.db.driverClassName=com.mysql.cj.jdbc.Driver
store.db.url=jdbc:mysql://192.168.135.130:3306/seata?useUnicode=true&rewriteBatchedStatements=true
store.db.user=root
store.db.password=Root.123456
store.db.minConn=5
store.db.maxConn=30
store.db.globalTable=global_table
store.db.branchTable=branch_table
store.db.distributedLockTable=distributed_lock
store.db.queryLimit=100
store.db.lockTable=lock_table
store.db.maxWait=5000

#These configurations are required if the `store mode` is `redis`. If `store.mode,store.lock.mode,store.session.mode` are not equal to `redis`, you can remove the configuration block.
store.redis.mode=single
store.redis.single.host=127.0.0.1
store.redis.single.port=6379
store.redis.sentinel.masterName=
store.redis.sentinel.sentinelHosts=
store.redis.maxConn=10
store.redis.minConn=1
store.redis.maxTotal=100
store.redis.database=0
store.redis.password=
store.redis.queryLimit=100

#Transaction rule configuration, only for the server
server.recovery.committingRetryPeriod=1000
server.recovery.asynCommittingRetryPeriod=1000
server.recovery.rollbackingRetryPeriod=1000
server.recovery.timeoutRetryPeriod=1000
server.maxCommitRetryTimeout=-1
server.maxRollbackRetryTimeout=-1
server.rollbackRetryTimeoutUnlockEnable=false
server.distributedLockExpireTime=10000
server.xaerNotaRetryTimeout=60000
server.session.branchAsyncQueueSize=5000
server.session.enableBranchAsyncRemove=false
server.enableParallelRequestHandle=false

#Metrics configuration, only for the server
metrics.enabled=false
metrics.registryType=compact
metrics.exporterList=prometheus
metrics.exporterPrometheusPort=9898
```

:::

---------



### 启动

```sh
  # 需要进入bin目录下执行，否则找不到SpringBootApplication等类
  cd /usr/local/seata/bin
  seata-server.sh 
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
# 需要进入bin目录下执行，否则找不到SpringBootApplication等类
cd /usr/local/seata/bin
# 制定ip
./seata-server.sh -h 192.168.135.130 -p 8091
seata-server.sh -p 8091 -h 127.0.0.1 -m db 
```

### 访问界面

[http://192.168.135.130:7091/](http://192.168.135.130:7091/)

![image-20230420164849463](/images/seata/image-20230420164849463.png)



##  **Seata Client快速开始**

[Source Code](https://github.com/Q10Viking/learncode/tree/main/seata/learnSeata/MicroServices)

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

[版本说明 · alibaba/spring-cloud-alibaba Wiki (github.com)](https://github.com/alibaba/spring-cloud-alibaba/wiki/版本说明)

- 父pom指定微服务版本

| Spring Cloud Alibaba Version | Spring Cloud Version     | Spring Boot Version | Seata Version | nacos |
| ---------------------------- | ------------------------ | ------------------- | ------------- | ----- |
| 2.2.9.RELEASE                | Spring Cloud Hoxton.SR12 | 2.3.12.RELEASE      | 1.5.2         | 2.1.0 |

- 启动Seata Server(TC)端，Seata Server使用nacos作为配置中心和注册中心
- 启动nacos服务



### 依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
</dependency>
```

### 微服务对应数据库中添加undo_log表(仅AT模式)

[seata/mysql.sql at 1.5.2 · seata/seata (github.com)](https://github.com/seata/seata/blob/1.5.2/script/client/at/db/mysql.sql)

```sql
-- for AT mode you must to init this sql for you business database. the seata server not need it.
CREATE TABLE IF NOT EXISTS `undo_log`
(
    `branch_id`     BIGINT       NOT NULL COMMENT 'branch transaction id',
    `xid`           VARCHAR(128) NOT NULL COMMENT 'global transaction id',
    `context`       VARCHAR(128) NOT NULL COMMENT 'undo_log context,such as serialization',
    `rollback_info` LONGBLOB     NOT NULL COMMENT 'rollback info',
    `log_status`    INT(11)      NOT NULL COMMENT '0:normal status,1:defense status',
    `log_created`   DATETIME(6)  NOT NULL COMMENT 'create datetime',
    `log_modified`  DATETIME(6)  NOT NULL COMMENT 'modify datetime',
    UNIQUE KEY `ux_undo_log` (`xid`, `branch_id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4 COMMENT ='AT transaction mode undo table';
```

### 微服务application.yml中添加seata配



```yml
seata:
  application-id: ${spring.application.name}
  tx-service-group: default_tx_group
  registry:
    type: nacos
    nacos:
      application: seata-server
      server-addr: 192.168.135.1:8848
      namespace: c3f112d8-1c5e-419e-9c83-b0b26b987a42
      group: SEATA_GROUP
  config:
    type: nacos
    nacos:
      server-addr: 192.168.135.1:8848
      namespace: c3f112d8-1c5e-419e-9c83-b0b26b987a42
      group: SEATA_GROUP
      data-id: seataServer.properties
```



### 在全局事务发起者中添加@GlobalTransactional注

```java
@Override
    //@Transactional
    @GlobalTransactional(name="createOrder")
    public Order saveOrder(OrderVo orderVo) {
        System.out.println(sqlSessionFactory.getConfiguration().getEnvironment().getDataSource());
        log.info("=============用户下单=================");
        log.info("当前 XID: {}", RootContext.getXID());

        // 保存订单
        Order order = new Order();
        order.setUserId(orderVo.getUserId());
        order.setCommodityCode(orderVo.getCommodityCode());
        order.setCount(orderVo.getCount());
        order.setMoney(orderVo.getMoney());
        order.setStatus(OrderStatus.INIT.getValue());

        Integer saveOrderRecord = orderMapper.insert(order);
        log.info("保存订单{}", saveOrderRecord > 0 ? "成功" : "失败");

        //扣减库存
        storageFeignService.deduct(orderVo.getCommodityCode(), orderVo.getCount());

        //扣减余额   服务降级  throw
        Boolean debit= accountFeignService.debit(orderVo.getUserId(), orderVo.getMoney());

//        if(!debit){
//            // 解决 feign整合sentinel降级导致SeaTa失效的处理
//            throw new RuntimeException("账户服务异常降级了");
//        }

        //更新订单
        Integer updateOrderRecord = orderMapper.updateOrderStatus(order.getId(),OrderStatus.SUCCESS.getValue());
        log.info("更新订单id:{} {}", order.getId(), updateOrderRecord > 0 ? "成功" : "失败");

        return order;

    }
```



```java
@Transactional
@Override
public void debit(String userId, int money){
    log.info("=============用户账户扣款=================");
    log.info("当前 XID: {}", RootContext.getXID());

    checkBalance(userId, money);

    log.info("开始扣减用户 {} 余额", userId);
    Integer record = accountMapper.reduceBalance(userId,money);

    if (ERROR_USER_ID.equals(userId)) {
        // 模拟异常
        throw new RuntimeException("account branch exception");
    }
    log.info("扣减用户 {} 余额结果:{}", userId, record > 0 ? "操作成功" : "扣减余额失败");
}
```



### 测试

![image-20230420212526253](/images/seata/image-20230420212526253.png)

## 小结

![image-20230420212644627](/images/seata/image-20230420212644627.png)

> 全局事务ID与分支事务ID



![image-20230420211158758](/images/seata/image-20230420211158758.png)



![image-20230420211241807](/images/seata/image-20230420211241807.png)





## Seata版本

> 1.5.1的版本它依赖的jar包都集成到了seata-server.jar包中，使用mysql8不方便添加lib.没有lib目录
>
> 1.5.2的版本，有lib目录，依赖的包都在lib目录下，并且有mysql8的jar包



![image-20230420182419565](/images/seata/image-20230420182419565.png)



