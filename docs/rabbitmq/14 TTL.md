---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /rabbitmq/
typora-root-url: ..\.vuepress\public
---

## TTL

1. TTL 全称 Time To Live（存活时间/过期时间）。
2. **当消息到达存活时间后，还没有被消费，会被自动清除。**
3. RabbitMQ可以对消息设置过期时间，也可以对整个队列（Queue）设置过期时间

### 队列设置ttl

![image-20211031063750080](/../../../../saas-yong/fullstack/Java架构师之路/Rabbitmq/imgs/image-20211031063750080.png)

### 消息设置ttl

![image-20211031064246588](/../../../../saas-yong/fullstack/Java架构师之路/Rabbitmq/imgs/image-20211031064246588.png)



## Spring的配置

```xml
    <!--ttl-->
    <rabbit:queue name="test_queue_ttl" id="test_queue_ttl">
        <!--设置queue的参数-->
        <rabbit:queue-arguments>
            <!--x-message-ttl指队列的过期时间-->
            <entry key="x-message-ttl" value="10000" value-type="java.lang.Integer"></entry>
        </rabbit:queue-arguments>
    </rabbit:queue>
```



## 小结

1. 设置队列过期时间使用参数：x-message-ttl，单位：ms(毫秒)，会**对整个队列消息统一过期**。
2. 设置消息过期时间使用参数：expiration。单位：ms(毫秒)，**当该消息在队列头部时（消费时），会单独判断这一消息是否过期**⭐。
3. 如果两者都进行了设置，以时间短的为准。