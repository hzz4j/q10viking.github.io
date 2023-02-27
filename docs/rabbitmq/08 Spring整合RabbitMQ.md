---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /rabbitmq/
typora-root-url: ..\.vuepress\public
---



## **Spring** **整合** **RabbitMQ**

[Spring 整合 RabbbitMQ Source Code](https://github.com/Q10Viking/learncode/tree/main/rabbitmq/_02_spring_rabbitmq_produce_basic)

需求：使用 Spring **整合** **RabbitMQ**

```sh
生产者
    创建生产者工程
    添加依赖
    配置整合
    编写代码发送消息

```

```sh
消费者
    创建生产者工程
    添加依赖
    配置整合
    编写消息监听器⭐
```

## 依赖

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.1.7.RELEASE</version>
</dependency>

<dependency>
    <groupId>org.springframework.amqp</groupId>
    <artifactId>spring-rabbit</artifactId>
    <version>2.1.8.RELEASE</version>
</dependency>
```

## 配置

### 生产者

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:rabbit="http://www.springframework.org/schema/rabbit"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       https://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/rabbit
       http://www.springframework.org/schema/rabbit/spring-rabbit.xsd">
    <!--加载配置文件-->
    <context:property-placeholder location="classpath:rabbitmq.properties"/>

    <!-- 定义rabbitmq connectionFactory -->
    <rabbit:connection-factory id="connectionFactory" host="${rabbitmq.host}"
                               port="${rabbitmq.port}"
                               username="${rabbitmq.username}"
                               password="${rabbitmq.password}"
                               virtual-host="${rabbitmq.virtual-host}"/>
    <!--定义管理交换机、队列-->
    <rabbit:admin connection-factory="connectionFactory"/>

    <!--定义持久化队列，不存在则自动创建；不绑定到交换机则绑定到默认交换机
    默认交换机类型为direct，名字为：""，路由键为队列的名称
    -->
    <!--
        id：bean的名称
        name：queue的名称
        auto-declare:自动创建
        auto-delete:自动删除。 最后一个消费者和该队列断开连接后，自动删除队列
        durable：是否持久化
    -->

    <rabbit:queue id="spring_queue" name="spring_queue"    auto-declare="true"/>

    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~广播；所有队列都能收到消息~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <!--定义广播交换机中的持久化队列，不存在则自动创建-->
    <rabbit:queue id="spring_fanout_queue_1" name="spring_fanout_queue_1" auto-declare="true"/>

    <!--定义广播交换机中的持久化队列，不存在则自动创建-->
    <rabbit:queue id="spring_fanout_queue_2" name="spring_fanout_queue_2" auto-declare="true"/>

    <!--定义广播类型交换机；并绑定上述两个队列-->
    <rabbit:fanout-exchange id="spring_fanout_exchange" name="spring_fanout_exchange"  auto-declare="true">
        <rabbit:bindings>
            <rabbit:binding  queue="spring_fanout_queue_1"  />
            <rabbit:binding queue="spring_fanout_queue_2"/>
        </rabbit:bindings>
    </rabbit:fanout-exchange>


    <!-- 定义队列-->
    <rabbit:queue id="spring_direct_queue" name="spring_direct_queue"  auto-declare="true"/>

    <!--
      定义 Routing  路由模式 交互机
    -->
    <rabbit:direct-exchange name="spring_direct_exchange" >
        <rabbit:bindings>
            <!--direct 类型的交换机绑定队列  key ：路由key  queue：队列名称-->
            <rabbit:binding queue="spring_direct_queue" key="info"></rabbit:binding>
        </rabbit:bindings>

    </rabbit:direct-exchange>

    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~通配符；*匹配一个单词，#匹配多个单词 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <!--定义广播交换机中的持久化队列，不存在则自动创建-->
    <rabbit:queue id="spring_topic_queue_star" name="spring_topic_queue_star"  auto-declare="true"/>
    <!--定义广播交换机中的持久化队列，不存在则自动创建-->
    <rabbit:queue id="spring_topic_queue_well" name="spring_topic_queue_well" auto-declare="true"/>
    <!--定义广播交换机中的持久化队列，不存在则自动创建-->
    <rabbit:queue id="spring_topic_queue_well2" name="spring_topic_queue_well2" auto-declare="true"/>

    <!--
      声明  topic 类型的交换机
    -->
    <rabbit:topic-exchange id="spring_topic_exchange"  name="spring_topic_exchange" auto-declare="true">
        <rabbit:bindings>
            <rabbit:binding pattern="baiqi.*"  queue="spring_topic_queue_star"/>
            <rabbit:binding pattern="baiqi.#" queue="spring_topic_queue_well"/>
            <rabbit:binding pattern="itcast.#" queue="spring_topic_queue_well2"/>
        </rabbit:bindings>
    </rabbit:topic-exchange>

    <!--定义rabbitTemplate对象操作可以在代码中方便发送消息-->
    <rabbit:template id="rabbitTemplate" connection-factory="connectionFactory"/>
</beans>
```

### 消费端

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:rabbit="http://www.springframework.org/schema/rabbit"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       https://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/rabbit
       http://www.springframework.org/schema/rabbit/spring-rabbit.xsd">
    <!--加载配置文件-->
    <context:property-placeholder location="classpath:rabbitmq.properties"/>

    <!-- 定义rabbitmq connectionFactory -->
    <rabbit:connection-factory id="connectionFactory" host="${rabbitmq.host}"
                               port="${rabbitmq.port}"
                               username="${rabbitmq.username}"
                               password="${rabbitmq.password}"
                               virtual-host="${rabbitmq.virtual-host}"/>

    <bean id="springQueueListener" class="org.hzz.rabbitmq.listener.SpringQueueListener"/>
    <bean id="fanoutListener1" class="org.hzz.rabbitmq.listener.FanoutListener"/>

    <rabbit:listener-container connection-factory="connectionFactory" auto-declare="true">
        <rabbit:listener ref="springQueueListener" queue-names="spring_queue"/>
        <rabbit:listener ref="fanoutListener1" queue-names="spring_fanout_queue_1"/>
    </rabbit:listener-container>
</beans>
```





## 测试

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:spring-rabbitmq-producer.xml")
public class ProducerTest {
```

![image-20211031033626226](/images/RabbitMQ/image-20211031033626226.png)

![image-20211031033659177](/images/RabbitMQ/image-20211031033659177.png)



## 交互⭐

### 生产端：RabbitTemplate客户端

```java
rabbitTemplate.convertAndSend
```

### 消费端：MessageListener

