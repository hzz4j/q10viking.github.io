---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /maven/
typora-root-url: ..\.vuepress\public
---





## Maven项目管理工具

**maven** 是一个**项目管理工具**，主要作用是在项目开发阶段对Java项目进行**依赖管理**和**项目构建**

**依赖管理**：就是对jar包的管理。通过导入maven坐标，就相当于将仓库中的jar包导入了当前项目中。

**项目构建**：通过maven的一个命令就可以完成项目从清理、编译、测试、报告、打包，部署整个过程

<img src="/images/maven/image-20201230110306512.png" alt="image-20201230110306512" style="zoom:67%;" />





## mvn命令

- mvn install命令完成了项目编译、单元测试、打包功能，同时把打好的可执行jar包（war包或其它形式的包）布署到本地maven仓库，但没有布署到远程maven私服仓库
- mvn deploy命令完成了项目编译、单元测试、打包功能，同时把打好的可执行jar包（war包或其它形式的包）布署到本地maven仓库和远程maven私服仓库
- `mvn package -Dmaven.test.skip=true`跳过测试
- `mvn spring-boot:run -Ph2`激活指定的profile



## 依赖范围scope



![image-20230517201733989](/images/maven/image-20230517201733989.png)

- compile 默认scope



## optional可选依赖

> 在Springboot中自动配置大量使用到了

[Maven实战-maven中的可选依赖](https://blog.csdn.net/lovejj1994/article/details/80283240)

- A引入依赖B，B里面又引入依赖C，如果在B中设置依赖C为optional 为true,那么A不会看到C
- 如果A与B是父子关系，如B是父工程，A继承了这个工程，那么无论B中引入的依赖C，那么不管C是否设置为optional，A都能看到C





## dependencyManagement版本依赖管理

[从根上理解Maven拉包原理，搞定Maven全功能 下-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/1204369)

为了规范一个复杂项目中所有子模块的依赖版本，防止出现两个子模块a，b引用同一个依赖，但是一个的版本是1.0，一个的版本是2.0的这种情况。

比如子模块a和b，都引入了x，y，z三个依赖，这三个依赖的版本都要求是相同的的才能匹配上，此时子模块a引入的是1.0的版本，子模块b引入的是2.0的版本，那么最后可能会出现版本不相同导致匹配不上的问题。所以都在父工程的`<dependencyManagement>`进行依赖版本管理



## pom.xml文件详解

[Maven: settings.xml、pom.xml完整配置-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/813478)
