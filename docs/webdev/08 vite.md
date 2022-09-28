---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /webdev/
typora-root-url: ..\.vuepress\public
---



::: tip

前端非常好的开箱即用的工具

:::

## 背景

在默认情况下, 我们的esmodule去导入资源的时候, 要么是绝对路径, 要么是相对路径

:::: code-group
::: code-group-item index.html

```html
<body>
    <script src="./app.js" type="module"></script>
 </body>
```
:::
::: code-group-item app.js

```js
import "./count.js";
```
:::
::::

浏览器实现了esmodule，能够支持导入`count.js`

![image-20220928124855584](/images/webdev/image-20220928124855584.png)

如果我们像这样导入，浏览器esmodule则不会去node_modules查找

```js
import "./count.js";
import _ from "lodash";  // 浏览器不会去node_modules中找lodash
```

![image-20220928125145177](/images/webdev/image-20220928125145177.png)

> 既然我们现在的最佳实践就是node_modules, 那为什么es官方在我们导入非绝对路径和非相对路径的资源的时候不默认帮我们 搜寻node_modules呢？假设浏览器做了这个事情，那么会导致性能下降，因为依赖也可能引入更多的import。会形成一个关系网图。



## 使用vite❤️

在上面的项目中我们安装vite,开箱即用

```sh
npm install -D vite
```

配置一下`package.json`

```json
"scripts": {
    "dev": "vite", 
    "build": "vite build", 
    "preview": "vite preview" 
}
```

运行可以看到，解决我们项目中引入`lodash`的问题。原因时，vite对路径进行了处理。

```js
// 源码
import "./count.js";
import _ from "lodash";

// vite处理成
import "/count.js";
import __vite__cjsImport1_lodash from "/node_modules/.vite/deps/lodash.js?v=b4eb8a8a"; 
```



## 依赖预构建

根据官网的描述[Dependency Pre-Bundling | Vite (vitejs.dev)](https://vitejs.dev/guide/dep-pre-bundling.html)  它主要解决两个问题

1. 兼容CommonJs和UMD，vite会将他们转换成 ESM（esmodule）

2. 提高性能：Vite converts ESM dependencies with many internal modules into a single module to improve subsequent page load performance。将许多模块变成一个文件，减少网络请求（官网举了一个lodash-es的例子）

   

比如我们配置`vite.config.js`,不对lodash-es进行预构建。

```js
import { defineConfig } from "vite";
export default defineConfig({
  optimizeDeps: {
    exclude: ["lodash-es"],
  },
});
```

可以看到发送了很多http请求加载模块

![image-20220928135336799](/images/webdev/image-20220928135336799.png)





## 配置文件







## 环境变量

[Env Variables and Modes | Vite (vitejs.dev)](https://vitejs.dev/guide/env-and-mode.html#env-variables-and-modes)

> 环境变量: 会根据当前的代码环境产生值的变化的变量就叫做环境变量 ---来自[vite环境变量处理_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1GN4y1M7P5?p=8&vd_source=83b77a4d29913d39a25316cf0ee47e54)

代码环境:

1. 开发环境
2. 测试环境
3. 预发布环境
4. 灰度环境
5. 生产环境

> vite使用dotenv这个第三方库来读取`.env`文件，并解析，最后挂在到`process`对象上。（process是node中的）

根据官网[Configuring Vite | environment-variables](https://vitejs.dev/config/#environment-variables)描述,默认是没有将env文件解析挂在到process上的。

```js
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  console.log("mode///", mode);
  console.log("process.env///", process.env.NODE_NAME); // 拿不到

  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // 会加载当前项目路径下的.env.[model]文件
  const env = loadEnv(mode, process.cwd(), "");
  console.log("env///", env);

  return {};
});

```

Vite 在一个特殊的 **`import.meta.env`** 对象上暴露环境变量。



## css处理

> Vite处理css的原理

```js
import 'index.css'
```





vite处理css模块化module













### js语法学习

```js
// a.js
export default function a(){}

// 
export { default as a} from "./a.js"
// 等价
import a from "./a.js"
export const a = a;
```





使用node开发一个静态资源服务器 js中import

```
content-type:text/javascript
```





## commonjs规范的原理

> node中的__dirname是怎么来的。

```js
(function(exports,require,module,__filename,__dirname){
    // 我们就可以使用
    require()
    console.log("__dirname",__dirname)
}())
```



