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