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

- 创建一个默认的网络`learncompose_default`，默认以compose所在文件目录名加"_default"命名，compose内的所有容器都会加入此网络，可以相互用服务名访问。最好自定义一个网络。

  ```yaml
    redis-node6:
      image: redis:5.0
      command: redis-server --port 7005 --cluster-enabled yes --cluster-config-file /data/nodes.conf --appendonly yes --bind 0.0.0.0
      ports:
        - "7005:7005"
        - "17005:17005"
      volumes:
        - ./data/node6:/data
      networks:
        - mynet		# 服务加入该网络
  
  networks:
    mynet:		# 自定义网络
      driver: bridge	# 使用桥接驱动
  ```
- 如果镜像 `hzz-microservice-server:0.0.1` 不存在先构建镜像，如果镜像存在则不构建，加上 **--build** 参数可以强制先构建镜像，如果镜像之前构建过且构建文件没有变化或构建的内容没有变化，就算加上 **--build** 参数也不会重新构建
- 根据构建的镜像创建一个名称叫 `learncompose-eureka-1` 的容器
- 启动容器

----------



## Docker Compose管理容器的结构

> Docker Compose将所管理的容器分为三层，**分别是工程（ project），服务（service）以及容器（ container)**

- Docker Compose运行目录下的所有文件（ docker-compose.yml、 extends文件或环境变量文件等）组成一个工程（默认为 docker-compose.yml所在目录的目录名称）。一个工程可包含多个服务，每个服务中定义了容器运行的镜像、参数和依赖，一个服务可包括多个容器实例

  > 上面示例里工程名称是 docker-compose.yml 所在的目录名。该工程包含了1个服务，服务名称是 eureka，执行 docker-compose up时，启动了eureka服务的1个容器实例

- 同一个docker compose内部的容器之间可以用服务名相互访问，**服务名就相当于hostname，可以直接 ping 服务名，得到的就是服务对应容器的ip，如果服务做了扩容，一个服务对应了多个容器，则 ping 服务名 会轮询访问服务对应的每台容器ip ，docker底层用了LVS等技术帮我们实现这个负载均衡**



---------



## docker-compose.yml常用指令

文件官方文档：[https://docs.docker.com/compose/compose-file/](https://docs.docker.com/compose/compose-file/)

### **image**

指定镜像名称或者镜像id，如果该镜像在本地不存在，Compose会尝试pull下来。

```java
 image: java:8
```

​            

### **build**

指定Dockerfile文件的路径。可以是一个路径，例如：

```sh
 build: ./dir  
```

也可以是一个对象，用以指定Dockerfile和参数，例如：

```sh
build:
  context: ./dir
  dockerfile: Dockerfile-alternate
  args:
    buildno: 1
```

### **command**

覆盖容器启动后默认执行的命令。

```sh
command: bundle exec thin -p 3000
```

也可以是一个list，类似于Dockerfile总的CMD指令，格式如下

```sh
command: [bundle, exec, thin, -p, 3000]
```

### **links**

显示链接到其他服务中的容器。可以指定服务名称和链接的别名使用SERVICE:ALIAS 的形式，或者只指定服务名称，

```sh
web:
  links:
   - db
   - db:database
   - redis
```

### **external_links**

表示链接到docker-compose.yml外部的容器，甚至并非Compose管理的容器，特别是对于那些提供共享容器或共同服务。格式跟links类似，示例：

```sh
external_links:
 - redis_1
 - project_db_1:mysql
 - project_db_1:postgresql
```

### **ports**

暴露端口信息。使用宿主端口:容器端口的格式，或者仅仅指定容器的端口（此时宿主机将会随机指定端口），类似于docker run -p ，示例：

```sh
ports:
 - "3000"
 - "3000-3005"
 - "8000:8000"
 - "9090-9091:8080-8081"
 - "49100:22"
 - "127.0.0.1:8001:8001"
 - "127.0.0.1:5000-5010:5000-5010"
```

### **expose**

暴露端口，只将端口暴露给连接的服务，而不暴露给宿主机，示例：

```sh
expose:
 - "3000"
 - "8000"
```

### **volumes**

卷挂载路径设置。可以设置宿主机路径 `（HOST:CONTAINER）` 或加上访问模式 `（HOST:CONTAINER:ro）`

```sh
volumes:
  # Just specify a path and let the Engine create a volume
  - /var/lib/mysql

  # Specify an absolute path mapping
  - /opt/data:/var/lib/mysql

  # Path on the host, relative to the Compose file
  - ./cache:/tmp/cache

  # User-relative path
  - ~/configs:/etc/configs/:ro

  # Named volume
  - datavolume:/var/lib/mysql
```

### **volumes_from**

从另一个服务或者容器挂载卷。可以指定只读或者可读写，如果访问模式没有指定，则默认是可读写。示例

```sh
volumes_from:
 - service_name
 - service_name:ro
 - container:container_name
 - container:container_name:rw
```

### **environment**s

设置环境变量。可以使用数组或者字典两种方式。只有一个key的环境变量可以在运行Compose的机器上找到对应的值，这有助于加密的或者特殊主机的值

```sh
environment:
  RACK_ENV: development
  SHOW: 'true'
  SESSION_SECRET:

environment:
  - RACK_ENV=development
  - SHOW=true
  - SESSION_SECRET
```

### **env_file**

从文件中获取环境变量，可以为单独的文件路径或列表。如果通过 docker-compose -f FILE 指定了模板文件，则 env_file 中路径会基于模板文件路径。如果有变量名称与 environment 指令冲突，则以envirment 为准

```sh
env_file: .env

env_file:
  - ./common.env
  - ./apps/web.env
  - /opt/secrets.env
```

### **extends**

继承另一个服务，基于已有的服务进行扩展



### **net**

设置网络模式。示例：

```sh
net: "bridge"
net: "host"
net: "none"
net: "container:[service name or container name/id]"
```

### **dns**

配置dns服务器。可以是一个值，也可以是一个列表

```sh
dns: 8.8.8.8
dns:
  - 8.8.8.8
  - 9.9.9.9
```

### **dns_search**

配置DNS的搜索域，可以是一个值，也可以是一个列表

```sh
dns_search: example.com
dns_search:
  - dc1.example.com
  - dc2.example.com
```

