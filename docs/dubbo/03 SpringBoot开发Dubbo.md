---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



[Source Code](https://github.com/Q10Viking/learncode/tree/main/dubbo/dubbo-springboot-demo)



## 依赖

> 父工程

::: details

```xml
<properties>
    <dubbo.version>3.2.0</dubbo.version>
    <spring-boot.version>2.7.8</spring-boot.version>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>

<dependencyManagement>
    <dependencies>
        <!-- Spring Boot -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>${spring-boot.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>

        <dependency>
            <groupId>org.apache.dubbo</groupId>
            <artifactId>dubbo-bom</artifactId>
            <version>${dubbo.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>

        <dependency>
            <groupId>org.apache.dubbo</groupId>
            <artifactId>dubbo-dependencies-zookeeper-curator5</artifactId>
            <version>${dubbo.version}</version>
            <type>pom</type>
        </dependency>
    </dependencies>
</dependencyManagement>
```

:::

> 子工程

::: details

```xml
<dependencies>
        <dependency>
            <groupId>org.hzz</groupId>
            <artifactId>interface</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>
        <!-- spring boot starter -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
            <exclusions>
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-logging</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <!-- dubbo -->
        <dependency>
            <groupId>org.apache.dubbo</groupId>
            <artifactId>dubbo-spring-boot-starter</artifactId>
        </dependency>

        <dependency>
            <groupId>org.apache.dubbo</groupId>
            <artifactId>dubbo-dependencies-zookeeper-curator5</artifactId>
            <type>pom</type>
            <exclusions>
                <exclusion>
                    <artifactId>slf4j-reload4j</artifactId>
                    <groupId>org.slf4j</groupId>
                </exclusion>
                <exclusion>
                    <groupId>org.apache.zookeeper</groupId>
                    <artifactId>zookeeper</artifactId>
                </exclusion>
            </exclusions>
        </dependency>

        <dependency>
            <groupId>org.apache.zookeeper</groupId>
            <artifactId>zookeeper</artifactId>
            <version>3.7.1</version>
        </dependency>


        <!--  slf4j 门面      -->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>1.7.30</version>
        </dependency>

        <!--  log4j2的实现      -->
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-api</artifactId>
            <version>2.17.1</version>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>2.17.1</version>
        </dependency>

        <!-- 桥接器 -->
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-slf4j-impl</artifactId>
            <version>2.17.1</version>
        </dependency>
    </dependencies>
```

:::

## 定义服务接口

```java
public interface DemoService {
    String sayHello(String name);
}
```



## 定义服务端的实现

> 注：在`DemoServiceImpl` 类中添加了 `@DubboService` 注解，通过这个配置可以基于 Spring Boot 去发布 Dubbo 服务

```java
@DubboService
public class DemoServiceImpl implements DemoService {
    @Override
    public String sayHello(String name) {
        return "Hello " + name + "(Hello World)";
    }
}
```

### 配置服务端 Yaml 配置文件

```yaml
dubbo:
  application:
    name: dubbo-springboot-demo-provider
  protocol:
    name: dubbo
    port: -1
  registry:
    address: zookeeper://${zookeeper.address:172.29.96.105}:2181
```

### 基于 Spring 配置服务端启动类

除了配置 Yaml 配置文件之外，我们还需要创建基于 Spring Boot 的启动类。

首先，我们先创建服务端的启动类。

```java
@SpringBootApplication
@EnableDubbo
public class ProviderApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProviderApplication.class, args);
    }
}
```

> 在这个启动类中，配置了一个 `ProviderApplication` 去读取我们前面定义的 `application.yml` 配置文件并启动应用





## 消费端

### 配置消费端 YAML 配置文件

```yaml
dubbo:
  application:
    name: dubbo-springboot-demo-consumer
  protocol:
    name: dubbo
    port: -1
  registry:
    address: zookeeper://${zookeeper.address:172.29.96.105}:2181
```

### 基于 Spring 配置消费端启动类

```java
@SpringBootApplication
@EnableDubbo
public class ConsumerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConsumerApplication.class, args);
    }
}
```



### 配置消费端请求任务

> 为了测试方便，使用 Spring Boot 模式下的基于 `CommandLineRunner`去创建
>
> 通过`@DubboReference` 从 Dubbo 获取了一个 RPC 订阅，这个 `demoService` 可以像本地调用一样直接调用。

```java
@Component
public class Task implements CommandLineRunner {

    @DubboReference
    private DemoService demoService;
    @Override
    public void run(String... args) throws Exception {
        String result = demoService.sayHello("world");
        System.out.println("Receive result ======> " + result);

        new Thread(()-> {
            while (true) {
                try {
                    Thread.sleep(1000);
                    System.out.println(new Date() + " Receive result ======> "
                            + demoService.sayHello("Q10Viking"));
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    Thread.currentThread().interrupt();
                }
            }
        }).start();
    }
}
```





## 启动

> 启动服务端，出现`[Dubbo] Current Spring Boot Application is await...`,表示成功

![image-20230509001241637](/images/dubbo/image-20230509001241637.png)



> 接着启动消费端：可以看到不断获取到了调用结果

![image-20230509001411630](/images/dubbo/image-20230509001411630.png)





## 小结

> 对比直接使用dubbo api，结合springboot，我们省去了服务的导入和导出的细枝末节。主要涉及者三个注解

- **@EnableDubbo**
- **@DubboReference**
- **@DubboService**



## zk存储的信息

![image-20230509001924379](/images/dubbo/image-20230509001924379.png)

## 参考

[3 - Dubbo x Spring Boot 开发微服务应用 | Apache Dubbo](https://cn.dubbo.apache.org/zh-cn/overview/quickstart/java/spring-boot/)

