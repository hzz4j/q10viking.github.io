---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /rabbitmq/
typora-root-url: ..\.vuepress\public
---





```
1. 配置queue,exchange,和绑定
2. 生产者
3. 消费者
```



## 配置

```java
@Configuration
public class DirectConfig {

    @Bean
    public Queue pubsubQueueOne(){
        return new Queue(QueueConstant.DIRECT_QUEUE_ONE);
    }

    @Bean
    public Queue pubsubQueueTwo(){
        return new Queue(QueueConstant.DIRECT_QUEUE_TWO);
    }

    @Bean
    public DirectExchange setDirectExchange() {
        return new DirectExchange(ExchangeConstant.DIRECT_EXCHANGE);
    }

    @Bean
    public Binding bindQueueOne(){
        return BindingBuilder.bind(pubsubQueueOne())
                .to(setDirectExchange())
                .with(RouteKeyConstant.DIRECT_ROUTE_KEY_CHANG_SHA);
    }

    @Bean
    public Binding bindQueueTwo(){
        return BindingBuilder.bind(pubsubQueueTwo())
                .to(setDirectExchange())
                .with(RouteKeyConstant.DIRECT_ROUTE_KEY_BEI_JING);
    }
}

```



## 生产者

```java
@RestController
public class ProducerController {
    @Autowired
    private RabbitTemplate rabbitTemplate;


    /** ------------------helloworld模式-----------------------------*/
    @ApiOperation(value="helloWorld发送接口",notes="直接发送到队列")
    @GetMapping("/helloWorldSend")
    public Object helloWorldSend(String msg) {
        MessageProperties messageProperties = new MessageProperties();
        messageProperties.setContentType(MessageProperties.CONTENT_TYPE_TEXT_PLAIN);
        rabbitTemplate.send(QueueConstant.HELLO_WORLD_QUEUE,new Message(msg.getBytes(StandardCharsets.UTF_8),messageProperties));
        return "message send: "+msg;
    }

    /**-------------------------------------------------------------*/

    /** ------------------工作队列模式--------------------------------*/
    @ApiOperation(value="workqueue发送接口",notes="发送到所有监听该队列的消费")
    @GetMapping(value="/workqueueSend")
    public Object workqueueSend(String msg)  {
        MessageProperties messageProperties = new MessageProperties();
        messageProperties.setContentType(MessageProperties.CONTENT_TYPE_TEXT_PLAIN);
        //制造多个消息进行发送操作
        for (int i = 0; i <10 ; i++) {
            rabbitTemplate.send(QueueConstant.WORK_QUEUE,  new Message((msg+i).getBytes(StandardCharsets.UTF_8),messageProperties));
        }
        return "message sended: "+msg;
    }
    /**-------------------------------------------------------------*/



    /** ------------------发布订阅模式--------------------------------*/
    @ApiOperation(value="fanout发送接口",notes="发送到fanoutExchange。消息将往该exchange下的所有queue转发")
    @GetMapping(value="/fanoutSend")
    public Object fanoutSend(String msg)  {
        MessageProperties messageProperties = new MessageProperties();
        messageProperties.setContentType(MessageProperties.CONTENT_TYPE_TEXT_PLAIN);
        //fanout模式只往exchange里发送消息。分发到exchange下的所有queue
        rabbitTemplate.send(ExchangeConstant.FANOUT_EXCHANGE, "", new Message(msg.getBytes(StandardCharsets.UTF_8),messageProperties));
        return "message sended : "+msg;
    }
    /**-------------------------------------------------------------*/


    /** ------------------Routing模式--------------------------------*/
    @ApiOperation(value="direct发送接口",notes="发送到directExchange。exchange转发消息时，会往routingKey匹配的queue发送")
    @GetMapping(value="/directSend")
    public Object routingSend(String routingKey,String message)  {

        if(null == routingKey) {
            routingKey= RouteKeyConstant.DIRECT_ROUTE_KEY_BEI_JING;
        }
        MessageProperties messageProperties = new MessageProperties();
        messageProperties.setContentType(MessageProperties.CONTENT_TYPE_TEXT_PLAIN);
        //fanout模式只往exchange里发送消息。分发到exchange下的所有queue
        rabbitTemplate.send(ExchangeConstant.DIRECT_EXCHANGE, routingKey, new Message(message.getBytes(StandardCharsets.UTF_8),messageProperties));
        return "message sended : routingKey >"+routingKey+";message > "+message;
    }
    /**-------------------------------------------------------------*/


    /** ------------------Topic模式--------------------------------*/
    @ApiOperation(value="topic发送接口",notes="发送到topicExchange。exchange转发消息时，会往routingKey匹配的queue发送，*代表一个单词，#代表0个或多个单词。")
    @GetMapping(value="/topicSend")
    public Object topicSend(String routingKey,String message)  {

        if(null == routingKey) {
            routingKey="changsha.kf";
        }
        MessageProperties messageProperties = new MessageProperties();
        messageProperties.setContentType(MessageProperties.CONTENT_TYPE_TEXT_PLAIN);
        //fanout模式只往exchange里发送消息。分发到exchange下的所有queue
        rabbitTemplate.send(ExchangeConstant.TOPIC_EXCHANGE, routingKey, new Message(message.getBytes(StandardCharsets.UTF_8),messageProperties));
        return "message sended : routingKey >"+routingKey+";message > "+message;
    }
    /**-------------------------------------------------------------*/

}

```



