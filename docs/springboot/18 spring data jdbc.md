---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---



[Source Code](https://github.com/Q10Viking/learncode/tree/main/springboot/spring-data-jdbc-with-h2)

## 依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jdbc</artifactId>
</dependency>

<!-- 而不是 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```

![image-20230527004201865](/images/ddd/image-20230527004201865.png)



::: details

```xml
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
        <artifactId>spring-boot-starter-data-jdbc</artifactId>
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
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.18</version>
    </dependency>
</dependencies>
```

:::

## 使用H2作为内存数据库

::: tip

H2是Java开发的关系型数据，springboot集成了H2的自动配置类，对于开发测试很方便

:::

```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```



### 配置

```properties
# Enabling H2 Console
spring.h2.console.enabled=true

# Show all queries
logging.level.org.springframework.jdbc.core = trace

spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=sa
```



[http://localhost:8080/h2-console](http://localhost:8080/h2-console)

![image-20230527100253666](/images/ddd/image-20230527100253666.png)





## 使用spring data jdbc



### sql文件

::: tip

spring data jdbc会根据文件名`data.sql`和`schemal.sql`会执行sql语句

:::



> schema.sql

```java
create table student
(
    id              integer      not null,
    name            varchar(255) not null,
    passport_number varchar(255) not null,
    primary key (id)
);

create TABLE client
(
    id   INT auto_increment primary key,
    name VARCHAR(200)
);

create TABLE project
(
    id     INT auto_increment primary key,
    name   VARCHAR(200),
    client INTEGER
);
ALTER TABLE project
    ADD FOREIGN KEY (client) REFERENCES client (id);

```



> data.sql

```sql
insert into student values(10001,'hzz', 'E1234567');
insert into student values(10002,'Q10Viking', 'A1234568');
```



### 简单方式JdbcTemplate

```java
@Repository
public class StudentJdbcRepository {
    private JdbcTemplate jdbcTemplate;

    public StudentJdbcRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Student findById(Long id) {
        return jdbcTemplate.queryForObject("select * from student where id=?",
                new BeanPropertyRowMapper<>(Student.class), id);
    }
}
```



### 继承接口CrudRepository

::: tip

注意Spring Data中的Repository实现了DDD的方式

:::

```java
@Repository
public interface ClientRepository extends CrudRepository<Client, Integer> {
}
```

```java
@Table("CLIENT")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    @Id
    private int id;
    private String name;
    private Set<Project> projects = new HashSet<>();

    public void addProject(Project project){
        projects.add(project);
    }


}
```

```java
@Test
public void testAddClient() throws InterruptedException {
    Client client = new Client();
    client.setName("DDD-learning");
    client.addProject(new Project(1, "Java"));
    client.addProject(new Project(2, "GoLang"));
    clientRepository.save(client);
    clientRepository.findAll().forEach(System.out::println);
    // Client(id=1, name=DDD-learning, projects=[Project(id=1, name=Java), Project(id=2, name=GoLang)])
}
```



### 继承接口Repository

```java
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

@org.springframework.stereotype.Repository
public interface StuRepository  extends Repository<Student, Long> {
    Student findByName(String name);

    @Query("select * from student where name = :name")
    Student findStudentOnName(@Param("name") String name);
}
```



## 实体映射

```java
@Table("CLIENT")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    @Id
    private int id;
    private String name;
    private Set<Project> projects = new HashSet<>();

    public void addProject(Project project){
        projects.add(project);
    }
}
```

```java
@Table("PROJECT")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    private int id;
    private String name;
}
```



## 测试

```java
@SpringBootTest
public class ClientRepositoryTest {

    @Autowired
    private ClientRepository clientRepository;

    @Test
    public void testAddClient() throws InterruptedException {
        Client client = new Client();
        client.setName("DDD-learning");
        client.addProject(new Project(1, "Java"));
        client.addProject(new Project(2, "GoLang"));
        clientRepository.save(client);
        clientRepository.findAll().forEach(System.out::println);
        // Client(id=1, name=DDD-learning, projects=[Project(id=1, name=Java), Project(id=2, name=GoLang)])
    }
}
```

### 执行的sql

```sql
INSERT INTO "CLIENT" ("NAME") VALUES (?)
INSERT INTO "PROJECT" ("CLIENT", "ID", "NAME") VALUES (?, ?, ?)
INSERT INTO "PROJECT" ("CLIENT", "ID", "NAME") VALUES (?, ?, ?)
```



## 参考

[Spring Data JDBC - Reference Documentation](https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.repositories)

[Integrating Spring Boot and Spring JDBC with H2 and Starter JDBC | Spring Boot Tutorial](https://www.springboottutorial.com/spring-boot-and-spring-jdbc-with-h2)

[Spring Data JDBC: Implementing Domain Driven Design Aggregate | by Tahir Naqash | Medium](https://medium.com/@techphile/spring-data-jdbc-implementing-domain-driven-design-aggregate-4d6bac13c728)

[领域设计：聚合与聚合根 (qq.com)](https://mp.weixin.qq.com/s?__biz=MzA4MjQ1ODIzMA==&mid=504716494&idx=1&sn=5e1616b133730e9b8c4e6008bad06947&chksm=04649fd7331316c16fac4e20b63396c766ffb7b6e81b3193cfa91f129deb971ecfce88afc78c#rd)



### 日志

[Show Hibernate SQL with Parameter Values in Spring Boot (howtodoinjava.com)](https://howtodoinjava.com/spring-boot/spring-data-jpa-sql-logging/)

[Show Hibernate/JPA SQL Statements in Spring Boot | Baeldung](https://www.baeldung.com/sql-logging-spring-boot)
