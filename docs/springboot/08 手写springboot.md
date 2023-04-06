---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---

::: tip

1. 手写模拟SpringBoot启动过程
2. 手写模拟SpringBoot条件注解功能
3. 手写模拟SpringBoot自动配置功能
4. SpringBoot整合Tomcat底层源码分析

:::

[Source Code](https://github.com/Q10Viking/learncode/tree/main/springboot/hzz-springboot/hzz-springboot)

## 依赖

> 建一个工程，两个Module:
>
> 1. springboot模块，表示springboot框架的源码实现
> 2. user包，表示用户业务系统，用来写业务代码来测试我们所模拟出来的SpringBoot

![image-20230406224758560](/images/springboot/image-20230406224758560.png)

> 首先，SpringBoot是基于的Spring，所以我们要依赖Spring，然后我希望我们模拟出来的SpringBoot也支持Spring MVC的那一套功能，所以也要依赖Spring MVC，包括Tomcat等，所以在SpringBoot模块中要添加以下依赖：

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.3.18</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-web</artifactId>
        <version>5.3.18</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.3.18</version>
    </dependency>

    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>4.0.1</version>
    </dependency>

    <dependency>
        <groupId>org.apache.tomcat.embed</groupId>
        <artifactId>tomcat-embed-core</artifactId>
        <version>9.0.73</version>
    </dependency>
</dependencies>
```

> 在User模块下我们进行正常的开发就行了，比如先添加SpringBoot依赖：

```xml
<dependencies>
    <dependency>
        <groupId>org.hzz.springboot</groupId>
        <artifactId>springboot</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>
</dependencies>
```

然后定义相关的Controller和Service:

![image-20230406230224785](/images/springboot/image-20230406230224785.png)

::: tip

因为我们模拟实现的是SpringBoot，而不是SpringMVC，所以我直接在user包下定义了UserController和UserService，最终我希望能运行MyApplication中的main方法，就直接启动了项目，并能在浏览器中正常的访问到UserController中的某个方法。

:::



## **核心注解和核心类**

我们在真正使用SpringBoot时，核心会用到SpringBoot一个类和注解：

1. @SpringBootApplication，这个注解是加在应用启动类上的，也就是main方法所在的类
2. SpringApplication，这个类中有个run()方法，用来启动SpringBoot应用的

所以我们也来模拟实现他们。

### @HZZSpringBootApplication注解

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({})
@ComponentScan
public @interface HZZSpringBootApplication {
}
```



### HZZSpringApplication

一个用来实现启动逻辑的HZZSpringApplication类。

```java
public class HZZSpringApplication {
    public static void run(Class<?> clazz) {

    }
}
```

有了以上两者，我们就可以在Application中来使用了，比如：

```java
@HZZSpringBootApplication
public class Application {
    public static void main(String[] args) {
        HZZSpringApplication.run(Application.class);
    }
}
```



## **run方法**

run方法中需要实现什么具体的逻辑呢？

首先，我们希望run方法一旦执行完，我们就能在浏览器中访问到UserController，那势必在run方法中要启动Tomcat，通过Tomcat就能接收到请求了。

Spring MVC的底层原理，在SpringMVC中有一个Servlet非常核心，那就是DispatcherServlet，这个DispatcherServlet需要绑定一个Spring容器，因为DispatcherServlet接收到请求后，就会从所绑定的Spring容器中找到所匹配的Controller，并执行所匹配的方法。

所以，在run方法中，我们要实现的逻辑如下：

1. 创建一个Spring容器
2. 创建Tomcat对象
3. 生成DispatcherServlet对象，并且和前面创建出来的Spring容器进行绑定
4. 将DispatcherServlet添加到Tomcat中
5. 启动Tomcat

### 创建Spring容器

```java
public class HZZSpringApplication {
    public static void run(Class<?> clazz) {
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.register(clazz);
        context.refresh();
    }
}
```

我们创建的是一个AnnotationConfigWebApplicationContext容器，并且把run方法传入进来的class作为容器的配置类，比如在MyApplication的run方法中，我们就是把**Application.class**传入到了run方法中，最终Application就是所创建出来的Spring容器的配置类，并且由于Application类上有@HZZSpringBootApplication注解，而@HZZSpringBootApplication注解的定义上又存在@ComponentScan注解，所以AnnotationConfigWebApplicationContext容器在执行refresh时，就会解析Application这个配置类，从而发现定义了@ComponentScan注解，也就知道了要**进行扫描**，只不过扫描路径为空，而AnnotationConfigWebApplicationContext容器会处理这种情况，**如果扫描路径会空，则会将Application所在的包路径做为扫描路径**，从而就会扫描到UserService和UserController。

所以Spring容器创建完之后，容器内部就拥有了UserService和UserController这两个Bean。

### 启动Tomcat

我们用的是Embed-Tomcat，也就是内嵌的Tomcat，真正的SpringBoot中也用的是内嵌的Tomcat，而对于启动内嵌的Tomcat，也并不麻烦，代码如下：

```java
public static void startTomcat(WebApplicationContext webApplicationContext) {

    Tomcat tomcat = new Tomcat();

    Server server = tomcat.getServer();
    Service service = server.findService("Tomcat");

    Connector connector = new Connector("HTTP/1.1");
    connector.setPort(8081);



    StandardEngine engine = new StandardEngine();
    engine.setDefaultHost("localhost");

    StandardHost host = new StandardHost();
    host.setName("localhost");

    String contextPath = "";
    Context context = new StandardContext();
    context.setPath(contextPath);
    context.addLifecycleListener(new Tomcat.FixContextListener());


    host.addChild(context);
    engine.addChild(host);
    service.setContainer(engine);
    service.addConnector(connector);

    tomcat.addServlet(contextPath, "dispatcher", new DispatcherServlet(webApplicationContext));
    context.addServletMappingDecoded("/*", "dispatcher");

    try {
        tomcat.start();
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

代码虽然看上去比较多，但是逻辑并不复杂，比如配置了Tomcat绑定的端口为8081，后面向当前Tomcat中添加了DispatcherServlet，并设置了一个Mapping关系，最后启动，其他代码则不用太过关心。

而且在构造DispatcherServlet对象时，传入了一个ApplicationContext对象，也就是一个Spring容器，就是我们前文说的，DispatcherServlet对象和一个Spring容器进行绑定。

接下来，我们只需要在run方法中，调用startTomcat即可：

```java
public static void run(Class<?> clazz) {
    AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
    context.register(clazz);
    context.refresh();

    startTomcat(context);
}
```

实际上代码写到这，一个极度精简版的SpringBoot就写出来了，比如现在运行MyApplication，就能正常的启动项目，并能接收请求。

启动能看到Tomcat的启动日志：

![image-20230406234237246](/images/springboot/image-20230406234237246.png)

然后在浏览器上访问：http://localhost:8081/test,也能正常的看到结果

![image-20230406234325235](/images/springboot/image-20230406234325235.png)