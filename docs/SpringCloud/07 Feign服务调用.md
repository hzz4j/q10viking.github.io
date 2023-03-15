---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /SpringCloud/
typora-root-url: ..\.vuepress\public
---



[Feign使用实战-github](https://github.com/Q10Viking/springcloudalibaba/tree/main/04-learn-spring-cloud-alibaba)

## 项目中引入OpenFegin依赖

```xml
<!--   引入openFegin     -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```



## 编写调用接口+@FeignClient注解

建一个包org.hzz.fegin，在里面编写

```java
@FeignClient(value = "mall-order",path = "/order")
public interface OrderFeignService {
    @GetMapping("/findOrderByUserId/{id}")
    R findOrderByUserId(@PathVariable("id") int id);
}

```



## 调用端在启动类上添加@EnableFeignClients注解

```java
@SpringBootApplication
@EnableFeignClients
public class MallUserApplication {
    public static void main(String[] args) {
        SpringApplication.run(MallUserApplication.class,args);
    }
}

```



## 进行服务调用

```java
@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    @Autowired
    private OrderFeignService orderFeignService;

    @GetMapping("/findOrderByUserId/{id}")
    public R findOrderByUserId(@PathVariable("id") Integer id){
        log.info("获取用户订单");
       return orderFeignService.findOrderByUserId(id);

    }

}
```

