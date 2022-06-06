---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vuepress/
typora-root-url: ..\.vuepress\public
---



## 问题分析

::: tip 

背景介绍： 在项目安装插件[register-components](https://v2.vuepress.vuejs.org/zh/reference/plugin/register-components.html#register-components)之后，本地启动是没有问题的，在github actions中报一下错误，原因是在actions的环境中找不到`register-components`

:::

<img src="https://gitee.com/q10viking/PictureRepos/raw/master/images/image-20211127071140391.png" alt="image-20211127071140391" style="zoom:67%;" />

## 解决方案

> Cache depencies是为了加快项目的部署，而此时项目中下载了新的依赖，需要在actions环境中，也要下载。

将`.github\workflows\docs.yml`中相关的缓存依赖的代码注释掉

<img src="https://gitee.com/q10viking/PictureRepos/raw/master/images/image-20211127071510990.png" alt="image-20211127071510990" style="zoom:80%;" />

尝试，等部署成功之后再将这个缓存打开，依然报错。所以还是将缓存的依赖继续注释掉
