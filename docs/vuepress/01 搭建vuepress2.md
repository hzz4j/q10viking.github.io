---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vuepress/
typora-root-url: ..\.vuepress\public
---

## 环境搭建

1. 在github创建仓库vlog 用于存放我们的项目，并克隆到电脑上

   <img src="/images/vuepress/image-20211126054031455.png" alt="image-20211126054031455" style="zoom: 50%;" />

2. 进入vlog目录，安装vuepress

   ```sh
   # 构建前端的包管理
   npm init
   # 安装vuepress 当前的最新版本是2.0.0-beta.27
   npm install -D vuepress@next
   
   # 在 package.json 中添加一些 scripts
   {
     "scripts": {
       "docs:dev": "vuepress dev docs",
       "docs:build": "vuepress build docs"
     }
   }
   
   # 将默认的临时目录和缓存目录添加到 .gitignore 文件中
   echo 'node_modules' >> .gitignore
   echo '.temp' >> .gitignore
   echo '.cache' >> .gitignore
   
   # 创建你的第一篇文档
   mkdir docs
   echo '# Hello VuePress' > docs/README.md
   ```

3. 在本地启动服务器来开发你的文档网站

   ```sh
   npm run docs:dev
   ```

   

## 基本配置

1. 在`.vuepress`文件夹下，创建config.js,以后的相关导航栏，侧边栏，搜索等都在这里配置。
2. 在`.vuepress` 文件夹下，创建public文件夹，在创建images，用于存放图片
3. 为了使得页面更加简洁，禁用掉一些信息

```js
/**
 * vuepress 配置文件
 */

 module.exports = {
    lang: 'zh-CN',
    title: '静默的Vlog',
    description: '静默的Vuepress Blog',
    head: [['link', { rel: 'icon', href: '/images/favicon-32x32.png' }]], // icon设置

    themeConfig: {
      logo: '/images/logo.png',
      lastUpdated: false,   // 禁用显示更新时间
      contributors: false   // 禁用显示贡献者 
    },
  }
```



## 参考

[快速上手 | VuePress (vuejs.org)](https://v2.vuepress.vuejs.org/zh/guide/getting-started.html)

[配置 | VuePress (vuejs.org)](https://v2.vuepress.vuejs.org/zh/reference/config.html#站点配置)

