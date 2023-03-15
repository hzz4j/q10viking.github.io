---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /nacos/
typora-root-url: ..\.vuepress\public
---



https://www.processon.com/view/link/603f3d2fe401fd641adb51f1

## 入口

springboot加载配置： org.springframework.boot.env.PropertySourceLoader 接口，有properties和yml形式的实现

```java
public interface PropertySourceLoader {

	String[] getFileExtensions();

	/**
		这就是加载配置文件的方法
	 */
	List<PropertySource<?>> load(String name, Resource resource) throws IOException;

}
```



## 扩展点

**ApplicationContextInitializer**

Spring的扩展点之一，在ConfigurableApplicationContext#refresh之前调用，通常用于需要对应用上下文做初始化的web应用中，比如根据上下文环境注册或激活配置文件



### 源码中文件加载顺序



![image-20210822200600855](/images/nacos/image-20210822200600855.png)



## 接口调用nacos注册中心

拉取配置的数据

ConfigServer

![image-20210822201610433](/images/nacos/image-20210822201610433.png)

## 监听

NacosContextRefresher

![image-20210822203343721](/images/nacos/image-20210822203343721.png)



## RefreshScope的原理

会将该bean进行销毁，[Spring bean销毁的过程](https://blog.csdn.net/long9870/article/details/100544690?spm=1001.2014.3001.5501)

```java
@RefreshScope   // 会将这个bean进行销毁，下次获取则重新从beanFactory中哪，从原料beanDefinition从新生产，这样就能注入新的value了
public class TestController{
    @Value("${common.value}")
    private String name;
}
```

![image-20210822212151316](/images/nacos/image-20210822212151316.png)



## 配置变化客户端是如何感知的？

1. Nacos服务端，首先会更新服务端的配置数据文件，然后发布一个**NotifyCenter**.publishEvent事件
2. 异步解耦这个事件，





## 配置变化其他集群是如何感知的？同步





## 服务端注册配置

会更新文件在服务器文件中，然后发布事件来

