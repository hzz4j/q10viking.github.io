---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---





- JDK：Java Develpment Kit java 开发工具
- JRE：Java Runtime Environment  java运行时环境
- JVM：java Virtual Machine java 虚拟机

![image-20230511161708514](/images/java/image-20230511161708514.png)

三者的关系可以用这样的关系表示

```sh
JRE = JVM + libraries to run Java Application
JDK = JRE + tools to develop Java Application
```



### JDK

JDK是java开发工具包，在其安装目录下面有五个文件夹、一些描述文件、一个src压缩文件。bin、lib、 jre这四个文件夹起作用。可以看出来JDK包含JRE，而JRE包含JVM。

- bin:最主要的是编译器(javac.exe)
- lib：类库（开发中需要使用到的一些jdk提供的一些类）
- jre:java运行环境（注意：这里的bin、lib文件夹和jre里的bin、lib是不同的）