---
prev:
  text: Back To 目录
  link: /topicNav/
typora-root-url: ..\.vuepress\public
---

## Docker

::: tip

[Docker docs https://docs.docker.com](https://docs.docker.com/)

:::

Docker 是一个用于开发、交付和运行容器的容器化平台。 Docker 不使用虚拟机监控程序，如果要开发和测试应用程序，可以在台式机或笔记本电脑上运行 Docker。 桌面版 Docker 支持 Linux、Windows 和 macOS。 对于生产系统，Docker 适用于服务器环境，包括 Linux 的多种变体和 Microsoft Windows Server 2016 及更高版本。 许多云（包括 Azure）都支持 Docker。



## Docker 引擎

> [Microsoft: Docket tutorial](https://learn.microsoft.com/zh-cn/training/modules/intro-to-docker-containers/2-what-is-docker)

![显示 Docker 体系结构的大致概述的关系图。](/images/Docker/2-docker-architecture.svg)

![https://note.youdao.com/yws/public/resource/42384826563c36cddfa032983505bd0d/xmlnote/8115491FCB464209B8FBAFF17AE99A1B/112214](/images/Docker/112214)



- Docker daemon是一个运行在宿主机（ DOCKER-HOST）的后台进程。可通过 Docker客户端与之通信

- Docker客户端是 Docker的用户界面，它可以接受用户命令和配置标识，并与 Docker daemon通信。图中， docker build等都是 Docker的相关命令

- Docker镜像是一个只读模板，它包含创建 Docker容器的说明。**它和系统安装光盘有点像**，使用系统安装光盘可以安装系统，同理，使用Docker镜像可以运行 Docker镜像中的程序

- 容器是镜像的可运行实例。**镜像和容器的关系有点类似于面向对象中，类和对象的关系**。可通过 Docker API或者 CLI命令来启停、移动、删除容器

- Registry

  - Docker Registry是一个集中存储与分发镜像的服务。构建完 Docker镜像后，就可在当前宿主机上运行。但如果想要在其他机器上运行这个镜像，就需要手动复制。此时可借助 Docker Registry来避免镜像的手动复制。

    一个 Docker Registry可包含多个 Docker仓库，每个仓库可包含多个镜像标签，每个标签对应一个 Docker镜像。这跟 Maven的仓库有点类似，如果把 Docker Registry比作 Maven仓库的话，那么 Docker仓库就可理解为某jar包的路径，而镜像标签则可理解为jar包的版本号。

    Docker Registry可分为公有Docker Registry和私有Docker Registry。 最常⽤的Docker Registry莫过于官⽅的Docker Hub， 这也是默认的Docker Registry。 Docker Hub上存放着⼤量优秀的镜像， 我们可使⽤Docker命令下载并使⽤



## Docker Hub

[Docker Hub](https://hub.docker.com/)

```sh
q10viking
qw*******
```



## Resources

|       说明       |                             网址                             |
| :--------------: | :----------------------------------------------------------: |
|    Docker文档    |     [https://docs.docker.com/](https://docs.docker.com/)     |
|    DockerHub     |      [https://hub.docker.com/](https://hub.docker.com/)      |
| Play With Docker | [https://labs.play-with-docker.com/](https://labs.play-with-docker.com/) |

