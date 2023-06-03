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



## @Column

@Column 注解用于指定字段或属性将映射到的列的详细信息。 我们可以使用具有以下最常用属性的列注解

- **name** 属性允许明确指定列的名称。
- **length** 属性允许用于映射值的列的大小，特别是对于 String 值。
- **nullable**可空属性允许在生成模式时将该列标记为 NOT NULL。
- **unique** 属性允许将列标记为仅包含唯一值。



## @Id 和 @GeneratedValue 注解

每个实体 bean 都有一个主键，我们可以使用 `@Id` 注解在类上对其进行注解。 主键可以是单个字段或多个字段的组合，具体取决于表结构。

默认情况下，`@Id` 注解将自动确定要使用的最合适的主键生成策略，但我们可以通过应用 `@GeneratedValue` 注解来覆盖它，它带有两个参数 strategy 和 generator

- TABLE：使用一个特定的数据库表格来保存主键。 
- SEQUENCE：根据底层数据库的序列来生成主键，条件是数据库支持序列。 
- **IDENTITY**：主键由数据库自动生成（主要是自动增长型） 
- **AUTO**：主键由程序控制。

```java
@Entity
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "fullname", length = "200")
    private String name;
    private String email;
    
    //constructors, getters, and setters
}
```



## 参看

[@Entity 和 @Table 注解的用法](https://blog.csdn.net/u013517229/article/details/89307158)

[Learn about @Entity and @Table annotation in JPA - Huong Dan Java](https://huongdanjava.com/learn-about-entity-and-table-annotation-in-jpa.html)



