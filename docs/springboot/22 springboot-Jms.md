---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---



## JMS

JMS(Java Message Service）是一套规范

ActiveMQ实现了JMS 1.1 with full client implementation including JNDI

[what-apache-activemq](https://www.openlogic.com/blog/what-apache-activemq#difference)

## SpringBoot内嵌activemq

> [Spring Support](https://activemq.apache.org/spring-support) so that ActiveMQ can be easily embedded into Spring applications and configured using Spring’s XML configuration mechanism
>
> --- from [ActiveMQ (apache.org)](https://activemq.apache.org/components/classic/)

根据[Springboot官网 对 Activemq 的支持](https://docs.spring.io/spring-boot/docs/2.7.12/reference/html/messaging.html#messaging.jms.activemq)的描述，只要classpath存在ActiveMQ，那么springboot会默认启动内嵌的activemq。前提条件是没有在配置文件没有提供url连接配置并且没有禁用。

> When [ActiveMQ](https://activemq.apache.org/) is available on the classpath, Spring Boot can also configure a `ConnectionFactory`. If the broker is present, an embedded broker is automatically started and configured (provided no broker URL is specified through configuration and the embedded broker is not disabled in the configuration).
>
> If you use `spring-boot-starter-activemq`, the necessary dependencies to connect or embed an ActiveMQ instance are provided, as is the Spring infrastructure to integrate with JMS.

![image-20230605125318039](/images/springboot/image-20230605125318039.png)



如以下情况会禁止内嵌的activemq的创建

1. 直接禁止

   ```yaml
   spring:
     activemq:
       in-memory: false
   ```

   ![image-20230605125551139](/images/springboot/image-20230605125551139.png)

2. 提供了额外的url

   ```yaml
   spring:
     activemq:
       broker-url: "tcp://192.168.1.210:9876"
       user: "admin"
       password: "secret"
   ```

::: tip

本项目主要是体验jms,所以不打算而外安装ActiveMQ，所以采用内嵌的方式演示.

内嵌的方式它默认使用url是：`vm://localhost`

:::



## 依赖

[Source Code](https://github.com/Q10Viking/learncode/tree/main/springboot/springboot-jms-activemq)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-activemq</artifactId>
</dependency>
```

### 配置JMS

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.support.converter.MappingJackson2MessageConverter;
import org.springframework.jms.support.converter.MessageConverter;
import org.springframework.jms.support.converter.MessageType;

@Configuration
@EnableJms // 启动JMS listener
public class JmsConfig {

    // 用于发送java对象
    @Bean
    public MessageConverter jacksonJmsMessageConverter() {
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        converter.setTargetType(MessageType.TEXT);
        converter.setTypeIdPropertyName("_type");
        return converter;
    }
}
```

### 收消息配置

```java
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class Receiver {

    @JmsListener(destination = "str.queue")
    public void receiveMessage(String message) {
        System.out.println("Received <" + message + ">");
    }

    @JmsListener(destination = "entity.queue")
    public void receiveMessage(org.hzz.entity.Email email) {
        System.out.println("Received <" + email + ">");
    }
}
```



### 测试

```java
@SpringBootApplication
public class SpringbootJmsActivemqApplication {

    @Autowired
    private JmsTemplate jmsTemplate;

    public static void main(String[] args) {
        SpringApplication.run(SpringbootJmsActivemqApplication.class, args);
    }

    @Bean
    public CommandLineRunner testStr(){
        return args -> {
            jmsTemplate.convertAndSend("str.queue", "hello jms activemq");
        };
    }


    @Bean
    public CommandLineRunner testEntity() {
        return args -> {
            jmsTemplate.convertAndSend("entity.queue"
                    , new Email("q10viking", "hello jms activemq"));
        };
    }
}
```

![image-20230605140823691](/images/springboot/image-20230605140823691.png)

## JmsTemplate

> 自动配置类`JmsAutoConfiguration`配置了模板

```java
@Bean
@ConditionalOnMissingBean(JmsOperations.class)
@ConditionalOnSingleCandidate(ConnectionFactory.class)
public JmsTemplate jmsTemplate(ConnectionFactory connectionFactory) {
    PropertyMapper map = PropertyMapper.get();
    JmsTemplate template = new JmsTemplate(connectionFactory);
    template.setPubSubDomain(this.properties.isPubSubDomain());
    map.from(this.destinationResolver::getIfUnique).whenNonNull().to(template::setDestinationResolver);
    map.from(this.messageConverter::getIfUnique).whenNonNull().to(template::setMessageConverter);
    mapTemplateProperties(this.properties.getTemplate(), template);
    return template;
}
```



## 参考

[Using JMS in Spring Boot | Lanky Dan Blog](https://lankydan.dev/2017/06/18/using-jms-in-spring-boot)

[Springboot官网 对 Activemq 的支持](https://docs.spring.io/spring-boot/docs/2.7.12/reference/html/messaging.html#messaging.jms.activemq)

[Getting Started | Messaging with JMS (spring.io)](https://spring.io/guides/gs/messaging-jms/)

[ActiveMQ (apache.org)](https://activemq.apache.org/components/classic/)

[ActiveMQ vm transport](https://activemq.apache.org/vm-transport-reference.html)