---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /zk/
typora-root-url: ..\.vuepress\public
---



## zookeeper官方

zookeeper 官方的客户端没有和服务端代码分离，他们为同一个jar 文件，所以我们直接引入zookeeper的maven即可， 这里版本请保持与服务端版本一致，不然会有很多兼容性的问题

[Source Code](https://github.com/Q10Viking/learncode/tree/main/zookeeper/basic-zk)

```xml
<dependency>
    <groupId>org.apache.zookeeper</groupId>
    <artifactId>zookeeper</artifactId>
    <version>3.7.1</version>
</dependency>
```

### 编码

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.zookeeper.*;

import java.io.IOException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

@Slf4j
public class ZookeepClient {

    private final static  String CONNECT_STR="localhost:2181";
    private final static Integer  SESSION_TIMEOUT=30*1000;
    private static ZooKeeper zooKeeper=null;
    private static CountDownLatch countDownLatch=new CountDownLatch(1);

    public static void main(String[] args) throws IOException, InterruptedException, KeeperException {
        zooKeeper = new ZooKeeper(CONNECT_STR, SESSION_TIMEOUT, new Watcher() {
            @Override
            public void process(WatchedEvent event) {
                if (event.getType() == Event.EventType.None
                        && event.getState() == Event.KeeperState.SyncConnected) {
                    log.info("连接已建立");
                    countDownLatch.countDown();
                }
            }
        });
        countDownLatch.await();

//===========================创建节点================================================
        MyConfig myConfig = new MyConfig();
        myConfig.setKey("hzz");
        myConfig.setValue("Q10Viking");
        ObjectMapper objectMapper = new ObjectMapper();
        byte[] bytes = objectMapper.writeValueAsBytes(myConfig);
        String s = zooKeeper.create("/myconfig", bytes, ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);

        //===========================设置监听==========================================
        Watcher watcher = new Watcher() {
            @SneakyThrows
            @Override
            public void process(WatchedEvent event) {
                if (event.getType() == Event.EventType.NodeDataChanged
                        && event.getPath() != null && event.getPath().equals("/myconfig")) {
                    log.info(" PATH:{}  发生了数据变化", event.getPath());
                    // 设置循环监听
                    byte[] data = zooKeeper.getData("/myconfig", this, null);
                    MyConfig newConfig = objectMapper.readValue(new String(data), MyConfig.class);
                    log.info("数据发生变化: {}", newConfig);
                }
            }
        };
        // 获取数据
        byte[] data = zooKeeper.getData("/myconfig", watcher, null);
        MyConfig originalMyConfig = objectMapper.readValue(new String(data), MyConfig.class);
        log.info("原始数据: {}", originalMyConfig);

        TimeUnit.SECONDS.sleep(Integer.MAX_VALUE);
    }
}
/**
 * 2023-04-26 22:44:44.142 [INFO ] org.hzz.ZookeepClient [main-EventThread] : 连接已建立
 * 2023-04-26 22:44:44.318 [INFO ] org.hzz.ZookeepClient [main] : 原始数据: MyConfig(key=hzz, value=Q10Viking)
 */
```



> zk上节点的内容

![image-20230426224721830](/images/zk/image-20230426224721830.png)

因为代码中监听了这个节点，我们在zk上更新一下值，发现程序监听到了值的改变

![image-20230426225008409](/images/zk/image-20230426225008409.png)



## 应用与zk监听的概览❤️

::: tip

监听与事件的触发

:::

<img src="/images/zk/image-20211118072058711.png" />

