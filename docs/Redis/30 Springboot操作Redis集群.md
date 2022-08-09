---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---



::: tip

[Source Code springboot_redis_cluster](https://github.com/Q10Viking/learncode/tree/main/redis/_04_springboot_redis_cluster)

:::



## 配置

```yaml

spring:
  redis:
    database: 0
    timeout: 3000
    password: Root.123456
    #    sentinel:    #哨兵模式
    #      master: mymaster #主服务器所在集群名称
    #      nodes: 192.168.187.135:26379,192.168.187.135:26380,192.168.187.135:26381
    cluster:
      nodes: 192.168.187.135:8001,192.168.187.130:8002,192.168.187.132:8003,192.168.187.135:8004,192.168.187.130:8005,192.168.187.132:8006
    lettuce:  # springboot中使用的redis连接池为lettuce不是jedis
      pool:
        max-idle: 50
        min-idle: 10
        max-active: 100
        max-wait: 1000s
```



## 测试

```java
@Override
public void run(String... args) throws Exception {
    stringRedisTemplate.opsForValue().set("springboot:hzz","Hello q10viking");
    String s = stringRedisTemplate.opsForValue().get("springboot:hzz");
    System.out.println(s);
}
```

![image-20220809165441315](/images/Redis/image-20220809165441315.png)