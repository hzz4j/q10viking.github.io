---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /maven/
typora-root-url: ..\.vuepress\public
---



## mvn命令

- mvn install 从远程仓库下载jar到本地仓库





## dependencyManagement版本依赖管理

[从根上理解Maven拉包原理，搞定Maven全功能 下-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/1204369)

为了规范一个复杂项目中所有子模块的依赖版本，防止出现两个子模块a，b引用同一个依赖，但是一个的版本是1.0，一个的版本是2.0的这种情况。

比如子模块a和b，都引入了x，y，z三个依赖，这三个依赖的版本都要求是相同的的才能匹配上，此时子模块a引入的是1.0的版本，子模块b引入的是2.0的版本，那么最后可能会出现版本不相同导致匹配不上的问题。所以都在父工程的`<dependencyManagement>`进行依赖版本管理



### pom.xml文件详解

[Maven: settings.xml、pom.xml完整配置-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/813478)
