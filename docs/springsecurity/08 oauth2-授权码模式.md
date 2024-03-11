---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springsecurity/
typora-root-url: ..\.vuepress\public
---



## 授权码模式

::: tip

这种方式比较适合web前端交互页面，客户端从前端获得用户授权的码。比如京东的扫码登陆。

:::

**授权码（authorization code）方式，指的是第三方应用先申请一个授权码，然后再用该码获取令牌**

授权码通过前端传送，令牌则是储存在后端，而且所有与资源服务器的通信都在后端完成。这样的前后端分离，可以避免令牌泄漏

它的步骤如下：

1. 用户访问客户端，后者将前者导向授权服务器。
2. 用户选择是否给予客户端授权。
3. 假设用户给予授权，授权服务器将用户导向客户端事先指定的"重定向URI"（redirection URI），同时附上一个授权码。
4. 客户端收到授权码，附上早先的"重定向URI"，向授权服务器申请令牌。这一步是在客户端的后台的服务器上完成的，对用户不可见。
5. 授权服务器核对了授权码和重定向URI，确认无误后，向客户端发送访问令牌（access token）和更新令牌（refresh token）。



## 流程

1. 用户访问,此时没有Token。Oauth2RestTemplate会报错，这个报错信息会被Oauth2ClientContextFilter捕获并重定向到授权服务器。
2. 授权服务器通过Authorization Endpoint(/oauth/authorize)进行授权，并通过AuthorizationServerTokenServices生成授权码并返回给客户端。
3. 客户端拿到授权码去授权服务器通过Token Endpoint(/oauth/token)调用AuthorizationServerTokenServices生成Token并返回给客户端
4. 客户端拿到Token去资源服务器访问资源，一般会通过Oauth2AuthenticationManager调用ResourceServerTokenServices进行校验。校验通过可以获取资源。  

![img](/images/springsecurity/52714.png)



## 项目配置

[Source Code](https://github.com/Q10Viking/springcloudalibaba/tree/main/oauth2/oauth2-basic)

### 依赖

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

### Spring Security配置

```java
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private UserService userService;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.formLogin().permitAll()
                .and().authorizeRequests()
                .antMatchers("/oauth/**").permitAll() //允许
                .antMatchers("/order/**").permitAll()
                .anyRequest().authenticated()
                .and().logout().permitAll()
                .and().csrf().disable();
    }
}
```

```java
@Service
public class UserService implements UserDetailsService {
    private static Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    @Lazy // 解决循环依赖
    public PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        String password = passwordEncoder.encode("Root.123456");
        logger.info("user password "+password);
        return new User("hzz",password,
                AuthorityUtils.commaSeparatedStringToAuthorityList("admin"));
    }
}
```

### 授权服务配置

> 授权客户端备案

```java
@Configuration
@EnableAuthorizationServer
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.inMemory()
                //配置client_id
                .withClient("client")
                //配置client-secret
                .secret(passwordEncoder.encode("123123"))
                //配置访问token的有效期
                .accessTokenValiditySeconds(3600)
                //配置刷新token的有效期
                .refreshTokenValiditySeconds(864000)
                //配置redirect_uri，用于授权成功后跳转
                .redirectUris("http://www.baidu.com")
                //配置申请的权限范围
                .scopes("all")
                //配置grant_type，表示授权类型
                .authorizedGrantTypes("authorization_code");
    }
}
```

### 资源服务配置

```java
@Configuration
@EnableResourceServer
public class ResourceServiceConfig extends ResourceServerConfigurerAdapter {
    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .anyRequest().authenticated()
                .and().requestMatchers().antMatchers("/user/**");
    }
}
```



## 测试

客户端将用用户导向一个链接地址[http://localhost:8080/oauth/authorize?client_id=client&response_type=code](http://localhost:8080/oauth/authorize?client_id=client&response_type=code)

这个链接是引导用户携带客户端的id和授权模式code，向授权服务获取授权码。

![image-20230313180127555](/images/springsecurity/image-20230313180127555.png)

> 用户端授权

![image-20230313180231138](/images/springsecurity/image-20230313180231138.png)

> 客户端此时从返回的链接，可以获取code

```http
https://www.baidu.com/?code=5cqpOI
```

客户端用户授权的code去授权服务器获取token

![image-20230313181202912](/images/springsecurity/image-20230313181202912.png)

![image-20230313180933110](/images/springsecurity/image-20230313180933110.png)

客户端将这个token存在自己的服务器，并使用这个token去获取资源服务器获取资源

![image-20230313181111280](/images/springsecurity/image-20230313181111280.png)