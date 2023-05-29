---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---







## 背景

::: tip

springdata data jpa的优点：通过实体映射数据库，并且有DDD聚合持久化的功能。

:::

本次试验，通过实体映射的优势，我们采用了两个不同的关系型数据库，一个是H2一个是Mysql.

[Source Code](https://github.com/Q10Viking/learncode/tree/main/springboot/spring-boot-jpa-ddd)

## 配置

> application.yml

```yaml
spring:
  profiles:
    active: '@spring-boot.profiles.active@'
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true


logging:
  level:
    org.hibernate.sql: debug
    org.hibernate.type: trace
```

> application-mysql.yml

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
    hibernate:
      ddl-auto: create
    database-platform: org.hibernate.dialect.MySQL8Dialect

```



> application-h2.yml

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
    hibernate:
      ddl-auto: create
    database-platform: org.hibernate.dialect.H2Dialect

```



> pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.hzz</groupId>
    <artifactId>spring-boot-jpa-ddd</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <resource.delimiter>@</resource.delimiter>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!--SpringBoot的版本管理-->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>2.7.12</version>
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
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
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
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.7.12</version>
            </plugin>
        </plugins>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
            </resource>
        </resources>
    </build>
</project>
```



## 实体

> Student.java

```java
package org.hzz.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@Entity
@Table(name = "student")
public class Student {
    @Id
    @Column
    private String id;

    @Column
    private String name;

    @Column
    private String grade;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_hobbies", joinColumns = @JoinColumn(name = "student_id"))
    private Set<String> hobbies = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_book", joinColumns = @JoinColumn(name = "student_id"))
    private List<Book> books = new ArrayList<>();

    public void addBook(Book book) {
        books.add(book);
    }

    public void addHobby(String hobby) {
        hobbies.add(hobby);
    }
}

```

> Book.java

```java
package org.hzz.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Book {
    private String name;
    private String author;
}

```



## Repository

```java
package org.hzz.repository;

import org.hzz.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentCrudRepository extends JpaRepository<Student, String> {
}

```



## 测试

```java
@SpringBootApplication
@EnableJpaRepositories(basePackages = "org.hzz.repository")
@EntityScan(basePackages = "org.hzz.entity")
public class Application implements CommandLineRunner {
    @Value("${hzz.use}")
    private String databaseName;

    @Autowired
    private StudentCrudRepository studentCrudRepository;

    public static void main(String[] args) {
        SpringApplication.run(Application.class);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Hzz Use: " + databaseName);
        System.out.println("增加学生信息：");
        Student student = new Student();
        student.setId(UUID.randomUUID().toString());
        student.setName("hzz");
        student.setGrade("六年级");
        student.addBook(new Book("领域驱动设计", "Eric Evans"));
        student.addBook(new Book("Java编程思想", "Bruce Eckel"));
        student.addBook(new Book("Java并发编程实战", "Brian Goetz"));

        student.addHobby("篮球");
        student.addHobby("足球");
        student.addHobby("乒乓球");
        studentCrudRepository.save(student);
        System.out.println("查询所有学生信息：");
        studentCrudRepository.findAll().forEach(System.out::println);
    }
}
```



> controller rest api测试 [localhost:8080/student/findAll](http://localhost:8080/student/findAll)

```json
[
    {
        "id": "2990dbe2-ca21-405d-92ef-cf67ef329b90",
        "name": "hzz",
        "grade": "六年级",
        "hobbies": [
            "足球",
            "篮球",
            "乒乓球"
        ],
        "books": [
            {
                "name": "领域驱动设计",
                "author": "Eric Evans"
            },
            {
                "name": "Java编程思想",
                "author": "Bruce Eckel"
            },
            {
                "name": "Java并发编程实战",
                "author": "Brian Goetz"
            }
        ]
    }
]
```



### h2



![image-20230529011718001](/images/maven/image-20230529011718001.png)

[http://localhost:8080/h2-console](http://localhost:8080/h2-console)



![image-20230529011838779](/images/maven/image-20230529011838779.png)

![image-20230529011903372](/images/maven/image-20230529011903372.png)

![image-20230529011932618](/images/maven/image-20230529011932618.png)



### mysql

![image-20230529011420191](/images/maven/image-20230529011420191.png)

![image-20230529011623124](/images/maven/image-20230529011623124.png)

![image-20230529011557645](/images/maven/image-20230529011557645.png)



![image-20230529011652442](/images/maven/image-20230529011652442.png)



### 执行的sql

> 无论是mysql还是h2数据库，hibernate插入的sql都是一样的，本案例中插入学生与查询学生，展示的sql

```sql
-- 打印h2插入的sql
insert 
    into
        student
        (grade, name, id) 
    values
        (?, ?, ?)
-- 3本书分别插入了一次，一共三次
insert 
    into
        student_book
        (student_id, author, name) 
    values
        (?, ?, ?)
        
insert 
    into
        student_book
        (student_id, author, name) 
    values
        (?, ?, ?)
        
insert 
    into
        student_book
        (student_id, author, name) 
    values
        (?, ?, ?)

-- 3个hobby分别插入一次，一共三次
insert 
    into
        student_hobbies
        (student_id, hobbies) 
    values
        (?, ?)

insert 
    into
        student_hobbies
        (student_id, hobbies) 
    values
        (?, ?)
        
insert 
    into
        student_hobbies
        (student_id, hobbies) 
    values
        (?, ?)
-- 打印h2查询的sql,可以看到底层是没有使用join查询而是分批次
select
        student0_.id as id1_0_,
        student0_.grade as grade2_0_,
        student0_.name as name3_0_ 
    from
        student student0_
        

select
        hobbies0_.student_id as student_1_2_0_,
        hobbies0_.hobbies as hobbies2_2_0_ 
    from
        student_hobbies hobbies0_ 
    where
        hobbies0_.student_id=?
        
select
        books0_.student_id as student_1_1_0_,
        books0_.author as author2_1_0_,
        books0_.name as name3_1_0_ 
    from
        student_book books0_ 
    where
        books0_.student_id=?
```



## ddl-auto

```yaml
spring:
	jpa:
		show-sql: true
		hibernate:
			ddl-auto: create
```



- create：
  每次加载hibernate时都会删除上一次的生成的表，然后根据你的model类再重新来生成新表，哪怕两次没有任何改变也要这样执行，这就是导致数据库表数据丢失的一个重要原因。

- update

  最常用的属性，第一次加载hibernate时根据model类会自动建立起表的结构（前提是先建立好数据库），以后加载hibernate时根据 model类自动更新表结构，即使表结构改变了但表中的行仍然存在不会删除以前的行。要注意的是当部署到服务器后，表结构是不会被马上建立起来的，是要等 应用第一次运行起来后才会。



## 参考

[Spring Data JPA - Reference Documentation](https://docs.spring.io/spring-data/jpa/docs/2.7.12/reference/html/)

[Spring Boot JPA - Quick Guide (tutorialspoint.com)](https://www.tutorialspoint.com/spring_boot_jpa/spring_boot_jpa_quick_guide.htm)

[Domain-Driven Design Series' Articles - DEV Community](https://dev.to/peholmst/series/12780)

[Different Ways to Store JPA Entity Objects into a Database (javaguides.net)](https://www.javaguides.net/2018/12/different-ways-to-store-jpa-entity-objects-into-database.html)

❤️[JPA / Hibernate ElementCollection Example with Spring Boot | CalliCoder](https://www.callicoder.com/hibernate-spring-boot-jpa-element-collection-demo/)

### 日志

[Show Hibernate SQL with Parameter Values in Spring Boot (howtodoinjava.com)](https://howtodoinjava.com/spring-boot/spring-data-jpa-sql-logging/)

[Show Hibernate/JPA SQL Statements in Spring Boot | Baeldung](
