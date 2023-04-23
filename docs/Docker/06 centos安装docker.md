---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



## Docker安装

Docker 是一个开源的商业产品，有两个版本：社区版（Community Edition，缩写为 CE）和企业版（Enterprise Edition，缩写为 EE）。企业版包含了一些收费服务，个人开发者一般用不到。下面的介绍都针对社区版。

Docker CE 的安装请参考官方文档，**我们这里以CentOS为例**

[Install Docker Engine on CentOS | Docker Documentation](https://docs.docker.com/engine/install/centos/)

1. 使用 root 权限登录 Centos。确保 yum 包更新到最新

```sh
yum -y update
```

2. 使用 root 权限登录 Centos。确保 yum 包更新到最新

   ```sh
   yum remove -y docker*
   # 相当于
   sudo yum remove docker \
                     docker-client \
                     docker-client-latest \
                     docker-common \
                     docker-latest \
                     docker-latest-logrotate \
                     docker-logrotate \
                     docker-engine
   ```

3. 安装需要的软件包， yum-util 提供yum-config-manager功能，另外两个是devicemapper驱动依赖的

   ```sh
   yum install -y yum-utils
   ```

4. 设置yum源，并更新 yum 的包索引

   ```sh
   # 官方的
   yum-config-manager \
       --add-repo \
       https://download.docker.com/linux/centos/docker-ce.repo
       
   # 我们使用阿里云的
   yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
   yum makecache fast
   ```

5. 可以查看所有仓库中所有docker版本，并选择特定版本安装

   ```sh
   yum list docker-ce --showduplicates | sort -r
   
   
   docker-ce.x86_64            3:23.0.4-1.el7                      docker-ce-stable
   docker-ce.x86_64            3:23.0.3-1.el7                      docker-ce-stable
   docker-ce.x86_64            3:23.0.2-1.el7                      docker-ce-stable
   docker-ce.x86_64            3:23.0.1-1.el7                      docker-ce-stable
   docker-ce.x86_64            3:23.0.0-1.el7                      docker-ce-stable
   docker-ce.x86_64            3:20.10.9-3.el7                     docker-ce-stable
   docker-ce.x86_64            3:19.03.9-3.el7                     docker-ce-stable
   ```

   

6. 安装docker

   ```sh
   # 这是指定版本安装
   yum install -y docker-ce-3:19.03.9-3.el7.x86_64 
             
   # 官方还提供了很多相关的工具
   yum install docker-ce-<VERSION_STRING> docker-ce-cli-<VERSION_STRING> containerd.io docker-buildx-plugin docker-compose-plugin
   ```

   



## 启动

```sh
#启动
systemctl start docker
# 设置为开机启动
systemctl start docker && systemctl enable docker
```





## 卸载

```sh
yum remove -y docker*
rm -rf /etc/systemd/system/docker.service.d
rm -rf /var/lib/docker
rm -rf /var/run/docker
```

