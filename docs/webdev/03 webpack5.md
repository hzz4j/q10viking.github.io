---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /webdev/
typora-root-url: ..\.vuepress\public
---



## webpack

默认入口时./src/index.js,打包是dist/main.js



[Asset Modules | webpack](https://webpack.js.org/guides/asset-modules/)

In webpack 5 we can use "Asset Modules" to load common files like "json", "png" etc. See for more info: https://webpack.js.org/guides/asset-modules/

```js
{
    test: /\.json$/,
    type: 'asset/resource',
    generator: {
        filename: '[name][ext][query]'
    }
}
```



## public path

[Public Path | webpack](https://webpack.js.org/guides/public-path/#root)

```js
output:{
    publicPath: '/', // 能够访问静态资源
}
```

> 在开发插件的时候遇到[静默のBlog (browser extionsion)](https://q10viking.github.io/minifrontendproject/43 browser extenstion.html)

![image-20220925200114394](/images/webdev/image-20220925200114394.png)



## 开发插件的配置

```js
const path = require('path');
module.exports = {
    entry:{
        app: "./src/app.ts"
    },
    output:{
        publicPath: '/', // 能够访问静态资源
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'images/[name][ext][query]',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.json$/,
                type: 'asset/resource',
                generator: {
                    filename: '[name][ext][query]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    }
}
```

