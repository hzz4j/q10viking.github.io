---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /kafka/
typora-root-url: ..\.vuepress\public
---



[Source Code]()

## 依赖

版本匹配kafka2.5.0

```xml
<!-- https://mvnrepository.com/artifact/org.apache.kafka/kafka-clients -->
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-clients</artifactId>
    <version>2.5.0</version>
</dependency>

<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.apache.kafka</groupId>
            <artifactId>kafka-clients</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```



## 配置

```yml


spring:
  kafka:
    bootstrap-servers: 172.29.96.105:9092,172.29.96.105:9093,172.29.96.105:9094
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
      acks: 1
      client-id: producer
      retries: 3 # 设置大于0的值，则客户端会将发送失败的记录重新发送
      batch-size: 16384
      buffer-memory: 33554432
    consumer:
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      auto-offset-reset: earliest
      enable-auto-commit: false
    listener:
      # 当每一条记录被消费者监听器（ListenerConsumer）处理之后提交
      # RECORD
      # 当每一批poll()的数据被消费者监听器（ListenerConsumer）处理之后提交
      # BATCH
      # 当每一批poll()的数据被消费者监听器（ListenerConsumer）处理之后，距离上次提交时间大于TIME时提交
      # TIME
      # 当每一批poll()的数据被消费者监听器（ListenerConsumer）处理之后，被处理record数量大于等于COUNT时提交
      # COUNT
      # TIME |　COUNT　有一个条件满足时提交
      # COUNT_TIME
      # 当每一批poll()的数据被消费者监听器（ListenerConsumer）处理之后, 手动调用Acknowledgment.acknowledge()后提交
      # MANUAL
      # 手动调用Acknowledgment.acknowledge()后立即提交
      # MANUAL_IMMEDIATE
      ack-mode: manual_immediate
server:
  port: 8888
```



## 生产者

```java
@RestController
@RequestMapping("/kafka")
@Slf4j
public class KafkaController {

    private static final AtomicInteger count = new AtomicInteger(0);
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;


    @GetMapping("/send")
    public String send(@RequestParam("message") String message) {
        kafkaTemplate.send(KafkaConsts.TOPIC,String.valueOf(count.getAndIncrement()) ,message);
        log.info("send message:{} - {}", count.get(),message);
        return "success: "+count.get()+message;
    }
}
```

![image-20230423123246115](/images/kafka/image-20230423123246115.png)



## 消费监听

```java
@Component
@Slf4j
public class Consumer {

    /**
     * @KafkaListener(groupId = "testGroup", topicPartitions = {
     *             @TopicPartition(topic = "topic1", partitions = {"0", "1"}),
     *             @TopicPartition(topic = "topic2", partitions = "0",
     *                     partitionOffsets = @PartitionOffset(partition = "1", initialOffset = "100"))
     *     },concurrency = "6")
     *  //concurrency就是同组下的消费者个数，就是并发消费数，必须小于等于分区总数
     * @param record
     */
    @KafkaListener(topics = KafkaConsts.TOPIC, groupId = "q10viking-group",concurrency = "3")
    public void listenJavaCLusterTopic(ConsumerRecord<String,String> record, Acknowledgment ack) {
        log.info("listenJavaCLusterTopic receive message: partition={} offset={} key={} - value={}",
                record.partition(),record.offset(), record.key(),record.value());
        ack.acknowledge();
    }
    /**
     * partition=2 offset=5 key=3 - value=learning kafka
     * partition=1 offset=0 key=4 - value=learning kafka
     * partition=0 offset=5 key=5 - value=learning kafka
     * partition=1 offset=1 key=6 - value=learning kafka
     * partition=0 offset=6 key=7 - value=learning kafka
     */
}
```



> concurrency的作用：同组下的消费者个数，就是并发消费数，必须小于等于分区总数

```sh
2023-04-23 12:26:13.565  INFO 26548 --- [ntainer#0-1-C-1] o.s.k.l.KafkaMessageListenerContainer    : q10viking-group: partitions assigned: [java-cluster-topic-1]
2023-04-23 12:26:13.565  INFO 26548 --- [ntainer#0-0-C-1] o.s.k.l.KafkaMessageListenerContainer    : q10viking-group: partitions assigned: [java-cluster-topic-0]
2023-04-23 12:26:13.565  INFO 26548 --- [ntainer#0-2-C-1] o.s.k.l.KafkaMessageListenerContainer    : q10viking-group: partitions assigned: [java-cluster-topic-2]
```

```
bin/kafka-consumer-groups.sh --bootstrap-server 172.29.96.105:9092,172.29.96.105:9093,172.29.96.105:9094 --describe --group q10viking-group
```

```sh

GROUP           TOPIC              PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG             CONSUMER-ID                                                     HOST            CLIENT-ID
q10viking-group java-cluster-topic 2          6               6               0               consumer-q10viking-group-3-d4a5a573-3c6a-4aac-9d09-695ab267ec6f /172.29.96.1    consumer-q10viking-group-3
q10viking-group java-cluster-topic 1          2               2               0               consumer-q10viking-group-2-9791cd08-f0da-4cff-ac1e-926fbed55e90 /172.29.96.1    consumer-q10viking-group-2
q10viking-group java-cluster-topic 0          7               7               0               consumer-q10viking-group-1-909d8c18-6e35-423e-a15e-67a93e7b3e40 /172.29.96.1    consumer-q10viking-group-1
```

![image-20230423123123194](/images/kafka/image-20230423123123194.png)