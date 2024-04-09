---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /win11/
typora-root-url: ..\.vuepress\public
---



[Excalidraw](https://excalidraw.com/)

很好用的白板工具

[Releases · excalidraw/excalidraw (github.com)](https://github.com/excalidraw/excalidraw/releases)

使用发布的版本，不要使用master版本

![image-20240409205628040](/images/win11/image-20240409205628040.png)

```sh
yarn install 
yarn start
```



## 环境配置

### nvm

卸载windows上的node,安装[Releases · coreybutler/nvm-windows (github.com)](https://github.com/coreybutler/nvm-windows/releases)

[nvm 介绍，安装，以及使用](https://blog.csdn.net/qq_22182989/article/details/125387145)

```java
nvm ls                      // 看安装的所有node.js的版本
nvm list available          // 查显示可以安装的所有node.js的版本
nvm install <version>       // 安装node.js的命名 version是版本号 nvm install 18.20.0
nvm use <version>           // 切换到使用指定的nodejs版本 nvm use 18.20.0
    
npm install -g yarn
yarn -v
```



### 运行起来

```sh
yarn start
```

## 编写bat启动文件

> 命名为`start_excalidraw.bat`

```
@echo off  
cd /d E:\excalidraw-0.17.3
yarn start
```



## 设置字体

[添加沐瑶字体](https://blog.csdn.net/xhmico/article/details/135655680)

我在自己的excalidraw中添加了三种字体

## 素材库

阿里icon [iconfont-阿里巴巴矢量图标库](https://www.iconfont.cn/)

官网提供的素材库

## 背景颜色

```
faf9de
```

