---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /maven/
typora-root-url: ..\.vuepress\public
---





## 背景

::: tip

根据不同的配置文件激活使用不同的数据库。默认的激活的是mysql

:::

[Source Code](https://github.com/Q10Viking/learncode/tree/main/maven/spring-boot-profile-demo)

![image-20230528153116403](/images/maven/image-20230528153116403.png)

```xml
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
```



## 配置

spring中的profile和maven的profile还是有些区别的，要想上面的配置生效，还需要一下配置

### 默认配置application.yml

> `spring-boot.profiles.active` 对应profile中property,用于替换maven pom.xml中的值

```yaml
spring:
  profiles:
    active: '@spring-boot.profiles.active@'
```

> 资源符号`@`生效

```xml
<properties>
    <resource.delimiter>@</resource.delimiter>
</properties>

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
```



### 完整的pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.hzz</groupId>
    <artifactId>spring-boot-profile-demo</artifactId>
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
            <artifactId>spring-boot-starter-web</artifactId>
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



## 测试

通过`spring-boot-maven-plugin`插件



### Bug

```sh
# 经过很多测试发现这种方式很多都是失效的
mvn spring-boot:run -Dspring-boot.run.profiles=h2
#对应在pom.xml的配置
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <profiles>
        	<profile>h2</profile>
        </profiles>
    </configuration>
</plugin>

# 还是采用maven比较舒服
mvn spring-boot:run -Ph2
```



> 在idea中直接运行项目，激活的是mysql

```sql
The following 1 profile is active: "mysql"
```

> 指定使用profile

```sql
mvn spring-boot:run -Ph2

The following 1 profile is active: "h2"
```

---------



```sh
mvn spring-boot:run -Pmysql

The following 1 profile is active: "mysql"
```



在IDEA中也可以直接勾选需要激活的profile

![image-20230528230247933](/images/maven/image-20230528230247933.png)



## 小结

> the most important profiles-related feature that Spring Boot brings is **profile-specific properties files.** These have to be named in the format *application-{profile}.properties*.
>
> Spring Boot will automatically load the properties in an *application.properties* file for all profiles and the ones in profile-specific *.properties* files only for the specified profile.

```java
application.yml
application-h2.yml
application-mysql.yml
```

springboot最先激活的文件是默认文件

如果激活的是mysql

```sh
mvn spring-boot:run -Dspring-boot.profiles.active=mysql
```

那么加入默认的配置文件`application.yml`，然后是`application-mysql.yml`.配置会覆盖。



## 参考

[Activating Spring Boot profile with Maven profile | Dev in Web (dolszewski.com)](http://dolszewski.com/spring/spring-boot-properties-per-maven-profile/)

[Spring Boot Maven Plugin Documentation](https://docs.spring.io/spring-boot/docs/2.7.12/maven-plugin/reference/htmlsingle/#using.overriding-command-line)

[maven - Using Spring Boot profiles with command line arguments - Stack Overflow](https://stackoverflow.com/questions/58641770/using-spring-boot-profiles-with-command-line-arguments)

[How to configure Profiles in Spring Boot - DEV Community](https://dev.to/mhdzaid/how-to-configure-profiles-in-spring-boot-16jo)





--------------



