---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /kafka/
typora-root-url: ..\.vuepress\public
---



::: details

kafka服务器使用的版本是2.5.0

所以客户端的依赖也是2.5.0

:::



## Producer

- 配置生产者参数属性和创建生产者对象
- 构建消息：ProducerRecord;
- 发送消息
- 关闭生产者



```java
@Slf4j
public class Producer {
    public static void main(String[] args) {

        Properties properties = new Properties();
        // 服务器用逗号分割
        properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,"172.29.96.105:9092");

        // 生产者的ID
        properties.put(ProducerConfig.CLIENT_ID_CONFIG,"hello.world.producer");

        // 序列化器
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);

        KafkaProducer<String, String> producer = null;

        try {
            // 1. 创建生产者对象
            producer = new KafkaProducer<>(properties);
            // 2. 创建消息对象

            User user = new User(1, "Q10Viking");
            // args: topic ,value
            ProducerRecord<String, String> record = new ProducerRecord<>(Consts.TOPIC,
                    JSON.toJSONString(user));

            // 3. 发送消息
            producer.send(record);
            log.info("消息发送成功");
        }finally {
            if (producer != null) producer.close();
        }
    }
}
```



> 在kafka中直接使用工具脚本接收消息

```sh
# bin/kafka-console-consumer.sh  --bootstrap-server 172.29.96.105:9092  --from-beginning  --topic java-kafka

q10viking@LAPTOP-PJLAUUSP:~/software/kafka_2.12-2.5.0$ bin/kafka-console-consumer.sh \
>  --bootstrap-server 172.29.96.105:9092 \
>  --from-beginning \
>  --topic java-kafka
{"id":1,"username":"Q10Viking"}
{"id":1,"username":"Q10Viking"}
```

![image-20230422211821466](/images/kafka/image-20230422211821466.png)



## Consumer

- 配置消费者参数属性和构造消费者对象
- 订阅主题
- 拉取消息并进行消息处理
- 提交消费偏移量，关闭消费者



```java
@Slf4j
public class Consumer {
    public static void main(String[] args) {

        Properties properties = new Properties();
        properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "172.29.96.105:9092");
        // 反序列化器
        properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        // 消费者组
        properties.put(ConsumerConfig.GROUP_ID_CONFIG, "java-kafka-consumer-group");
        // 自动提交offset
        properties.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, true);
        // 连接超时时间
        properties.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, 30000);
        // 自动提交offset的时间间隔
        properties.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, 5000);
        // 消费者的ID
        properties.put(ConsumerConfig.CLIENT_ID_CONFIG, "192.168.135.1");
        // 从头开始消费 --from-beginning
        properties.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        KafkaConsumer<String, String> consumer = null;
        try {
            // 1. 创建消费者对象
            consumer = new KafkaConsumer<>(properties);
            // 2. 订阅主题
            consumer.subscribe(Collections.singleton(Consts.TOPIC));
            // 3. 拉取数据
            for (; ; ) {
                // 拉去数据
                ConsumerRecords<String, String> records = consumer.poll(1000);
                if(records.count()!=0 ) System.out.println("总共消息数量: "+records.count());
                // 获取分区
                Set<TopicPartition> partitions = records.partitions();
                for (TopicPartition partition : partitions) {
                    // 获取每个分区的数据,分区内的数据是有序的
                    records.records(partition).forEach(record -> {
                        System.out.println("分区：" + partition.partition() + " 偏移量：" + record.offset() + " key：" + record.key() + " value：" + record.value());
                    });
                }

            }
        } finally {
            if (consumer != null) consumer.close();
        }
    }
}
/**
 * 总共消息数量: 10
 * 分区：0 偏移量：2 key：null value：{"id":0,"username":"Q10Viking"}
 * 分区：0 偏移量：3 key：null value：{"id":1,"username":"Q10Viking"}
 * 分区：0 偏移量：4 key：null value：{"id":2,"username":"Q10Viking"}
 * 分区：0 偏移量：5 key：null value：{"id":3,"username":"Q10Viking"}
 * 分区：0 偏移量：6 key：null value：{"id":4,"username":"Q10Viking"}
 * 分区：0 偏移量：7 key：null value：{"id":5,"username":"Q10Viking"}
 * 分区：0 偏移量：8 key：null value：{"id":6,"username":"Q10Viking"}
 * 分区：0 偏移量：9 key：null value：{"id":7,"username":"Q10Viking"}
 * 分区：0 偏移量：10 key：null value：{"id":8,"username":"Q10Viking"}
 * 分区：0 偏移量：11 key：null value：{"id":9,"username":"Q10Viking"}
 */
```



> 查看消费组，可以看到消费位移自动提交了为12（消费消息的offset+1）

```sh
GROUP                     TOPIC           PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG             CONSUMER-ID                                        HOST            CLIENT-ID
java-kafka-consumer-group java-kafka      0          12              12              0               192.168.135.1-ae1acd2c-2a65-466c-a73a-3d3fd80e8a6b /172.29.96.1    192.168.135.1
```

