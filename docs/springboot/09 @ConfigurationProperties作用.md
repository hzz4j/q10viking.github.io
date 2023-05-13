---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---



## @ConfigurationProperties作用

可以将配置文件如application.yml，批量注入到bean属性中

### 根据setXXX方法对应注入

如根据setName方法,而不是根据属性名

```java
@Configuration
@ConfigurationProperties("hzz")
public class MyProperties {
    private String hzzName;

    @NestedConfigurationProperty  // 就算没有该注解也会注入
    private MySubProperties mySubProperties;

    // 根据yml配置文件的key 找到setKey
    public void setName(String xxx){
        hzzName = xxx;
    }

    public void setMySubProperties(MySubProperties mySubProperties){
        this.mySubProperties = mySubProperties;
    }
}
```



```java
public class MySubProperties {
    private String something;

    public void setSomething(String something) {
        this.something = something;
    }
}

```



配置文件

```yml
hzz:
	name: hello
# 以下的情况就不会注入
hzz:
	hzzName: hello


hzz:
  name: hello
  mySubProperties:
    something: hello Something

```

### 其中setXXX(参数)

其中参数可以是枚举类型

在配置文件中直接指定枚举即可



## 案例

这就是为什么DruidDataSource在配置文件中配置url,为什么属性jdbUrl会被复制到配置文件中的url的原因，因为有setUrl.

springboot会根据配置文件的url来找到setUrl方法

```yml
spring:
	datasource:
		url: xxx
```



```java
@Bean
@ConfigurationProperties("spring.datasource")
public DataSource druidDataSource(){
    return new DruidDataSource();   // 有setUrl
}
```



----------



## 案例2

```yml
secure:
  ignored:
    urls: #安全路径白名单
      - /swagger-ui.html
      - /swagger-resources/**
      - /swagger/**
      - /**/v2/api-docs
      - /**/*.js
      - /**/*.css
      - /**/*.png
      - /**/*.ico
      - /webjars/springfox-swagger-ui/**
      - /actuator/**
      - /druid/**
      - /admin/login
      - /admin/register
      - /upload/product/**
```

```java
@Getter
@Setter
@ConfigurationProperties(prefix = "secure.ignored")
public class IgnoreUrlsConfig {

    private List<String> urls = new ArrayList<>();

}
```

