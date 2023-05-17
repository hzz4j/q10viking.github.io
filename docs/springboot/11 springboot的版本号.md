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

- **GA**： as in general availability are versions that have been released to the public. A version that has had this status for once will never change its content( 也就是已发布的稳定版本，我们平常成为realase)

- **CURRENT**： The most recent **GA** release that should usually be used for all new projects.（用于最新的GA版本）

- **RC** ： Release candidate; probably feature complete and should be pretty stable - problems should be relatively rare and minor, but worth reporting to try to get them fixed for release.（已经很接近GA版本了）

- **PRE**

  `pre release` versions will also not change but are only released to let developers test the features of an upcoming **GA** release. They might contain some bugs that will be fixed in a later pre release of the same version (i.e. bugs in `2.0.0 M1` will probably be fixed in `2.0.0 M2`). `M` is short for **milestone**. （功能已经开发完毕，但是还有很多bug待测试和修复）



## 什么是milestone

> milestone是项目管理期（project management term）

In order to produce a final release, code would go through several milestones as key features are implemented.

Once all new features are implemented, the code would then usually go through various pre-release stages, such as betas and release candidates. When everyone is happy, a final version is released and the whole process begins again.

In Spring land this process goes:

- `Mx` for a Milestone release, sequentially numbered
- `RCx` for a Release Candidate, sequentially numbered
- `GA` for "General Availability" release - the final version

  

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



## 小结

springboot整个开发过程可以理解为

```java
SNAPSHOT -> M1 -> M2 -> ... -> RC1 -> RC2 -> ... -> GA
           --------------------------------------
           |                PRE                 |
           --------------------------------------
            
```



## 参考

[stackoverflow: what-is-the-difference-between-springs-ga-rc-and-m2-releases](https://stackoverflow.com/questions/2107484/what-is-the-difference-between-springs-ga-rc-and-m2-releases)



