::: tip

Application Lifecycle Events

:::

## Event Listener

::: tip

Servlet event listeners support event notifications for state changes in the ServletContext, HttpSession and ServletRequest objects.

:::

## **Event Types and Listener Interfaces**

### ServletContext Events

![image (12)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061408871.jpg)

```java {8-9}
/**
 <listener>
     <listener-class>
        org.hzz.listener.MyServletContextListener
     </listener-class>
 </listener>
 */
@WebListener // 让容器发现这个listener
public class MyServletContextListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("code to initialize the database connection");
        System.out.println("and store it as a context attribute");

        ServletContext servletContext = sce.getServletContext();
        String breed = servletContext.getInitParameter("breed");
        Dog dog = new Dog(breed);
        servletContext.setAttribute("dog",dog);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("code to close the database connection");
    }
}
```



### HttpSession Events

![image (13)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061410328.jpg)



### ServletRequest Event

![image (14)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061412538.jpg)



















