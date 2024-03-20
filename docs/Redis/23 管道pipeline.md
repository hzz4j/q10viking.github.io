---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---



::: tip

[Source Code PipelineApp.java](https://github.com/Q10Viking/learncode/blob/main/redis/_01_java_redis/src/main/java/org/hzz/PipelineApp.java)

:::



## 管道pipeline的用处

客户端可以一次性发送多个请求而不用等待服务器的响应，待所有命令都发送完后再一次性读取服务的响应，这样可以**极大的降低多条命令执行的网络传输开销**，管道执行多条命令的网络开销实际上只相当于一次命令执行的网络开销。需要注意到是用pipeline方式打包命令发送，r**edis必须在处理完所有命令前先缓存起所有命令的处理结果**。打包的命令越多，**缓存消耗内存也越多**。所以并不是打包的命令越多越好。

pipeline中发送的每个command都会被server立即执行，如果执行失败，将会在此后的响应中得到信息；也就是pipeline并不是表达“所有command都一起成功”的语义，**管道中前面命令失败，后面命令不会有影响，继续执行**。



## 测试


> 多个命令一起发送，减少网络开销
>
> 注意但是不能保证原子性。



```java
public class PipelineApp {
    public static void main(String[] args) {
        JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
        jedisPoolConfig.setMaxTotal(20);
        jedisPoolConfig.setMaxIdle(10);
        jedisPoolConfig.setMinIdle(5);
        // timeout，这里既是连接超时又是读写超时，从Jedis 2.8开始有区分connectionTimeout和soTimeout的构造函数
        JedisPool jedisPool = new JedisPool(jedisPoolConfig, "192.168.187.135", 6379, 3000, null);
        //从redis连接池里拿出一个连接执行命令
        Jedis jedis = jedisPool.getResource();

        //管道的命令执行方式：cat redis.txt | redis-cli -h 127.0.0.1 -a password - p 6379 --pipe
        Pipeline pipeline = jedis.pipelined();
        for (int i = 0; i < 10; i++) {
            pipeline.incr("pipelineKey");
            pipeline.set("test::q10viking("+i+")","No."+i);
            //模拟管道报错
            //pl.setbit("error", -1, true);
        }
        List<Object> results = pipeline.syncAndReturnAll();
        System.out.println(results);

    }
}
/**
 * [1, OK, 2, OK, 3, OK, 4, OK, 5, OK, 6, OK, 7, OK, 8, OK, 9, OK, 10, OK]
 */
```

