---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---



在onRefresh方法里面创建内置的tomcat

1. ServletWebServerFactoryAutoConfiguration自动配置类里面配置TomcatWebServerFactory
2. 从Ioc里面getBean，来获取ServletWebServerFactory的实例
3. 创建了tomcat
4. 在tomcat的启动过程中会通过回调的方式向context中添加DispatchServlet.
5. DispatchServlet有一个配置类DispatchServletConfiguration



## 在SpringBoot注册Servlet

1. 通过ServletRegistrationBean,因为它实现了ServletContextInitializer接口，
2. 在tomcat启动过程中会将ServletContextInitializer类型的bean拿出来，放到tomcat中