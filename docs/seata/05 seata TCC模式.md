---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /seata/
typora-root-url: ..\.vuepress\public
---



## TCC

TCC 基于分布式事务中的二阶段提交协议实现，它的全称为 Try-Confirm-Cancel，即资源预留（Try）、确认操作（Confirm）、取消操作（Cancel），他们的具体含义如下：

1. Try：对业务资源的检查并预留；
2. Confirm：对业务处理进行提交，即 commit 操作，只要 Try 成功，那么该步骤一定成功；
3. Cancel：对业务处理进行取消，即回滚操作，该步骤回对 Try 预留的资源进行释放。



> - **XA是资源层面的分布式事务，强一致性，在两阶段提交的整个过程中，一直会持有资源的锁**
> - **TCC是业务层面的分布式事务，最终一致性，不会一直持有资源的锁**

![https://note.youdao.com/yws/public/resource/59f135645af771eb7c652f36dc0aae07/xmlnote/4FAE4FD5607542D29F74D81F9DAFF41F/54287](/images/algorithm/54287.png)

TCC 是一种侵入式的分布式事务解决方案，以上三个操作都需要业务系统自行实现，对业务系统有着非常大的入侵性，设计相对复杂，但优点是 TCC 完全不依赖数据库，能够实现跨数据库、跨应用资源管理，对这些不同数据访问通过侵入式的编码方式实现一个原子操作，更好地解决了在各种复杂业务场景下的分布式事务问题。



### 举例

> 比如说用户下单

try 阶段首先进行预留资源，然后在 commit 阶段扣除资源

![https://note.youdao.com/yws/public/resource/59f135645af771eb7c652f36dc0aae07/xmlnote/2730B8B7E95447B59D8DB145C60E374F/55787](/images/algorithm/55787.png)

-------------

try 阶段首先进行预留资源，预留资源时扣减库存失败导致全局事务回滚，在 cancel 阶段释放资源

![https://note.youdao.com/yws/public/resource/59f135645af771eb7c652f36dc0aae07/xmlnote/768266383B6C44C28E6DEA98B784BF20/55786](/images/algorithm/55786.png)



## Seata TCC模式

一个分布式的全局事务，整体是 两阶段提交 的模型。全局事务是由若干分支事务组成的，分支事务要满足 两阶段提交 的模型要求，即需要每个分支事务都具备自己的：

- 一阶段 prepare 行为
- 二阶段 commit 或 rollback 行为

​    ![0](/images/algorithm/55681.png)

在Seata中，AT模式与TCC模式事实上都是两阶段提交的具体实现，他们的区别在于：

AT 模式基于 支持本地 ACID 事务的关系型数据库：

- 一阶段 prepare 行为：在本地事务中，一并提交业务数据更新和相应回滚日志记录。
- 二阶段 commit 行为：马上成功结束，自动异步批量清理回滚日志。
- 二阶段 rollback 行为：通过回滚日志，自动生成补偿操作，完成数据回滚。

相应的，TCC 模式不依赖于底层数据资源的事务支持：

- 一阶段 prepare 行为：调用自定义的 prepare 逻辑。
- 二阶段 commit 行为：调用自定义的 commit 逻辑。
- 二阶段 rollback 行为：调用自定义的 rollback 逻辑。

> 简单点概括，SEATA的TCC模式就是手工的AT模式，它允许你自定义两阶段的处理逻辑而不依赖AT模式的undo_log。







## Seata TCC实战

用户下单，整个业务逻辑由三个微服务构成：

- 库存服务：对给定的商品扣除库存数量。
- 订单服务：根据采购需求创建订单。
- 帐户服务：从用户帐户中扣除余额。

![https://note.youdao.com/yws/public/resource/59f135645af771eb7c652f36dc0aae07/xmlnote/EA988AE84CDF43F5BFC7A8E6334BF9A7/55687](/images/algorithm/55687.png)

### **环境准备**

[版本说明 · alibaba/spring-cloud-alibaba Wiki (github.com)](https://github.com/alibaba/spring-cloud-alibaba/wiki/版本说明)

- 父pom指定微服务版本

| Spring Cloud Alibaba Version | Spring Cloud Version     | Spring Boot Version | Seata Version | nacos |
| ---------------------------- | ------------------------ | ------------------- | ------------- | ----- |
| 2.2.9.RELEASE                | Spring Cloud Hoxton.SR12 | 2.3.12.RELEASE      | 1.5.2         | 2.1.0 |

- 启动Seata Server(TC)端，Seata Server使用nacos作为配置中心和注册中心
- 启动nacos服务



### sql

[seata/mysql.sql at 1.5.2 · seata/seata (github.com)](https://github.com/seata/seata/blob/1.5.2/script/client/tcc/db/mysql.sql)

```sql
-- -------------------------------- The script use tcc fence  --------------------------------
CREATE TABLE IF NOT EXISTS `tcc_fence_log`
(
    `xid`           VARCHAR(128)  NOT NULL COMMENT 'global id',
    `branch_id`     BIGINT        NOT NULL COMMENT 'branch id',
    `action_name`   VARCHAR(64)   NOT NULL COMMENT 'action name',
    `status`        TINYINT       NOT NULL COMMENT 'status(tried:1;committed:2;rollbacked:3;suspended:4)',
    `gmt_create`    DATETIME(3)   NOT NULL COMMENT 'create time',
    `gmt_modified`  DATETIME(3)   NOT NULL COMMENT 'update time',
    PRIMARY KEY (`xid`, `branch_id`),
    KEY `idx_gmt_modified` (`gmt_modified`),
    KEY `idx_status` (`status`)
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4;
```



### 依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
</dependency>
```

### 

### 配置

```yml

spring:
  application:
    name: tcc-order-service
  cloud:
    nacos:
      discovery:
        ip: 192.168.135.1:8848
        namespace: c3f112d8-1c5e-419e-9c83-b0b26b987a42

  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://192.168.135.130:3306/seata_tcc_order?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
    username: root
    password: Root.123456
    druid:
      initial-size: 10
      max-active: 100
      min-idle: 10
      max-wait: 60000
      pool-prepared-statements: true
      max-pool-prepared-statement-per-connection-size: 20
      time-between-eviction-runs-millis: 60000
      min-evictable-idle-time-millis: 300000
      test-while-idle: true
      test-on-borrow: false
      test-on-return: false
      stat-view-servlet:
        enabled: true
        url-pattern: /druid/*
      filter:
        stat:
          log-slow-sql: true
          slow-sql-millis: 1000
          merge-sql: false
        wall:
          config:
            multi-statement-allow: true
seata:
  application-id: ${spring.application.name}
  # seata 服务分组，要与服务端配置service.vgroup_mapping的后缀对应
  tx-service-group: default_tx_group
  config:
    nacos:
      server-addr: 192.168.135.1:8848
      group: SEATA_GROUP
      namespace: c3f112d8-1c5e-419e-9c83-b0b26b987a42
      data-id: seataServer.properties
  registry:
    nacos:
      application: seata-server
      server-addr: 192.168.135.1:8848
      group: SEATA_GROUP
      namespace: c3f112d8-1c5e-419e-9c83-b0b26b987a42
server:
  port: 8888
```



### 服务

![image-20230421144853834](/images/algorithm/image-20230421144853834.png)

