---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /typescript/
---



## VSCode调试ts代码

::: tip

在vscode上调试ts,而不是使用浏览器的dev tool

:::

### 安装插件

Debugger for Microsoft Edge

### 创建launch.json文件

![image (5)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202111301159819.jpg)

选择对应插件的浏览器

![image (6)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202111301200931.jpg)

```json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "edge",
            "request": "launch",
            "name": "针对 localhost 启动 Edge",
            "url": "http://localhost:3000", // 自定项目启动的端口
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```

### tsconfig.json配置

打开该配置，在tsc编译文件的时候会生成一个.js.map文件

```json
"sourceMap": true
```



### 代码中断点调试

![image (7)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202111301205247.jpg)

