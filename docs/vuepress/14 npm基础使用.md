---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vuepress/
---



## npm卸载依赖

```sh
Use command:
1)npm uninstall <name of the module>

Also you can use:
1) npm uninstall <name of the module>: to remove the module from node_modules, but not package.json

2) npm uninstall <name of the module> --save: to also remove it from dependencies in package.json

3) npm uninstall <name of the module> --save-dev: to also remove it from devDependencies in package.json

4) npm -g uninstall <name of the module> --save: to remove it globally
```



## npm源⭐

### 查看源

查看当前源

```sh
npm config get registry
```

### 修改源

::: tip

在使用beta版本的module时，最好切换到官方的源，因为淘宝的源有可能没有同步更新

:::

```sh
# 默认源 官方源

npm config set registry https://registry.npmjs.org

# https -> http，这样网速就会好很多

npm config set registry http://registry.npmjs.org

# 如果还不能下载，就切换成淘宝源

npm config set registry https://registry.npm.taobao.org

```



### 问题分析

::: tip

在安装插件时遇到的问题 @vuepress/plugin-docsearch 版本不对

:::

官方推荐安装方式[docsearch | VuePress (vuejs.org)](https://v2.vuepress.vuejs.org/reference/plugin/docsearch.html#install) 要求的版本是v2.0.0-beta.27

```sh
# @next表示的是tag
npm i -D @vuepress/plugin-docsearch@next
```

<img src="https://gitee.com/q10viking/PictureRepos/raw/master/images//202111290524749.png" alt="image-20211129052353828" style="zoom:80%;" />

由于自己的npm源设置的是淘宝的源，导致下载下来的版本是v2.0.0-beta.26 [Package - @vuepress/plugin-docsearch (npmmirror.com)](https://npmmirror.com/package/%40vuepress%2Fplugin-docsearch)

<img src="https://gitee.com/q10viking/PictureRepos/raw/master/images//202111290527975.png" alt="image-20211129052725943" style="zoom:67%;" />

而此时npm官方上docsearch的tag next对应的版本是2.0.0-beta.27[@vuepress/plugin-docsearch - npm (npmjs.com)](https://www.npmjs.com/package/@vuepress/plugin-docsearch/v/2.0.0-beta.27)

<img src="https://gitee.com/q10viking/PictureRepos/raw/master/images//202111290529377.png" alt="image-20211129052903588" style="zoom: 50%;" />

**解决方式**：将npm源切换回来官网的源,再重新安装

```sh
npm config set registry https://registry.npmjs.org
npm i -D @vuepress/plugin-docsearch@next
```

