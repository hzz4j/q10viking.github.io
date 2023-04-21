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



### **TCC如何控制异常**

在 TCC 模型执行的过程中，还可能会出现各种异常，其中最为常见的有空回滚、幂等、悬挂等。TCC 模式是分布式事务中非常重要的事务模式，但是幂等、悬挂和空回滚一直是 TCC 模式需要考虑的问题，Seata 框架在 1.5.1 版本完美解决了这些问题



### 空回滚

> **那么空回滚是如何产生的呢**

![https://note.youdao.com/yws/public/resource/59f135645af771eb7c652f36dc0aae07/xmlnote/EC6A5A7DBE7A4A83976F867CC12BD8A7/55759](/images/algorithm/55759.png)

如上图所示，全局事务开启后，参与者 A 分支注册完成之后会执行参与者一阶段 RPC 方法，如果此时参与者 A 所在的机器发生宕机，网络异常，都会造成 RPC 调用失败，即参与者 A 一阶段方法未成功执行，但是此时全局事务已经开启，Seata 必须要推进到终态，在全局事务回滚时会调用参与者 A 的 Cancel 方法，从而造成空回滚。



**要想防止空回滚，那么必须在 Cancel 方法中识别这是一个空回滚，Seata 是如何做的呢？**

Seata 的做法是新增一个 TCC 事务控制表(tcc_fence_log)，包含事务的 XID 和 BranchID 信息，**在 Try 方法执行时插入一条记录，表示一阶段执行了，执行 Cancel 方法时读取这条记录，如果记录不存在，说明 Try 方法没有执行**。



### **如何处理幂等**

幂等问题指的是 TC 重复进行二阶段提交，因此 Confirm/Cancel 接口需要支持幂等处理，即不会产生资源重复提交或者重复释放。

> 幂等产生的原因

![https://note.youdao.com/yws/public/resource/59f135645af771eb7c652f36dc0aae07/xmlnote/51946CA854554178849414683E7BE9CC/55758](/images/algorithm/55758.png)



如上图所示，参与者 A 执行完二阶段之后，由于网络抖动或者宕机问题，会造成 TC 收不到参与者 A 执行二阶段的返回结果，TC 会重复发起调用，直到二阶段执行结果成功。



**Seata 是如何处理幂等问题的呢？**

同样的也是在 TCC 事务控制表中增加一个记录状态的字段 status，该字段有 3 个值，分别为：

1. tried：1
2. committed：2
3. rollbacked：3

二阶段 Confirm/Cancel 方法执行后，将状态改为 committed 或 rollbacked 状态。当重复调用二阶段 Confirm/Cancel 方法时，判断事务状态即可解决幂等问题。



### 空悬挂



悬挂指的是二阶段 Cancel 方法比 一阶段 Try 方法优先执行，由于允许空回滚的原因，在执行完二阶段 Cancel 方法之后直接空回滚返回成功，此时全局事务已结束，但是由于 Try 方法随后执行，这就会造成一阶段 Try 方法预留的资源永远无法提交和释放了。

> 空悬挂产生的原因

![https://note.youdao.com/yws/public/resource/59f135645af771eb7c652f36dc0aae07/xmlnote/E38EAA625136419C9DA9CEF85CCEEBE2/55757](/images/algorithm/55757.png)

如上图所示，在执行参与者 A 的一阶段 Try 方法时，出现网路拥堵，由于 Seata 全局事务有超时限制，执行 Try 方法超时后，TM 决议全局回滚，回滚完成后如果此时 RPC 请求才到达参与者 A，**执行 Try 方法进行资源预留，从而造成悬挂**。



**Seata 是怎么处理悬挂的呢？**

在 TCC 事务控制表记录状态的字段 status 中增加一个状态：

- suspended：4

当执行二阶段 Cancel 方法时，如果发现 TCC 事务控制表有相关记录，说明二阶段 Cancel 方法优先一阶段 Try 方法执行，因此插入一条 status=4 状态的记录，当一阶段 Try 方法后面执行时，判断 status=4 ，则说明有二阶段 Cancel 已执行，并返回 false 以阻止一阶段 Try 方法执行成功。



----------

## Seata TCC实战

[learncode/seata/learnSeata/seata-tcc at main · Q10Viking/learncode (github.com)](https://github.com/Q10Viking/learncode/tree/main/seata/learnSeata/seata-tcc)

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



### 解决幂等性的tcc_fence_log表

TCC 幂等、悬挂和空回滚问题如何解决？

TCC 模式中存在的三大问题是幂等、悬挂和空回滚。在 Seata1.5.1 版本中，增加了一张事务控制表，表名是 tcc_fence_log 来解决这个问题。而在@TwoPhaseBusinessAction 注解中提到的属性 useTCCFence 就是来指定是否开启这个机制，这个属性值默认是 false

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



```sh
*************************** 1. row ***************************
         xid: 192.168.135.130:8091:4729163079446176965
   branch_id: 4729163079446176971
 action_name: debit
      status: 2
  gmt_create: 2023-04-21 16:32:28.473
gmt_modified: 2023-04-21 16:32:28.651
1 row in set (0.00 sec)

# 其中状态status: tried:1;committed:2;rollbacked:3;suspended:4
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
server:
  port: 8888
spring:
  application:
    name: tcc-order-service
  cloud:
    nacos:
      discovery:
#        ip: 192.168.135.1:8848
        namespace: c3f112d8-1c5e-419e-9c83-b0b26b987a42
        server-addr: 192.168.135.1:8848

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
    type: nacos
    nacos:
      server-addr: 192.168.135.1:8848
      group: SEATA_GROUP
      namespace: c3f112d8-1c5e-419e-9c83-b0b26b987a42
      data-id: seataServer.properties
  registry:
    type: nacos
    nacos:
      application: seata-server
      server-addr: 192.168.135.1:8848
      group: SEATA_GROUP
      namespace: c3f112d8-1c5e-419e-9c83-b0b26b987a42


```



### 定义TCC接口

- @LocalTCC 适用于SpringCloud+Feign模式下的TCC，@LocalTCC一定需要注解在接口上，此接口可以是寻常的业务接口，只要实现了TCC的两阶段提交对应方法便可
- @TwoPhaseBusinessAction 注解try方法，其中name为当前tcc方法的bean名称，写方法名便可（全局唯一），commitMethod指向提交方法，rollbackMethod指向事务回滚方法。指定好三个方法之后，seata会根据全局事务的成功或失败，去帮我们自动调用提交方法或者回滚方法。
- @BusinessActionContextParameter 注解可以将参数传递到二阶段（commitMethod/rollbackMethod）的方法。
- BusinessActionContext 便是指TCC事务上下文

```java
import io.seata.rm.tcc.api.BusinessActionContext;
import io.seata.rm.tcc.api.BusinessActionContextParameter;
import io.seata.rm.tcc.api.LocalTCC;
import io.seata.rm.tcc.api.TwoPhaseBusinessAction;
import org.hzz.entity.Order;
import org.hzz.vo.OrderVo;

/**
 * 通过 @LocalTCC 这个注解，RM 初始化的时候会向 TC 注册一个分支事务。
 */
@LocalTCC
public interface OrderService {

    /**
     * TCC的try方法：保存订单信息，状态为支付中
     *
     * 定义两阶段提交，在try阶段通过@TwoPhaseBusinessAction注解定义了分支事务的 resourceId，commit和 cancel 方法
     *  name = 该tcc的bean名称,全局唯一
     *  commitMethod = commit 为二阶段确认方法
     *  rollbackMethod = rollback 为二阶段取消方法
     *  BusinessActionContextParameter注解 传递参数到二阶段中
     *  useTCCFence seata1.5.1的新特性，用于解决TCC幂等，悬挂，空回滚问题，需增加日志表tcc_fence_log
     */
    @TwoPhaseBusinessAction(name = "prepareSaveOrder", commitMethod = "commit", rollbackMethod = "rollback", useTCCFence = true)
    Order prepareSaveOrder(OrderVo orderVo, @BusinessActionContextParameter(paramName = "orderId") Long orderId);

    /**
     *
     * TCC的confirm方法：订单状态改为支付成功
     *
     * 二阶段确认方法可以另命名，但要保证与commitMethod一致
     * context可以传递try方法的参数
     *
     * @param actionContext
     * @return
     */
    boolean commit(BusinessActionContext actionContext);

    /**
     * TCC的cancel方法：订单状态改为支付失败
     * 二阶段取消方法可以另命名，但要保证与rollbackMethod一致
     *
     * @param actionContext
     * @return
     */
    boolean rollback(BusinessActionContext actionContext);
}

```

#### 实现

```java
@Service
@Slf4j
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Order prepareSaveOrder(OrderVo orderVo, @BusinessActionContextParameter(paramName = "orderId") Long orderId) {
        // 保存订单
        Order order = new Order();
        order.setId(orderId);
        order.setUserId(orderVo.getUserId());
        order.setCommodityCode(orderVo.getCommodityCode());
        order.setCount(orderVo.getCount());
        order.setMoney(orderVo.getMoney());
        order.setStatus(OrderStatus.INIT.getValue());
        Integer saveOrderRecord = orderMapper.insert(order);
        log.info("保存订单{}", saveOrderRecord > 0 ? "成功" : "失败");
        return order;
    }

    @Override
    public boolean commit(BusinessActionContext actionContext) {
        // 获取订单id
        long orderId = Long.parseLong(actionContext.getActionContext("orderId").toString());
        //更新订单状态为支付成功
        Integer updateOrderRecord = orderMapper.updateOrderStatus(orderId,OrderStatus.SUCCESS.getValue());
        log.info("更新订单id:{} {}", orderId, updateOrderRecord > 0 ? "成功" : "失败");
        return true;
    }

    @Override
    public boolean rollback(BusinessActionContext actionContext) {
        //获取订单id
        long orderId = Long.parseLong(actionContext.getActionContext("orderId").toString());
        //更新订单状态为支付失败
        Integer updateOrderRecord = orderMapper.updateOrderStatus(orderId,OrderStatus.FAIL.getValue());
        log.info("更新订单id:{} {}", orderId, updateOrderRecord > 0 ? "成功" : "失败");

        return true;
    }
}

```



#### 全局事务

 **在全局事务发起者中添加@GlobalTransactional注解**

```java
@Service
@Slf4j
public class BusinessServiceImpl implements BussinessService {

    @Autowired
    private OrderService orderService;
    @Autowired
    private AccountFeignService accountFeignService;

    @Autowired
    private StorageFeignService storageFeignService;


    @Override
    @GlobalTransactional(name = "createOrder",rollbackFor = Exception.class)
    public Order saveOrder(OrderVo orderVo) {
        log.info("=============用户下单=================");
        log.info("当前 XID: {}", RootContext.getXID());

        //获取全局唯一订单号  测试使用
        Long orderId = UUIDGenerator.generateUUID();

        //阶段一： 创建订单
        Order order = orderService.prepareSaveOrder(orderVo,orderId);

        //扣减库存
        storageFeignService.deduct(orderVo.getCommodityCode(), orderVo.getCount());
        //扣减余额
        accountFeignService.debit(orderVo.getUserId(), orderVo.getMoney());

        return order;
    }
}
```



----------



#### 账户冻结案例

![image-20230421172527736](/images/algorithm/image-20230421172527736.png)

```java
@LocalTCC
public interface AccountService {
    /**
     * 用户账户扣款
     *
     * 定义两阶段提交，在try阶段通过@TwoPhaseBusinessAction注解定义了分支事务的 resourceId，commit和 cancel 方法
     *  name = 该tcc的bean名称,全局唯一
     *  commitMethod = commit 为二阶段确认方法
     *  rollbackMethod = rollback 为二阶段取消方法
     *
     * @param userId
     * @param money 从用户账户中扣除的金额
     * @return
     */
    @TwoPhaseBusinessAction(name = "debit", commitMethod = "commit", rollbackMethod = "rollback", useTCCFence = true)
    boolean debit(@BusinessActionContextParameter(paramName = "userId") String userId,
                  @BusinessActionContextParameter(paramName = "money") int money);

    /**
     * 提交事务，二阶段确认方法可以另命名，但要保证与commitMethod一致
     * context可以传递try方法的参数
     *
     * @param actionContext
     * @return
     */
    boolean commit(BusinessActionContext actionContext);

    /**
     * 回滚事务，二阶段取消方法可以另命名，但要保证与rollbackMethod一致
     *
     * @param actionContext
     * @return
     */
    boolean rollback(BusinessActionContext actionContext);
}
```

> 实现



```java
@Service
@Slf4j
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountMapper accountMapper;

    @Transactional
    @Override
    public boolean debit(@BusinessActionContextParameter(paramName = "userId") String userId,
                         @BusinessActionContextParameter(paramName = "money") int money) {
        log.info("=============冻结用户账户余额=================");
        log.info("当前 XID: {}", RootContext.getXID());

        checkBalance(userId, money);

        log.info("开始冻结用户 {} 余额", userId);
        //冻结金额
        Integer record = accountMapper.freezeBalance(userId,money);

        log.info("冻结用户 {} 余额结果:{}", userId, record > 0 ? "操作成功" : "扣减余额失败");
        return true;
    }

    @Override
    public boolean commit(BusinessActionContext actionContext) {
        log.info("=============扣减冻结金额=================");
        String userId = actionContext.getActionContext("userId").toString();
        int money = (int) actionContext.getActionContext("money");
        //扣减冻结金额
        accountMapper.reduceFreezeBalance(userId,money);

        return true;
    }

    @Override
    public boolean rollback(BusinessActionContext actionContext) {
        log.info("=============解冻金额=================");

        String userId = actionContext.getActionContext("userId").toString();
        int money = (int) actionContext.getActionContext("money");
        //解冻金额
        accountMapper.unfreezeBalance(userId,money);
        return true;
    }

    private void checkBalance(String userId, int money){
        log.info("检查用户 {} 余额", userId);
        Account account = accountMapper.selectByUserId(userId);

        if (account.getMoney() < money) {
            log.warn("用户 {} 余额不足，当前余额:{}", userId, account.getMoney());
            throw new RuntimeException("余额不足");
        }

    }
}
```



> sql

```java
@Repository
public interface AccountMapper {
    /**
     * 查询账户
     * @param userId
     * @return
     */
    @Select("select id, user_id, money from account_tbl WHERE user_id = #{userId}")
    Account selectByUserId(@Param("userId") String userId);

    /**
     * 扣减余额
     * @param userId 用户id
     * @param money 要扣减的金额
     * @return
     */
    @Update("update account_tbl set money=money-#{money} where user_id = #{userId}")
    int reduceBalance(@Param("userId") String userId, @Param("money") Integer money);

    /**
     * 冻结金额  Try: 账户余额-支出余额，冻结余额+支出余额
     * @param userId 用户id
     * @param money 要扣减的金额
     * @return
     */
    @Update("update account_tbl set money=money-#{money},freeze_money=freeze_money+#{money} where user_id = #{userId}")
    int freezeBalance(@Param("userId") String userId, @Param("money") Integer money);

    /**
     * 扣减冻结金额  Confirm: 冻结余额-支出余额 （真正的扣减余额）
     * @param userId 用户id
     * @param money 要扣减的金额
     * @return
     */
    @Update("update account_tbl set freeze_money=freeze_money-#{money} where user_id = #{userId}")
    int reduceFreezeBalance(@Param("userId") String userId, @Param("money") Integer money);

    /**
     * 解冻金额  Cancel: 账户余额+支出余额，冻结余额-支出余额
     * @param userId 用户id
     * @param money 要扣减的金额
     * @return
     */
    @Update("update account_tbl set money=money+#{money},freeze_money=freeze_money-#{money} where user_id = #{userId}")
    int unfreezeBalance(@Param("userId") String userId, @Param("money") Integer money);
}
```



### 服务

![image-20230421144853834](/images/algorithm/image-20230421144853834.png)



### 测试

![image-20230421163840015](/images/algorithm/image-20230421163840015.png)