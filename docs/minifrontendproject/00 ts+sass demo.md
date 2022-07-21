---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## WebPack5工程化Typescript + Sass

之前开发的项目都是html + css + javascript，这次升级一下变成html + sass + typescript来开发，并在适当的情况下引入vue3来进行开发学习。

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/23%20ts%20sass%20demo/dist/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/23%20ts%20sass%20demo)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/23%20ts%20sass%20demo/dist/"/>

[View in Stackblitz](https://stackblitz.com/edit/webpack-webpack-js-org-4wgkdu)

## npm命令基础知识

[When should i use npm with "-g" flag and why? - Stack Overflow](https://stackoverflow.com/questions/8909986/when-should-i-use-npm-with-g-flag-and-why)

The rules of thumb:

- **Install globally if the package provides command-line tools**
- Install locally if you're using the package as part of your application
- Install globally *and* locally if both use-cases apply

----------

如全局安装sass

```sh
# 全局安装在了E:\nodejs\node_global\sass -> E:\nodejs\node_global\node_modules\sass\sass.js
npm install -g sass

# 那么在命令行就能使用sass命令，并且package.json没有sass的依赖
sass --version
```



## Webpack5工程化

### 项目初始化并安装相关插件

```sh
# 生成package.json
npm init
# 引入webpack
npm install webpack webpack-cli --save-dev

# 安装scss/sass加载文件
npm install --save-dev style-loader css-loader sass-loader sass

# 安装ts环境
npm install --save-dev typescript ts-loader
# 生成html页面到dist目录中，并自动引入需要的js,css。引入的js在配置HtmlWebpackPlugin中指定，css则在引入的js文件中import
npm install --save-dev html-webpack-plugin
# 用于处理index.html页面中标签<a href="path/image/xx.jpg">引入的图片，生成到dist文件中
npm install --save-dev html-loader

# css 抽离
npm install --save-dev mini-css-extract-plugin
# -D 是 --save-dev的简写，压缩生成css  出于学习的目的就不压缩了
# npm i -D css-minimizer-webpack-plugin
```



### 创建webpack.config.js,并配置

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 处理模板index.html
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css

module.exports = {
  mode: 'development', /**指定model */
  entry: {
    app: './src/app.ts',  /**js入口文件为app.js */
    main: './src/js/main.ts'
  },
  devtool: 'inline-source-map', /**方便定位 */
  output: {
    filename: 'js/[name].js',  /*生成的文件是app.js */
    path: path.resolve(__dirname, 'dist'),
    // publicPath: "/assets/",
    assetModuleFilename: 'images/[name][ext][query]', /** 图片输出到dist目录保持原样 */
    clean: true   /* 每次生成文件都清除dist下的旧文件 */
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          // "style-loader",
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/app.html',
      inject: true,
      chunks: ['main','app'],
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: '[id].[contenthash].css'
    })
  ]
};
```



### package.json配置

> npm init生成文件并修改

```json
/* watch model使得webpack自动打包，热更新*/
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "watch": "webpack --watch",
    "build": "webpack"
 }
```



### tsconfig.json配置

创建一个文件，并填入一下内容

```json
{
    "compilerOptions": {
      "outDir": "./dist/",
      "sourceMap": true,
      "noImplicitAny": true,
      "module": "es6",
      "target": "es5",
      "allowJs": true,
      "moduleResolution": "node"
    }
}
```





### sass说明

```
style-loader Inject CSS into the DOM.
mini-css-extract-plugin 打包时抽离css为单独文件
css-loader interprets @import and url() like import/require() and will resolve them.
Loads a Sass/SCSS file and compiles it to CSS
```



### 运行命令⭐⭐⭐

> vscode中使用插件live server来运行dist下面的index.html文件来进行观察

```sh
# 编译打包
npm run build  
# 自动检测文件
npm run watch
```





## 之后的开发规范⭐⭐⭐

以后就之间拷贝这个目录，然后执行**npm install**

1. app.html不用写link引入样式
2. app.html不用写script来引入自己写的js
3. 部署到githug page页面则使用路径**dist**

![image-20220721071853698](/images/css/image-20220721071853698.png)



[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/23%20ts%20sass%20demo/dist/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/23%20ts%20sass%20demo)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/23%20ts%20sass%20demo/dist/"/>







## Webpack开发多页面

[romanslonov/webpack4-multipage-boilerplate: 🚀 Simple yet, powerful boilerplate using postcss and webpack 4 for building multi-page websites (github.com)](https://github.com/romanslonov/webpack4-multipage-boilerplate)



[Static website, multiple html pages, using Webpack + example on Github – Ivar Prudnikovas – Software engineer specializing in web application development. Building enterprise web products, Microservices and Android apps.](https://www.ivarprudnikov.com/static-website-multiple-html-pages-using-webpack-plus-github-example/)

[Set up Webpack 5 for Basic Javascript Projects | by Kcotrinam | Geek Culture | Medium](https://medium.com/geekculture/set-up-webpack-5-for-basic-javascript-projects-8bded066d282)
