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



## 实现Tomcat和Jetty切换

虽然我们前面已经实现了一个比较简单的SpringBoot，不过我们可以继续来扩充它的功能，比如现在我有这么一个需求，这个需求就是我现在不想使用Tomcat了，而是想要用Jetty，那该怎么办？

我们前面代码中默认启动的是Tomcat，那我现在想改成这样子：

1. 如果项目中有Tomcat的依赖，那就启动Tomcat
2. 如果项目中有Jetty的依赖就启动Jetty
3. 如果两者都没有则报错
4. 如果两者都有也报错

这个逻辑希望SpringBoot自动帮我实现，对于程序员用户而言，只要在Pom文件中添加相关依赖就可以了，想用Tomcat就加Tomcat依赖，想用Jetty就加Jetty依赖。

那SpringBoot该如何实现呢？

我们知道，不管是Tomcat还是Jetty，它们都是应用服务器，或者是Servlet容器，所以我们可以定义接口来表示它们，这个接口叫做WebServer,并且在这个接口中定义一个start方法：

```java
public interface WebServer {
    void start();
}
```

有了WebServer接口之后，就针对Tomcat和Jetty提供两个实现类：

```java
public class TomcatServer implements WebServer {
    @Override
    public void start() {
        System.out.println("TomcatServer start");
    }
}

public class JettyServer implements WebServer {
    @Override
    public void start() {
        System.out.println("JettyServer start");
    }
}
```

而在HZZSpringApplication中的run方法中，我们就要去获取对应的WebServer，然后启动对应的webServer，代码为

```java
public static void run(Class<?> clazz) {
    AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
    context.register(clazz);
    context.refresh();

    WebServer webServer = getWebServer(context);
    webServer.start();
}


public static WebServer getWebServer(ApplicationContext context) {
    return null;
}
```

这样，我们就只需要在getWebServer方法中去判断到底该返回TomcatWebServer还是JettyWebServer。

前面提到过，我们希望根据项目中的依赖情况，来决定到底用哪个WebServer，我就直接用SpringBoot中的源码实现方式来模拟了。



## **模拟实现条件注解**

首先我们得实现一个条件注解@ZhouyuConditionalOnClass，对应代码如下

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
@Conditional(HZZOnClassCondition.class)
public @interface HZZConditionalOnClass {
    String value() default "";
}
```

注意核心为@Conditional(HZZOnClassCondition.class)中的HZZOnClassCondition，因为 它才是真正得条件逻辑

```java
public class HZZOnClassCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        MultiValueMap<String, Object> annotationAttributes = metadata.getAllAnnotationAttributes(HZZConditionalOnClass.class.getName());
        String className = (String) annotationAttributes.getFirst("value");
        try {
            context.getClassLoader().loadClass(className);
            return true;
        } catch (ClassNotFoundException e) {
            return false;
        }
    }
}
```

具体逻辑为，拿到@HZZConditionalOnClass中的value属性，然后用类加载器进行加载，如果加 载到了所指定的这个类，那就表示符合条件，如果加载不到，则表示不符合条件。



## **模拟实现自动配置类**

有了条件注解，我们就可以来使用它了，那如何实现呢？这里就要用到自动配置类的概念，我们先看代码：

```java
@Configuration
public class WebServiceAutoConfiguration {

    @Bean
    @HZZConditionalOnClass("org.apache.catalina.startup.Tomcat")
    public TomcatServer tomcatServer() {
        return new TomcatServer();
    }

