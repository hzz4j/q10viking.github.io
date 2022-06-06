---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /cloudnative/
typora-root-url: ..\.vuepress\public
---



::: tip

[Empowering App Development for Developers | Docker](https://www.docker.com/)

[Docker Hub](https://hub.docker.com/) 注册一个账号，我的是q10viking  1193094618@qq.com

 Docker是一个开源的**容器引擎**，它有助于更快地交付应用。 Docker可将应用程序和基础设施层隔离，并且能将基础设施当作程序一样进行管理。使用 Docker可更快地打包、测试以及部署应用程序，并可以缩短从编写到部署运行代码的周期。

:::

![202112151643391](/images/cloudnative/202112151643391.jpg)

## Docker的优点

### 简化程序

Docker 让开发者可以打包他们的应用以及依赖包到一个**可移植**的容器中，然后发布到任何流行的 Linux 机器上，便可以实现虚拟化。Docker改变了虚拟化的方式，使开发者可以直接将自己的成果放入Docker中进行管理。方便快捷已经是 Docker的最大优势，过去需要用数天乃至数周的 任务，在Docker容器的处理下，只需要数秒就能完成。

### 避免选择恐惧症

如果你有选择恐惧症，还是资深患者。Docker 帮你 打包你的纠结！比如 Docker 镜像；Docker 镜像中包含了**运行环境和配置**，所以 Docker 可以简化部署多种应用实例工作。比如 Web 应用、后台应用、数据库应用、大数据应用比如 Hadoop 集群、消息队列等等都可以打包成一个镜像部署。

### **节省开支**

一方面，云计算时代到来，使开发者不必为了追求效果而配置高额的硬件，Docker 改变了高性能必然高价格的思维定势。Docker 与云的结合，让云空间得到更充分的利用。不仅解决了硬件管理的问题，也改变了虚拟化的方式。



## Docker的架构:star:

::: tip

:one: 客户端

:two: 服务端  宿主机有运行的容器Containers运行着镜像

:three: 镜像仓库

:::

![202112151649256](/images/cloudnative/202112151649256.jpg)

### **Docker daemon（ Docker守护进程）**

::: tip

Docker daemon是一个运行在宿主机（ DOCKER-HOST）的后台进程。可通过 Docker客户端与之通信。

:::

### **Client（ Docker客户端）**

::: tip

Docker客户端是 Docker的用户界面，它可以接受用户命令和配置标识，并与 Docker daemon通信。图中， docker build等都是 Docker的相关命令

:::



### **Images（ Docker镜像）**

::: tip

Docker镜像是一个只读模板，它包含创建 Docker容器的说明。**它和系统安装光盘有点像**，使用系统安装光盘可以安装系统，同理，使用Docker镜像可以运行 Docker镜像中的程序。

:::

### **Container（容器）**

::: tip

容器是镜像的可运行实例。**镜像和容器的关系有点类似于面向对象中，类和对象的关系**。可通过 Docker API或者 CLI命令来启停、移动、删除容器。

:::

### **Registry**

::: tip

Docker Registry是一个集中存储与分发镜像的服务。构建完 Docker镜像后，就可在当前宿主机上运行。但如果想要在其他机器上运行这个镜像，就需要手动复制。此时可借助 Docker Registry来避免镜像的手动复制。

:::

一个 Docker Registry可包含多个 Docker仓库，每个仓库可包含多个镜像标签，每个标签对应一个 Docker镜像。这跟 Maven的仓库有点类似，如果把 Docker Registry比作 Maven仓库的话，那么 Docker仓库就可理解为某jar包的路径，而镜像标签则可理解为jar包的版本号。

Docker Registry可分为公有Docker Registry和私有Docker Registry。 最常⽤的Docker Registry莫过于官⽅的Docker Hub， 这也是默认的Docker Registry。 Docker Hub上存放着⼤量优秀的镜像， 我们可使⽤Docker命令下载并使⽤。
