---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---



## Springboot发布版本

[Spring Boot](https://spring.io/projects/spring-boot#learn)

![image-20230517101509661](/images/springboot/image-20230517101509661.png)

- **GA**： as in general availability are versions that have been released to the public. A version that has had this status for once will never change its content( 也就是已发布的稳定版本)

- **CURRENT**： The most recent **GA** release that should usually be used for all new projects.（用于最新的GA版本）

- **PRE**

  `pre release` versions will also not change but are only released to let developers test the features of an upcoming **GA** release. They might contain some bugs that will be fixed in a later pre release of the same version (i.e. bugs in `2.0.0 M1` will probably be fixed in `2.0.0 M2`). `M` is short for milestone.





## SNAPSHOT

> 项目还在开发中，代码会随时变动

Maven versions can contain a string literal "SNAPSHOT" to signify that a project is currently under active development.

For example, if your project has a version of “1.0-SNAPSHOT” and you deploy this project’s artifacts to a Maven repository, Maven would expand this version to “1.0-20080207-230803-1” if you were to deploy a release at 11:08 PM on February 7th, 2008 UTC. In other words, when you deploy a snapshot, you are not making a release of a software component; you are releasing a snapshot of a component at a specific time.

> An example of maven release process

![image-20230517102938535](/images/springboot/image-20230517102938535.png)

So mainly snapshot versions are used for projects under active development. If your project depends on a software component that is under active development, you can depend on a snapshot release, and Maven will periodically attempt to download the latest snapshot from a repository when you run a build. Similarly, if the next release of your system is going to have a version “1.8,” your project would have a “1.8-SNAPSHOT” version until it was formally released.

For example , the following dependency would always download the latest 1.8 development JAR of spring:

```java
  <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring</artifactId>
        <version>1.8-SNAPSHOT”</version>
    </dependency>
```

