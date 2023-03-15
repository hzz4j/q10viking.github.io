---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Ribbon/
typora-root-url: ..\.vuepress\public
---



限定注入

Spring的扩展点，老朋友SmartInitializingSingleton，在处理EventListener时有用到

```java
@Bean
public MyLoadBalancerInterceptor myLoadBalancerInterceptor(LoadBalancerClient loadBalancerClient) {
    return new MyLoadBalancerInterceptor(loadBalancerClient);
}

// 等同于
@Bean
public MyLoadBalancerInterceptor myLoadBalancerInterceptor(@Autowired LoadBalancerClient loadBalancerClient) {
    return new MyLoadBalancerInterceptor(loadBalancerClient);
}
```



## @LoadBalanced作用

下面两个的效果是一样的

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

```java
	@Bean
    @LoadBalanced  // 交给自动配置类LoadBalancerAutoConfiguration来进行处理该类是spring cloud的类
    public RestTemplate restTemplate(RestTemplateBuilder restTemplateBuilder){
        return restTemplateBuilder
                //.additionalInterceptors(new LoadBalancerInterceptor(loadBalancerClient))
                .build();
    }
```

主要目的就是在配置的RestTemplate中添加一个拦截器，该拦截器有RibbonLoadBalancerClient,从而实现RestTemplate具有Ribbon的效果



## @LoadBalanced原理分析

```java
@Target({ ElementType.FIELD, ElementType.PARAMETER, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Qualifier		// 限定注入
public @interface LoadBalanced {

}

```

引入SpringCloud后有一个配置类LoadBalancerAutoConfiguration ，主要用于处理@LoadBalanced

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(RestTemplate.class)
@ConditionalOnBean(LoadBalancerClient.class)
@EnableConfigurationProperties(LoadBalancerRetryProperties.class)
public class LoadBalancerAutoConfiguration {
    @LoadBalanced		// 限定注入
	@Autowired(required = false)  
	private List<RestTemplate> restTemplates = Collections.emptyList();
}
```

以Ribbon作为客户端负载均衡为例

在一个Configuration配置类中

1. @LoadBalanced利用@Qualifier作为restTemplates注入的筛选条件，筛选出具有负载均衡标识的RestTemplate

2. 注册一个拦截器（实现了ClientHttpRequestInterceptor接口），在拦截器中传入LoadBalancerClient

   1. 引入nacos-discovery场景启动器，就会把RibbonLoadBalancerClient注入到了容器中

3. 通过方法拿到我们定义的拦截器 返回SmartInitializingSingleton扩展点，在SmartInitializingSingleton类中处理@LoadBalanced限定的RestTemplate对象

   1. 为每个RestTemplate添加拦截器

4. 而实际中是如何通过一个SmartInitializingSingleton 来处理容器中所有的注册类的

   ```java
   final ObjectProvider<List<RestTemplateCustomizer>> restTemplateCustomizers
   ```

   

## @MyLoadBalanced模拟实现

```java
@Configuration
public class MyLoadBalancerAutoConfiguration {
    
    @MyLoadBalanced
    @Autowired(required = false) // 限定注入到list的RestTemplate
    private List<RestTemplate> restTemplates = Collections.emptyList();

    // 引入nacos-discovery场景启动器，就会把RibbonLoadBalancerClient注入到了容器中
    @Bean
    public MyLoadBalancerInterceptor myLoadBalancerInterceptor(LoadBalancerClient loadBalancerClient) {
        return new MyLoadBalancerInterceptor(loadBalancerClient);
    }
    
    // 添加拦截器
    @Bean
    public SmartInitializingSingleton myLoadBalancedRestTemplateInitializer(
            MyLoadBalancerInterceptor myLoadBalancerInterceptor) {
        //  spring的扩展点
        return new SmartInitializingSingleton() {
            @Override
            public void afterSingletonsInstantiated() {
                for (RestTemplate restTemplate : MyLoadBalancerAutoConfiguration.this.restTemplates) {
                    List<ClientHttpRequestInterceptor> list = new ArrayList<>(restTemplate.getInterceptors());
                    // 填充拦截器
                    list.add(myLoadBalancerInterceptor);
                    restTemplate.setInterceptors(list);
                }
            }
        };
    }
}
```

