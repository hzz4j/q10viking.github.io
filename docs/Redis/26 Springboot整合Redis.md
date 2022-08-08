---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---



## 依赖

```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<dependency>
   <groupId>org.apache.commons</groupId>
   <artifactId>commons-pool2</artifactId>
</dependency>
```



## 简单的redis配置

::: tip



:::



```yaml
spring:
  redis:
    port: 6379
    host: 192.168.187.135
    lettuce:
      pool:
        max-active: 100
        max-idle: 50
        min-idle: 10
        max-wait: 1000
```



## StringRedisTemplate与RedisTemplate序列化测试

::: tip

StringRedisTemplate继承自RedisTemplate，也一样拥有相同的操作。

StringRedisTemplate默认采用的是String的序列化策略，保存的key和value都是采用此策略序列化保存的。

RedisTemplate默认采用的是JDK的序列化策略，保存的key和value都是采用此策略序列化保存的。

:::

```java
@SpringBootApplication
public class Application implements CommandLineRunner {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private RedisTemplate redisTemplate;

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        stringRedisTemplate.opsForValue().set("template:string:1", "Hello Redis");
        stringRedisTemplate.opsForValue().set("template:string:2", "Hello 静默");

        redisTemplate.opsForValue().set("template:redis:1", "Hello Redis");
        redisTemplate.opsForValue().set("template:redis:2", "Hello 静默");
    }
}
```

![image-20220809022616694](/images/Redis/image-20220809022616694.png)



### **对象序列化**❤️

**StringRedisTemplate一般用来存储字符串，默认用的序列化是StringRedisSerializer。**

如果要存储对象我们一般用RedisTemplate，它底层用的序列化机制是JdkSerializationRedisSerializer，**这种存储对象要求对象实现Serializable接口，它底层存的是二进制的序列化数组，不便于在redis里查看**，**所以我们一般用Jackson2JsonRedisSerializer，能将对象转成json存储，并且不需要对象实现Serializable接口，也便于在redis里查看**。

当然，如果不需要在redis里查看一些数据，对性能要求较高的话，序列化可以采用protobuf。



#### 实现Serializable

```java
public void storeObject(){
    User user = new User();  // User实现了Serializable接口
    user.setId(1);
    user.setName("q10viking");
    // 只提供字符串
    //        stringRedisTemplate.opsForValue().set("user:1",user);
    redisTemplate.opsForValue().set("user:1",user);
    User u = (User)redisTemplate.opsForValue().get("user:1");
    System.out.println(u);  // User{name='q10viking', id=1}
}
```

![image-20220809025902867](/images/Redis/image-20220809025902867.png)

### Jackson2JsonRedisSerializer对象转Json❤️

需要jackson的依赖

```xml
<!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.13.3</version>
</dependency>
```



```java
public void storeObjectJson() {
        Book book = new Book();
        book.setId(1);
        book.setName("《生死疲劳》");
        
        Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<Object>(Object.class);
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();

        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);

        // key序列化使用StringRedisSerializer
        redisTemplate.setKeySerializer(stringRedisSerializer);
        redisTemplate.setHashKeySerializer(stringRedisSerializer);

        // value序列化jackson
        redisTemplate.setValueSerializer(jackson2JsonRedisSerializer);
        redisTemplate.setHashValueSerializer(jackson2JsonRedisSerializer);

        redisTemplate.opsForValue().set("book:1",book);
        Book o = (Book)redisTemplate.opsForValue().get("book:1");
        System.out.println(o); // Book{name='《生死疲劳》', id=1}
    }
```

![image-20220809032642885](/images/Redis/image-20220809032642885.png)

以后可以单独创建RestTemplate Bean来自己配置

```java
@Bean
public RedisTemplate redisTemplate(){
    RedisTemplate redisTemplate = new RedisTemplate();
    Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<Object>(Object.class);
    StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();

    ObjectMapper om = new ObjectMapper();
    om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
    om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
    jackson2JsonRedisSerializer.setObjectMapper(om);

    // key序列化使用StringRedisSerializer
    redisTemplate.setKeySerializer(stringRedisSerializer);
    redisTemplate.setHashKeySerializer(stringRedisSerializer);

    // value序列化jackson
    redisTemplate.setValueSerializer(jackson2JsonRedisSerializer);
    redisTemplate.setHashValueSerializer(jackson2JsonRedisSerializer);
    return redisTemplate;
}
```



