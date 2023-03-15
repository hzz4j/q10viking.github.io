---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /SpringCloud/
typora-root-url: ..\.vuepress\public
---

[Nacos配置中心实战-github](https://github.com/Q10Viking/springcloudalibaba/tree/main/05-learn-spring-cloud-alibaba)

## 引入依赖

```xml
<!--    引入配置中心    -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

## 创建bootstrap.yml文件

配置中心的配置

```yaml
spring:
  application:
    name: nacos-config
  cloud:
    nacos:
      config:
        server-addr: http://192.168.88.1:8848
        # `${spring.application.name}.${file-extension:properties}`
        file-extension: yml    # 代表使用配置中心中使用配置的文件格式
```

<img src="/images/springcloud/image-20210822171735784.png" alt="image-20210822171735784" style="zoom:67%;" />

![image-20210822171644538](/images/springcloud/image-20210822171644538.png)





## 优先级

配置中心>本地IDEA