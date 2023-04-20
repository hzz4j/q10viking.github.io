---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /seata/
typora-root-url: ..\.vuepress\public
---





## MySQL提供的XA

> mysql jdbc 实现了XA规范

- AP(Application Program)：应用程序，主要是定义事务边界以及那些组成事务的特定于应用程序的操作。
- RM(Resouces Manager)：资源管理器，管理一些共享资源的自治域，如提供对诸如数据库之类的共享资源的访问。
- TM(Transaction Manager)：事务管理器，管理全局事务，协调事务的提交或者回滚，并协调故障恢复

```java
import com.mysql.cj.jdbc.JdbcConnection;
import com.mysql.cj.jdbc.MysqlXAConnection;
import com.mysql.cj.jdbc.MysqlXid;

import javax.transaction.xa.XAException;
import javax.transaction.xa.XAResource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class MySQLXADemo {
    public static void main(String[] args) throws SQLException {
        //true表示打印XA语句,，用于调试
        boolean logXaCommands = true;

        // 获得资源管理器操作接口实例 RM1
        Connection connection1 = DriverManager.getConnection("jdbc:mysql://192.168.135.130:3306/seata_order",
                "root", "Root.123456");
        MysqlXAConnection xAConnection1 = new MysqlXAConnection((JdbcConnection) connection1, logXaCommands);
        XAResource xaResource1 = xAConnection1.getXAResource();

        // 获得资源管理器操作接口实例 RM2
        Connection connection2 = DriverManager.getConnection("jdbc:mysql://192.168.135.130:3306/seata_storage",
                "root", "Root.123456");

        MysqlXAConnection xAConnection2 = new MysqlXAConnection((JdbcConnection) connection2, logXaCommands);
        XAResource xaResource2 = xAConnection2.getXAResource();

        // AP(应用程序)请求TM执行一个分布式事务，TM生成全局事务id
        byte[] gtrid = "q10viking".getBytes();
        int formatId = 1;

        try {
            // ==============分别执行RM1和RM2上的事务分支====================
            // TM生成rm1上的事务分支id
            byte[] bqual1 = "branch1".getBytes();
            MysqlXid xId1 = new MysqlXid(gtrid, bqual1, formatId);
            // 执行rm1上的事务分支
            xaResource1.start(xId1, XAResource.TMNOFLAGS);

            PreparedStatement ps1 = connection1.prepareStatement(
                    "INSERT into order_tbl(user_id,commodity_code,count,money,status) VALUES (1001,2001,2,10,1)");
            ps1.execute();
            xaResource1.end(xId1, XAResource.TMSUCCESS);


            // TM生成rm2上的事务分支id
            byte[] bqual2 = "branch2".getBytes();
            MysqlXid xId2 = new MysqlXid(gtrid, bqual2, formatId);
            // 执行rm2上的事务分支
            xaResource2.start(xId2, XAResource.TMNOFLAGS);

            PreparedStatement ps2 = connection2.prepareStatement(
                    "update storage_tbl set count=count-2 where commodity_code=2001");
            ps2.execute();
            xaResource2.end(xId2, XAResource.TMSUCCESS);

            // ===================两阶段提交================================
            // phase1：询问所有的RM 准备提交事务分支
            int rm1Prepare = xaResource1.prepare(xId1);
            int rm2Prepare = xaResource2.prepare(xId2);
            // phase2：提交所有事务分支
            boolean onePhase = false;
            //TM判断有2个事务分支，所以不能优化为一阶段提交
            if(rm1Prepare == XAResource.XA_OK && rm2Prepare == XAResource.XA_OK){
                //所有事务分支都prepare成功，提交所有事务分支
                xaResource1.commit(xId1, onePhase);
                xaResource2.commit(xId2, onePhase);
            } else {
                xaResource1.rollback(xId1);
                xaResource2.rollback(xId2);
            }
        } catch (SQLException | XAException e) {
            e.printStackTrace();
        }

    }
}
/**
 * Thu Apr 20 22:31:25 GMT+08:00 2023 DEBUG: Executing XA statement: XA START 0x71313076696b696e67,0x6272616e636831,0x1
 * Thu Apr 20 22:31:25 GMT+08:00 2023 DEBUG: Executing XA statement: XA END 0x71313076696b696e67,0x6272616e636831,0x1
 * Thu Apr 20 22:31:25 GMT+08:00 2023 DEBUG: Executing XA statement: XA START 0x71313076696b696e67,0x6272616e636832,0x1
 * Thu Apr 20 22:31:25 GMT+08:00 2023 DEBUG: Executing XA statement: XA END 0x71313076696b696e67,0x6272616e636832,0x1
 * Thu Apr 20 22:31:25 GMT+08:00 2023 DEBUG: Executing XA statement: XA PREPARE 0x71313076696b696e67,0x6272616e636831,0x1
 * Thu Apr 20 22:31:25 GMT+08:00 2023 DEBUG: Executing XA statement: XA PREPARE 0x71313076696b696e67,0x6272616e636832,0x1
 * Thu Apr 20 22:31:25 GMT+08:00 2023 DEBUG: Executing XA statement: XA COMMIT 0x71313076696b696e67,0x6272616e636831,0x1
 * Thu Apr 20 22:31:25 GMT+08:00 2023 DEBUG: Executing XA statement: XA COMMIT 0x71313076696b696e67,0x6272616e636832,0x1
 */
```



## Seata的XA模式

![https://note.youdao.com/yws/public/resource/59f135645af771eb7c652f36dc0aae07/xmlnote/E2227F72EB4741EFB2044CFDA2BC6811/55865](/images/seata/55865.png)



### AT和XA模式数据源代理机制对比

![https://note.youdao.com/yws/public/resource/59f135645af771eb7c652f36dc0aae07/xmlnote/FD20DEB1A7494ED5A792985AB1933CA9/55847](/images/seata/55847.png)



**XA 模式的使用**

从编程模型上，XA 模式与 AT 模式保持完全一致。只需要修改数据源代理，即可实现 XA 模式与 AT 模式之间的切换

```java
@Bean("dataSource")
public DataSource dataSource(DruidDataSource druidDataSource) {
    // DataSourceProxy for AT mode
    // return new DataSourceProxy(druidDataSource);

    // DataSourceProxyXA for XA mode
    return new DataSourceProxyXA(druidDataSource);
}
```



**Spring Cloud Alibaba整合Seata XA实战**

对比Seata AT模式配置，只需修改两个地方：

- 微服务数据库不需要undo_log表，undo_log表仅用于AT模式
- 修改数据源代码模式为XA模式

```yml
seata:
  # 数据源代理模式 默认AT
  data-source-proxy-mode: XA
```

 
