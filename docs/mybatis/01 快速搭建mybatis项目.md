---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /mybatis/
typora-root-url: ..\.vuepress\public
---



## IDEA搭建工程

::: tip

使用maven的方式搭建

:::

[Source Code - 01 mybatis start](https://github.com/Q10Viking/learncode/tree/main/mybatis/01_mybatis_start)

## jar包依赖

::: tip

:one: mybatis

:two: mysql driver

:::

::: details 点击查看poml.xml

```xml {18-28}
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xmlns="http://maven.apache.org/POM/4.0.0"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.hzz</groupId>
    <artifactId>quick start</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <dependencies>
        <!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.7</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.27</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/junit/junit -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```

:::

## 配置文件

::: tip

:one: xml配置文件

:two: xml mapper 映射文件

::: 

### mybatis-config.xml配置

::: tip

配置文件 直接复制 [mybatis – MyBatis 3 | 入门](https://mybatis.org/mybatis-3/zh/getting-started.html) SqlSessionFactory的配置

:::

::: details mybatis-config.xml

```xml {6-7,20}
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <properties resource="db-config.properties">
    </properties>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>
    <mappers>
        <mapper resource="org/hzz/mapper/EmpMapper.xml"/>
    </mappers>
</configuration>
```

:::

### 数据库db-config.properties配置

::: tip

将数据库的信息独立出来配置，然后再在mybatis的配置文件中引入

:::

::: details db-config.properties

```properties
driver = com.mysql.cj.jdbc.Driver
url = jdbc:mysql://192.168.187.135:3306/learn_mybatis
username = root
password = Root.123456
```

::: 



## 创建实体类

::: tip

mybatis中一张表对应一个实体+一个mapper

:::



::: details Emp.java

```java
package org.hzz.pojo;

public class Emp {
    private Integer id;
    private String username;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String toString() {
        return "Emp{" +
                "id=" + id +
                ", username='" + username + '\'' +
                '}';
    }
}

```

:::



## 配置Mapper.xml

::: tip

映射接口的sql操作配置 配置文件 直接复制 [mybatis – MyBatis 3 | 入门](https://mybatis.org/mybatis-3/zh/getting-started.html)

::: details EmpMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="org.hzz.mapper.EmpMapper">

    <select id="selectEmp" resultType="org.hzz.pojo.Emp">
        select *
        from emp
        where id = #{id}
    </select>
    <insert id="insertEmp">
        insert
        into emp(username) values(
        #{username}
        )
    </insert>

    <update id="updateEmp">
        update emp
        set username=#{username}
        where id = #{id}
    </update>

    <delete id="deleteEmp">
        delete
        from emp
        where id = #{id}
    </delete>
</mapper>
```

在mybatis-config.xml中引入

```xml
<mappers>
    <mapper resource="EmpMapper.xml"/>
    <!--        <mapper resource="org/hzz/mapper/EmpMapper.xml"/>-->
</mappers>
```



:::

## 测试-ibatis原始的方式

::: tip

使用ibatis最原始的方法，statement id来进行查询

:::

::: details FirstTest.java

```java {30,39,50,58}
package org.hzz;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.hzz.pojo.Emp;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;

/**
 * @Author 静默
 * @Email 1193094618@qq.com
 */
public class FirstTest {
        private static final String configFile = "mybatis-config.xml";
        private SqlSessionFactory sqlSessionFactory;

    @Before
    public void before() throws IOException {
        InputStream in = Resources.getResourceAsStream(configFile);
        sqlSessionFactory = new SqlSessionFactoryBuilder().build(in);
    }
    @Test
    public void selectTest(){
        try(SqlSession sqlSession = sqlSessionFactory.openSession()){
            Emp emp = (Emp) sqlSession.selectOne("org.hzz.mapper.EmpMapper.selectEmp",1);
            System.out.println(emp);
        }
    }
    @Test
    public void insertTest(){
        try(SqlSession session = sqlSessionFactory.openSession(true)){
            Emp emp = new Emp();
            emp.setUsername("hzz");
            // 在mapper中能够#{username}获取出来
            Integer r = (Integer)session.insert("org.hzz.mapper.EmpMapper.insertEmp",emp);
            System.out.println(r);
        }
    }

    @Test
    public void updateTest(){
        try(SqlSession session = sqlSessionFactory.openSession(true)){
            Emp emp = new Emp();
            emp.setId(2);
            emp.setUsername("hzz01");
            Integer r = (Integer)session.insert("org.hzz.mapper.EmpMapper.updateEmp",emp);
            System.out.println(r);
        }
    }

    @Test
    public void deleteTest(){
        try(SqlSession session = sqlSessionFactory.openSession(true)){
            Integer r = (Integer)session.insert("org.hzz.mapper.EmpMapper.deleteEmp",2);
            System.out.println(r);
        }
    }

}

```

:::



## 项目结构

![image-20220807121110687](/images/mybatis/image-20220807121110687.png)

## 测试的数据库

![image-20220807115451388](/images/mybatis/image-20220807115451388.png)



## 使用接口绑定方式⭐

::: tip

使得配置xml形式，更加在Java层面体现。如在java代码中操作数据的方式，以及在mybatis-config配置mappers时可以直接使用接口来声明

:::

上面的测试，使用的是ibatis最原始的方式，但是在项目开发的过程中，使用接口绑定的方式更加常见。

从而也可以看出mapper.xml文件与接口并不是强依赖的。只不过接口是xml文件的更加Java代码形式。但是要将接口和xml绑定起来，那么就需要注意一下的操作

1. 在xml中namespace id指定位接口的权限命名。id为具体的方法。
2. mapper.xml的文件命名和接口命名一样。（命名一样是规范，主要是为了在配置mappers时，使用接口方式的配置，能够找到对应的mapper.xml），并在相同的包下。
3. 并且在mybatis-config.xml配置文件中指定接口（如果想以接口配置的话）

```xml
<mappers>
    <!--   接口绑定方式找到mapper.xml的两种方式     -->
    <!--        <mapper resource="org/hzz/mapper/EmpMapper.xml"/>-->
    <mapper class="org.hzz.mapper.EmpMapper"/>
</mappers>
```



### 创建接口

::: details EmpMapper.java

```java
package org.hzz.mapper;

import org.hzz.pojo.Emp;

/**
 * @Author 静默
 * @Email 1193094618@qq.com
 */
public interface EmpMapper {
    Emp selectEmp(Integer id);

    Integer insertEmp(Emp emp);

    Integer updateEmp(Emp emp);

    Integer deleteEmp(Integer id);
}

```

:::

### EmpMapper.xml文件移动

**需要将xml文件和接口处于同一个包名下**，否则会报错

```sh
org.apache.ibatis.binding.BindingException: Invalid bound statement (not found): org.hzz.mapper.EmpMapper.selectEmp
```



### 测试

```java
public class SecondTest {
    private static final String configFile = "mybatis-config.xml";
    private SqlSessionFactory sqlSessionFactory;

    @Before
    public void before() throws IOException {
        InputStream in = Resources.getResourceAsStream(configFile);
        sqlSessionFactory = new SqlSessionFactoryBuilder().build(in);
    }

    @Test
    public void selectTest(){
        try(SqlSession sqlSession = sqlSessionFactory.openSession()){
            EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);
            Emp emp = mapper.selectEmp(1);
            System.out.println(emp);
        }
    }
}
```

### 项目结构

![image-20220807123523793](/images/mybatis/image-20220807123523793.png)

