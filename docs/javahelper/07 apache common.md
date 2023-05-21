---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /javahelper/
typora-root-url: ..\.vuepress\public
---





[Apache Commons – Apache Commons](https://commons.apache.org/)

Java代码可复用的代码片段封装

## BeanUtils

```xml
<dependency>
    <groupId>commons-beanutils</groupId>
    <artifactId>commons-beanutils</artifactId>
    <version>1.9.4</version>
</dependency>
```

```java
public class MainTest {
    public static void main(String[] args) throws InvocationTargetException, IllegalAccessException {
        User user = new User("hzz", 18);
        User user1 = new User();
        System.out.println(user1);
        BeanUtils.copyProperties(user1,user);
        System.out.println(user1);
    }
}
```

