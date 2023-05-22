---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---



[Source Code](https://github.com/Q10Viking/learncode/tree/main/ddd/multi-layers)

## 背景

> API文档，之前使用的[springfox/springfox: Automated JSON API documentation for API's built with Spring (github.com)](https://github.com/springfox/springfox)目前在github上最新的更新时间已经是三年前了

![image-20230522113301607](/images/springboot/image-20230522113301607.png)



> 目前[OpenAPI 3 Library for spring-boot  springdoc](https://springdoc.org/)我观察项目很活跃



## 依赖

> 基本上引入依赖，就能访问Swagger UI界面：`http://server:port/context-path/swagger-ui.html`，并且能看到Controller的入口

```xml
<properties>
    <springdoc.version>1.7.0</springdoc.version>
</properties>

<dependencyManagement>
    <!-- OpenAPI 3 -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi</artifactId>
        <version>${springdoc.version}</version>
        <type>pom</type>
        <scope>import</scope>
    </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-ui</artifactId>
    </dependency>
</dependencies>
```





## 额外信息配置

![image-20230522135222296](/images/springboot/image-20230522135222296.png)

```java

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppSpringdocConfig {

    @Bean
    public OpenAPI applicationOpenApi() {
        Info info = new Info()
                .title("分层架构模型")
                .description("springboot+mybatis-plus+swagger3")
                .version("1.0.0")
                .license(new License().name("Apache 2.0").url("https://q10viking.github.io"))
                .contact(new Contact().name("q10viking").email("1193094618@qq.com"));
        return new OpenAPI()
                .info(info);
    }
}
```



## 常用注解

[OpenAPI规范](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md)

### @Tag

一般用在用在类上

```java
@RestController
@RequestMapping("/user")
@Tag(name = "用户管理",description = "用户管理(增删改查)",
        externalDocs = @ExternalDocumentation(url = "https://q10viking.github.io",description = "我的博客"))
public class UserController {
}
```

![image-20230522152028202](/images/springboot/image-20230522152028202.png)



### @Operation

方法描述

```java
@Operation(summary = "查询用户信息",description = "根据用户id查询用户信息")
@GetMapping("/queryById")
default Result<UserVO> queryById(
    @Valid @NotNull @RequestParam(name="userid",required = false)
    Long userId){
    throw new NotImplementedException("接口未实现");
}
```

![image-20230522190936620](/images/springboot/image-20230522190936620.png)





## open api

[OpenAPI Specification - Version 3.0.3 | Swagger](https://swagger.io/specification/)

> An OpenAPI definition can then be used by **documentation generation tools to display the API**, **code generation tools** to generate servers and clients in various programming languages, testing tools, and many other use cases.







## 参考

[OpenAPI规范](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md)

[OpenAPI 3 Library for spring-boot  springdoc](https://springdoc.org/)



