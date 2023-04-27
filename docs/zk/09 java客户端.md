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

```sh
q10viking@LAPTOP-PJLAUUSP:/usr/zk/zookeeper-3.7.1$ bin/zkServer.sh version
ZooKeeper JMX enabled by default
Using config: /usr/zk/zookeeper-3.7.1/bin/../conf/zoo.cfg
Apache ZooKeeper, version 3.7.1 2022-05-07 06:45 UTC
```

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



## Curator

1. Curator 是一套由netflix 公司开源的，Java 语言编程的 ZooKeeper 客户端框架，Curator项目是现在ZooKeeper 客户端中使用最多，对ZooKeeper 版本支持最好的第三方客户端，并推荐使用
2. Curator 把我们平时常用的很多 ZooKeeper 服务开发功能做了封装，例如 Leader 选举、分布式计数器、分布式锁。这就减少了技术人员在使用 ZooKeeper 时的大部分底层细节开发工作
3. 在**会话重新连接、Watch 反复注册、多种异常处理等使用场景中**，用原生的 ZooKeeper 处理比较复杂。而在使用 Curator 时，由于其对这些功能都做了高度的封装，使用起来更加简单，不但减少了开发时间，而且增强了程序的可靠性。

> 依赖

```xml
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>5.0.0</version>
    <exclusions>
        <exclusion>
            <groupId>org.apache.zookeeper</groupId>
            <artifactId>zookeeper</artifactId>
        </exclusion>
    </exclusions>
</dependency>

<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-x-discovery</artifactId>
    <version>5.0.0</version>
    <exclusions>
        <exclusion>
            <groupId>org.apache.zookeeper</groupId>
            <artifactId>zookeeper</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.apache.zookeeper</groupId>
    <artifactId>zookeeper</artifactId>
    <version>3.7.1</version>
</dependency>
```



### 创建会话

要进行客户端服务器交互，第一步就要创建会话

Curator 提供了多种方式创建会话，比如用静态工厂方式创建： 

```java
// 重试策略 
RetryPolicy retryPolicy = new ExponentialBackoffRetry(1000, 3)
CuratorFramework client = CuratorFrameworkFactory.newClient(zookeeperConnectionString, retryPolicy);
client.start();
```

或者使用 fluent 风格创建

```java
@Before
public void init() {
    curatorFramework = CuratorFrameworkFactory.builder()
        .connectString(CONNECT_STR)
        .sessionTimeoutMs(sessionTimeoutMs)
        .connectionTimeoutMs(connectionTimeoutMs)
        .retryPolicy(new ExponentialBackoffRetry(1000, 3))
        .build();
    curatorFramework.start();
}
```

这段代码的编码风格采用了流式方式，最核心的类是 CuratorFramework 类，该类的作用是定义一个 ZooKeeper 客户端对象，并在之后的上下文中使用。在定义 CuratorFramework 对象实例的时候，我们使用了 CuratorFrameworkFactory 工厂方法，并指定了 connectionString 服务器地址列表、retryPolicy 重试策略 、sessionTimeoutMs 会话超时时间、connectionTimeoutMs 会话创建超时时间。下面我们分别对这几个参数进行讲解：



1. connectionString：服务器地址列表，在指定服务器地址列表的时候可以是一个地址，也可以是多个地址。如果是多个地址，那么每个服务器地址列表用逗号分隔, 如  host1:port1,host2:port2,host3；port3 。 
2. retryPolicy：重试策略，当客户端异常退出或者与服务端失去连接的时候，可以通过设置客户端重新连接 ZooKeeper 服务端。而 Curator 提供了 一次重试、多次重试等不同种类的实现方式。在 Curator 内部，可以通过判断服务器返回的 keeperException 的状态代码来判断是否进行重试处理，如果返回的是 OK 表示一切操作都没有问题，而 SYSTEMERROR 表示系统或服务端错误。

具体的实现

| **策略名称**            | **描述**                             |
| ----------------------- | ------------------------------------ |
| ExponentialBackoffRetry | 重试一组次数，重试之间的睡眠时间增加 |
| RetryNTimes             | 重试最大次数                         |
| RetryOneTime            | 只重试一次                           |
| RetryUntilElapsed       | 在给定的时间结束之前重试             |

3. 超时时间：Curator 客户端创建过程中，有两个超时时间的设置。一个是 sessionTimeoutMs 会话超时时间，用来设置该条会话在 ZooKeeper 服务端的失效时间。另一个是 connectionTimeoutMs 客户端创建会话的超时时间，用来限制客户端发起一个会话连接到接收 ZooKeeper 服务端应答的时间。sessionTimeoutMs 作用在服务端，而 connectionTimeoutMs 作用在客户端。

> 完整代码

::: details

