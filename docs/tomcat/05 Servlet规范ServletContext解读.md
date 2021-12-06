---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /tomcat/
---



## ServletContext

::: tip

The ServletContext interface defines a servlet’s view of the Web application within which the servlet is running.

服务器容器在启动时会为每个项目创建唯一的一个ServletContext对象，用于实现多个Servlet之间 的信息共享和通信

One ServletContext per web app. (They should have named it AppContext.)

:::

![image (1)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112060918834.jpg)

### ServletConfig

- One ServletConfig object per servlet.
- Use it to pass deploy-time information to the servlet (a database or enterprise bean lookup name, for example) that you don’t want to hard-code into the servlet (servlet init parameters)



## Initialization Parameters

`web.xml`

```xml
<context-param>
    <param-name>userName</param-name>
    <param-value>静默</param-value>
</context-param>
<context-param>
    <param-name>description</param-name>
    <param-value>Learning tomcat</param-value>
</context-param>
```

```java
@WebServlet("/servletContext/test1")
public class ServletContextTest1 extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletContext servletContext = req.getServletContext();
        Enumeration<String> initParameterNames = servletContext.getInitParameterNames();
        while(initParameterNames.hasMoreElements()){
            String name = initParameterNames.nextElement();
            System.out.println(name + " = " + servletContext.getInitParameter(name));
        }
    }
}
```

```
description = Learning tomcat
userName = 静默
```



## Configuration methods

::: tip

:one:adding and configuring Servlets

:two: adding and configuring Filters

:three: adding and configuring Listeners

:::



## Context Attributes

```java
@WebServlet("/servletContext/test2")
public class ServletContextTest2 extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletContext servletContext = req.getServletContext();
        Enumeration<String> attributeNames = servletContext.getAttributeNames();
        while(attributeNames.hasMoreElements()){
            String name = attributeNames.nextElement();
            System.out.println(name + " = " + servletContext.getAttribute(name));
        }
    }
}
```



## Resources

::: tip

:one: 代表web应用的根目录

用一个文件下载的例子来理解

:::

> http://localhost:8888/servlet_specification/servletContext/fileDown/bookCode.jar

```java {1,6,12,15}
@WebServlet("/servletContext/fileDown/*")
public class FileDownload extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // pathInfo 是 /bookCode.jar
        String filename = req.getPathInfo().substring(1);
        ServletContext servletContext = this.getServletContext();
        String mimeType = servletContext.getMimeType(filename);

        // We want the browser to recognize that this is a JAR, not HTML, so we set the
        //content type to “application/java-archive”.
        resp.setContentType(mimeType);

        // This just says, “give me an input stream for the resource named tomcat-i18n-zh-CN.jar”.
        InputStream resourceAsStream = servletContext.getResourceAsStream("/"+filename);

        int read = 0;
        byte[] bytes = new byte[1024];
        OutputStream outputStream = resp.getOutputStream();
        while((read = resourceAsStream.read(bytes)) != -1) {
            outputStream.write(bytes, 0, read);
        }
        outputStream.flush();
        outputStream.close();
    }
}
```



### 资源所处于的位置

The getResourceAsStream() requires you to start with a forward slash (“/”) , which **represents the root of your web app.**

![image (8)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061151532.jpg)

![image (7)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061115307.jpg)

### MIME

You have to tell the browser what you’re sending back, so the browser can do the right thing: launch a “helper” app like a PDF viewer or video player, render the HTML, save the bytes of the response as a downloaded file, etc. And since you’re wondering, yes when we say content type we mean the same thing as MIME type.

![image (9)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061155723.jpg)









