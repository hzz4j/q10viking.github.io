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
>
> OpenAPI 描述json.`http://server:port/context-path/v3/api-docs`这个我们在后面集成ReDoc的时候有用

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



### @ApiResponse👍

> 使用@ApiResponse的时候不要使用content,让swagger-ui自己去识别。因为我们返回的Result是一个泛型，而java不允许我们使用`Result<UserVo>.class`的形式

```java
@Operation(summary = "查询用户信息", description = "根据用户id查询用户信息")
    @ApiResponse(responseCode = "200", description = "查询成功"
            , content = {@Content(mediaType = "application/json", schema = @Schema(implementation = Result.class))
    })
    @GetMapping("/queryById")
    default Result<UserVO> queryById(
            @Valid @NotNull @RequestParam(name="userid",required = false)
            Long userId){
        throw new NotImplementedException("接口未实现");
    }
```

::: tip

正确使用的方式

:::

```java
@Operation(summary = "查询用户信息", description = "根据用户id查询用户信息")
@ApiResponse(responseCode = "200", description = "查询成功")
@GetMapping("/queryById")
default Result<UserVO> queryById(
    @Valid @NotNull @RequestParam(name="userid",required = false)
    Long userId){
    throw new NotImplementedException("接口未实现");
}


@Data
public class Result<T>  {

    @Schema(description = "返回码",example = "200")
    @JSONField(ordinal = 0)
    private String code;

    @Schema(description = "返回信息",example = "success")
    @JSONField(ordinal = 1)
    private String msg;

    @Schema(description = "返回数据")
    @JSONField(ordinal = 2)
    private T data;
}

@Data
public class UserVO {

    @Schema(description = "用户名",example = "q10viking",title = "用户名t")
    private String name;

    @Schema(description = "密码",example = "123456")
    private String password;
}


```

> swagger-ui的显示

![image-20230522215545732](/images/springboot/image-20230522215545732.png)

> ReDoc的显示

![image-20230522220125965](/images/springboot/image-20230522220125965.png)





### @Schema

```java
@Data
public class UserVO {

    @Schema(description = "用户名",example = "q10viking")
    private String name;

    @Schema(description = "密码",example = "123456")
    private String password;
}
```

![image-20230522231851264](/images/springboot/image-20230522231851264.png)



### @Parameter

> example有精度丢失问题
>
> ```java
> @Operation(summary = "查询用户信息", description = "根据用户id查询用户信息")
>     @ApiResponse(responseCode = "200", description = "查询成功"
>             /**, content = {@Content(mediaType = "application/json", schema = @Schema(implementation = Result.class))
>     }*/)
>     @GetMapping("/queryById")
>     default Result<UserVO> queryById(
>             @Parameter(description = "用户id",required = true,example = "1220708537638920191")
>             @Valid @NotNull @RequestParam(name="userid",required = true)
>             String userId){
>         throw new NotImplementedException("接口未实现");
>     }
> ```
>
> 

![image-20230523004752406](/images/springboot/image-20230523004752406.png)



```java
@Operation(summary = "保存用户信息", description = "保存用户信息到数据库")
@ApiResponse(responseCode = "200", description = "保存成功"
             , content = {@Content(mediaType = "application/json")})
@PostMapping("/save")
default  Result<String> save(
    @Parameter(description = "用户信息",required = true)
    @Valid @RequestBody UserDTO userDTO) {
    throw new NotImplementedException("接口未实现");
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    @Schema(description = "用户id",example = "1220708537638920191")
    private Long id;

    @Schema(description = "用户名",example = "Q10Viking")
    @NotBlank(message = "用户名不能为空")
    private String username;

    @Schema(description = "用户密码",example = "123456")
    private String password;

    @Schema(description = "用户年龄",example = "1193094618@qq.com")
    @NotNull(message = "邮箱不能为空")
    private String email;

    @Schema(description = "创建时间",example = "2020-01-23 12:23:34")
    private Date created;
}
```

![image-20230523011044569](/images/springboot/image-20230523011044569.png)





### springfox迁移到springdoc



- `@Api` → `@Tag`
- `@ApiIgnore` → `@Parameter(hidden = true)` or `@Operation(hidden = true)` or `@Hidden`
- `@ApiImplicitParam` → `@Parameter`
- `@ApiImplicitParams` → `@Parameters`
- `@ApiModel` → `@Schema`
- `@ApiModelProperty(hidden = true)` → `@Schema(accessMode = READ_ONLY)`
- `@ApiModelProperty` → `@Schema`
- `@ApiOperation(value = "foo", notes = "bar")` → `@Operation(summary = "foo", description = "bar")`
- `@ApiParam` → `@Parameter`
- `@ApiResponse(code = 404, message = "foo")` → `@ApiResponse(responseCode = "404", description = "foo")`



> springfox的注解

| 注解               | 描述                                             |
| ------------------ | ------------------------------------------------ |
| @Api               | 标记一个类为 Swagger 资源。                      |
| @ApiImplicitParam  | 表示 API Operation 中的单个参数。                |
| @ApiImplicitParams | 包装注解，包含多个 @ApiImplicitParam 注解        |
| @ApiModel          | 提供 Swagger models 的附加信息                   |
| @ApiModelProperty  | 添加和操作 model 属性的数据。                    |
| @ApiOperation      | 描述一个特定路径的 operation（通常是 HTTP 方法） |
| @ApiParam          | 为 operation 参数添加额外的 meta-data。          |
| @ApiResponse       | 描述 operation 可能的响应。                      |
| @ApiResponses      | 包装注解，包含多个 @ApiResponse 注解。           |
| @ResponseHeader    | 表示响应头。                                     |



## open api

[OpenAPI Specification - Version 3.0.3 | Swagger](https://swagger.io/specification/)

> An OpenAPI definition can then be used by **documentation generation tools to display the API**, **code generation tools** to generate servers and clients in various programming languages, testing tools, and many other use cases.





## ReDoc

> 替换Swagger-UI的方案

[Redocly/redoc: 📘 OpenAPI/Swagger-generated API Reference Documentation (github.com)](https://github.com/Redocly/redoc)



### 配置

ReDoc是使用Reactor开发的，提供了cdn,我们使用springboot提供的静态资源，再根据ReDoc官网，写一个`index.html`页面

其中`spec-url`填入的就是springdoc暴露的openapi的数据

访问[http://localhost:8080/api/redoc-ui/index.html](http://localhost:8080/api/redoc-ui/index.html)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Redoc</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">

    <!--
    Redoc doesn't change outer page styles
    -->
    <style>
        body {
            margin: 0;
            padding: 0;
        }
    </style>
</head>
<body>
<redoc spec-url='http://localhost:8080/api/v3/api-docs'></redoc>
<script src="https://cdn.redoc.ly/redoc/v2.0.0/bundles/redoc.standalone.js"> </script>
</body>
</html>

```

![image-20230522224932115](/images/springboot/image-20230522224932115.png)

### 特点

只是文档提供,但是却并不像swagger-ui那样可以直接执行接口。 但是我还是Redoc觉得不错，因为，可以浏览文档，并且Schema显示比较清楚。



## 参考

[OpenAPI规范](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md)

[OpenAPI 3 Library for spring-boot  springdoc](https://springdoc.org/)

[Springfox的注解](https://segmentfault.com/a/1190000018863282)

