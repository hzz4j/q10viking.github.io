---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---

## spring

[Source Code](https://github.com/Q10Viking/learncode/tree/main/springbootcache)

在spring中就已经引入了本地缓存，spring-context中就有了`CacheEvict`等注解

在springboot中，自动配置类中就配置了ConcurrentMapCacheManager，默认的。

下面这个依赖，方便引入其他缓存，如RedisCache,Ehcache等

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```



## 简单使用

Spring 从 3.1 开始就引入了对 Cache 的支持。定义了 `org.springframework.cache.Cache` 和 `org.springframework.cache.CacheManager` 接口来统一不同的缓存技术。并支持使用 `JCache（JSR-107）`注解简化我们的开发。

其使用方法和原理都类似于 Spring 对事务管理的支持。Spring Cache 是作用在方法上的，其核心思想是，当我们在调用一个缓存方法时会把该方法参数和返回结果作为一个键值对存在缓存中。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>
```

引入了springboot，就可以使用缓存了

1. 开启基于注解的缓存，使用 `@EnableCaching` 标识在 SpringBoot 的主启动类上。

2. 标注缓存注解即可

```java
@SpringBootApplication
@EnableCaching  // 开启基于注解的缓存
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class);
    }
}
```

```java
@Component
@Log
public class SimpleRunner implements CommandLineRunner, ApplicationContextAware {
    private ApplicationContext applicationContext;
    @Override
    public void run(String... args) throws Exception {
        log.info("-----------msg-------------------");
        /**
         * 因为spring的缓存是通过代理实现的，类似aop.被Spring包装了。
         * 在该类方法直接执行，不会走代理，所以我们需要拿到代理类
         */
        SimpleRunner simpleRunner = applicationContext.getBean(SimpleRunner.class);

        log.info(simpleRunner.getData(1));
        log.info(simpleRunner.getData(1));
        log.info(simpleRunner.getData(1));
    }

    private AtomicInteger count = new AtomicInteger(0);
    @Cacheable(cacheNames = "emps")
    public String getData(Integer id){
        return "msg"+count.incrementAndGet();
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}
```

![image-20231222191923432](/images/springboot/image-20231222191923432.png)

### 常用属性说明



#### 常用属性说明

下面介绍一下 `@Cacheable `这个注解常用的几个属性：

> - `cacheNames/value` ：用来指定缓存组件的名字
> - `key` ：缓存数据时使用的 key，可以用它来指定。默认是使用方法参数的值。（这个 key 你可以使用 spEL 表达式来编写）
> - `keyGenerator` ：key 的生成器。 key 和 keyGenerator 二选一使用
> - `cacheManager` ：可以用来指定缓存管理器。从哪个缓存管理器里面获取缓存。
> - `condition` ：可以用来指定符合条件的情况下才缓存
> - `unless` ：否定缓存。当 unless 指定的条件为 true ，方法的返回值就不会被缓存。当然你也可以获取到结果进行判断。（通过 `#result` 获取方法结果）
> - `sync` ：是否使用异步模式。

#### spEL 编写 key

前面说过，缓存的 key 支持使用 spEL 表达式去编写，下面总结一下使用 spEL 去编写 key 可以用的一些元数据：

![img](/images/springboot/0b94988b3cde463ed16ca1edec244c1e.png)

## 引入第三方缓存Redis

springboot自动配置类配置了`RedisCacheConfiguration`,引入下面的依赖，就会注册`RedisCacheManager`。

![image-20231222193138072](/images/springboot/image-20231222193138072.png)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

```yml
# redis连接配置
spring:
  redis:
    host: 192.168.135.130
    port: 6379
    jedis:
      pool:
        # 连接池最大连接数（使用负值表示没有限制）
        max-active: 8
        # 连接池最大阻塞等待时间（使用负值表示没有限制）
        max-wait: -1ms
        # 连接池中的最大空闲连接
        max-idle: 8
        # 连接池中的最小空闲连接
        min-idle: 0
      # 连接超时时间（毫秒）默认是2000ms
    timeout: 2000ms
  cache:
    redis:
      ## Entry expiration in milliseconds. By default the entries never expire.
      time-to-live: 1d
    type: redis
```

![image-20231222194901593](/images/springboot/image-20231222194901593.png)

由于出现乱码，我们需要配置一下,首先需要引入jackson

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.16.0</version>
</dependency>
```

```java
@Configuration
public class RedisConfig {
    @Bean
    @Primary
    public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory){
        RedisCacheConfiguration redisCacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));
        return RedisCacheManager.RedisCacheManagerBuilder.fromConnectionFactory(redisConnectionFactory)
                .cacheDefaults(redisCacheConfiguration)
                .build();
    }
}
```

![image-20231222201249988](/images/springboot/image-20231222201249988.png)

```java
@Cacheable(cacheNames = "msg",key = "#root.targetClass.simpleName+':'+#id")
public String getData(Integer id){
    return "msg"+count.incrementAndGet();
}
```



### 小结

```xml
<dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.18</version>
        </dependency>

        <!--   redis cache     -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <!--   解决乱码     -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.16.0</version>
        </dependency>

    </dependencies>
```



## 参考

[SpringBoot 缓存之 @Cacheable 详细介绍](https://xie.infoq.cn/article/001e0f5ab65fa7dd1484c51e5)

[Caching Data with Spring](https://spring.io/guides/gs/caching/)

[“8个步骤”手把手带你用SpringBoot操作Redis，实现数据缓存](https://cloud.tencent.com/developer/article/1824707)

