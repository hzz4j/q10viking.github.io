---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /seata/
typora-root-url: ..\.vuepress\public
---



## SeataFeignClient

> 原理在bean的生命周期中替换bean

> 用于在Feign调用过程中设置请求头的xid（事务全局ID）

[08 SpringBoot-Seata集成基础设施(SeataClient)准备工作 | ProcessOn免费在线作图,在线流程图,在线思维导图 |](https://www.processon.com/view/link/62a1b7807d9c08733ec284e3)

![08 SpringBoot-Seata集成基础设施(SeataClient)准备工作](/images/seata/08 SpringBoot-Seata集成基础设施(SeataClient)准备工作.png)



## DataSourceProxy

> 代理连接池DataSource（如DruidDataSource）,在getConnection的时候获得ConectionProxy,在从连接connection获得PrepareStatementProxy

[Seata XA 模式对比AT模式](http://seata.io/zh-cn/docs/dev/mode/xa-mode.html)

![image-20220609172914639](/images/seata/image-20220609172914639.png)



```java
//AutoDataSourceProxyRegistrar#registerBeanDefinitions
AbstractBeanDefinition beanDefinition = BeanDefinitionBuilder
                .genericBeanDefinition(SeataDataSourceBeanPostProcessor.class)
                .addConstructorArgValue(excludes)
                .addConstructorArgValue(dataSourceProxyMode)
                .getBeanDefinition();
```

[SpringBoot-Seata集成基础设施(DataSourceProxy)准备工作 | ProcessOn免费在线作图,在线流程图,在线思维导图 |](https://www.processon.com/view/link/62a1fcfe0791293ad1a59975)

![SpringBoot-Seata集成基础设施(DataSourceProxy)准备工作](/images/seata/SpringBoot-Seata集成基础设施(DataSourceProxy)准备工作.png)





## @GlobalTransactional的扫面AOP

GlobalTransactionScanner





## Java代码

```
io.seata.spring.annotation.datasource.DataSourceProxyHolder#putDataSource
Function<? super K, ? extends V> mappingFunction

BranchType.XA == dataSourceProxyMode ? DataSourceProxyXA::new : DataSourceProxy::new
```

