::: tip

The ServletContext interface defines a servlet’s view of the Web application within which the servlet is running.

:::



## ContextParam

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

