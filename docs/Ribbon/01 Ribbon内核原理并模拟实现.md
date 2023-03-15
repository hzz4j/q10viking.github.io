---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Ribbon/
typora-root-url: ..\.vuepress\public
---

## 内核原理

1. 获取该服务对应的所有实例
2. 拦截方法将mall-order，替换为实例的IP:PORT

![img](/images/ribbon/13570.png)



## 手动模拟实现其过程

1. 先去掉RestTemplate的Ribbon(我的项目之前配置了)

```java
// 使得注入的RestTemplate不具备Ribbon的功能
@Bean
//    @LoadBalanced  
public RestTemplate restTemplate(RestTemplateBuilder restTemplateBuilder){

    return restTemplateBuilder
        //                .additionalInterceptors(new LoadBalancerInterceptor(loadBalancerClient))
        .build();
}
```

### 前置知识

```java
// 容器中会注入一个spring cloud 的CompositeDiscoveryClient类
public class CompositeDiscoveryClient implements DiscoveryClient {
	// NacosDiscoveryClient 也在里面
	private final List<DiscoveryClient> discoveryClients;
```

## 实现

1. 通过DiscoveryClient获取到服务所有的实例

2. 通过轮训方式的负载均衡算法，获取到其中一个实例

3. 替换mall-order为ip地址，然后访问

   [模拟Ribbon的内核实现-github](https://github.com/Q10Viking/springcloudalibaba/tree/main/03-learn-spring-cloud-alibaba)

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private DiscoveryClient discoveryClient;

    @GetMapping("/findOrderByUserId/{id}")
    public R findOrderByUserId(@PathVariable("id") Integer id){
//        String orderUrl = "http://localhost:8020/order/findOrderByUserId/"+id;
        String orderUrl = getUrl("mall-order")+"/order/findOrderByUserId/"+id;
        R r = restTemplate.getForObject(orderUrl, R.class);
        return r;
    }

    private final AtomicInteger count = new AtomicInteger(0);
    private String getUrl(String serviceName){
        List<ServiceInstance> instances = discoveryClient.getInstances(serviceName);
        // 通过负载均衡获取到其中的一个实例
        ServiceInstance serviceInstance = instances.get(getIndex(instances.size()));
        URI uri = serviceInstance.getUri();
        return uri.toString();
    }
    // CAS获取到洗衣歌实例的索引位置
    private int getIndex(int size){
        for(;;){
            int currentIndex = count.get();
            int next = (currentIndex+1)%size;
            if(count.compareAndSet(currentIndex,next)){
                return currentIndex;
            }
        }
    }
}

```

