---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /win11/
typora-root-url: ..\.vuepress\public
---





## 下载JDK

[Win10系统安装64位JDK8最新2021详细步骤（配置Java环境变量）_80大叔学Java的博客-CSDN博客_jdk8 64位](https://blog.csdn.net/dashu_java/article/details/119326520)

[Java Platform Standard Edition 8 Documentation (oracle.com)](https://docs.oracle.com/javase/8/docs/)

### 补充CLASSPATH配置

```
.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar;
```



## 安装Maven

> 下载maven并配置环境变量

[maven的下载与安装教程（超详细）_格子衫111的博客-CSDN博客_maven下载](https://blog.csdn.net/u012660464/article/details/114113349)

> 使用阿里云镜像

[maven镜像_maven下载地址_maven安装教程-阿里巴巴开源镜像站 (aliyun.com)](https://developer.aliyun.com/mirror/maven)

```xml
<mirror>
    <id>aliyunmaven</id>
    <mirrorOf>*</mirrorOf>
    <name>阿里云公共仓库</name>
    <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```

[仓库服务 (aliyun.com)](https://developer.aliyun.com/mvn/guide?spm=a2c6h.13651104.0.0.43586e1aPgmg75)