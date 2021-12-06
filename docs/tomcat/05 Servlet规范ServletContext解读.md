## ServletContext

::: tip

The ServletContext interface defines a servlet’s view of the Web application within which the servlet is running.

服务器容器在启动时会为每个项目创建唯一的一个ServletContext对象，用于实现多个Servlet之间 的信息共享和通信

:::

![image (1)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112060918834.jpg)

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

