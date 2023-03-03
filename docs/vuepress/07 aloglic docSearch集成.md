---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vuepress/
typora-root-url: ..\.vuepress\public
---

## docsearch

::: tip 

官方文档有两种方式来集成algolia docSearch. :one: 向algolia官方注册信息 :two: 自己构建爬虫

由于第一种方式简单，但是我迟迟没有收到邮件，所以推荐第二种方式自己构建爬虫

:::

----------

## 手动执行爬虫:rocket:

::: tip 

以下操作基于windows环境

:::

### python环境安装

下载python[Python Release Python 3.6.6 | Python.org](https://www.python.org/downloads/release/python-366/)



![202111281725342](/images/vuepress/202111281725342.png)

配置python环境变量



![202111290600550](/images/vuepress/202111290600550.png)

### 安装爬虫环境

参考[Run your own | DocSearch by Algolia](https://docsearch.algolia.com/docs/legacy/run-your-own/#running-the-crawler-from-the-code-base)

### Algolia环境配置

在 [algolia](https://www.algolia.com) 使用github账号注册的上的dashboad上创建一个应用

```
用户名：cau1403090523@gmail.com 密码：同邮箱
```

![202111281559173](/images/vuepress/202111281559173.png)

我创建了一个应用，并命名为Blog,然后切换到该应用，点击API keys

![202111281602375](/images/vuepress/202111281602375.png)

创建一个新的api key,其中需要有相应的权限，根据官网 [Run your own | DocSearch by Algolia](https://docsearch.algolia.com/docs/legacy/run-your-own/#set-up-your-environment)

::: tip

- `APPLICATION_ID` set to your Algolia Application ID
- `API_KEY` set to your API Key. Make sure to use an API key with **write** access to your index. It needs [the ACL `addObject`, `editSettings` and `deleteIndex`](https://www.algolia.com/doc/guides/security/api-keys/#acl).

:::

**注意在生成API的时候不要指定index name,保持为空，表示这个api key可以操作所有的索引**

![202111281612220](/images/vuepress/202111281612220.png)

新生成的api key 应该如下所示，**api key用于爬虫上传数据的凭证**

![202111290900539](/images/vuepress/202111290900539.png)

### 安装pipenv

::: tip

pipenv 用于执行python程序时构建一个虚拟环境，在这个环境中能够很好的管理包依赖

它会创建一个Pipfile 这个文件的作用类似npm下的package.json，用于管理项目中需要的依赖

:::

[Pipenv & Virtual Environments 官网](https://pipenv.pypa.io/en/latest/install/#installing-pipenv)

```
pip install --user pipenv
pipenv install
```

默认安装在了

```sh
C:\Users\你的用户名\AppData\Roaming\Python\Python38\Scripts
# 如： C:\Users\11930\AppData\Roaming\Python\Python38\Scripts
```

配置该环境变量

![202111290900049](/images/vuepress/202111290900049.png)

```sh
# 验证
> pipenv --version
pipenv, version 2021.11.23
```



### 下载Chrome driver

::: tip

use the browser emulation 即爬虫使用浏览模拟的方式，经过自己的实验，这样能够让爬虫爬取到更多的数据

:::

目前我的chrome浏览器是 96.0.4664.45

![202111290558310](/images/vuepress/202111290558310.png)

找到对应浏览器的版本下载驱动 [ChromeDriver - WebDriver for Chrome - Downloads (chromium.org)](https://chromedriver.chromium.org/downloads)

![202111290559323](/images/vuepress/202111290559323.png)

### 下载爬虫代码

https://github.com/algolia/docsearch-scraper

```
git clone https://github.com/algolia/docsearch-scraper.git
```

进入到docsearch-scraper文件夹，并在里面创建**\.env**文件

```sh
D:\Github\docsearch-scraper> touch .env
```

在**.env**文件中填入在algolia上配置的application_id和api_key

```sh
APPLICATION_ID=在aloglia上配置的应用ID
API_KEY=在aloglia配置的api key
# 配置chrome的驱动
CHROMEDRIVER_PATH=E:/chromedriver/chromedriver.exe
```

### 配置config.json文件

::: tip

用于爬虫程序使用,爬取 [https://q10viking.github.io)](https://q10viking.github.io/) 

config.json文件如下，我放在了.vuepress文件夹下

:::

复制官网[docsearch | VuePress (vuejs.org)](https://v2.vuepress.vuejs.org/reference/plugin/docsearch.html#get-search-index)的爬虫的配置文件，你需要修改的地方：

1. index_name配置为索引的名字，爬虫会将数据存储到该索引名下
2. start_urls，博客网站
3. js_render，添加这行，表示使用浏览器模拟，这样使得爬虫能够爬取到博客更多的数据

```json {2,4,30}
{
  "index_name": "docs",
  "start_urls": [
    "http://q10viking.github.io"
  ],
  "stop_urls": [],
  "selectors": {
    "lvl0": {
      "selector": ".sidebar-heading.active",
      "global": true,
      "default_value": "Documentation"
    },
    "lvl1": ".theme-default-content h1",
    "lvl2": ".theme-default-content h2",
    "lvl3": ".theme-default-content h3",
    "lvl4": ".theme-default-content h4",
    "lvl5": ".theme-default-content h5",
    "text": ".theme-default-content p, .theme-default-content li",
    "lang": {
      "selector": "/html/@lang",
      "type": "xpath",
      "global": true
    }
  },
  "custom_settings": {
    "attributesForFaceting": [
      "lang"
    ]
  },
  "js_render": true
}
```



### 执行爬虫:star:

::: tip

在windows上使用gitbash来执行

:::

进入到文件夹docsearch-scraper，执行命令

```sh
# 下载docsearch-scraper依赖的文件
pipenv install
```

![202111281804501](/images/vuepress/202111281804501.png)

```sh
# 创建virtualenv 虚拟环境
pipenv shell
```

![202111290609031](/images/vuepress/202111290609031.png)

执行爬虫代码

```sh
# 指定爬虫的配置文件
./docsearch run D:/Github/q10viking.github.io/docs/.vuepress/config.json
```

![202111290613633](/images/vuepress/202111290613633.png)

在[Indices | Algolia](https://www.algolia.com/apps/20P1NJDB7B/indices)查看爬取的结果

![202111290412851](/images/vuepress/202111290412851.png)

## 博客配置docsearch插件

```sh
# 下载插件
npm i -D @vuepress/plugin-docsearch@next
```

注意官网推荐的版本，看看自己下载的版本是不是符合，因为如果使用的镜像源的话，下载的版本版本有可能落后，我此时安装docsearch插件的时候，淘宝的npm源是2.0.0-beta.26

![202111290524749](/images/vuepress/202111290524749.png)

config.js文件中配置插件

```js {5-7}
plugins: [
	[
      '@vuepress/docsearch',  // alogolia docsearch
      {
        appId: '20P1NJDB7B',  // Add your own Application ID
        apiKey: '25cd701e07d0762388df4474cbf8c05d', // Set it to your own *search* API key
        indexName: 'docs'
      }
    ]
]
```



## 预览效果:smile_cat:

![202111290536972](/images/vuepress/202111290536972.png)

## 参考

[aloglia 官网](https://www.algolia.com/) :star:

[docSearch配置](https://v2.vuepress.vuejs.org/zh/reference/plugin/docsearch.html#%E5%AE%89%E8%A3%85)

[Run your own | DocSearch by Algolia](https://docsearch.algolia.com/docs/legacy/run-your-own/#set-up-your-environment)

