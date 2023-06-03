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

## TODO

java对应的mysql

## 参考

[spring-boot-data-sql-and-schema-sql](https://www.baeldung.com/spring-boot-data-sql-and-schema-sql)