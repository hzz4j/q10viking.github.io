---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /nacos/
typora-root-url: ..\.vuepress\public
---

[Nacos配置中心实战-github](https://github.com/Q10Viking/springcloudalibaba/tree/main/05-learn-spring-cloud-alibaba)

## 配置中心

![img](/images/nacos/12925.png)





##  **Config相关配置**

Nacos 数据模型 Key 由三元组唯一确定, Namespace默认是空串，公共命名空间（public），分组默认是 DEFAULT_GROUP

<img src="/images/nacos/14992.png" alt="img" style="zoom:67%;" />

## 文件扩展名

项目中配置的使用的文件扩展名

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

### 文件格式

nacos配置中心中文件格式

![image-20210822172821087](/images/nacos/image-20210822172821087.png)

项目中引用配置中心的配置，根据文件名和文件格式引用

**要一一对应起来nacos-config.yml文件（应用名.文件扩展名）**

## namespace

用于进行租户粒度的配置隔离。不同的命名空间下，可以存在相同的 Group 或 Data ID 的配置。Namespace 的常用场景之一是不同环境的配置的区分隔离，例如开发测试环境和生产环境的资源（如配置、服务）隔离等。

在没有明确指定 ${spring.cloud.nacos.config.namespace} 配置的情况下， 默认使用的是 Nacos 上 Public 这个namespace。如果需要使用自定义的命名空间，可以通过以下配置来实现：

### 自定义命名空间

如以项目进行隔离

![image-20210822173333309](/images/nacos/image-20210822173333309.png)



```yml
spring:
  application:
    name: nacos-config
  cloud:
    nacos:
      config:
        server-addr: http://192.168.88.1:8848
        file-extension: yml    # 代表使用配置中心中使用配置的文件格式
        namespace: 08655487-b7a7-43b3-9ddb-94874568c3b2  # 命名空间ID
```

​	![image-20210822173632500](/images/nacos/image-20210822173632500.png)

**此时就会加载命名空间learnSpringCloud下的nacos-config.yml文件（应用名.文件扩展名）**



## 支持profile粒度的配置

spring-cloud-starter-alibaba-nacos-config 在加载配置的时候，不仅仅加载了以 dataid 为 ${spring.application.name}.${file-extension:properties} 为前缀的基础配置，还加载了dataid为 ${spring.application.name}-${profile}.${file-extension:properties} 的基础配置。在日常开发中如果遇到多套环境下的不同配置，可以通过Spring 提供的 ${spring.profiles.active} 这个配置项来配置。

```
spring:
  application:
    name: nacos-config
  profiles:
    active: dev      
  cloud:
    nacos:
      config:
        server-addr: http://192.168.88.1:8848
        file-extension: yml    # 代表使用配置中心中使用配置的文件格式
        namespace: 08655487-b7a7-43b3-9ddb-94874568c3b2  # 命名空间
```

![image-20210822174331563](/images/nacos/image-20210822174331563.png)

**此时就会加载命名空间learnSpringCloud下的nacos-config-dev.yml文件（应用名-profile.文件扩展名）**

## 支持自定义 Group 的配置

如： 订单服务，商品服务这样来实现**配置的一个隔离**

Group是组织配置的维度之一。通过一个有意义的字符串（如 Buy 或 Trade ）对配置集进行分组，从而区分 Data ID 相同的配置集。当您在 Nacos 上创建一个配置时，如果未填写配置分组的名称，则配置分组的名称默认采用 DEFAULT_GROUP 。配置分组的常见场景：不同的应用或组件使用了相同的配置类型，如 database_url 配置和 MQ_topic 配置。

在没有明确指定 ${spring.cloud.nacos.config.group} 配置的情况下，默认是DEFAULT_GROUP 。如果需要自定义自己的 Group，可以通过以下配置来实现：



## 支持自定义扩展的 Data Id 配置

Data ID  是组织划分配置的维度之一。Data ID 通常用于组织划分系统的配置集。一个系统或者应用可以包含多个配置集，每个配置集都可以被一个有意义的名称标识。Data ID 通常采用类 Java 包（如 com.taobao.tc.refund.log.level）的命名规则保证全局唯一性。此命名规则非强制。

**通过自定义扩展的 Data Id 配置，既可以解决多个应用间配置共享的问题，又可以支持一个应用有多个配置文件。**

1. 共享配置
2. 扩展配置

```yml
spring:
  application:
    name: nacos-config
  profiles:
    active: dev
  cloud:
    nacos:
      config:
        server-addr: http://192.168.88.1:8848
        file-extension: yml    # 代表使用配置中心中使用配置的文件格式
        namespace: 08655487-b7a7-43b3-9ddb-94874568c3b2  # 命名空间
        shared-configs:     # 共享配置，list集合
          - data-id: share-config01.yml   #自定义 Data Id 的配置
            group: REFRESH_GROUP
            refresh: true
          - data-id: share-config02.yml
            group: REFRESH_GROUP
            refresh: true
        extension-configs:   # 扩展配置，list集合
          - data-id: ext-config01.yml
            group: REFRESH_GROUP
            refresh: true
          - data-id: ext-config02.yml
            group: REFRESH_GROUP
            refresh: true
```

![image-20210822181642093](/images/nacos/image-20210822181642093.png)

## 优先级

都会加载，只不过优先级不同，会产生覆盖的效果

```sh
# ${spring.application.name}-${profile}.${file-extension:properties}
#${spring.application.name}.${file-extension:properties}
#${spring.application.name}
#extensionConfigs
#sharedConfigs 

1) nacos-config-dev.yaml 精准配置
2) nacos-config.yaml 同工程不同环境的通用配置
3) ext-config: 不同工程 扩展配置
4) shared-dataids 不同工程通用配置
```



## 补充

以上的配置都在bootstrap.yml文件中配置而不是application.yml