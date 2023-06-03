---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---



::: tip

ORM 是 Object Relational Mapping 的缩写，译为“对象关系映射”框架。

:::



## @Entity与@Table

@Entity 注解和 @Table 注解都是 Java Persistence API 中定义的一种注解

- @Entity 说明这个 class 是实体类，并且使用默认的 orm 规则，即 class 名即数据库表中表名，class 字段名即表中的字段名

- @Table 注解是一个非必须的注解。@Table 注解指定了 Entity 所要映射带数据库表，其中 @Table.name() 用来指定映射表

  的表名。声明此对象映射到数据库的数据表，通过它可以为实体指定表(talbe),目录 (Catalog) 和 schema 的名字。



> 如果没有使用`@Table`指定表名，那么默认的数据库表名为实体（Entity）的类名。数据库会首字母小写，如下面的例子表名（clazz）实体名是Clazz

```java
@Data
@Entity
public class Clazz {
    private Long id;
    private String name;
}
```



> 可以给实体名改变名字，表名为class，实体名为Class

```java
@Data
@Entity("Class")
public class Clazz {
    private Long id;
    private String name;
}
```

> 不想改变实体的名称让它使用默认的类名，只想改变表名。表名为class，实体名为Clazz

```java
@Data
@Entity
@Table("class")
public class Clazz {
    private Long id;
    private String name;
}
```



## 参看

[@Entity 和 @Table 注解的用法](https://blog.csdn.net/u013517229/article/details/89307158)

[Learn about @Entity and @Table annotation in JPA - Huong Dan Java](https://huongdanjava.com/learn-about-entity-and-table-annotation-in-jpa.html)



