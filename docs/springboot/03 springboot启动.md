---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---



## Springboot启动流程

1. 加载一些监听器
2. 发布启动事件
3. 发布一个事件，通过监听器来加载全局配置文件
4. 打印banner
5. 创建容器Serlvet容器





1. spring容器启动
2. 全局配置文件的加载







[Link](https://www.processon.com/view/link/60d865e85653bb049a4b77ff)

<common-progresson-snippet src="https://www.processon.com/view/link/60d865e85653bb049a4b77ff"/>



## 选择context

> 在springboot中已经在spring.factories中配置了创建相应context的factory

```yml
# Application Context Factories
org.springframework.boot.ApplicationContextFactory=\
org.springframework.boot.web.reactive.context.AnnotationConfigReactiveWebServerApplicationContext.Factory,\
org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext.Factory
```

![image-20230409101441490](/images/springboot/image-20230409101441490.png)



springboot在选择context的时候，主要是根据WebApplicationType来进行创建

```sh
WebApplicationType.NONE--> DefaultApplicationContextFactory--> AnnotationConfigApplicationContext
WebApplicationType.SERVLET-->AnnotationConfigServletWebServerApplicationContext.Factory
WebApplicationType.REACTIVE-->AnnotationConfigReactiveWebServerApplicationContext.Factory
```



## 创建webServer

[Link](https://www.processon.com/view/link/5feb409a07912910e48b61c0)

<common-progresson-snippet src="https://www.processon.com/view/link/5feb409a07912910e48b61c0"/>