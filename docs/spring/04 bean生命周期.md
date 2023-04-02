---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /spring/
typora-root-url: ..\.vuepress\public
---



## Bean的生命周期

<common-progresson-snippet src="https://www.processon.com/view/link/5f8588c87d9c0806f27358c1"/>

```sh
实例化前: InstantiationAwareBeanPostProcessor#postProcessBeforeInstantiation
构造方法
merged bean definition: MergedBeanDefinitionPostProcessor#postProcessMergedBeanDefinition
实例化后: InstantiationAwareBeanPostProcessor#postProcessAfterInstantiation
已经完成属性注入Hello World | InstantiationAwareBeanPostProcessor#postProcessProperties
Aware bean name: userService
@PostConstruct
初始化前: BeanPostProcessor#postProcessBeforeInitialization
InitializingBean#afterPropertiesSet
初始化后: BeanPostProcessor#postProcessAfterInitialization
@PreDestory
DisposableBean#destroy
```





## Spring底层扫面

<common-progresson-snippet src="https://www.processon.com/view/link/61370ee60e3e7412ecd95d43"/>







## 关闭

ApplicationContext结束时会运行一个钩子方法。

```java
class SpringApplicationShutdownHook implements Runnable {
    void addRuntimeShutdownHook() {
        Runtime.getRuntime().addShutdownHook(new Thread(this, "SpringApplicationShutdownHook"));
    }
}

```

