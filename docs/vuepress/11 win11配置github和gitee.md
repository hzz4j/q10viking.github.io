---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vuepress/
typora-root-url: ..\.vuepress\public
---



## 取消全局用户配置

查看当前是否使用了全局用户配置

```sh
PS C:\Users\11930\Desktop> git config user.name
zhuangzhuang-huang
PS C:\Users\11930\Desktop> git config user.email
cau1403090523@gmail.com
```

取消全局用户配置

```sh
git config --global --unset user.name "zhuangzhuang-huang"
git config --global --unset user.email "cau1403090523@gmail.com"
```



## 生成SSH key

```sh
# ssh-keygen 参数说明
-t:		指定要创建的密钥类型。可以使用："rsa1"(SSH-1) "rsa"(SSH-2) "dsa"(SSH-2)
-f:		指定密钥文件名。
-C:		提供一个新注释
```

```sh
# 进入到目录
cd C:\Users\11930\.ssh
# 在C:\Users\11930\.ssh创建文件 
touch id_rsa.github
# Github 注册的邮箱
ssh-keygen -t rsa -f id_rsa.github -C "cau1403090523@gmail.com"
# Gitee 注册的邮箱
touch id_rsa.gitee
ssh-keygen -t rsa -f id_rsa.gitee -C "1193094618@qq.com" 
```

![202111271126733](/images/vuepress/202111271126733.png)

## 配置SSH Key到Github和Gitee

**id_rsa.gitee.pub**和 **id_rsa.github.pub**的内容分别配置到gitee和github

![202111271126276](/images/vuepress/202111271126276.png)

### 配置config文件

```sh
# 进入到目录
cd C:\Users\11930\.ssh
# 在C:\Users\11930\.ssh创建文件 
touch config
```
添加以下内容：

```sh
# gitee
Host gitee.com
HostName gitee.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa.gitee

# github
Host github.com
HostName github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa.github
```



## SSH key测试

```sh
ssh -T git@gitee.com
ssh -T git@github.com

# 输入如
Hi Q10Viking! You've successfully authenticated, but GitHub does not provide shell access.
```

### github ping不通

在使用ssh key测试的时候，会识别不了github.com,在hosts文件添加如下内容

```sh
140.82.113.3 github.com
199.232.5.194 github.global.ssl.fastly.net
54.231.114.219 github-cloud.s3.amazonaws.com
```



## 设置用户全局信息

```sh
git config --global  user.name "静默"
git config --global  user.email "cau1403090523@gmail.com"
```





## 参考

[connecting to github with-ssh](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys)