---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /rabbitmq/
typora-root-url: ..\.vuepress\public
---



## 1. 引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>

```

## 2. yml配置

Rabbitmq连接的基本信息配置

```yml
# 配置RabbitMQ的基本信息  ip 端口 username  password..
spring:
  rabbitmq:
    host: 192.168.135.130 # ip
    port: 5672
    username: hzz
    password: Root.123456
    virtual-host: /springboot
```





## 生产端

### 定义交换机，队列以及绑定关系的配置类⭐❤️

```java
@Configuration
public class RabbitMqConfig {

    //定义交换机的名字
    public static final String  EXCHANGE_NAME = "boot_topic_exchange";
    //定义队列的名字
    public static final String QUEUE_NAME = "boot_queue";

    //1、声明交换机
    @Bean("bootExchange")
    public Exchange bootExchange(){

        return ExchangeBuilder.topicExchange(EXCHANGE_NAME).durable(true).build();
    }



    //2、声明队列
    @Bean("bootQueue")
    public Queue bootQueue(){

        return QueueBuilder.durable(QUEUE_NAME).build();
    }


    //3、队列与交换机进行绑定
    @Bean
    public Binding bindQueueExchange(@Qualifier("bootQueue") Queue queue, @Qualifier("bootExchange") Exchange exchange){
        return BindingBuilder.bind(queue).to(exchange).with("boot.#").noargs();
    }

}
```



### 注入RabbitTemplate，调用方法，完成消息发送

springboot自动配置中带有RabbitAutoConfiguration，在这个类中注入了RabbitTemplate;

> 查看技巧，可以在RabbitTemplate的构造方法打上断点，进行跟踪，就可以发现

## 消费端

### @RabbitListener注解⭐

定义监听类，使用@RabbitListener注解完成队列监听

```java
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * @author 白起老师
 */
@Component
public class RabbitMQListener {

      //定义方法进行信息的监听   RabbitListener中的参数用于表示监听的是哪一个队列
      @RabbitListener(queues = "boot_queue")
      public void ListenerQueue(Message message){
          System.out.println("message:"+message.getBody());
      }
}

```

