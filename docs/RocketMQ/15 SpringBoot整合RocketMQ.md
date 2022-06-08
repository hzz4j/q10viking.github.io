---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /RocketMQ/
typora-root-url: ..\.vuepress\public
---



::: tip

[github code: RocketMQ/SpringBootRocketMQ ](https://github.com/Q10Viking/learncode/tree/main/RocketMQ/SpringBootRocketMQ)

[github rocket-spring地址](https://github.com/apache/rocketmq-spring.git )

:::



## 依赖

```xml
<groupId>org.apache.rocketmq</groupId>
<artifactId>rocketmq-spring-boot-starter</artifactId>
<version>2.2.2</version>
```



## 生产者

```java
@Component
public class SpringProducer {
    @Autowired
    private RocketMQTemplate rocketMQTemplate;

    //发送普通消息的示例
    public void sendMessage(String topic,String msg){
        this.rocketMQTemplate.convertAndSend(topic,msg);
    }

    //发送事务消息的示例
    public void sendMessageInTransaction(String topic,String msg) throws InterruptedException {
        String[] tags = new String[] {"TagA", "TagB", "TagC", "TagD", "TagE"};
        for (int i = 0; i < 10; i++) {
            Message<String> message = MessageBuilder.withPayload(msg).build();
            String destination =topic+":"+tags[i % tags.length];
            SendResult sendResult = rocketMQTemplate.sendMessageInTransaction(destination, message,destination);
            System.out.printf("%s%n", sendResult);
            System.out.println("destination: "+destination);

            Thread.sleep(10);
        }
    }

}
```

## 事务消息

```java
@RocketMQTransactionListener(rocketMQTemplateBeanName = "rocketMQTemplate")
public class MyTransactionImpl implements RocketMQLocalTransactionListener {
    private ConcurrentHashMap<Object, Message> localTrans = new ConcurrentHashMap<>();

    @Override
    public RocketMQLocalTransactionState executeLocalTransaction(Message msg, Object arg) {
        Object transId = msg.getHeaders().get(RocketMQHeaders.PREFIX+RocketMQHeaders.TRANSACTION_ID);
        String destination = arg.toString();
        localTrans.put(transId,msg);
        //这个msg的实现类是GenericMessage，里面实现了toString方法
        //在Header中自定义的RocketMQHeaders.TAGS属性，到这里就没了。但是RocketMQHeaders.TRANSACTION_ID这个属性就还在。
        //而message的Header里面会默认保存RocketMQHeaders里的属性，但是都会加上一个RocketMQHeaders.PREFIX前缀
        System.out.println("executeLocalTransaction msg = "+msg);
        //转成RocketMQ的Message对象
        org.apache.rocketmq.common.message.Message message = RocketMQUtil.convertToRocketMessage(new StringMessageConverter(),"UTF-8",destination, msg);
        String tags = message.getTags();
        if(StringUtils.contains(tags,"TagA")){
            return RocketMQLocalTransactionState.COMMIT;
        }else if(StringUtils.contains(tags,"TagB")){
            return RocketMQLocalTransactionState.ROLLBACK;
        }else{
            return RocketMQLocalTransactionState.UNKNOWN;
        }
    }

    //延迟检查的时间间隔要有点奇怪。
    @Override
    public RocketMQLocalTransactionState checkLocalTransaction(Message msg) {
        String transId = msg.getHeaders().get(RocketMQHeaders.PREFIX+RocketMQHeaders.TRANSACTION_ID).toString();
        Message originalMessage = localTrans.get(transId);
        //这里能够获取到自定义的transaction_id属性
        System.out.println("checkLocalTransaction msg = "+originalMessage);
        //获取标签时，自定义的RocketMQHeaders.TAGS拿不到，但是框架会封装成一个带RocketMQHeaders.PREFIX的属性
//        String tags = msg.getHeaders().get(RocketMQHeaders.TAGS).toString();
        String tags = msg.getHeaders().get(RocketMQHeaders.PREFIX+RocketMQHeaders.TAGS).toString();
        if(StringUtils.contains(tags,"TagC")){
            return RocketMQLocalTransactionState.COMMIT;
        }else if(StringUtils.contains(tags,"TagD")){
            return RocketMQLocalTransactionState.ROLLBACK;
        }else{
            return RocketMQLocalTransactionState.UNKNOWN;
        }
    }
}
```

## 消费者

```java
@Component
@RocketMQMessageListener(consumerGroup = "springboot_consumer_group",
        topic = Topics.TOPIC,consumeMode = ConsumeMode.CONCURRENTLY)

public class SpringConsumer implements RocketMQListener<String> {
    @Override
    public void onMessage(String message) {
        System.out.println("Received message : "+ message);
    }
}

```