## 消费者

```java
@Component
public class ConcumerReceiver {

    /** ------------------helloworld模式-----------------------------*/
    @RabbitListener(queues = QueueConstant.HELLO_WORLD_QUEUE)
    public void helloWorldReceiver(String msg){
        System.out.println("helloWorld模式 receiver msg: "+msg);
    }

    /**-------------------------------------------------------------*/

    /** ------------------工作队列模式--------------------------------*/
    @RabbitListener(queues = {QueueConstant.WORK_QUEUE})
    public void workReceiverOne(String msg){
        System.out.println("工作模式one receiver msg: "+msg);
    }

    @RabbitListener(queues = {QueueConstant.WORK_QUEUE})
    public void workReceiverTwo(String msg){
        System.out.println("工作模式Two receiver msg: "+msg);
    }
    /**-------------------------------------------------------------*/

    /** ----------------------路由模式--------------------------------*/
    @RabbitListener(queues=QueueConstant.DIRECT_QUEUE_ONE)
    public void routingReceiveq1(String message) {

        System.out.println("Routing路由模式routingReceiveq11111 received message : " +message);
    }

    @RabbitListener(queues=QueueConstant.DIRECT_QUEUE_TWO)
    public void routingReceiveq2(String message) {

        System.out.println("Routing路由模式routingReceiveq22222 received message : " +message);
    }

    /**-------------------------------------------------------------*/

    /** ------------------发布订阅模式--------------------------------*/
    @RabbitListener(queues=QueueConstant.PUBSUB_QUEUE_ONE)
    public void fanoutReceiveq1(String message) {
        System.out.println("发布订阅模式1received message : " +message);
    }
    @RabbitListener(queues=QueueConstant.PUBSUB_QUEUE_TWO)
    public void fanoutReceiveq2(String message) {

        System.out.println("发布订阅模式2 received message : " +message);
    }
    /**-------------------------------------------------------------*/

    /** ------------------Topic模式--------------------------------*/
    @RabbitListener(queues=QueueConstant.TOPIC_QUEUE_ONE)
    public void topicReceiveq1(String message) {
        System.out.println("Topic模式 topic_sb_mq_q1 received message : " +message);
    }

    @RabbitListener(queues=QueueConstant.TOPIC_QUEUE_TWO)
    public void topicReceiveq2(String message) {
        System.out.println("Topic模式 topic_sb_mq_q2 received  message : " +message);
    }
    /**-------------------------------------------------------------*/

}

```