## **Redis客户端命令对应的RedisTemplate中的方法列表**



### String结构

| **String类型结构**     |                                           |
| ---------------------- | ----------------------------------------- |
| Redis                  | RedisTemplate rt                          |
| set key value          | rt.opsForValue().set("key","value")       |
| get key                | rt.opsForValue().get("key")               |
| del key                | rt.delete("key")                          |
| strlen key             | rt.opsForValue().size("key")              |
| getset key value       | rt.opsForValue().getAndSet("key","value") |
| getrange key start end | rt.opsForValue().get("key",start,end)     |
| append key value       | rt.opsForValue().append("key","value")    |



### Hash结构

| **Hash结构**                             |                                                       |
| ---------------------------------------- | ----------------------------------------------------- |
| hmset key field1 value1 field2 value2... | rt.opsForHash().putAll("key",map) //map是一个集合对象 |
| hset key field value                     | rt.opsForHash().put("key","field","value")            |
| hexists key field                        | rt.opsForHash().hasKey("key","field")                 |
| hgetall key                              | rt.opsForHash().entries("key") //返回Map对象          |
| hvals key                                | rt.opsForHash().values("key") //返回List对象          |
| hkeys key                                | rt.opsForHash().keys("key") //返回List对象            |
| hmget key field1 field2...               | rt.opsForHash().multiGet("key",keyList)               |
| hsetnx key field value                   | rt.opsForHash().putIfAbsent("key","field","value"     |
| hdel key field1 field2                   | rt.opsForHash().delete("key","field1","field2")       |
| hget key field                           | rt.opsForHash().get("key","field")                    |

### List结构

| **List结构**                                               |                                                   |
| ---------------------------------------------------------- | ------------------------------------------------- |
| lpush list node1 node2 node3...                            | rt.opsForList().leftPush("list","node")           |
| rt.opsForList().leftPushAll("list",list) //list是集合对象  |                                                   |
| rpush list node1 node2 node3...                            | rt.opsForList().rightPush("list","node")          |
| rt.opsForList().rightPushAll("list",list) //list是集合对象 |                                                   |
| lindex key index                                           | rt.opsForList().index("list", index)              |
| llen key                                                   | rt.opsForList().size("key")                       |
| lpop key                                                   | rt.opsForList().leftPop("key")                    |
| rpop key                                                   | rt.opsForList().rightPop("key")                   |
| lpushx list node                                           | rt.opsForList().leftPushIfPresent("list","node")  |
| rpushx list node                                           | rt.opsForList().rightPushIfPresent("list","node") |
| lrange list start end                                      | rt.opsForList().range("list",start,end)           |
| lrem list count value                                      | rt.opsForList().remove("list",count,"value")      |
| lset key index value                                       | rt.opsForList().set("list",index,"value")         |
|                                                            |                                                   |



### Set结构

| **Set结构**                                        |                                                             |
| -------------------------------------------------- | ----------------------------------------------------------- |
| sadd key member1 member2...                        | rt.boundSetOps("key").add("member1","member2",...)          |
| rt.opsForSet().add("key", set) //set是一个集合对象 |                                                             |
| scard key                                          | rt.opsForSet().size("key")                                  |
| sidff key1 key2                                    | rt.opsForSet().difference("key1","key2") //返回一个集合对象 |
| sinter key1 key2                                   | rt.opsForSet().intersect("key1","key2")//同上               |
| sunion key1 key2                                   | rt.opsForSet().union("key1","key2")//同上                   |
| sdiffstore des key1 key2                           | rt.opsForSet().differenceAndStore("key1","key2","des")      |
| sinter des key1 key2                               | rt.opsForSet().intersectAndStore("key1","key2","des")       |
| sunionstore des key1 key2                          | rt.opsForSet().unionAndStore("key1","key2","des")           |
| sismember key member                               | rt.opsForSet().isMember("key","member")                     |
| smembers key                                       | rt.opsForSet().members("key")                               |
| spop key                                           | rt.opsForSet().pop("key")                                   |
| srandmember key count                              | rt.opsForSet().randomMember("key",count)                    |
| srem key member1 member2...                        | rt.opsForSet().remove("key","member1","member2",...)        |
