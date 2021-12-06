---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /tomcat/
---



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

::: tip

**HttpSessionBindingListener**

:one: When an instance of this `ActiveUser` get set as a session attribute by `HttpSession#setAttribute()`, then the `valueBound()` will be invoked.

:two: When it get removed by either `HttpSession#removeAttribute()`, or an invalidate of the session, or get replaced by another `HttpSession#setAttribute()`, then the `valueUnbound()` will be invoked.

:::

```java {1,12-20}
public class Dog implements HttpSessionBindingListener {
    private String breed;

    public Dog(String breed) {
        this.breed = breed;
    }

    public String getBreed() {
        return breed;
    }

    @Override
    public void valueBound(HttpSessionBindingEvent event) {
        System.out.println("==================Value Bound==================");
    }

    @Override
    public void valueUnbound(HttpSessionBindingEvent event) {

    }
}
```



### ServletRequest Event

![image (14)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061412538.jpg)



