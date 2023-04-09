---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---

## 1. 简介

SpringBoot 最强大的功能就是把我们常用的场景抽取成了一个个starter（场景启动器），我们通过引入springboot 为我提供的这些场景启动器，我们再进行少量的配置就能使用相应的功能。即使是这样，springboot也不能囊括我们所有的使用场景，往往我们需要自定义starter，来简化我们对springboot的使用。



## 2. 如何自定义starter



<img src="/images/springboot/14510.pmg" alt="img" style="zoom:50%;" />

- 启动器（starter）是一个空的jar文件，仅仅提供辅助性依赖管理，这些依赖可能用于自动装配或其他类库。
- 需要专门写一个类似spring-boot-autoconfigure的配置模块
- 用的时候只需要引入启动器starter，就可以使用自动配置了

### 命名规范

#### 官方命名空间

- 前缀：spring-boot-starter-
- 模式：spring-boot-starter-模块名
- 举例：spring-boot-starter-web、spring-boot-starter-jdbc

#### 自定义命名空间

- 后缀：-spring-boot-starter
- 模式：模块-spring-boot-starter
- 举例：mybatis-spring-boot-starter



## **自定义starter实例**

1. @Condition注解
2. @EnableConfigurationProperties
3. @ConfigurationProperties

### 父工程learn-springboot-starter

我们需要先创建一个父maven项目: learn-springboot-starter，用于管理

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.6.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <groupId>org.hzz</groupId>
    <artifactId>learn-springboot-starter</artifactId>
    <version>1.0-SNAPSHOT</version>

    <modules>
        <module>hzz-spring-boot-starter</module>
        <module>hzz-spring-boot-autoconfigurer</module>
    </modules>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <packaging>pom</packaging>

</project>
```



### hzz-spring-boot-starter

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>learn-springboot-starter</artifactId>
        <groupId>org.hzz</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>
    <version>0.0.1-SNAPSHOT</version>
    <groupId>org.hzz</groupId>
    <artifactId>hzz-spring-boot-starter</artifactId>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <description>
        启动器（starter）是一个空的jar文件，
        仅仅提供辅助性依赖管理，
        这些依赖需要自动装配或其他类库。
    </description>
    
    <dependencies>
        <dependency>
            <groupId>org.hzz</groupId>
            <artifactId>hzz-spring-boot-autoconfigurer</artifactId>
            <version>0.0.1-SNAPSHOT</version>
        </dependency>
    </dependencies>

</project>
```

### hzz-spring-boot-autoconfigurer

1. 定义的包名不要和待会要测试的项目名一样，不然就是直接包扫描了
2. 主要是自动配置类
3. spring.factories

#### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.hzz</groupId>
        <artifactId>learn-springboot-starter</artifactId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <groupId>org.hzz</groupId>
    <artifactId>hzz-spring-boot-autoconfigurer</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>hzz-spring-boot-autoconfigurer</name>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- 会生成META-INF 元数据  用于提供idea自动提示配置文件的 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <!-- 依赖不会传播 -->
            <optional>true</optional>
        </dependency>
    </dependencies>
</project>
```



#### 自动配置类HelloAutoConfiguration

```java
@Configuration
@ConditionalOnProperty("hzz.hello.name")  // 项目配置了这个属性，该类HelloAutoConfiguration才注入到容器
@EnableConfigurationProperties(HelloProperties.class)   //  是的配置类HelloProperties 生效（即注入到容器中）这样写关系明确
public class HelloAutoConfiguration {
    @Autowired
    private HelloProperties helloProperties;

    @Bean
    public HelloController helloController(){
        return new HelloController(helloProperties);
    }

}

```

#### 绑定配置类HelloProperties

```java
@ConfigurationProperties("hzz.hello")	//	全量注册属性
public class HelloProperties {
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

为了使得yml配置的时候，有提示引入了依赖

```xml
<!-- 会生成META-INF 元数据  用于提供idea自动提示配置文件的 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <!-- 依赖不会传播 -->
    <optional>true</optional>
</dependency>
```

#### 要注入的bean：HelloController

```java
@RestController
public class HelloController {
    private HelloProperties helloProperties;

    public HelloController(HelloProperties helloProperties) {
        this.helloProperties = helloProperties;
    }

    @GetMapping("/")
    public String hello(){
        return "欢迎您："+helloProperties.getName();
    }
}

```

#### spring.factories

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
   org.hzz.HelloAutoConfiguration
```



## 安装成本地jar包

1. 由于是父工程管理的，先打包父工程

<img src="/../../../../saas-yong/fullstack/Java架构师之路/SpringBoot/imgs/image-20210820163719969.png" alt="image-20210820163719969" style="zoom:67%;" />



## 测试项目

<img src="/../../../../saas-yong/fullstack/Java架构师之路/SpringBoot/imgs/image-20210820164700448.png" alt="image-20210820164700448" style="zoom:67%;" />

1. 自己新建一个SpringBoot项目

2. 该项目中只有一个类

   ```xml
   @SpringBootApplication
   public class TestSpringbootStarterApplication {
   
       public static void main(String[] args) {
         SpringApplication.run(TestSpringbootStarterApplication.class, args);
       }
   
   }
   ```

3. 引入我们自定义的场景启动器，那么我们项目就会有场景启动器定义的HelloController了（前提是满足@Condition条件）

   ```xml
   <dependency>
       <groupId>org.hzz</groupId>
       <artifactId>hzz-spring-boot-starter</artifactId>
       <version>0.0.1-SNAPSHOT</version>
   </dependency>
   ```

4. 使得HelloController生效，注入到容器中，需要配置我们之前定义的属性条件

   ```properties
   hzz.hello.name=Q10Viking
   debug=true		# 查看测试
   ```

可以看到项目引入了我们自动配置类

```sh
   HelloAutoConfiguration matched:
      - @ConditionalOnProperty (hzz.hello.name) matched (OnPropertyCondition)
```

![image-20210820165311004](/../../.vuepress/public/images/springboot/image-20210820165311004.png)