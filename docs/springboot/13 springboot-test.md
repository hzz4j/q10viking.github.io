---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---



## 依赖

[Core Features (spring.io)](https://docs.spring.io/spring-boot/docs/2.7.12/reference/html/features.html#features.testing)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
</dependency>
```





## 常见错误

- 需要包名一致
- 需要有对应的启动类，并且该启动类上标注了@SpringBootApplication

![image-20230521193651428](/images/springboot/image-20230521193651428.png)

```sh
java.lang.IllegalStateException: Unable to find a @SpringBootConfiguration, 
```



```java
@Slf4j
@SpringBootTest
public class MapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    public void test(){
        UserDO userDO = userMapper.selectById(1220708537638920191l);
        log.info(userDO.toString());
    }
}
```

如果引入了mybatis来进行测试，需要将mapper扫描进入容器。

```java
@SpringBootApplication
@MapperScan(basePackages = {"org.hzz.mapper"})
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class);
    }
}
```



## 在不同包下

![image-20230602203223534](/images/springboot/image-20230602203223534.png)

> 要想成功注入，需要加上`@RunWith(SpringRunner.class)`

```java
import org.hzz.spring.service.CarService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CarAndCarDTOMapperTest {

    @Autowired
    private CarService carService;

    @Test
    public void test() {
        System.out.println(carService);
        System.out.println(carService.enrichName("success"));
    }
}
```



## 参考

[Testing in Spring Boot | Baeldung](https://www.baeldung.com/spring-boot-testing)
