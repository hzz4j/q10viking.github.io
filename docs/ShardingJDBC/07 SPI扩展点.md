---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /ShardingJDBC/
typora-root-url: ..\.vuepress\public
---



## SPI

ShardingSphere保留了大量的SPI扩展接口，对主流程封闭、对 SPI开放



## 实战扩展主键生成策略

仿造UUIDShardingKeyGenerator使用自己的生成策略

```java
@Slf4j
public class MyKeyGenerator implements ShardingKeyGenerator {

    private Properties properties = new Properties();
    private AtomicLong atomicLong = new AtomicLong(0L);

    @Override
    public Comparable<?> generateKey() {
        LocalDateTime now = LocalDateTime.now();
        String time = DateTimeFormatter.ofPattern("HHmmssSSS").format(now);
        Long key = Long.parseLong(time + atomicLong.getAndIncrement());
        log.info("生成Key: "+key);
        return key;
    }

    @Override
    public String getType() {
        return "MYKEY";
    }

    @Override
    public Properties getProperties() {
        return this.properties;
    }

    @Override
    public void setProperties(Properties properties) {
        this.properties = properties;
    }
}
```

![image-20230327180245248](/images/ShardingJDBC/image-20230327180245248.png)

`org.apache.shardingsphere.spi.keygen.ShardingKeyGenerator`文件写入扩展的类

```
org.hzz.spiextension.MyKeyGenerator
```

### 配置使用

```properties
#配置真实的数据源
spring.shardingsphere.datasource.names=m1,m2

spring.shardingsphere.datasource.m1.type=com.alibaba.druid.pool.DruidDataSource
spring.shardingsphere.datasource.m1.drive-class=com.mysql.cj.jdbc.Driver
spring.shardingsphere.datasource.m1.url=jdbc:mysql://192.168.135.130:3306/coursedb?serverTimezone=UTC
spring.shardingsphere.datasource.m1.username=root
spring.shardingsphere.datasource.m1.password=Root.123456


spring.shardingsphere.datasource.m2.type=com.alibaba.druid.pool.DruidDataSource
spring.shardingsphere.datasource.m2.drive-class=com.mysql.cj.jdbc.Driver
spring.shardingsphere.datasource.m2.url=jdbc:mysql://192.168.135.130:3306/coursedb2?serverTimezone=UTC
spring.shardingsphere.datasource.m2.username=root
spring.shardingsphere.datasource.m2.password=Root.123456

# 指定表的分布情况 配置表在哪个数据库里，表名是什么。水平分表，分两个表：
#m1.course_1,m1.course_2
spring.shardingsphere.sharding.tables.course.actual-data-nodes=m$->{1..2}.course_$->{1..2}

# 指定表的主键生成策略
spring.shardingsphere.sharding.tables.course.key-generator.column=cid
spring.shardingsphere.sharding.tables.course.key-generator.type=MYKEY

#指定分片策略
# 数据分片策略
spring.shardingsphere.sharding.tables.course.database-strategy.inline.algorithm-expression=m$->{cid%2+1}
spring.shardingsphere.sharding.tables.course.database-strategy.inline.sharding-column=cid
# 表分片策略
spring.shardingsphere.sharding.tables.course.table-strategy.inline.algorithm-expression=course_$->{(cid%4).intdiv(2)+1}
spring.shardingsphere.sharding.tables.course.table-strategy.inline.sharding-column=cid
# 打开日志输出
spring.shardingsphere.props.sql.show=true
```

## 测试

```java
@Test
public void test() throws InterruptedException {
    for (int i = 0; i < 10; i++) {
        Course course = new Course();
        course.setCname("SPI");
        course.setUserId(100l);
        course.setCstatus("1");
        courseMapper.insert(course);
    }
}
```

