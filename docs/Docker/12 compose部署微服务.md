---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



::: tip

如果微服务较多，则可以用docker compose来统一编排，接下来我们用docker compose来统一编排电商项目的五个微服务：mall-authcenter，mall-gateway，mall-member，mall-order，mall-product

:::

## 编排依赖环境

1. 创建一个空目录docker-mall
2. 在docker-mall目录下新建一个编排文件docker-compose-env.yml，内容如下

```dockerfile
version: '3.8'
services:
  mysql:
    image: mysql:5.7
    container_name: mysql
    command: mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci  #覆盖容器启动后默认执行的启动mysql命令
    restart: always  #关机或者重启机器时，docker同时重启容器，一般mysql服务可以这么设置，保持服务一直都在
    environment:
      MYSQL_ROOT_PASSWORD: root #设置root帐号密码
    ports:
      - 3306:3306
    volumes:
      - /mydata/mysql/data/db:/var/lib/mysql #数据文件挂载
      - /mydata/mysql/data/conf:/etc/mysql/conf.d #配置文件挂载
      - /mydata/mysql/log:/var/log/mysql #日志文件挂载
  redis:   
    image: redis:5.0
    container_name: redis
    command: redis-server --appendonly yes  
    volumes:
      - /mydata/redis/data:/data #数据文件挂载
    ports:
      - 6379:6379
  rabbitmq:
    image: rabbitmq:3.7.25-management
    container_name: rabbitmq
    volumes:
      - /mydata/rabbitmq/data:/var/lib/rabbitmq #数据文件挂载
      - /mydata/rabbitmq/log:/var/log/rabbitmq #日志文件挂载
    ports:
      - 5672:5672
      - 15672:15672
  elasticsearch:
    image: elasticsearch:6.4.0
    container_name: elasticsearch
    environment:
      - "cluster.name=elasticsearch" #设置集群名称为elasticsearch
      - "discovery.type=single-node" #以单一节点模式启动
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m" #设置使用jvm内存大小，稍微配置大点，不然有可能启动不成功
    volumes:
      - /mydata/elasticsearch/plugins:/usr/share/elasticsearch/plugins #插件文件挂载
      - /mydata/elasticsearch/data:/usr/share/elasticsearch/data #数据文件挂载
    ports:
      - 9200:9200
      - 9300:9300
  kibana:
    image: kibana:6.4.0
    container_name: kibana
    links:  #同一个compose文件管理的服务可以直接用服务名访问，如果要给服务取别名则可以用links实现，如下面的es就是elasticsearch服务的别名
      - elasticsearch:es #可以用es这个域名访问elasticsearch服务
    depends_on:
      - elasticsearch #kibana在elasticsearch启动之后再启动
    environment:
      - "elasticsearch.hosts=http://es:9200" #设置访问elasticsearch的地址
    ports:
      - 5601:5601
  logstash:
    image: logstash:6.4.0
    container_name: logstash
    volumes:
      - /mydata/logstash/logstash-springboot.conf:/usr/share/logstash/pipeline/logstash.conf #挂载logstash的配置文件，docker对单个文件的挂载需要先在宿主机建好对应文件才能挂载成功
    depends_on:
      - elasticsearch #kibana在elasticsearch启动之后再启动
    links:
      - elasticsearch:es #可以用es这个域名访问elasticsearch服务
    ports:
      - 4560:4560
  mongo:
    image: mongo:3.2
    container_name: mongo
    volumes:
      - /mydata/mongo/db:/data/db #数据文件挂载
    ports:
      - 27017:27017
  nacos:
    image: nacos/nacos-server:1.4.2
    container_name: nacos
    environment:
      - MODE=standalone
    volumes:
      - /mydata/nacos/logs/:/home/nacos/logs
    ports:
      - "8848:8848"
  zookeeper:
    image: zookeeper:3.5
    ports:
      - 2181:2181 
    volumes:
      - /mydata/zookeeper/data:/data
      - /mydata/zookeeper/conf:/conf
      
  rocketmq:
    image: rocketmqinc/rocketmq
    container_name: rocketmq
    restart: always    
    ports:
      - 9876:9876
    volumes:
      - /mydata/rocketmq/logs:/home/rocketmq/logs
      - /mydata/rocketmq/store:/home/rocketmq/store
    command: sh mqnamesrv
  broker:
    image: rocketmqinc/rocketmq
    container_name: rmqbroker
    restart: always    
    ports:
      - 10909:10909
      - 10911:10911
      - 10912:10912
    volumes:
      - /mydata/rocketmq/logs:/home/rocketmq/logs
      - /mydata/rocketmq/store:/home/rocketmq/store
      - /mydata/rocketmq/conf/broker.conf:/opt/rocketmq-4.4.0/conf/broker.conf  #这个配置需要先在宿主机对应目录放好broker.conf配置文件,文件内容参考下面文档
    command: sh mqbroker -n namesrv:9876 -c ../conf/broker.conf
    depends_on:
      - rocketmq
    environment:
      - JAVA_HOME=/usr/lib/jvm/jre
  console:
    image: styletang/rocketmq-console-ng
    container_name: rocketmq-console-ng
    restart: always    
    ports:
      - 8076:8080
    depends_on:
      - rocketmq
    environment:
      - JAVA_OPTS= -Dlogging.level.root=info -Drocketmq.namesrv.addr=rocketmq:9876 
      - Dcom.rocketmq.sendMessageWithVIPChannel=false
```

broker.conf文件内容

```properties
brokerName = broker-a
brokerId = 0
deleteWhen = 04
fileReservedTime = 48
brokerRole = ASYNC_MASTER
flushDiskType = ASYNC_FLUSH
# 宿主机IP
brokerIP1=192.168.65.42
```

### 启动

