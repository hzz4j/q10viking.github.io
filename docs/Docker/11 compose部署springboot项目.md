---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



## docker compose部署springboot项目❤️

::: tip

我开发一个简单的springboot的项目，依赖着mysql和redis的环境。部署的时候。采用docker compose的方式来部署。

:::

以下操作在：docker compose v2.15.1

```sh
q10viking@LAPTOP-PJLAUUSP:/mydata$ docker compose version
Docker Compose version v2.15.1
```



[Source Code](https://github.com/Q10Viking/learncode/tree/main/docker/docker-service)

## 项目配置

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

## 项目打包

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

## 编写相应配置文件

### 依赖环境

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

### 服务

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



## **动态扩容微服务(单物理机内扩容)**❤️

要扩容微服务，比如我们想把user服务部署成两个微服务，则需要将docker-compose.yml里的服务的端口映射和容器名称都注释掉，因为不可能两个user服务的容器映射到宿主机的同一个端口，修改之后的docker-compose-app.yml内容如下：

```yml
services:
  user:
    image: mall-user-service:0.0.1 #指定Dockfile所在路径
    build: ./user #指定Dockfile所在路径
    # container_name: mall-user-service
    ports:
      - 8888  # 仅指定容器的端口，让宿主机随机分配
    external_links:
      - redis
      - mysql8:db
```

执行如下扩容命令，**服务一旦扩容对应了多个容器，则❤️访问服务名❤️docker会自动帮我们负载均衡去访问服务对应的每台容器**

```sh
 #必须先正常编排微服务，然后才能动态扩容,文件有变动，需要重新创建容器
docker compose -f docker-compose-app.yml up --force-recreate -d    
docker compose -f docker-compose-app.yml up --scale user=3 -d
#如果要缩容执行如下操作
docker compose -f docker-compose-app.yml up --scale user=3 -d
```

输出

```sh
q10viking@LAPTOP-PJLAUUSP:~/learndocker/mall$ docker compose -f docker-compose-app.yml up --scale user=3 -d
[+] Running 3/3
 ⠿ Container mall-user-1  Started                                                                                                                      1.5s
 ⠿ Container mall-user-3  Started                                                                                                                      3.1s
 ⠿ Container mall-user-2  Started                                                                                                                      4.8s
```

![image-20230424175539729](/images/Docker/image-20230424175539729.png)

### 负载均衡👍

为了实现负载均衡，参照[Microservices: Scaling and Load Balancing using docker compose | by Vinod Rane | Medium](https://medium.com/@vinodkrane/microservices-scaling-and-load-balancing-using-docker-compose-78bf8dc04da9)用nginx来实现

创建nginx的配置文件,在mall目录（也就是docker compose的工程目录）

```sh
q10viking@LAPTOP-PJLAUUSP:~/learndocker/mall$ tree
.
├── docker-compose-app.yml
├── docker-compose-env.yml
├── nginx.conf
└── user
    ├── Dockerfile
    └── docker-service-0.0.1-SNAPSHOT.jar
```

```
user  nginx;
events {
    worker_connections   1000;
}
http {
        server {
              listen 8888;
              location / {
                proxy_pass http://user:8888; # docker会自己根据user服务名去负载均衡，nginx在这里主要责任是代理的作用
              }
        }
}
```

修改`docker-compose-app.yml`文件

```yml
services:
  user:
    image: mall-user-service:0.0.1 #指定Dockfile所在路径
    build: ./user #指定Dockfile所在路径
    # container_name: mall-user-service
    ports:
      - 8888
    external_links:
      - redis
      - mysql8:db
  nginx:
    image: nginx:latest
    container_name: nginx
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro # 将当前我们的配置挂载到容器
    depends_on:
      - user   # 依赖的服务，我们在nginx做了反向代理
    ports:
      - "8888:8888"
```

> 启动


```sh
 # 先启动容器
 docker compose -f docker-compose-app.yml up --force-recreate -d
 # 再扩展
 docker compose -f docker-compose-app.yml up --scale user=3 -d
 
```

![image-20230424183517979](/images/Docker/image-20230424183517979.png)

访问： [http://localhost:8888/docker/user/select?name=huangzhuangzhuang](http://localhost:8888/docker/user/select?name=huangzhuangzhuang)

![image-20230424184756842](/images/Docker/image-20230424184756842.png)



> 优化，既然在docker compose工程中就相当于内网，我们只需要暴露nginx的端口就行了，user服务的端口我们就选择不暴露了。
>
> 将user服务的端口注释掉

```yml
services:
  user:
    image: mall-user-service:0.0.1 #指定Dockfile所在路径
    build: ./user #指定Dockfile所在路径
    # container_name: mall-user-service
    # ports:
    #   - 8888
    external_links:
      - redis
      - mysql8:db
  nginx:
    image: nginx:latest
    container_name: nginx
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro # 将当前我们的配置挂载到容器
    depends_on:
      - user   # 依赖的服务，我们在nginx做了反向代理
    ports:
      - "8888:8888"
```

```sh
CONTAINER ID   IMAGE                     COMMAND                  CREATED         STATUS         PORTS                               NAMES
c4e20908b65e   nginx:latest              "/docker-entrypoint.…"   7 minutes ago   Up 6 minutes   80/tcp, 0.0.0.0:8888->8888/tcp      nginx
346605d38eb7   mall-user-service:0.0.1   "java -jar /app.jar"     7 minutes ago   Up 7 minutes   8888/tcp                            mall-user-1
2fd53aedfe13   mall-user-service:0.0.1   "java -jar /app.jar"     7 minutes ago   Up 7 minutes   8888/tcp                            mall-user-2
224457a0cad9   mall-user-service:0.0.1   "java -jar /app.jar"     7 minutes ago   Up 7 minutes   8888/tcp                            mall-user-3
7d3ac8001869   mysql:8.0-oracle          "docker-entrypoint.s…"   4 hours ago     Up 4 hours     0.0.0.0:3306->3306/tcp, 33060/tcp   mysql8
62229f460335   redis:6.0                 "docker-entrypoint.s…"   4 hours ago     Up 4 hours     0.0.0.0:6379->6379/tcp              redis
```



## 命令小结

```sh
docker compose -f docker-compose-env.yml up -d
docker compose -f docker-compose-app.yml up -d
# 文件有变动，需要重新创建容器 --force-recreate
docker compose -f docker-compose-app.yml up --force-recreate -d
docker compose -f docker-compose-app.yml up --scale user=3 -d
#如果要缩容执行如下操作
docker compose -f docker-compose-app.yml up --scale user=3 -d
```

