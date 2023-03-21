---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /win11/
typora-root-url: ..\.vuepress\public
---



## 背景

> SpringBoot已经发布了3.0版本，但是需要的JDK17,借着这个机会，我使用OpenJDK17来尝试一下。

## 下载OpenJDK

从[Latest Releases | Adoptium](https://adoptium.net/zh-CN/temurin/releases/)下载预编译好的OpenJDK

![image-20230321203035890](/images/win11/image-20230321203035890.png)



## 切换版本配置

[如何在Windows中快速切换不同的Java版本](https://www.cnblogs.com/jaxu/p/14972722.html)

```sh
# 创建两个空文件夹
E:\Java\scripts>type NUL > java8.bat
E:\Java\scripts>type NUL > java17.bat
```

> java17.bat

```sh
@echo off
set JAVA_HOME=E:\Java\jdk-17.0.6+10
set Path=%JAVA_HOME%\bin;%Path%
echo Java 17 activated.
```

> java8.bat

```sh
@echo off
set JAVA_HOME=E:\Java\jdk1.8.0_361
set Path=%JAVA_HOME%\bin;%Path%
echo Java 8 activated.
```

环境变量

![image-20230321212803377](/images/win11/image-20230321212803377.png)



### 使用❤️

```sh
C:\Users\11930>java17
Java 17 activated.

C:\Users\11930>java -version
openjdk version "17.0.6" 2023-01-17 LTS
OpenJDK Runtime Environment Microsoft-7209853 (build 17.0.6+10-LTS)
OpenJDK 64-Bit Server VM Microsoft-7209853 (build 17.0.6+10-LTS, mixed mode, sharing)

C:\Users\11930>java8
Java 8 activated.

C:\Users\11930>java -version
java version "1.8.0_361"
Java(TM) SE Runtime Environment (build 1.8.0_361-b09)
Java HotSpot(TM) 64-Bit Server VM (build 25.361-b09, mixed mode)
```



## 参考

[Oracle JDK 和 OpenJDK 有什么区别？-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/833977)

[如何在Windows中快速切换不同的Java版本](https://www.cnblogs.com/jaxu/p/14972722.html)