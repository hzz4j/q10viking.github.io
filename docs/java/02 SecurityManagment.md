---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
---



::: tip

在Tomcat中看到创建类加载器时使用了AccessController.doPrivileged的方法，准备研究一下

Java语言随着互联网的兴起而逐步走向成熟，最初是在使用Applet的时候，Java在设计之初就做了安全上的考虑。Java安全模型的设计需要考虑如何保证Java程序可以安全地访问资源，并进行可控的授权

:::

## 沙箱模型

Java安全模型的最初版本（Java 1.0版本）是一个沙箱模型。沙箱模型提供了一个非常受限的运行环境供应用程序运行。运行在沙箱中的程序没有访问操作系统资源的权限，比如访问文件、网络等等。这个版本的安全模型有效地将远程代码和本地代码隔离开，防止恶意的远程代码对本地计算机系统的破坏。

::: tip

最初Java在浏览器应用的程序Java applets，会从互联网上加载代码

:::

![java_security_1](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112132152667.png)

虽然严格的限制可以防止系统被破话，但是这也给程序的功能扩展带来了障碍。当一些没有权限的代码希望访问系统资源的时候，沙箱模型的限制将阻碍这些功能的实现。所以，在后续的Java 1.1版本中，为了可以对代码的资源访问进行授权，引入了安全策略。

::: tip

JDK 1.1 introduced the concept of a "signed applet", as illustrated by the figure below. In that release, a correctly digitally signed applet is treated as if it is trusted local code if the signature key is recognized as trusted by the end system that receives the applet.

:::

![java_security_2](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112132158020.png)

在Java 1.2中，又再次对Java的沙箱模型进行了改进，增加了代码签名机制。不管是远程代码还是本地代码，都需要按照安全策略的配置，由类加载器加载到JVM中权限不同的运行空间，进行权限的差异化控制。

![java_security_3](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112132200381.png)

## 域模型

::: tip

当前Java的安全模型是使用域模型来实现的

基于域模型的Java安全模型来进行权限访问控制

:::

在当前最新的Java安全模型中，引入了 **域（Domain）** 的概念。虚拟机会将所有代码加载到不同的域中。其中系统域负责和操作系统的资源进行交互，而各个应用域对系统资源的访问需要通过系统域的代理来实现受限访问。JVM中的不同域关联了不同的权限，处于域中的类将拥有这个域所包含的所有权限。

![java_security_4](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112132207047.png)



![image (14)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112132208328.jpg)

