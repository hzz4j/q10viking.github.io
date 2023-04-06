---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springmvc/
typora-root-url: ..\.vuepress\public
---



> SpringMVC中根据请求路径最终找到处理器Controller，主要是通过处理器映射器HandlerMapping来实现的，所以着重来分析一下它的源码



[Link](https://www.processon.com/view/link/615ea79e1efad4070b2d6707)

<common-progresson-snippet src="https://www.processon.com/view/link/615ea79e1efad4070b2d6707"/>



::: tip

1. @RequestMapping是通过RequestMappingHandlerMapping负责解析的。
2. HandlerMapping负责根据请求映射到对应的handler方法。而RequestMappingHanderMapping是HandlerMapping的其中一个实现类，负责根据@RequestMapping注解进行映射。
3. HandlerMapping可分为两个过程 1）解析 2）映射

:::











