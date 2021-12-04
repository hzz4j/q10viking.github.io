::: tip

把 Servlet 简单理解为运行在服务端的 Java 小 程序，但是 **Servlet 没有 main 方法，不能独立运行**，因此必须把它部署到 Servlet 容器 中，由容器来实例化并调用 Servlet。

Tomcat就是一个“**HTTP 服务器 + Servlet 容器**”，我们也叫它们 Web 容器

:::

## Http请求过程

![image (11)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112041331328.jpg)



## Servlet接口规范

HTTP 服 务器不直接跟业务类打交道，而是把请求交给 Servlet 容器去处理，Servlet 容器会将请求 转发到具体的 Servlet，如果这个 Servlet 还没创建，就加载并实例化这个 Servlet，然后调 用这个 Servlet 的接口方法。因此 **Servlet 接口其实是Servlet 容器跟具体业务类之间的接口**

![image (12)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112041337554.jpg)

