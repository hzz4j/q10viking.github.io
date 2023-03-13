---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springsecurity/
typora-root-url: ..\.vuepress\public
---



## 密码模式

::: tip

在这种模式中，用户必须把自己的密码给客户端，但是客户端不得储存密码。适用场景：自家公司搭建的授权服务器

:::



## 项目配置

[Source Code](https://github.com/Q10Viking/springcloudalibaba/tree/main/oauth2/oauth2-password)

授权码模式上进行更改

### spring security配置

```java
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.formLogin().permitAll()
                .and().authorizeRequests()
                .antMatchers("/oauth/**").permitAll()
                .anyRequest().authenticated()
                .and().logout().permitAll()
                .and().csrf().disable();
    }


    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
```



### 授权配置

```java
@Configuration
@EnableAuthorizationServer
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        // 密码模式必须配置
        endpoints.authenticationManager(authenticationManager)
                .allowedTokenEndpointRequestMethods(HttpMethod.GET,HttpMethod.POST); // 支持的方法
    }

    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {
        // 允许表单控制
        security.allowFormAuthenticationForClients();
    }

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
                .authorizedGrantTypes("password");
    }
}
```



## 测试

### get方式

浏览器：[http://localhost:8080/oauth/token?username=hzz&password=Root.123456&grant_type=password&client_id=client&client_secret=123123&scope=all](http://localhost:8080/oauth/token?username=hzz&password=Root.123456&grant_type=password&client_id=client&client_secret=123123&scope=all)

![image-20230313190239594](/images/springsecurity/image-20230313190239594.png)

### post方式

apipostman测试

![image-20230313191049030](/images/springsecurity/image-20230313191049030.png)



![image-20230313191126323](/images/springsecurity/image-20230313191126323.png)
