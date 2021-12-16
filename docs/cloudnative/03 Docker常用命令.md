---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /cloudnative/
---



::: tip

[docker | Docker Documentation 命令](https://docs.docker.com/engine/reference/commandline/docker/) 

:one: 镜像命令

:two: 容器命令

:::



## **搜索镜像**

可使用 docker search命令搜索存放在 Docker Hub中的镜像。执行该命令后， Docker就会在Docker Hub中搜索含有 java这个关键词的镜像仓库。

```sh
docker search java
```

::: details

```sh
[root@localhost docker]# docker search java
NAME                               DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
node                               Node.js is a JavaScript-based platform for s…   10852     [OK]
tomcat                             Apache Tomcat is an open source implementati…   3193      [OK]
openjdk                            OpenJDK is an open-source implementation of …   3058      [OK]
java                               DEPRECATED; use "openjdk" (or other JDK impl…   1976      [OK]
ghost                              Ghost is a free and open source blogging pla…   1451      [OK]
couchdb                            CouchDB is a database that uses JSON for doc…   451       [OK]
jetty                              Jetty provides a Web server and javax.servle…   379       [OK]
groovy                             Apache Groovy is a multi-faceted language fo…   120       [OK]
lwieske/java-8                     Oracle Java 8 Container - Full + Slim - Base…   50                   [OK]
nimmis/java-centos                 This is docker images of CentOS 7 with diffe…   42                   [OK]
fabric8/java-jboss-openjdk8-jdk    Fabric8 Java Base Image (JBoss, OpenJDK 8)      29                   [OK]
timbru31/java-node                 OpenJDK JRE or JDK (8 or 11) with Node.js 12…   19                   [OK]
cloudbees/java-build-tools         Docker image with commonly used tools to bui…   16                   [OK]
fabric8/java-centos-openjdk8-jdk   Fabric8 Java Base Image (CentOS, OpenJDK 8, …   14                   [OK]
frekele/java                       docker run --rm --name java frekele/java        12                   [OK]
blacklabelops/java                 Java Base Images.                               8                    [OK]
fabric8/java-centos-openjdk8-jre   Fabric8 Java Base Image (CentOS, OpenJDK 8, …   4                    [OK]
rightctrl/java                     Oracle Java                                     3                    [OK]
cfje/java-test-applications        Java Test Applications CI Image                 2
jelastic/javaengine                An image of the Java Engine server maintaine…   1
buildo/java8-wkhtmltopdf           Java 8 + wkhtmltopdf                            1                    [OK]
cfje/java-buildpack                Java Buildpack CI Image                         1
cfje/java-resource                 Java Concourse Resource                         1
thingswise/java-docker             Java + dcd                                      0                    [OK]
adorsys/java                       Java Runtime Image                              0                    [OK]
```

:::

以上列表包含五列，含义如下：

- NAME:镜像仓库名称。

- DESCRIPTION:镜像仓库描述。

- STARS：镜像仓库收藏数，表示该镜像仓库的受欢迎程度，类似于 GitHub的 stars0

- OFFICAL:表示是否为官方仓库，该列标记为[0K]的镜像均由各软件的官方项目组创建和维护。

- AUTOMATED：表示是否是自动构建的镜像仓库。



## 下载镜像

使用命令docker pull命令即可从 Docker Registry上下载镜像，执行该命令后，Docker会从 Docker Hub中的 java仓库下载最新版本的 Java镜像。如果要下载指定版本则在java后面加冒号指定版本，例如：

```sh
docker pull java:8
```

::: details

```sh
[root@localhost docker]# docker pull java:8
8: Pulling from library/java
5040bd298390: Pull complete
fce5728aad85: Pull complete
76610ec20bf5: Pull complete
60170fec2151: Pull complete
e98f73de8f0d: Pull complete
11f7af24ed9c: Pull complete
49e2d6393f32: Pull complete
bb9cdec9c7f3: Pull complete
Digest: sha256:c1ff613e8ba25833d2e1940da0940c3824f03f802c449f3d1815a66b7f8c0e9d
Status: Downloaded newer image for java:8
docker.io/library/java:8
```

:::

不指定版本默认会下载latest版本

```sh
docker pull nginx
```

::: details

```sh
[root@localhost docker]# docker pull nginx
Using default tag: latest
latest: Pulling from library/nginx
e5ae68f74026: Pull complete
21e0df283cd6: Pull complete
ed835de16acd: Pull complete
881ff011f1c9: Pull complete
77700c52c969: Pull complete
44be98c0fab6: Pull complete
Digest: sha256:9522864dd661dcadfd9958f9e0de192a1fdda2c162a35668ab6ac42b465f0603
Status: Downloaded newer image for nginx:latest
docker.io/library/nginx:latest
```

:::

## **列出镜像**

::: tip

列出已下载的镜像

:::

```sh
docker images
```

::: details

```sh
[root@localhost docker]# docker images
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
nginx        latest    f652ca386ed1   12 days ago   141MB
java         8         d23bdf5b1b1b   4 years ago   643MB
```

:::

## 运行镜像

::: tip

需要注意的是，使用 docker run命令创建容器时，会先检查本地是否存在指定镜像。如果本地不存在该名称的镜像， Docker就会自动从 Docker Hub下载镜像并启动一个 Docker容器

:::

### 新建并启动容器

使用以下docker run命令即可新建并启动一个容器，该命令是最常用的命令，它有很多选项，下面将列举一些常用的选项。

- -d选项：表示后台运行

- -P选项：随机端口映射

- -p选项：指定端口映射，有以下四种格式。 

  - -- ip:hostPort:containerPort 

  - -- ip::containerPort

  - -- hostPort:containerPort 

  - -- containerPort

### 容器的网络模式

::: tip

--net选项：指定网络模式，该选项有以下可选参数：

​	--net=bridge:**默认选项**，表示连接到默认的网桥。

​	--net=host:容器使用宿主机的网络。

​	--net=container:NAME-or-ID：告诉 Docker让新建的容器使用已有容器的网络配置。

​	--net=none：不配置该容器的网络，用户可自定义网络配置。

:::







### 运行nginx

::: tip

这样就能启动一个 Nginx容器。在本例中，为 docker run添加了两个参数，含义如下：

-d 后台运行

-p 宿主机端口:容器端口 #开放容器端口到宿主机端口

:::

```sh
docker run -d -p 91:80 nginx
```

http://192.168.187.132:91/

![image (9)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112151838311.jpg)

## **列出容器**

::: tip

列出**运行中**的容器，其中可以获取到容器的ID(CONTAINER ID)

:::

```sh
docker ps
```

::: details

```sh
[root@localhost docker]# docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                NAMES
13bc65da0321   nginx     "/docker-entrypoint.…"   12 minutes ago   Up 12 minutes   0.0.0.0:91->80/tcp   boring_kowalevski
```

:::

































## **删除本地镜像**

::: tip

删除指定镜像，强制删除加 -f

:::

```sh
docker rmi java 
```

删除所有镜像

```sh
docker rmi $(docker images -q)
```



## **删除容器**

删除指定容器

```sh
# CONTAINER ID
docker rm f0b1c8ab3633
```

该命令只能删除**已停止**的容器，如需删除正在运行的容器，可使用-f参数

强制删除所有容器

```sh
docker rm -f $(docker ps -a -q)
```

