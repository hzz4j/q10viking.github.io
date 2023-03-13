---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springsecurity/
typora-root-url: ..\.vuepress\public
---



## 基于Redis的token

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>
```



## 项目配置

[Source Code](https://github.com/Q10Viking/springcloudalibaba/tree/main/oauth2/oauth2-password-redis)

```java
@Configuration
public class RedisConfig {
    @Autowired
    private RedisConnectionFactory redisConnectionFactory;
    @Bean
    public TokenStore tokenStore(){
        return new RedisTokenStore(redisConnectionFactory);
    }
}
```

在授权服务器配置中指定令牌的存储策略为Redis

```java
@Autowired
private TokenStore tokenStore;

@Override
public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
    // 密码模式必须配置
    endpoints.authenticationManager(authenticationManager)
        .tokenStore(tokenStore)
        .reuseRefreshTokens(false) // refresh_token是否重复使用
        .userDetailsService(userService) // 刷新令牌授权包含对用户信息的检查
        .allowedTokenEndpointRequestMethods(HttpMethod.GET,HttpMethod.POST); // 支持的方法
}
```

## 项目测试

[http://localhost:8080/oauth/token?username=hzz&password=Root.123456&grant_type=password&client_id=client&client_secret=123123&scope=all](http://localhost:8080/oauth/token?username=hzz&password=Root.123456&grant_type=password&client_id=client&client_secret=123123&scope=all)

![image-20230313214440805](/images/springsecurity/image-20230313214440805.png)