启动compose所有容器，在docker-mall目录执行如下命令

```sh
docker compose -f docker-compose-env.yml up -d
```



## 编排微服务

1. 在docker-mall目录下分别创建mall-authcenter，mall-gateway，mall-member，mall-order，mall-product目录。

2. 在每个微服务目录下新建一个Dockerfile，内容如下，以mall-product服务为例，其它微服务都类似修改：

   ```dockerfile
   # 基于哪个镜像
   From java:8
   # 复制文件到容器
   ADD mall-product-0.0.1-SNAPSHOT.jar /app.jar
   # 配置容器启动后执行的命令
   ENTRYPOINT ["java","-jar","/app.jar"]
   ```

3. 在docker-mall目录下新建微服务编排文件docker-compose-app.yml，内容如下

   ```dockerfile
   version: '3.8'
   services:
     mall-authcenter:
       image: mall/mall-authcenter:0.0.1  #指定镜像名称
       build: ./mall-authcenter  #指定Dockfile所在路径
       container_name: mall-authcenter  #指定启动容器名称
       ports:
         - 9999:9999
       volumes:
         - /etc/localtime:/etc/localtime:ro  #同步宿主机与容器时间，ro代表readonly只读
       environment:
         - JAVA_TOOL_OPTIONS=-Xmx1g -Xms1g -XX:MaxMetaspaceSize=512m -javaagent:/agent/skywalking-agent.jar -DSW_AGENT_NAME=tulingmall-order -DSW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.65.204:11800
       external_links:  #访问不在同一个compose文件管理的服务需要用external_links，前提是这些服务都在同一个网络下才能正常访问 
         - nacos:nacos  #可以用nacos这个域名访问nacos服务
         - mysql:db  #可以用db这个域名访问mysql服务
       cap_add:
         - SYS_PTRACE #这个参数是让docker能支持在容器里能执行jdk自带的类似jinfo，jmap这些命令，如果不需要在容器里执行这些命令可以不加
     mall-gateway:
       image: mall/mall-gateway:0.0.1
       build: ./mall-gateway
       container_name: mall-gateway
       ports:
         - 8888:8888
       volumes:
         - /etc/localtime:/etc/localtime:ro #同步宿主机与容器时间
       environment:
         - JAVA_TOOL_OPTIONS=-Xmx1g -Xms1g -XX:MaxMetaspaceSize=512m -javaagent:/agent/skywalking-agent.jar -DSW_AGENT_NAME=tulingmall-order -DSW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.65.204:11800
       depends_on:
         - mall-authcenter #gateway在authcenter启动之后再启动
       external_links:
         - nacos:nacos
       cap_add:
         - SYS_PTRACE #这个参数是让docker能支持在容器里能执行jdk自带的类似jinfo，jmap这些命令，如果不需要在容器里执行这些命令可以不加
     mall-member:
       image: mall/mall-member:0.0.1
       build: ./mall-member
       container_name: mall-member
       ports:
         - 8877:8877
       volumes:
         - /etc/localtime:/etc/localtime:ro #同步宿主机与容器时间
       environment:
         - JAVA_TOOL_OPTIONS=-Xmx1g -Xms1g -XX:MaxMetaspaceSize=512m -javaagent:/agent/skywalking-agent.jar -DSW_AGENT_NAME=tulingmall-order -DSW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.65.204:11800
       external_links:
         - nacos:nacos
         - mysql:db #可以用db这个域名访问mysql服务
         - mongo
         - redis
         - rabbitmq
       cap_add:
         - SYS_PTRACE #这个参数是让docker能支持在容器里能执行jdk自带的类似jinfo，jmap这些命令，如果不需要在容器里执行这些命令可以不加
     tulingmall-product:
       image: mall/mall-product:0.0.1
       build: ./mall-product
       container_name: mall-product
       ports:
         - 8866:8866
       volumes:
         - /etc/localtime:/etc/localtime:ro #同步宿主机与容器时间
       environment:
         - JAVA_TOOL_OPTIONS=-Xmx1g -Xms1g -XX:MaxMetaspaceSize=512m -javaagent:/agent/skywalking-agent.jar -DSW_AGENT_NAME=tulingmall-order -DSW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.65.204:11800
       external_links:
         - nacos:nacos
         - mysql:db #可以用db这个域名访问mysql服务
         - redis
         - zookeeper
       cap_add:
         - SYS_PTRACE #这个参数是让docker能支持在容器里能执行jdk自带的类似jinfo，jmap这些命令，如果不需要在容器里执行这些命令可以不加
     mall-order:
       image: mall/mall-order:0.0.1
       build: ./mall-order
       container_name: mall-order
       ports:
         - 8844:8844
       volumes:
         - /etc/localtime:/etc/localtime:ro #同步宿主机与容器时间
       environment:
         - JAVA_TOOL_OPTIONS=-Xmx1g -Xms1g -XX:MaxMetaspaceSize=512m -javaagent:/agent/skywalking-agent.jar -DSW_AGENT_NAME=tulingmall-order -DSW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.65.204:11800
       external_links:
         - nacos:nacos
         - mysql:db #可以用db这个域名访问mysql服务
         - redis
         - rabbitmq
         - namesrv:rockermq
       cap_add:
         - SYS_PTRACE #这个参数是让docker能支持在容器里能执行jdk自带的类似jinfo，jmap这些命令，如果不需要在容器里执行这些命令可以不加
   ```

4. 启动compose的所有微服务容器，在docker-mall目录执行如下命令

   ```sh
   #这里启动的微服务跟上面启动的mysql，redis这些中间件服务因为都在docker-mall目录下，即都是同一个工程下，默认都在相同的网络下，可以相互访问
   docker-compose -f docker-compose-app.yml up -d  
   ```

   
