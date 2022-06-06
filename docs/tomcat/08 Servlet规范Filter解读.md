---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /tomcat/
---



## Filter

![image (20)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061803042.jpg)

![image (21)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061915519.jpg)

## Lifecycle

```java
 public void init(FilterConfig filterConfig);
 public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain);
 public void destroy();
```

## Declaring and ordering filters

::: tip

:one: Declare your filter
:two: Map your filter to the web resources you want to filter
:three: Arrange these mappings to create filter invocation sequences

:::

### Declaring a filter

```xml
<filter>
    <filter-name>BeerRequest</filter-name>
    <filter-class>com.example.web.BeerRequestFilter
    </filter-class>
    <init-param>
        <param-name>LogFileName</param-name>
        <param-value>UserLog.txt</param-value>
    </init-param>
</filter>
```

### Declaring a filter mapping to a URL pattern

```xml
<filter-mapping>
    <filter-name>BeerRequest</filter-name>
    <url-pattern>*.do</url-pattern>
</filter-mapping>
```

### Declaring a filter mapping to a servlet name

```xml
<filter-mapping>
    <filter-name>BeerRequest</filter-name>
    <servlet-name>AdviceServlet</servlet-name>
</filter-mapping>
```

### The Container’s rules for ordering filters:star:

When more than one filter is mapped to a given resource, the Container uses the following rules

1. Filters with matching URL patterns are placed in the chain in the order in which they are declared in the DD.
2. Once all filters with matching URLs are placed in the chain, the Container does the same thing with filters that have a matching < servlet-name > in the DD.

