---
prev:
  text: Back To 目录
  link: /topicNav/
typora-root-url: ..\.vuepress\public
---

## 什么是Feign

Feign是Netflix开发的声明式、模板化的HTTP客户端.

**Spring Cloud openfeign对Feign进行了增强，使其支持Spring MVC注解，另外还整合了Ribbon和Nacos，从而使得Feign的使用更加方便**

### 优势

Feign可以做到使用 **HTTP 请求远程服务时就像调用本地方法一样的体验**，开发者完全感知不到这是远程方法，更感知不到这是个 HTTP 请求。它像 Dubbo 一样，consumer 直接调用接口方法调用 provider，而不需要通过常规的 Http Client 构造请求再解析返回数据。它解决了让开发者调用远程接口就跟调用本地方法一样，无需关注与远程的交互细节，更无需关注分布式环境开发。

也属于一种RPC调用，底层协议用的是http协议

## Ribbon与Feign对比

### Ribbon+RestTemplate

```java
@Bean
@LoadBalanced
public RestTemplate restTemplate() {
    return new RestTemplate();
}

//调用方式
String url = "http://mall-order/order/findOrderByUserId/"+id;
R result = restTemplate.getForObject(url,R.class);
```

### **Feign进行微服务调用**

通常在springCloud开发中，使用的openFeign的方式

```java
@FeignClient(value = "mall-order",path = "/order")
public interface OrderFeignService {
    @RequestMapping("/findOrderByUserId/{userId}")
    public R findOrderByUserId(@PathVariable("userId") Integer userId);
}

@Autowired
OrderFeignService orderFeignService;
//feign调用
R result = orderFeignService.findOrderByUserId(id);
```



```xml
        <!--   引入openFegin     -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
```

