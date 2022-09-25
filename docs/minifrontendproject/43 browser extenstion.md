---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## 核心manifest文件





## 简单的插件

- [Source Code (采用webpack构建)](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/47%20browser%20extension-simple)
- 参考 [Your first extension - Mozilla | MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension)

访问 [https://www.mozilla.org/zh-CN/firefox/new/](https://www.mozilla.org/zh-CN/firefox/new/) 插件生效

manifest.json

```json
{

    "description": "Adds a solid red border to all webpages matching mozilla.org. See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Examples#borderify",
    "manifest_version": 2,
    "name": "Q10Vikiing(静默)Simple",
    "version": "1.0",
    "homepage_url": "https://q10viking.github.io",
    "icons": {
      "48": "images/border-48.png"
    },
  
    "content_scripts": [
      {
        "matches": ["*://*.mozilla.org/*"],
        "js": ["app.js"]
      }
    ]
  
  }
```

- icons 插件图标
- content_scripts的配置，当匹配到指定的网址时，运行app.js



## 安装插件

使用Edge安装

edge://extensions/

![image-20220925201304876](/images/minifrontendproject/image-20220925201304876.png)

![image-20220925201337256](/images/minifrontendproject/image-20220925201337256.png)





[microsoft/Web-Dev-For-Beginners: 24 Lessons, 12 Weeks, Get Started as a Web Developer (github.com)](https://github.com/microsoft/Web-Dev-For-Beginners)

[microsoft/Web-Dev-For-Beginners: 24 Lessons, 12 Weeks, Get Started as a Web Developer (github.com)](https://github.com/microsoft/Web-Dev-For-Beginners)