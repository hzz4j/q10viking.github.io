## ServletConfig

**The servlet init parameters are read only ONCE—when the Container initializes the servlet**

::: tip

When the Container makes a servlet, it reads the DD and creates the name/value pairs for the ServletConfig. The Container never reads the init parameters again! Once the parameters are in the ServletConfig, they won’t be read again until/unless you redeploy the servlet.

:::

![image (10)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061344703.jpg)



## InitParameters

```java
// 注解方式的配置
@WebServlet(
        value = "/servletConfig/test1",
        initParams = {
                @WebInitParam(name="username",value = "静默"),
                @WebInitParam(name="email",value="1193094618@qq.com")
        }
)
public class InitParamTest extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletConfig servletConfig = getServletConfig();
        Enumeration<String> initParameterNames = servletConfig.getInitParameterNames();
        while(initParameterNames.hasMoreElements()){
            String name = initParameterNames.nextElement();
            System.out.println(name + " = " +servletConfig.getInitParameter(name));
        }
    }
}
```



## ServletConfig vs ContextConfig

::: tip

- There’s only one ServletContext for an entire web app, and all the parts of the web app share it
- But each servlet in the app has its own ServletConfig.

:::



