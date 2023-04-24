---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



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



## docker compose部署springboot项目❤️

::: tip

我开发一个简单的springboot的项目，依赖着mysql和redis的环境。部署的时候。采用docker compose的方式来部署。

:::



[Source Code](https://github.com/Q10Viking/learncode/tree/main/docker/docker-service)

### 项目配置

```sh
server:
  port: 8888
  servlet:
    context-path: /docker
spring:
  redis:
    host: redis  # docker compose下的redis服务名
    port: 6379
    database: 0

  datasource:
    type: com.zaxxer.hikari.HikariDataSource
    driver-class-name: com.mysql.cj.jdbc.Driver
    # docker compose下的mysql8服务的别名db
    url: jdbc:mysql://db:3306/test?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=UTC
    username: root
    password: Root.123456
```

### 项目打包

> maven打包，我们跳过test测试，因为我直接在项目中配置的redis,mysql为docker compose下的服务名。

```xml
<properties>
    <java.version>1.8</java.version>
    <skipTests>true</skipTests>
</properties>
```

```sh
mvn package -Dmaven.test.skip=true
```

将打包好的jar包上传到服务器。

```sh
q10viking@LAPTOP-PJLAUUSP:~/learndocker/mall$ tree
.
├── docker-compose-app.yml
├── docker-compose-env.yml
└── user
    ├── Dockerfile
    └── docker-service-0.0.1-SNAPSHOT.jar
```

在服务器中新建一个mall目录用于docker compose的工程目录。然后创建文件夹user目录，用于存放user服务的jar包

### 编写相应配置文件

#### 依赖环境

> 依赖环境mysql和redis,`docker-compose-env.yml`

```sh
services:
  redis:
    image: redis:6.0
    container_name: redis
    command: redis-server --appendonly yes
    volumes:
      - /mydata/redis/data:/data
    ports:
      - 6379:6379
  mysql:
    image: mysql:8.0-oracle
    container_name: mysql8
    command: mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: Root.123456
    ports:
      - 3306:3306
    volumes:
      - /mydata/mysql/data/db:/var/lib/mysql #数据文件挂载
      - /mydata/mysql/data/conf:/etc/mysql/conf.d #配置文件挂载
      - /mydata/mysql/log:/var/log/mysql #日志文件挂载
```

> 启动docker compose的依赖环境

```sh
 docker compose -f docker-compose-env.yml up -d
```

可以看到卷挂在到了宿主机

```sh
q10viking@LAPTOP-PJLAUUSP:/mydata$ pwd
/mydata
q10viking@LAPTOP-PJLAUUSP:/mydata$ ls
mysql  redis
```

#### 服务

> 新建一个Dockerfile构建user服务的镜像

```dockerfile
From java:8
ADD docker-service-0.0.1-SNAPSHOT.jar /app.jar
# 声明需要暴露的端口
EXPOSE 8888
ENTRYPOINT ["java","-jar","/app.jar"]
```

> 配置docker compose 服务`docker-compose-app.yml`

```sh
services:
  user:
    image: mall-user-service:0.0.1 #指定Dockfile所在路径
    build: ./user #指定Dockfile所在路径
    container_name: mall-user-service
    ports:
      - 8888:8888
    external_links:
      - redis
      - mysql8:db   # 定义一个别名，项目中jdbc://db:3306
```

启动起来

```sh
 docker compose -f docker-compose-app.yml up -d
 docker compose -f docker-compose-app.yml up --force-recreate -d
```

### 效果

![image-20230424164059511](/images/Docker/image-20230424164059511.png)

### 测试

[http://localhost:8888/docker/user/select?name=q10viking](http://localhost:8888/docker/user/select?name=q10viking)

![image-20230424164143026](/images/Docker/image-20230424164143026.png)

> redis中

![image-20230424164218153](/images/Docker/image-20230424164218153.png)



### 命令小结

```sh
 docker compose -f docker-compose-env.yml up -d
 docker compose -f docker-compose-app.yml up -d
 # 文件有变动，需要重新创建容器 --force-recreate
 docker compose -f docker-compose-app.yml up --force-recreate -d
```

