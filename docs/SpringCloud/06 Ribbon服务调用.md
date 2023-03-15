---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /SpringCloud/
typora-root-url: ..\.vuepress\public
---

[服务调用Ribbon实战-github](https://github.com/Q10Viking/springcloudalibaba/tree/main/02-learn-spring-cloud-alibaba)

### 服务之间的调用

mall-user调用mall-order，现在mall-order有两个服务，mall-user去对用mall-order的时候，需要关注两件事

1. 需要去注册中心Nacos获取到mall-order对应的实例数据
2. 再通过客户端负载均衡选择其中一个实例进行调用

![image-20210821233548241](/images/springcloud/image-20210821233548241.png)



```java
//        String orderUrl = "http://localhost:8020/order/findOrderByUserId/"+id;
// 将链接改为mall-order 服务的名称
String orderUrl = "http://mall-order/order/findOrderByUserId/"+id;
```

为了restTemplate能够解析mall-order为正确的IP地址和端口，需要在加上@LoadBalanced

```java
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate(RestTemplateBuilder restTemplateBuilder){
        RestTemplate re = restTemplateBuilder.build();
        return  re;
    }
```

### @LoadBalanced原理

#### RibbonLoadBalancerClient负载均衡器

1. RestTemplate调用，如果有多个mall-order服务，就会选择其中一个mall-order进行调用
2. RestTemplate扩展点  ClientHttpRequestInterceptor，restTemplate在执行过程中会去调用该接口实现的类
3. ribbon  RibbonLoadBalancerClient
   1. ribbon会将服务mall-order转化为  localhost:8020

#### RibbonLoadBalancerClient

![image-20210821213041130](/images/springcloud/image-20210821213041130.png)

LoadBalancerInterceptor类 实现了 ClientHttpRequestInterceptor接口，并且在LoadBalancerInterceptor，维护了负载均衡客户端，项目中是RibbonLoadBalancerClient 它实现了LoadBalancerClient接口，负载从注册中心获取数据，和解析mall-order为 IP : PORT

```java
    @Autowired
    private LoadBalancerClient loadBalancerClient;  // 引入nacos-discovery场景启动器，就会把RibbonLoadBalancerClient注入到了容器中

    @Bean
//    @LoadBalanced
    public RestTemplate restTemplate(RestTemplateBuilder restTemplateBuilder){

        return restTemplateBuilder
                .additionalInterceptors(new LoadBalancerInterceptor(loadBalancerClient))
                .build();
    }
```



@LoadBalanced的原理，就是设置了拦截器，在拦截其中通过Ribbon进行解析的