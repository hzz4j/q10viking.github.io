---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /rabbitmq/
typora-root-url: ..\.vuepress\public
---

## **Topics** **通配符模式**

[Topic Source Code](https://github.com/Q10Viking/learncode/tree/main/rabbitmq/_01_rabbitmq_java_api/src/main/java/org/hzz/topic)

1. Topic 类型与 Direct 相比，都是可以根据 RoutingKey 把消息路由到不同的队列。只不过 Topic 类型Exchange 可以让队列在绑定 Routing key 的时候使用**通配符**
2. Routingkey 一般都是有一个或多个单词组成，多个单词之间以”.”分割，例如： item.insert
3. 规则：**# 匹配一个或多个词， \*匹配不多不少恰好1个词**，例如：item.# 能够匹配 item.insert.abc 或者 item.insert，item.* 只能匹配 item.insert

![image-20211031024047188](/images/RabbitMQ/image-20211031024047188.png)

![image-20211031024135577](/images/RabbitMQ/image-20211031024135577.png)

### 注意

1. exchange声明的是topic

   ![image-20211031024421485](/images/RabbitMQ/image-20211031024421485.png)

![image-20211031024512889](/images/RabbitMQ/image-20211031024512889.png)

## 小结⭐

**Topic 主题模式可以实现 Pub/Sub 发布与订阅模式和 Routing 路由模式的功能，只是 Topic 在配置routing key 的时候可以使用通配符，显得更加灵活。**



## 代码样例

> Weather.java

```java
public class Weather {
    public static void main(String[] args) throws Exception {

        Map area = new LinkedHashMap<String, String>();
        area.put("china.hunan.changsha.20201127", "中国湖南长沙20201127天气数据");
        area.put("china.hubei.wuhan.20201127", "中国湖北武汉20201127天气数据");
        area.put("china.hunan.zhuzhou.20201127", "中国湖南株洲20201127天气数据");
        area.put("us.cal.lsj.20201127", "美国加州洛杉矶20201127天气数据");

        area.put("china.hebei.shijiazhuang.20201128", "中国河北石家庄20201128天气数据");
        area.put("china.hubei.wuhan.20201128", "中国湖北武汉20201128天气数据");
        area.put("china.henan.zhengzhou.20201128", "中国河南郑州20201128天气数据");
        area.put("us.cal.lsj.20201128", "美国加州洛杉矶20201128天气数据");


        Connection connection = RabbitUtils.getConnection();
        Channel channel = connection.createChannel();

        Iterator<Map.Entry<String, String>> itr = area.entrySet().iterator();
        while (itr.hasNext()) {
            Map.Entry<String, String> me = itr.next();
            //第一个参数交换机名字   第二个参数作为 消息的routing key
            channel.basicPublish(RabbitConstant.EXCHANGE_WEATHER_TOPIC,me.getKey() , null , me.getValue().getBytes());

        }

        channel.close();
        connection.close();
    }
}
```

> Baidu.java

```java
public class Baidu {
    public static void main(String[] args) throws IOException {
        Connection connection = RabbitUtils.getConnection();
        final Channel channel = connection.createChannel();
        channel.queueDeclare(RabbitConstant.QUEUE_BAIDU, false, false, false, null);
        //queueBind用于将队列与交换机绑定
        //参数1：队列名 参数2：交互机名  参数三：路由key
        channel.queueBind(RabbitConstant.QUEUE_BAIDU, RabbitConstant.EXCHANGE_WEATHER_TOPIC, "*.*.*.20201127");
        // channel.queueBind(RabbitConstant.QUEUE_BAIDU, RabbitConstant.EXCHANGE_WEATHER_ROUTING, "china.hebei.shijiazhuang.20201128");
        channel.basicQos(1);
        channel.basicConsume(RabbitConstant.QUEUE_BAIDU , false , new DefaultConsumer(channel){
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("百度天气收到气象信息：" + new String(body));
                channel.basicAck(envelope.getDeliveryTag() , false);
            }
        });

    }
}
/**
 * 0 [main] INFO org.hzz.util.RabbitUtils  - 成功连接到： /192.168.135.130:5672
 * 百度天气收到气象信息：中国湖南长沙20201127天气数据
 * 百度天气收到气象信息：中国湖北武汉20201127天气数据
 * 百度天气收到气象信息：中国湖南株洲20201127天气数据
 * 百度天气收到气象信息：美国加州洛杉矶20201127天气数据
 */
```

