---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



## Docker Compose（容器编排）

使用微服务架构的应用系统一般包含若干个微服务，每个微服务一般都会部署多个实例。如果每个微服务都要手动启停，那么效率之低、维护量之大可想而知。

> 使用 Docker Compose来轻松、高效地管理容器

[Docker Compose overview | Docker Documentation](https://docs.docker.com/compose/)

```sh
q10viking@LAPTOP-PJLAUUSP:/$ docker compose version
Docker Compose version v2.15.1
```

## 快速入门

> 文件结构

```sh
q10viking@LAPTOP-PJLAUUSP:~/learndocker/learncompose$ tree
.
├── docker-compose.yml
└── eureka
    ├── Dockerfile
    └── microservice-eureka-server-0.0.1-SNAPSHOT.jar
```

> 在docker-compose.yml 中添加内容如下：

```sh
services:
  eureka:             #指定服务名
    image: hzz-microservice-server:0.0.1  #指定镜像名称
    build: ./eureka   #指定Dockfile所在路径
    ports:
      - "8761:8761"   #指定端口映射
    expose:
      - 8761          #声明容器对外暴露的端口
```

>  启动        

```sh
docker compose up （后面加-d可以后台启动)     
```

```sh
q10viking@LAPTOP-PJLAUUSP:~/learndocker/learncompose$ docker compose up
[+] Running 2/2
 ⠿ Network learncompose_default     Created                                                                        0.2s
 ⠿ Container learncompose-eureka-1  Created                                                                        1.0s
Attaching to learncompose-eureka-1
```

![image-20230424130639588](/images/Docker/image-20230424130639588.png)



> docker compose会做以下几件事

- 创建一个默认的网络`learncompose_default`，默认以compose所在文件目录名加"_default"命名，compose内的所有容器都会加入此网络，可以相互用服务名访问
- 如果镜像 `hzz-microservice-server:0.0.1` 不存在先构建镜像，如果镜像存在则不构建，加上 **--build** 参数可以强制先构建镜像，如果镜像之前构建过且构建文件没有变化或构建的内容没有变化，就算加上 **--build** 参数也不会重新构建
- 根据构建的镜像创建一个名称叫 `learncompose-eureka-1` 的容器
- 启动容器

----------

