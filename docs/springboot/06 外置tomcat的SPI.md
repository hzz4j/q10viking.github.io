---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---



外置tomcat的SPI在SpringBoot的使用

SpringServletContainerInitiallizer实现了这个类javax.servlet.ServletContainerInitializer，tomcat会通过SPI调用onStartup方法，tomcat传入实现了WebApplicationInitailizer的类@HandlerTypes(WebApplicationInitailizer.class)

在处理WebApplicationInitailizer这个类的实现AbstractDispatcherServletInitializer类的过程中，向tomcat的context配置了DispatchServlet

----------

需要用户自己操作的

运行项目的main方法是通过自定义一个类，实现**SpringBootServletInitializer**类，告诉它启动类，然后运行我们的启动类的main方法

```java

// 通过tomcat提供的服务接口来实现SpringBootServletInitializer实现了WebApplicationInitailizer
public class TomcatStartSpringBootApplication extends SpringBootServletInitializer{
    @Override
    protected SpringApplication configure(SpringApplicationBuilder builder){
        return builder.sources(Application.class);
    }
}
```

