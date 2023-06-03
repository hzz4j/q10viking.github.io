---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---





::: tip

springboot data jpa 启动加载数据data.sql和schema.sql

:::

[Source Code](https://github.com/Q10Viking/learncode/tree/main/springboot/springboot-loading-initial-data)

## 依赖

::: details

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.hzz</groupId>
    <artifactId>springboot-loading-initial-data</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <springboot.version>2.7.12</springboot.version>
        <resource.delimiter>@</resource.delimiter>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!--SpringBoot的版本管理-->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${springboot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.18</version>
        </dependency>
    </dependencies>

    <profiles>
        <profile>
            <id>mysql</id>
            <activation>
                <activeByDefault>true</activeByDefault>
            </activation>
            <properties>
                <spring-boot.profiles.active>mysql</spring-boot.profiles.active>
            </properties>
            <dependencies>
                <dependency>
                    <groupId>mysql</groupId>
                    <artifactId>mysql-connector-java</artifactId>
                    <version>8.0.25</version>
                    <scope>runtime</scope>
                </dependency>
            </dependencies>
        </profile>
        <profile>
            <id>h2</id>
            <properties>
                <spring-boot.profiles.active>h2</spring-boot.profiles.active>
            </properties>
            <dependencies>
                <dependency>
                    <groupId>com.h2database</groupId>
                    <artifactId>h2</artifactId>
                    <scope>runtime</scope>
                </dependency>
            </dependencies>
        </profile>
    </profiles>

    <build>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
            </resource>
        </resources>
    </build>
</project>
```

:::



### 配置

:::: code-group
::: code-group-item application.yaml

```yaml

spring:
  profiles:
    active: '@spring-boot.profiles.active@'
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
    defer-datasource-initialization: true
    hibernate:
      ddl-auto: create
  sql:
    init:
      mode: always
      data-locations: classpath*:sql/data.sql
      schema-locations: classpath*:sql/schema.sql
logging:
  level:
    org.hibernate.sql: debug
    org.hibernate.type: trace
server:
  port: 8888
```
:::
::: code-group-item application-mysql.yaml
```yaml
hzz:
  use: mysql
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/ddd?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=UTC
    username: root
    password: Root.123456
  jpa:
    database-platform: org.hibernate.dialect.MySQL8Dialect
```
:::
::: code-group-item application-h2.yaml
```yaml
hzz:
  use: h2
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    username: root
    password: Root.123456
  h2:
    console:
      enabled: true
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
```
:::
::::



## Entity

`springboot data jpa`使得我们很容易管理数据库。如果使用默认的配置，springboot会扫面项目中的**@Entity**,会自动创建对应的表

```java
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Country {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;
}
```

springboot会根据entity自动创建对应的数据库表

```sql
Hibernate: 
    
    drop table if exists country
Hibernate: 
    
    create table country (
       id integer not null auto_increment,
        name varchar(255) not null,
        primary key (id)
    ) engine=InnoDB
```

![image-20230603193124566](/images/springboot/image-20230603193124566.png)



上面都是spring boot data jpa自动帮我们做的，但是我们需要更多的控制权。这时候我们就需要`data.sql`和`schema.sql`文件



## data.sql

虽然spring帮我创建了表，但是并没有帮助我们填充数据，通过data.sql文件，可以插入数据

![image-20230603194000498](/images/springboot/image-20230603194000498.png)

```sql
INSERT INTO country (name) VALUES ('China');
INSERT INTO country (name) VALUES ('USA');
INSERT INTO country (name) VALUES ('Japan');
INSERT INTO country (name) VALUES ('Italy');
```



> By default, *data.sql* scripts get executed before the Hibernate is initialized. We need Hibernate to create our tables before inserting the data into them. To achieve this, we need to defer the initialization of our data source. We'll use the below property to achieve this:
>
> 默认情况下，data.sql脚本在初始化Hibernate之前执行。在将数据插入表之前，我们需要Hibernate来创建表。为了实现这一点，我们需要推迟数据源的初始化。我们将使用以下属性来实现这一点：

```properties
spring.jpa.defer-datasource-initialization=true
```

当我们运行项目的时候，springboot会自动执行data.sql里面的sql语句

![image-20230603201330185](/images/springboot/image-20230603201330185.png)

### 注意❤️

::: tip

Please note that for any script-based initialization, i.e. inserting data via data.sql or creating schema via schema.sql  we need to set the below property:

请注意，对于任何基于脚本的初始化，即通过data.sql插入数据或通过schema.sql创建schema，我们需要设置以下属性：

:::

```properties
spring.sql.init.mode=always
```

- 它的默认值是embedded，所以像h2这样的嵌入数据库，就不用设置这个。对于外部的数据库如mysql，则需要设置为always.
- 设置为always也对嵌入的数据库（如h2）生效

### 嵌入型数据库Java

[choosing-light-weight-java-database](http://sayrohan.blogspot.com/2012/12/choosing-light-weight-java-database.html)

[3-java-embedded-databases](https://dzone.com/articles/3-java-embedded-databases)

1. H2

2. HSQLDB (HyperSQL Database)

3. Apache Derby



## schema.sql

有时候，我们需要springboot jpa根据entity创建schema。我们可以自己顶一个文件，然后创建表

```sql
drop table if exists USERS;
create table USERS
(
    ID     int          not null AUTO_INCREMENT,
    NAME   varchar(100) not null,
    STATUS int,
    PRIMARY KEY (ID)
);
```

![image-20230603215801705](/images/springboot/image-20230603215801705.png)

启动项目之后

![image-20230603220042352](/images/springboot/image-20230603220042352.png)



> 注意，springboot项目启动的时候每次都会创建USERS表，由于数据库已经创建过了，那么，表创建重复，spring会报错，启动不起来，所以我们一般得手动加上drop语句

```sh
Caused by: java.sql.SQLSyntaxErrorException: Table 'USERS' already exists
```



```
create table USERS
(
    ID     int          not null AUTO_INCREMENT,
    NAME   varchar(100) not null,
    STATUS int,
    PRIMARY KEY (ID)
);
```



### 冲突

> **Please note that if we are using script-based initialization, i.e. through `schema.sql` and `data.sql` and also `Hibernate initialization`, then using both of them together can cause some issues.**
>
> To solve this, we can disable the execution of DDL commands altogether by Hibernate, which Hibernate uses for the creation/updation of tables:

```properties
# 禁止hibernate自动创建表schema
spring.jpa.hibernate.ddl-auto=none
```

这样禁止了hibernate自动生成schema,就能保证，只有schema.sql生效.避免了冲突，但是个人不建议这样做。

### 执行顺序❤️

一般我们配置成这样

```properties
spring.jpa.hibernate.ddl-auto=create
```

那么spring执行循序Hibernate根据entity生成schem,然后执行schema.sql,最后是data.sql填充数据库



### 控制Hibernate 创建DDL的方式

```
spring.jpa.hibernate.ddl-auto=有五种方式
不过最常用的还是create和update
```

- `create` – Hibernate first drops existing tables and then creates new tables.
- `update` – The object model created based on the mappings (annotations or XML) is compared with the existing schema, and then Hibernate updates the schema according to the diff. It never deletes the existing tables or columns even if they are no longer required by the application.
- `create-drop` – similar to *create*, with the addition that Hibernate will drop the database after all operations are completed; typically used for unit testing
- `validate` – Hibernate only validates whether the tables and columns exist; otherwise, it throws an exception.
- `none` – This value effectively turns off the DDL generation.



### 控制加载数据的方式

```properties
spring.sql.init.mode=三种
# 最常见的是always
```

springboot默认为嵌入的数据库加载数据如H2

- `always` – always initialize the database
- `embedded` – always initialize if an embedded database is in use. This is the default if the property value is not specified.
- `never` – never initialize the database



## 小结

```sql
# 确保data.sql和schema.sql在hibernate根据entity创建schema之后，才执行
spring.jpa.defer-datasource-initialization=true
# 对于非嵌入式的数据库，我们总是需要执行data.sql或者schema.sql的内容
spring.sql.init.mode=always

# hibernate 自动创建 schema
spring.jpa.hibernate.ddl-auto=none
spring.jpa.hibernate.ddl-auto=create
```

> 指定data.sql或者schema.sql的位置。**不过建议直接放在resources下即可，避免多余的配置，但是这样管理也不错**

```yaml
 spring:
 	sql:
        init:
          data-locations: classpath*:data.sql
          schema-locations: classpath*:schema.sql
```

![image-20230603222447267](/images/springboot/image-20230603222447267.png)

### 建议❤️

schema.sql可以不需要，让hibernate根据entity来创建，填充表数据，我们可以使用data.sql

配置

```sql
# 确保data.sql和schema.sql在hibernate根据entity创建schema之后，才执行
spring.jpa.defer-datasource-initialization=true
# 对于非嵌入式的数据库，我们总是需要加载data.sql或者schema.sql的内容
spring.sql.init.mode=always
# 允许hibernate自动创建
spring.jpa.hibernate.ddl-auto=create
```

最终的配置，**将data.sql和schema.sql直接放在resources下**

:::: code-group
::: code-group-item application.yaml

```yaml
spring:
  profiles:
    active: '@spring-boot.profiles.active@'
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
    defer-datasource-initialization: true
    hibernate:
      ddl-auto: create
  sql:
    init:
      mode: always
logging:
  level:
    org.hibernate.sql: debug
    org.hibernate.type: trace
server:
  port: 8888
```

:::
::: code-group-item application-mysql.yaml

```yaml
hzz:
  use: mysql
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/ddd?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=UTC
    username: root
    password: Root.123456
  jpa:
    database-platform: org.hibernate.dialect.MySQL8Dialect
```

:::
::: code-group-item application-h2.yaml

```yaml
hzz:
  use: h2
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    username: root
    password: Root.123456
  h2:
    console:
      enabled: true
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
```

:::
::::





## Java类型与数据类型对应

:::  tip

一直搞不清楚java类型与mysql数据类型的对应关系，既然hibernate能够生成schema,那么借此机会，一举拿下它

:::

java对应的mysql



::: details

```java
@Entity
@Getter
@Setter
@NoArgsConstructor
public class JavaTypeMappingMySqlType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private byte a;
    private short b;
    private boolean c;
    private char d;
    private int e;
    private long f;
    private float g;
    private double h;
    private String i;
    private java.util.Date j;
    private java.sql.Date k;
    private LocalDateTime l;
    private LocalDate m;
    private java.math.BigDecimal n;
    private java.math.BigInteger o;
    private byte[] p;
    private Integer q;
    private Double r;
    private Long s;
    private Float t;
}
/**
 CREATE TABLE `java_type_mapping_my_sql_type` (
 `id` int NOT NULL AUTO_INCREMENT,
 `a` tinyint NOT NULL,
 `b` smallint NOT NULL,
 `c` bit(1) NOT NULL,
 `d` char(1) NOT NULL,
 `e` int NOT NULL,
 `f` bigint NOT NULL,
 `g` float NOT NULL,
 `h` double NOT NULL,
 `i` varchar(255) DEFAULT NULL,
 `j` datetime(6) DEFAULT NULL,
 `k` date DEFAULT NULL,
 `l` datetime(6) DEFAULT NULL,
 `m` date DEFAULT NULL,
 `n` decimal(19,2) DEFAULT NULL,
 `o` decimal(19,2) DEFAULT NULL,
 `p` tinyblob,
 `q` int DEFAULT NULL,
 `r` double DEFAULT NULL,
 `s` bigint DEFAULT NULL,
 `t` float DEFAULT NULL,
 PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
 */
```

:::



| Java类型       | mysql类型     |
| -------------- | ------------- |
| int            | int           |
| Integer        | int           |
| double         | double        |
| Double         | double        |
| float          | float         |
| Float          | float         |
| long           | bigint        |
| Long           | bigint        |
| BigDecimal     | decimal(19,2) |
| BigInt         | decimal(19,2) |
| java.util.Date | datetime      |
| java.sql.Date  | date          |
| LocalDateTime  | datetime      |
| LocalDate      | date          |
| String         | varchar(255)  |
| byte           | tinyint       |
| byte[]         | tinyblob      |
| short          | smallint      |
| boolean        | bit(1)        |
| char           | char(1)       |



## 参考

[spring-boot-data-sql-and-schema-sql](https://www.baeldung.com/spring-boot-data-sql-and-schema-sql)