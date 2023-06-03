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

```

```



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



## TODO

java对应的mysql

## 参考

[spring-boot-data-sql-and-schema-sql](https://www.baeldung.com/spring-boot-data-sql-and-schema-sql)