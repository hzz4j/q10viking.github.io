---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /SpringCloud/
typora-root-url: ..\.vuepress\public
---



[基础环境搭建-Source Code](https://github.com/Q10Viking/springcloudalibaba/tree/main/01-learn-spring-cloud-alibaba)

## 版本关系

[版本说明](https://github.com/alibaba/spring-cloud-alibaba/wiki/%E7%89%88%E6%9C%AC%E8%AF%B4%E6%98%8E) 最新的版本选择： 

```java
// spring cloud 版本变化比较快，当前学习时间我们使用的版本
Spring Cloud Alibaba:2.2.6.RELEASE
Spring Boot :2.3.2.RELEASE
Spring Cloud:Hoxton.SR9
```

<img src="/images/springcloud/image-20210722144909439.png" alt="image-20210821180228734"  />

### SpringCloudAlibaba组件版本

<img src="/images/springcloud/image-20210821180319812.png" alt="image-20210821180319812" />



## IDEA创建项目

### 父项目

1. 建立为springboot项目（parent）
2. 版本管理dependencyManagement
   1. springcloud与springcloudAlibaba

#### maven

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.hzz</groupId>
    <artifactId>learn-spring-cloud-alibaba</artifactId>
    <version>1.0-SNAPSHOT</version>
    <description>
        微服务父项目
        1. 建立为springboot项目（parent）
        2. 版本管理dependencyManagement
            1. springcloud与springcloudAlibaba与springboot 相当于parent
    </description>

    <!-- 子项目   -->
    <modules>
        <module>mall-user</module>
        <module>mall-order</module>
        <module>mall-common</module>
    </modules>
    <!-- 打包方式为pom   -->
    <packaging>pom</packaging>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <!--   springcloud版本的统一管理     -->
        <spring.boot.version>2.3.2.RELEASE</spring.boot.version>
        <spring.cloud.version>Hoxton.SR9</spring.cloud.version>
        <spring.cloud.alibaba.version>2.2.6.RELEASE</spring.cloud.alibaba.version>
    </properties>


    <dependencyManagement>
        <dependencies>
            <!--Spring Cloud的版本管理-->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring.cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!--Spring Cloud alibaba的版本管理-->
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <version>${spring.cloud.alibaba.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!--SpringBoot的版本管理-->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-parent</artifactId>
                <version>${spring.boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>


    <dependencies>
        <!-- springboot场景启动器 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <!-- spring打包插件 添加版本防止报错   -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${spring.boot.version}</version>
            </plugin>
        </plugins>
    </build>
</project>
```

#### maven中parent的问题

```xml
<!-- parent中指定的version不能用properties配置的形式，而是直接指定版本，否则项目会有问题 -->
<!-- 错误的方式 -->
<properties>
    <!--   springcloud版本的统一管理     -->
    <spring.boot.version>2.3.2.RELEASE</spring.boot.version>
</properties>
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>${spring.boot.version}</version>
</parent>

<!-- 正确的方式 -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.3.2.RELEASE</version>
</parent>
```



#### 指定多个parent的方式

1. 这样不仅能够充分使用${properties}的方式，还能配置多个parent

```xml
<dependencyManagement>
    <dependencies>
        <!--Spring Cloud的版本管理-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring.cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <!--Spring Cloud alibaba的版本管理-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>${spring.cloud.alibaba.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <!--SpringBoot的版本管理-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-parent</artifactId>
            <version>${spring.boot.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```



#### plugin maven报错

```xml
    <!-- spring打包插件 添加版本防止报错   -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${spring.boot.version}</version>
            </plugin>
        </plugins>
    </build>
```



### 子项目

#### mall-common(公共)

一般创建一个公共的common子项目，让其他子项目共享一些类和maven配置（如依赖springboot-web，每个子项目都是一个web项目，所以在公共项目配置，其他子项目依赖这个common子项目，就不需要再配置了）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>learn-spring-cloud-alibaba</artifactId>
        <groupId>org.hzz</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>mall-common</artifactId>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
</project>
```

##### 公共类

用于接口统一返回的处理

```java
public class R extends HashMap<String, Object> {
    public R(){
        put("code",0);
        put("msg","success");
    }

    public static R ok(String msg) {
        R r = new R();
        r.put("msg", msg);
        return r;
    }
}

```



#### mall-user

就是子项目开发具体依赖的包，如springCloudAlibaba的相关组件，nacos-discovery等，还有引入公共的common依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>learn-spring-cloud-alibaba</artifactId>
        <groupId>org.hzz</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>mall-user</artifactId>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <dependencies>
        <!-- 引入公共的common依赖 -->
        <dependency>
            <groupId>org.hzz</groupId>
            <artifactId>mall-common</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>
    </dependencies>

</project>
```



### 流程小结

1. 创建子项目mall-common
   1. 包含公共的依赖如spring-boot-starter=web
2. 创建子项目mall-user
   1. application.yml 指定端口
   2. 配置RestTemple来调用其他的应用mall-order
   3. 引入mall-common的依赖

## IDEA微服务

IDEA显示多个服务的启动

<img src="/images/springcloud/image-20210722150034933.png" alt="image-20210722150034933" />

<img src="/images/springcloud/image-20210722150152163.png" alt="image-20210722150152163" />

<img src="/images/springcloud/image-20210821201253713.png" alt="image-20210821201253713" />

