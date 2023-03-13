---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springsecurity/
typora-root-url: ..\.vuepress\public
---



## OAuth2的设计思路

::: tip

OAuth在"客户端"与"服务提供商"之间，设置了一个授权层（authorization layer）。"客户端"不能直接登录"服务提供商"，只能登录授权层，以此**将用户与客户端区分开来**.

::

客户端使用授权层的令牌token向服务提供商请求资源。

![img](/images/springsecurity/52839.png)

1. 用户打开客户端以后，客户端要求用户给予授权。
2. 用户同意给予客户端授权。
3. 客户端使用上一步获得的授权，向授权服务器申请令牌。
4. 授权服务器对客户端进行认证以后，确认无误，同意发放令牌。
5. 客户端使用令牌，向资源服务器申请获取资源。
6. 资源服务器确认令牌无误，同意向客户端开放资源。



## 客户端授权模式

客户端必须得到用户的授权（authorization grant），才能获得令牌（access token）。一共分成四种授权类型（authorization grant），即四种颁发令牌的方式，适用于不同的互联网场景。

- 授权码模式（authorization code）
- 密码模式（resource owner password credentials）
- 简化(隐式)模式（implicit）
- 客户端模式（client credentials）

> 不管哪一种授权方式，第三方应用申请令牌之前，都必须先到系统备案，说明自己的身份，然后会拿到两个身份识别码：客户端 ID（client ID）和客户端密钥（client secret）.这是为了防止令牌被滥用，没有备案过的第三方应用，是不会拿到令牌的



## 快速搭建项目

[Source Code](https://github.com/Q10Viking/springcloudalibaba/tree/main/oauth2/oauth2-basic)

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>Hoxton.SR8</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
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
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-oauth2</artifactId>
    </dependency>
</dependencies>
```

