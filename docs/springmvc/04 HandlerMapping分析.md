---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springmvc/
typora-root-url: ..\.vuepress\public
---



> SpringMVC中根据请求路径最终找到处理器Controller，主要是通过处理器映射器HandlerMapping来实现的，所以着重来分析一下它的源码

::: tip

1. @RequestMapping是通过RequestMappingHandlerMapping负责解析的。
2. HandlerMapping负责根据请求映射到对应的handler方法。而RequestMappingHanderMapping是HandlerMapping的其中一个实现类，负责根据@RequestMapping注解进行映射。
3. HandlerMapping可分为两个过程 1）解析 2）映射

:::



## Springboot自动配置

```sh
WebMvcAutoConfiguration
	里面配置了这个Bean
```



## 如何判断是否是Handler

```java
//RequestMappingHandlerMapping#isHandler
AnnotatedElementUtils.hasAnnotation(beanType, Controller.class) ||
    AnnotatedElementUtils.hasAnnotation(beanType, RequestMapping.class)
```

通过观察源码发现springboot中定义了一个`org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController`



## 如何组装链路(解析)

> 下面的代码如何组装成`/hello/say`?

```java
@RestController
@RequestMapping("/hello")
@Slf4j
public class HelloController {
        @GetMapping("/say")
        public String say() {
            log.info("HelloController say");
            return "Hello World!";
        }
}
```

简单的来说就是提取path进行相加，但是源码中有复杂的设定

```java
org.springframework.web.util.pattern.PathPattern#combine
// /* + /hotel => /hotel
// /*.* + /*.html => /*.html
// However:
// /usr + /user => /usr/user
// /{foo} + /bar => /{foo}/bar
```

[Link](https://www.processon.com/view/link/615ea79e1efad4070b2d6707)

<common-progresson-snippet src="https://www.processon.com/view/link/615ea79e1efad4070b2d6707"/>

[Link](https://www.processon.com/view/link/642ebb51a7da6b51ab13f83d)

<common-progresson-snippet src="https://www.processon.com/view/link/642ebb51a7da6b51ab13f83d"/>



## 映射

一个请求过来如何找到对应请求链路

[Link](https://www.processon.com/view/link/615ea79e1efad4070b2d6707)

<common-progresson-snippet src="https://www.processon.com/view/link/615ea79e1efad4070b2d6707"/>
