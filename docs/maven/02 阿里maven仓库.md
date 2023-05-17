---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /maven/
typora-root-url: ..\.vuepress\public
---





[仓库服务 (aliyun.com)](https://developer.aliyun.com/mvn/guide)

```xml
<mirror>
  <id>aliyunmaven</id>
  <mirrorOf>*</mirrorOf>
  <name>阿里云公共仓库</name>
  <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```





mvn install: 安装到你的本地库中



现在遇到的问题

https://blog.csdn.net/taugast/article/details/113787531

https://blog.csdn.net/jeikerxiao/article/details/60324713

[将maven源改为国内阿里云镜像 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/71998219)

```java
<mirror>
  <id>aliyunmaven</id>
  <mirrorOf>public</mirrorOf>
  <name>阿里云公共仓库</name>
  <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```



```sh
Downloading from spring-snapshots: https://repo.spring.io/snapshot/org/springframework/spring-jcl/5.3.27/spring-jcl-5.3.27.pom
Downloading from spring-milestones: https://repo.spring.io/milestone/org/springframework/spring-jcl/5.3.27/spring-jcl-5.3.27.pom
Downloading from central: https://repo.maven.apache.org/maven2/org/springframework/spring-jcl/5.3.27/spring-jcl-5.3.27.pom
```



```
https://repo.maven.apache.org/maven2/
https://repo1.maven.org/maven2/ 阿里云代理的代理的
```



-------





## maven默认仓库

maven 默认的Central Repository中央仓库有两个[https://repo1.maven.org](https://repo1.maven.org/) 和 [https://repo.maven.apache.org](https://repo.maven.apache.org/)

我使用的maven版本是

### plugin插件

::: tip

[Maven – POM Reference (apache.org)](https://maven.apache.org/pom.html#Plugin_Repositories)

Repositories are home to two major types of artifacts. The first are artifacts that are used as dependencies of other artifacts. These are the majority of plugins that reside within central. The other type of artifact is plugins. Maven plugins are themselves a special type of artifact. Because of this, plugin repositories may be separated from other repositories (although, I have yet to hear a convincing argument for doing so). In any case, the structure of the pluginRepositories element block is similar to the repositories element. The pluginRepository elements each specify a remote location of where Maven can find new plugins.

:::

打开IDEA，第一次使用maven时，会从默认仓库[https://repo.maven.apache.org/maven2/](https://repo.maven.apache.org/maven2/)下载maven命令需要的插件（比如clean、install都是maven的插件），走的还是默认的repository，这样会很慢.

![image-20230517133945241](/images/maven/image-20230517133945241.png)

```sh
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-resources-plugin/3.3.0/maven-resources-plugin-3.3.0.pom
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-resources-plugin/3.3.0/maven-resources-plugin-3.3.0.pom (8.5 kB at 6.7 kB/s)
```