```java
@Slf4j
public abstract class CuratorStandaloneBase {
    private static final String CONNECT_STR = "localhost:2181";
    private static final int sessionTimeoutMs = 60*1000;
    private static final int connectionTimeoutMs = 5000;
    private static CuratorFramework curatorFramework;


    @Before
    public void init() {
        curatorFramework = CuratorFrameworkFactory.builder()
                .connectString(CONNECT_STR)
                .sessionTimeoutMs(sessionTimeoutMs)
                .connectionTimeoutMs(connectionTimeoutMs)
                .retryPolicy(new ExponentialBackoffRetry(1000, 3))
                .build();

        curatorFramework.getCuratorListenable().addListener((client, event) -> {
            log.info("监听到事件：{}", event);
            if(event == ConnectionState.CONNECTED) {
                log.info("连接成功");
            }
        });
        log.info("连接中...");
        curatorFramework.start();
    }

    public void createIfNeed(String path) throws Exception {
        Stat stat = curatorFramework.checkExists().forPath(path);
        if (stat==null){
            String s = curatorFramework.create().forPath(path);
            log.info("path {} created! ",s);
        }
    }

    public static CuratorFramework getCuratorFramework() {
        return curatorFramework;
    }


    @After
    public void after(){
        try {
            TimeUnit.SECONDS.sleep(Integer.MAX_VALUE);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }


    protected  String getConnectStr(){
        return CONNECT_STR;
    }
}
```

:::



### 创建节点

描述一个节点要包括节点的类型，即临时节点还是持久节点、节点的数据信息、节点是否是有序节点等属性和性质。

```java
 @Test
public void testCreate() throws Exception {
    String path = curatorFramework.create().forPath("/curator-node");
     curatorFramework.create().withMode(CreateMode.PERSISTENT).forPath("/curator-node","some-data".getBytes())
    log.info("curator create node :{}  successfully.",path);
}
```

在 Curator 中，可以使用 create 函数创建数据节点，并通过 withMode 函数指定节点类型（持久化节点，临时节点，顺序节点，临时顺序节点，持久化顺序节点等），默认是持久化节点，之后调用 forPath 函数来指定节点的路径和数据信息。



#### 一次性创建带层级结构的节点

```java
   // 递归创建子节点
    @Test
    public void testCreateWithParent() throws Exception {
        CuratorFramework curatorFramework = getCuratorFramework();

        String pathWithParent = "/node-parent/sub-node-1";
        String path = curatorFramework.create().creatingParentsIfNeeded().forPath(pathWithParent);
        log.info("curator create node :{}  successfully.", path);
    }
```



#### protection模式

会在节点的名称前面加上一个uuid ,

```java
// 创建的节点名称：_c_2725d4a4-e6f0-4001-885f-db60a2e39c60-curator-node0000000011
 // protection 模式，防止由于异常原因，导致僵尸节点
    @Test
    public void testCreate() throws Exception {

        CuratorFramework curatorFramework = getCuratorFramework();
        String forPath = curatorFramework
                .create()
                .withProtection()
                .withMode(CreateMode.EPHEMERAL_SEQUENTIAL).
                        forPath("/curator-node", "some-data".getBytes());
        log.info("curator create node :{}  successfully.", forPath);
    }
```



### 删除节点

```java
@Test
public void testDelete() throws Exception {
    String pathWithParent="/node-parent";
    curatorFramework.delete().guaranteed().deletingChildrenIfNeeded().forPath(pathWithParent);
}
```

guaranteed：该函数的功能如字面意思一样，主要起到一个保障删除成功的作用，其底层工作方式是：只要该客户端的会话有效，就会在后台持续发起删除请求，直到该数据节点在 ZooKeeper 服务端被删除。

deletingChildrenIfNeeded：指定了该函数后，系统在删除该数据节点的时候会以递归的方式直接删除其子节点，以及子节点的子节点。



### 设置节点数据

```java
@Test
public void testSetData() throws Exception {
    CuratorFramework curatorFramework = getCuratorFramework();

    curatorFramework.setData().forPath("/curator-node", "changed!".getBytes());
    byte[] bytes = curatorFramework.getData().forPath("/curator-node");
    log.info("get data from  node /curator-node :{}  successfully.", new String(bytes));
}
```



### 获取节点数据

```java
@Test
public void testGetData() throws Exception {
    byte[] bytes = curatorFramework.getData().forPath("/curator-node");
    log.info("get data from  node :{}  successfully.",new String(bytes));
}
```



### 获取节点子列表

```java
@Test
public void testListChildren() throws Exception {
    CuratorFramework curatorFramework = getCuratorFramework();

    String pathWithParent = "/discovery/example";
    List<String> strings = curatorFramework.getChildren().forPath(pathWithParent);
    strings.forEach(System.out::println);
}
```

![image-20230427130920163](/images/zk/image-20230427130920163.png)
