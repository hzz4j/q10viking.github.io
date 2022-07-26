---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## vite

[Vite | 下一代的前端工具链 (vitejs.dev)](https://cn.vitejs.dev/)



## 快速创建html+scss+typescript脚手架

::: tip

1. 非常轻便，已经配置好了ts
2. 提供了自带的serve

:::

[Getting Started | Vite (vitejs.dev)](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)

```sh
# 快速创建
npm create vite@latest

# 进入到项目目录
cd projectName

# 安装依赖，下载vite等
npm install

# 安装scss
npm add -D sass

# 命令行打开该项目
code .

# 运行
npm run dev
```

![image-20220724173911996](/images/minifrontendproject/image-20220724173911996.png)

![image-20220724174033888](/images/minifrontendproject/image-20220724174033888.png)

项目提供的默认模板

![image-20220724174831859](/images/minifrontendproject/image-20220724174831859.png)



### 别名@配置

::: tip

1. 如`import '@/style.scss'`
2. `import type TodoItem from '@/TodoItem'` 

:::

```json
// tsconfig.js
"baseUrl": ".",
"paths": {
    "@/*": [
        "src/*"
    ]
}
```



```js
// vite.config.ts
import { fileURLToPath, URL } from 'node:url'  // 依赖@types/node模块
import { defineConfig } from 'vite'


function wrapper(url: string | URL){
    console.log('我配置的输出import.meta.url',url)
    const re = fileURLToPath(new URL('./src',url))
    console.log("处理后的结果过",re);
    
    return re
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      //'@': wrapper(import.meta.url)
      '@': fileURLToPath(new URL('./src',import.meta.url))
    }
  }
})
```





### 注意⭐

vite打包build的时候,在index.html中，assets是绝对路径

```html
<script type="module" crossorigin src="/assets/index.4263fa05.js"></script>
<link rel="stylesheet" href="/assets/index.4c5dc9dc.css">
```

这样上传到github page会导致访问不到，因为我使用dist目录下的路径，所以得手动修改一下，改为相对路径

```html
<script type="module" crossorigin src="assets/index.4263fa05.js"></script>
<link rel="stylesheet" href="assets/index.4c5dc9dc.css">
```





## import.meta

[import.meta - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta)





## Vue3使用Font Awesome 

::: tip

在Vue中使用 font Awesome icons

:::



### 安装依赖

[Set Up with Vue | Font Awesome Docs](https://fontawesome.com/docs/web/use-with/vue/)

```sh
# core package
npm i --save @fortawesome/fontawesome-svg-core

# Free icons styles
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/free-regular-svg-icons
npm i --save @fortawesome/free-brands-svg-icons

# for Vue 3.x
npm i --save @fortawesome/vue-fontawesome@latest-3
```



### 导入图标

::: tip

为了减少项目的体积，可以按需导入

:::

[Import Icons | Font Awesome Docs](https://fontawesome.com/docs/apis/javascript/import-icons)

比如为了使用tiktok图标

![image-20220726160455989](/images/minifrontendproject/image-20220726155247346.png)



**注意icon有类型分类solid,regular,brands**

```js

import { library } from "@fortawesome/fontawesome-svg-core";
// 通过前缀全部导入fab类型的icon
import { fab } from "@fortawesome/free-brands-svg-icons"
// 其他的类型
// import { fas } from '@fortawesome/free-solid-svg-icons'
// import { far } from '@fortawesome/free-regular-svg-icons'

// 接受一个数组
library.add(fab)

<!-- Add all icons to the library so you can use it in your page -->
// library.add(fas, far, fab)
```

```js
// 只导入需要的，怎么知道图标对应的名字呢----》直接点开导入的包搜索
import { faTiktok } from "@fortawesome/free-brands-svg-icons"
library.add(faTiktok)
```



### 注册组件

```js
createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
```



## 使用

```html
<font-awesome-icon icon="fa-brands fa-tiktok" />
```



## 优化

::: tip

抽离成单独的一个文件`fontawesome-icon.ts`，以便进行维护

:::



```tsx
import { library } from "@fortawesome/fontawesome-svg-core";
// import {fab } from "@fortawesome/free-brands-svg-icons"
import {faTiktok,faWeibo,faBilibili } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


library.add(faTiktok,faWeibo,faBilibili)

export default FontAwesomeIcon
```

使用

```js
import FontAwesomeIcon from './ts/fontawesome-icons'
import App from './App.vue'

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
```



[Import Icons | Font Awesome Docs](https://fontawesome.com/docs/apis/javascript/import-icons)

[Home (fontawesome.com)](https://blog.fontawesome.com/how-to-use-vue-js-with-font-awesome/)

[javascript - Using Font Awesome in Vue 3 - Stack Overflow](https://stackoverflow.com/questions/66389974/using-font-awesome-in-vue-3)
