---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /tomcat/
---



## 环境准备

在聚合工程下新建一个子模块

![image (13)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112042047091.jpg)

创建webapp文件夹

![image (14)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112042050301.jpg)

此时它还是没有被标记为web module,通过project structure来设置它，添加一个web模块，并修改设置为webapp文件夹

![image (15)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112042057911.jpg)

构建一个artifact

![image (16)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112042100122.jpg)

![image (17)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112042101188.jpg)

![image (18)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112042103887.jpg)

## servlet-api依赖

```xml
<!-- https://mvnrepository.com/artifact/javax.servlet/javax.servlet-api -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>3.1.0</version>
    <scope>provided</scope>
</dependency>
```



## 测试

build->build actifact

![image (19)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112042105997.jpg)

::: tip

这样在启动tomcat源码的时候，也可以在servlet中打断点，进行调试，非常nice

:::
