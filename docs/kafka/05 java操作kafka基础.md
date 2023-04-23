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

[Source Code](https://github.com/Q10Viking/learncode/tree/main/kafka/helloworld)

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







## 生产者核心参数

```java
import com.alibaba.fastjson.JSON;
import org.apache.kafka.clients.producer.*;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

public class MsgProducer {
    private final static String TOPIC_NAME = "my-replicated-topic";

    public static void main(String[] args) throws InterruptedException, ExecutionException {
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "192.168.65.60:9092,192.168.65.60:9093,192.168.65.60:9094");
        /*
         发出消息持久化机制参数
        （1）acks=0： 表示producer不需要等待任何broker确认收到消息的回复，就可以继续发送下一条消息。性能最高，但是最容易丢消息。
        （2）acks=1： 至少要等待leader已经成功将数据写入本地log，但是不需要等待所有follower是否成功写入。就可以继续发送下一
             条消息。这种情况下，如果follower没有成功备份数据，而此时leader又挂掉，则消息会丢失。
        （3）acks=-1或all： 需要等待 min.insync.replicas(默认为1，推荐配置大于等于2) 这个参数配置的副本个数都成功写入日志，这种策略会保证
            只要有一个备份存活就不会丢失数据。这是最强的数据保证。一般除非是金融级别，或跟钱打交道的场景才会使用这种配置。
         */
        /*props.put(ProducerConfig.ACKS_CONFIG, "1");
         *//*
        发送失败会重试，默认重试间隔100ms，重试能保证消息发送的可靠性，但是也可能造成消息重复发送，比如网络抖动，所以需要在
        接收者那边做好消息接收的幂等性处理
        *//*
        props.put(ProducerConfig.RETRIES_CONFIG, 3);
        //重试间隔设置
        props.put(ProducerConfig.RETRY_BACKOFF_MS_CONFIG, 300);
        //设置发送消息的本地缓冲区，如果设置了该缓冲区，消息会先发送到本地缓冲区，可以提高消息发送性能，默认值是33554432，即32MB
        props.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 33554432);
        *//*
        kafka本地线程会从缓冲区取数据，批量发送到broker，
        设置批量发送消息的大小，默认值是16384，即16kb，就是说一个batch满了16kb就发送出去
        *//*
        props.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384);
        *//*
        默认值是0，意思就是消息必须立即被发送，但这样会影响性能
        一般设置10毫秒左右，就是说这个消息发送完后会进入本地的一个batch，如果10毫秒内，这个batch满了16kb就会随batch一起被发送出去
        如果10毫秒内，batch没满，那么也必须把消息发送出去，不能让消息的发送延迟时间太长
        *//*
        props.put(ProducerConfig.LINGER_MS_CONFIG, 10);*/
        //把发送的key从字符串序列化为字节数组
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        //把发送消息value从字符串序列化为字节数组
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

        Producer<String, String> producer = new KafkaProducer<String, String>(props);

        int msgNum = 5;
        final CountDownLatch countDownLatch = new CountDownLatch(msgNum);
        for (int i = 1; i <= msgNum; i++) {
            Order order = new Order(i, 100 + i, 1, 1000.00);
            //指定发送分区
            /*ProducerRecord<String, String> producerRecord = new ProducerRecord<String, String>(TOPIC_NAME
                    , 0, order.getOrderId().toString(), JSON.toJSONString(order));*/
            //未指定发送分区，具体发送的分区计算公式：hash(key)%partitionNum
            ProducerRecord<String, String> producerRecord = new ProducerRecord<String, String>(TOPIC_NAME
                                                                                               , order.getOrderId().toString(), JSON.toJSONString(order));

            //等待消息发送成功的同步阻塞方法
            /*RecordMetadata metadata = producer.send(producerRecord).get();
            System.out.println("同步方式发送消息结果：" + "topic-" + metadata.topic() + "|partition-"
                    + metadata.partition() + "|offset-" + metadata.offset());*/

            //异步回调方式发送消息
            producer.send(producerRecord, new Callback() {
                public void onCompletion(RecordMetadata metadata, Exception exception) {
                    if (exception != null) {
                        System.err.println("发送消息失败：" + exception.getStackTrace());

                    }
                    if (metadata != null) {
                        System.out.println("异步方式发送消息结果：" + "topic-" + metadata.topic() + "|partition-"
                                           + metadata.partition() + "|offset-" + metadata.offset());
                    }
                    countDownLatch.countDown();
                }
            });

            //送积分 TODO

        }

        countDownLatch.await(5, TimeUnit.SECONDS);
        producer.close();
    }
}
```





## 消费者核心参数

```java
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.time.Duration;
import java.util.Arrays;
import java.util.Properties;

public class MsgConsumer {
    private final static String TOPIC_NAME = "my-replicated-topic";
    private final static String CONSUMER_GROUP_NAME = "testGroup";

    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "192.168.65.60:9092,192.168.65.60:9093,192.168.65.60:9094");
        // 消费分组名
        props.put(ConsumerConfig.GROUP_ID_CONFIG, CONSUMER_GROUP_NAME);
        // 是否自动提交offset，默认就是true
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true");
        // 自动提交offset的间隔时间
        props.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "1000");
        //props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");
        /*
        当消费主题的是一个新的消费组，或者指定offset的消费方式，offset不存在，那么应该如何消费
        latest(默认) ：只消费自己启动之后发送到主题的消息
        earliest：第一次从头开始消费，以后按照消费offset记录继续消费，这个需要区别于consumer.seekToBeginning(每次都从头开始消费)
        */
        //props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        /*
      consumer给broker发送心跳的间隔时间，broker接收到心跳如果此时有rebalance发生会通过心跳响应将
      rebalance方案下发给consumer，这个时间可以稍微短一点
      */
        props.put(ConsumerConfig.HEARTBEAT_INTERVAL_MS_CONFIG, 1000);
        /*
        服务端broker多久感知不到一个consumer心跳就认为他故障了，会将其踢出消费组，
        对应的Partition也会被重新分配给其他consumer，默认是10秒
        */
        props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, 10 * 1000);
        //一次poll最大拉取消息的条数，如果消费者处理速度很快，可以设置大点，如果处理速度一般，可以设置小点
        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 500);
        /*
        如果两次poll操作间隔超过了这个时间，broker就会认为这个consumer处理能力太弱，
        会将其踢出消费组，将分区分配给别的consumer消费
        */
        props.put(ConsumerConfig.MAX_POLL_INTERVAL_MS_CONFIG, 30 * 1000);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        KafkaConsumer<String, String> consumer = new KafkaConsumer<String, String>(props);

        consumer.subscribe(Arrays.asList(TOPIC_NAME));
        // 消费指定分区
        //consumer.assign(Arrays.asList(new TopicPartition(TOPIC_NAME, 0)));

        //消息回溯消费
        /*consumer.assign(Arrays.asList(new TopicPartition(TOPIC_NAME, 0)));
        consumer.seekToBeginning(Arrays.asList(new TopicPartition(TOPIC_NAME, 0)));*/

        //指定offset消费
        /*consumer.assign(Arrays.asList(new TopicPartition(TOPIC_NAME, 0)));
        consumer.seek(new TopicPartition(TOPIC_NAME, 0), 10);*/

        //从指定时间点开始消费
        /*List<PartitionInfo> topicPartitions = consumer.partitionsFor(TOPIC_NAME);
        //从1小时前开始消费
        long fetchDataTime = new Date().getTime() - 1000 * 60 * 60;
        Map<TopicPartition, Long> map = new HashMap<>();
        for (PartitionInfo par : topicPartitions) {
            map.put(new TopicPartition(topicName, par.partition()), fetchDataTime);
        }
        Map<TopicPartition, OffsetAndTimestamp> parMap = consumer.offsetsForTimes(map);
        for (Map.Entry<TopicPartition, OffsetAndTimestamp> entry : parMap.entrySet()) {
            TopicPartition key = entry.getKey();
            OffsetAndTimestamp value = entry.getValue();
            if (key == null || value == null) continue;
            Long offset = value.offset();
            System.out.println("partition-" + key.partition() + "|offset-" + offset);
            System.out.println();
            //根据消费里的timestamp确定offset
            if (value != null) {
                consumer.assign(Arrays.asList(key));
                consumer.seek(key, offset);
            }
        }*/

        while (true) {
            /*
             * poll() API 是拉取消息的长轮询
             */
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(1000));
            for (ConsumerRecord<String, String> record : records) {
                System.out.printf("收到消息：partition = %d,offset = %d, key = %s, value = %s%n", record.partition(),
                                  record.offset(), record.key(), record.value());
            }

            /*if (records.count() > 0) {
                // 手动同步提交offset，当前线程会阻塞直到offset提交成功
                // 一般使用同步提交，因为提交之后一般也没有什么逻辑代码了
                consumer.commitSync();

                // 手动异步提交offset，当前线程提交offset不会阻塞，可以继续处理后面的程序逻辑
                consumer.commitAsync(new OffsetCommitCallback() {
                    @Override
                    public void onComplete(Map<TopicPartition, OffsetAndMetadata> offsets, Exception exception) {
                        if (exception != null) {
                            System.err.println("Commit failed for " + offsets);
                            System.err.println("Commit failed exception: " + exception.getStackTrace());
                        }
                    }
                });

            }*/
        }
    }
}
```

