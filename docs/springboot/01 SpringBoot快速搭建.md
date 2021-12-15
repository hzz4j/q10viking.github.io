::: tip

从官网下载 [Spring Initializr](https://start.spring.io/)

:::

## springboot工程约定

![8821](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112151249225.jpg)

## Application启动类

1. ComponentScan没有配置basePackage,那么是怎么扫描bean的呢？
   1. 在Spring底层解析ComponentScan时，读取basePackage,如果没有读取到，会将当前配置类所在的包当作扫描包
2. 所以主类最好放在需要扫描包的根目录

```java
/**
 *  @SpringBootApplication 来标注一个主程序类，说明这是一个Spring Boot应用
    自动装配就是从这里开始的
 */
@SpringBootApplication
public class Application {
 
    public static void main(String[] args) {
 
        // Spring应用启动起来
        SpringApplication.run(Application.class,args);
    }
}
```



## 配置文件

::: tip

约定大于配置

名字必须为`application`,文件后缀可以时`.properties .yml`

:::

**具体怎么灵活的配置，需要掌握自动配置的原理**，这样不需要死记硬背



## SpringBoot POM文件

1. maven父项目，继承父mave项目中所有的配置信息

   1. 在spring-boot-starter-parent项目中又引入了父项目spring-boot-dependencies
   2. spring-boot-dependencies（**版本仲裁中心**）帮我们管理了SpringBoot应用中所有的依赖版本，以后我们导入已有的依赖就不需要写版本号了，它帮我们解决了第三方库的版本冲突问题。

2. starter**场景启动器**，不同的场景启动器维护了所对应的所有依赖，从而简化maven文件书写

3. 插件spring-boot-maven-plugin，只有加上了这个插件只有加了这个插件 当运行 java -jar xxxx.jar 才能正常启动

   

```xml
<!--继承springboot的父项目-->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.3.5.RELEASE</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>

<dependencies>
    <!--引入springboot的web支持-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>

<!--部署springboot的插件， 只有加了这个插件 当运行 java -jar xxxx.jar 才能正常启动-->
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```


