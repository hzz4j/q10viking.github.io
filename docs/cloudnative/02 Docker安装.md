---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /cloudnative/
---



::: tip

[Install Docker Engine on CentOS | Docker Documentation](https://docs.docker.com/engine/install/centos/)

以下操作在本地虚拟机centos7 192.168.187.132 操作

:::



## 准备工作

::: tip

:one: 社区版（Community Edition，缩写为 CE）

:two: 企业版（Enterprise Edition，缩写为 EE）

:::

确保 yum 包更新到最新

```sh
yum -y update
```

安装相关工具

```sh
yum install -y yum-utils
```

设置yum源，并更新 yum 的包索引

```sh
# 官方的yum源
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# 这里使用阿里的云源，来加快访问速度
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
yum makecache fast
```

查看所有仓库中所有docker版本，并选择特定版本安装

```
yum list docker-ce --showduplicates | sort -r
```

![image (7)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112151722103.jpg)

## 安装docker

::: tip

用指定版本的方式安装

:::

```sh
yum install -y docker-ce-3:19.03.9-3.el7.x86_64
```



## 启动Docker



```sh
systemctl start docker
# 加入开机启动
systemctl enable docker
```

验证安装是否成功(有client和service两部分表示docker安装启动都成功了)

```sh
docker version
```

::: details

```sh
[root@localhost ~]# docker version
Client: Docker Engine - Community
 Version:           20.10.12
 API version:       1.40
 Go version:        go1.16.12
 Git commit:        e91ed57
 Built:             Mon Dec 13 11:45:41 2021
 OS/Arch:           linux/amd64
 Context:           default
 Experimental:      true

Server: Docker Engine - Community
 Engine:
  Version:          19.03.9
  API version:      1.40 (minimum version 1.12)
  Go version:       go1.13.10
  Git commit:       9d988398e7
  Built:            Fri May 15 00:24:05 2020
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.4.12
  GitCommit:        7b11cfaabd73bb80907dd23182b9347b4245eb5d
 runc:
  Version:          1.0.2
  GitCommit:        v1.0.2-0-g52b36a2
 docker-init:
  Version:          0.18.0
  GitCommit:        fec3683
```

:::



## 配置docke镜像加速器

::: tip

借助阿里云的镜像加速器，登录阿里云(https://cr.console.aliyun.com/#/accelerator)

:::

```sh
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://u8x09gus.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

![image (8)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112151759200.jpg)



## 卸载docker

```sh
yum remove -y docker*
rm -rf /etc/systemd/system/docker.service.d
rm -rf /var/lib/docker
rm -rf /var/run/docker
```

