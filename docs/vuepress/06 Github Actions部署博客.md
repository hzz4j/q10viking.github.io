---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vuepress/
typora-root-url: ..\.vuepress\public
---

## 部署

::: tip 

部署的时候使用`base: '/'` 的方式部署

:::

> github actions的自动构建部署的好处就是，每次提交文件到github之后，它就会帮我们build和部署，网站的内容就会自动更新，非常方便

使用github actions来部署vuepress，将官网的提供的文件复制进来

<img src="/images/vuepress/image-20211126110724435.png" alt="image-20211126110724435" style="zoom:50%;" />

> vuepress指南-部署，提供的文件，自己做了一些修改如node.js版本，去掉cache dependcies,使用npm而不是yarn来构建

```yml {26-35}
name: docs

on:
  # 每当 push 到 main 分支时触发部署
  push:
    branches: [main]
  # 手动触发部署
  workflow_dispatch:

jobs:
  docs:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
        with:
          # “最近更新时间” 等 git 日志相关信息，需要拉取全部提交记录
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v1
        with:
          # 选择要使用的 node 版本
          node-version: '14.17.6'

      # 缓存 node_modules
      # - name: Cache dependencies
      #   uses: actions/cache@v2
      #   id: yarn-cache
      #   with:
      #     path: |
      #       **/node_modules
      #     key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
      #     restore-keys: |
      #       ${{ runner.os }}-yarn-

      # 如果缓存没有命中，安装依赖
      - name: Install dependencies
        if: steps.yarn-cache.outputs.cache-hit != 'true'
        run: yarn --frozen-lockfile

      # 运行构建脚本
      - name: Build VuePress site
        run: npm run docs:build

      # 查看 workflow 的文档来获取更多信息
      # @see https://github.com/crazy-max/ghaction-github-pages
      - name: Deploy to GitHub Pages
        uses: crazy-max/ghaction-github-pages@v2
        with:
          # 部署到 gh-pages 分支
          target_branch: gh-pages
          # 部署目录为 VuePress 的默认输出目录
          build_dir: docs/.vuepress/dist
        env:
          # @see https://docs.github.com/cn/actions/reference/authentication-in-a-workflow#about-the-github_token-secret
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```



可以看到github actions将构建的内容放到**gh-pages**分支

<img src="/images/vuepress/image-20211126134357721.png" alt="image-20211126134357721" style="zoom:50%;" />

以上步骤是使用github actions的自动构建功能，但是不能访问页面，需要设置github pages的信息

<img src="/images/vuepress/image-20211126140058431.png" alt="image-20211126140058431" style="zoom:70%;" />

到此为止，进行访问 https://q10viking.github.io/

<img src="/images/vuepress/image-20211126135116578.png" alt="image-20211126135116578" style="zoom:50%;" />



## 参考

[部署 | VuePress (vuejs.org)](https://v2.vuepress.vuejs.org/zh/guide/deployment.html#github-pages)

