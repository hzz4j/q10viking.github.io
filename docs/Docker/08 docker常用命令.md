---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



![https://note.youdao.com/yws/public/resource/42384826563c36cddfa032983505bd0d/xmlnote/8115491FCB464209B8FBAFF17AE99A1B/112214](/images/Docker/112214)

## 搜索镜像

> 可使用 docker search命令搜索存放在 Docker Hub中的镜像。执行该命令后， Docker就会在Docker Hub中搜索含有 java这个关键词的镜像仓库

```
docker search openjdk
```

![image-20230423175931606](/images/Docker/image-20230423175931606.png)

以上列表包含五列，含义如下：

- NAME:镜像仓库名称。

- DESCRIPTION:镜像仓库描述。

- STARS：镜像仓库收藏数，表示该镜像仓库的受欢迎程度，类似于 GitHub的 stars0

- OFFICAL:表示是否为官方仓库，该列标记为[0K]的镜像均由各软件的官方项目组创建和维护。

- AUTOMATED：表示是否是自动构建的镜像仓库

> 和docker-desktop中的搜索一样



![image-20230423175827824](/images/Docker/image-20230423175827824.png)



## 下载镜像

使用命令docker pull命令即可从 Docker Registry上下载镜像，执行该命令后，Docker会从 Docker Hub中的 adoptopenjdk/仓库下载最新版本的 maven-openjdk11镜像。如果要下载指定版本则在java后面加冒号指定版本，例如：

```java
docker pull adoptopenjdk/maven-openjdk11:latest
```

![image-20230423180107601](/images/Docker/image-20230423180107601.png)



## 列出镜像

使用 docker images命令即可列出已下载的镜像

```sh
docker images
```

![image-20230423180259521](/images/Docker/image-20230423180259521.png)

对应的docker-desktop

![image-20230423180324265](/images/Docker/image-20230423180324265.png)