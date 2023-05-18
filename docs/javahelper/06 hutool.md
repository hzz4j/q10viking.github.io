---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /javahelper/
typora-root-url: ..\.vuepress\public
---



## 依赖

```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.16</version>
</dependency>
```



### ClassPathResource读取资源

```java
@GetMapping(value = "/hello",produces = {"text/html;charset=UTF-8"})
public void hello(HttpServletResponse response){
    //返回一个html测试页面
    try (ServletOutputStream servletOutputStream = response.getOutputStream();
        ) {
        ClassPathResource classPathResource = new ClassPathResource("hello.html");

        servletOutputStream.write(classPathResource.readBytes());
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
}
```