    @Bean
    @HZZConditionalOnClass("org.eclipse.jetty.server.Server")
    public JettyServer jettyServer() {
        return new JettyServer();
    }
}
```

这个代码还是比较简单的，通过一个WebServiceAutoConfiguration的Spring配置类，在里面定义了两个Bean，一个TomcatServer，一个JettyServer，不过这两个要生效的前提是符合当前所指定的条件，比如：

1. 只有存在"org.apache.catalina.startup.Tomcat"类，那么才有TomcatServer这个Bean
2. 只有存在"org.eclipse.jetty.server.Server"类，那么才有JettyServer这个Bean

并且我们只需要在HZZSpringApplication中getWebServer方法，如此实现

```java
public static WebServer getWebServer(ApplicationContext context) {
    // key为beanName, value为Bean对象
    Map<String, WebServer>  webServers = context.getBeansOfType(WebServer.class);

    if(webServers.isEmpty()){
        throw new RuntimeException("没有找到WebServer的实现类");
    }else if(webServers.size() > 1) {
        throw new RuntimeException("找到多个WebServer的实现类");
    }else {
        return webServers.values().iterator().next();
    }
}
```

这样整体SpringBoot启动逻辑就是这样的：

1. 创建一个AnnotationConfigWebApplicationContext容器
2. 解析Application类，然后进行扫描
3. 通过getWebServer方法从Spring容器中获取WebServer类型的Bean
4. 调用WebServer对象的start方法



## SPI

有了以上步骤，我们还差了一个关键步骤，就是Spring要能解析到WebServiceAutoConfiguration这个自动配置类，因为不管这个类里写了什么代码，Spring不去解析它，那都是没用的，此时我们需要SpringBoot在run方法中，能找到WebServiceAutoConfiguration这个配置类并添加到Spring容器中。

MyApplication是Spring的一个配置类，但是MyApplication是我们传递给SpringBoot，从而添加到Spring容器中去的，而WebServiceAutoConfiguration就需要SpringBoot去自动发现，而不需要程序员做任何配置才能把它添加到Spring容器中去，而且要注意的是，Spring容器扫描也是扫描不到WebServiceAutoConfiguration这个类的，因为我们的扫描路径是"com.zhouyu.user"，而WebServiceAutoConfiguration所在的包路径为"com.zhouyu.springboot"。

那SpringBoot中是如何实现的呢？通过SPI，当然SpringBoot中自己实现了一套SPI机制，也就是我们熟知的spring.factories文件，那么我们模拟就不搞复杂了，就直接用JDK自带的SPI机制。

现在我们只需要在springboot项目中的resources目录下添加如下目录（META-INF/services）和文件：

![image-20230407105422949](/images/springboot/image-20230407105422949.png)

SPI的配置就完成了，相当于通过org.hzz.springboot.AutoConfiguration文件配置了springboot中所提供的配置类。

并且提供一个接口

```java
public interface AutoConfiguration {
}
```

并且WebServiceAutoConfiguration实现该接口

```java
@Configuration
public class WebServiceAutoConfiguration implements AutoConfiguration{

    @Bean
    @HZZConditionalOnClass("org.apache.catalina.startup.Tomcat")
    public TomcatServer tomcatServer() {
        return new TomcatServer();
    }

    @Bean
    @HZZConditionalOnClass("org.eclipse.jetty.server.Server")
    public JettyServer jettyServer() {
        return new JettyServer();
    }
}
```

然后我们再利用spring中的@Import技术来导入这些配置类，我们在@HZZSpringBootApplication的定义上增加如下代码:

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
@ComponentScan
@Import(HZZImportSelector.class)
public @interface HZZSpringBootApplication {
}
```



```java
public class HZZImportSelector implements DeferredImportSelector {
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        ServiceLoader<AutoConfiguration> serviceLoader = ServiceLoader.load(AutoConfiguration.class);
        List<String> list = new ArrayList<>();
        for (AutoConfiguration autoConfiguration : serviceLoader) {
            list.add(autoConfiguration.getClass().getName());
            System.out.println("加载自动配置类：" + autoConfiguration.getClass().getName());
        }
        return list.toArray(new String[list.size()]);
    }
}
```

这就完成了从org.hzz.springboot.AutoConfiguration文件中获取自动配置类的名字，并导入到Spring容器中，从而Spring容器就知道了这些配置类的存在，而对于user项目而言，是不需要修改代码的。

## 测试

### tomcat

此时运行Application，就能看到启动了Tomcat：

```sh
加载自动配置类：org.hzz.springboot.WebServiceAutoConfiguration
准备加载类：org.apache.catalina.startup.Tomcat
加载类成功：org.apache.catalina.startup.Tomcat
准备加载类：org.eclipse.jetty.server.Server
加载类失败：org.eclipse.jetty.server.Server
TomcatServer start
```

### jetty

```xml
<dependencies>
    <dependency>
        <groupId>org.hzz.springboot</groupId>
        <artifactId>springboot</artifactId>
        <version>1.0-SNAPSHOT</version>
        <exclusions>
            <exclusion>
                <groupId>org.apache.tomcat.embed</groupId>
                <artifactId>tomcat-embed-core</artifactId>
            </exclusion>
        </exclusions>
    </dependency>

    <dependency>
        <groupId>org.eclipse.jetty</groupId>
        <artifactId>jetty-server</artifactId>
        <version>9.4.43.v20210629</version>
    </dependency>
</dependencies>
```

```java
加载自动配置类：org.hzz.springboot.WebServiceAutoConfiguration
准备加载类：org.apache.catalina.startup.Tomcat
加载类失败：org.apache.catalina.startup.Tomcat
准备加载类：org.eclipse.jetty.server.Server
加载类成功：org.eclipse.jetty.server.Server
JettyServer start
```

