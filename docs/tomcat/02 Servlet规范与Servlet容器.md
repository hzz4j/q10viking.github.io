---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /tomcat/
typora-root-url: ..\.vuepress\public
---

## Servlet Container

::: tip

Java Servlet technology provides dynamic, user-oriented content in web applications using a request-response programming model.

Servlets don’t have a main() method.They’re under the control of another Java application called a Container.

把 Servlet 简单理解为运行在服务端的 Java 小 程序，但是 **Servlet 没有 main 方法，不能独立运行**，因此必须把它部署到 Servlet 容器 中，由容器来实例化并调用 Servlet。

Tomcat就是一个“**HTTP 服务器 + Servlet 容器**”，我们也叫它们 Web 容器

:::

![202112061010707](/images/tomcat/202112061010707.jpg)



![202112061011290](/images/tomcat/202112061011290.jpg)



![202112061026358](/images/tomcat/202112061026358.jpg)

## Http请求过程

![202112041331328](/images/tomcat/202112041331328.jpg)

## Servlet接口规范

::: tip

**Apache Tomcat version 8.5 implements the Servlet 3.1**

[JAVA™ Servlet规范(oracle.com)](https://download.oracle.com/otn-pub/jcp/servlet-3_1-fr-spec/servlet-3_1-final.pdf?AuthParam=1638599308_cd92a269e7bc665ec5ae0fcd9287053b)

:::

HTTP 服 务器不直接跟业务类打交道，而是把请求交给 Servlet 容器去处理，Servlet 容器会将请求 转发到具体的 Servlet，如果这个 Servlet 还没创建，就加载并实例化这个 Servlet，然后调 用这个 Servlet 的接口方法。因此 **Servlet 接口其实是Servlet 容器跟具体业务类之间的接口**

Servlet属于JavaEE的内容

![202112041337554](/images/tomcat/202112041337554.jpg)

## web.xml

::: tip

Using the Deployment Descriptor to map URLs to servlets

:::

When you deploy your servlet into your web Container, you’ll create a fairly simple XML document called the **Deployment Descriptor (DD)** to tell the Container how to run your servlets.

you’ll use the DD for more than just mapping names, you’ll use two XML elements to map URLs to servlets—one to map the client-known public URL name to your own internal name, and the other to map your own internal name to a fully-qualified class name.



## GET vs POST

![202112061039060](/images/tomcat/202112061039060.jpg)

![202112061040240](/images/tomcat/202112061040240.jpg)
