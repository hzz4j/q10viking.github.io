---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /webdev/
typora-root-url: ..\.vuepress\public
---



::: tip

webpack更多的关注兼容性,

vite关注浏览器端的开发体验

:::

## Server Start

webpack构建工具需要很长时间才能启动开发服务器 (启动开发服务器 ---> 把项目跑起来)。webpack支持多种模块化: 你的工程可能不只是跑在浏览器端。

```js
// index.js
// 这一段代码最终会到浏览器里去运行
const lodash = require("lodash"); // commonjs 规范
import Vue from "vue"; // es6 module

// webpack是允许我们这么写的
```

webpack的编译原理, AST 抽象语法分析的工具 分析出你写的这个js文件有哪些导入和导出操作 构建工具是运行在服务端的

```js
// webpack的一个转换结果
const lodash = webpack_require("lodash");
const Vue = webpack_require("vue");
```

底层工作原理

```js
(function(modules) {
    function webpack_require() {}
    // 入口是index.js
    // 通过webpack的配置文件得来的: webpack.config.js ./src/index.js
    modules[entry](webpack_require);

}, ({
    "./src/index.js": (webpack_require) => {
        const lodash = webpack_require("lodash");
        const Vue = webpack_require("vue");
    }
}))
```

因为webpack支持多种模块化, 他一开始必须要统一模块化代码, 所以意味着他需要将所有的依赖全部读一遍,进行编译。然后才启动服务器。

![image-20220928122207480](/images/webdev/image-20220928122207480.png)

而Vite则是基于es module的直接先启动服务器，然后根据请求按需导入

![image-20220928122535926](/images/webdev/image-20220928122535926.png)