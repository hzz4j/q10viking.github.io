---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /css/
typora-root-url: ..\.vuepress\public
---



## Sass / Scss

[Sass: Syntactically Awesome Style Sheets (sass-lang.com)](https://sass-lang.com/)

![image-20220721001120735](/images/css/image-20220721001120735.png)



## npm安装Sass

::: tip

1. 我觉得scss格式比sass格式更符合需求
2. 项目中使用webback来安装相应的插件来解决

:::



```sh
# 全局安装在了E:\nodejs\node_global\sass -> E:\nodejs\node_global\node_modules\sass\sass.js
npm install -g sass
```

```sh
# 查看安装的版本
sass --version
1.53.0 compiled with dart2js 2.17.3

# 编译
sass main.scss main.css
sass --watch main.scc:main.css
```





## 特性

### nested嵌套

```scss
.documentation-links{
    .documentation-link{
        &:active{}   
    }
}
```



### properties

```scss
/**感觉有点鸡肋*/
flex:{
	direction: column;
	wrap: nowrap;
}
```



### variables

```scss
/** $开头 */
$primary-color: red;
$size-default: 1rem;

color: $primary-color;
padding: $size-default * 0.5;
```



### List & Maps

```scss
/** List*/
$border-default: 0.05rem solid $primary-color;
border: $border-default;

/** Map */
$colors: (main: red,secondary: orange);
// 使用map-get函数获取值
color: map-get($colors,main);

```



### Built -in Functions

```scss
background: lighten($primary-color,72%)
```



### Import & Partial(抽离到一个文件)

```scss
// css3 在浏览器中会单独加载这个文件
@import url('./xxx.css')  // 
```

> scss会整合到一个文件

```scss
// 文件名以下划线开头 _variables.scss

@import "_variables.scss"
```



### Advance Media

```scss
// scss中使得media更加接近标签
html{
    @media (min-width: 40rem){
        font-size: 35px;
    }
}


// css3中是
@media (min-width: 40rem){
    html{
        font-size: 35px;
    }
}
```



### Inheritance

```scss
// 抽离公共的区域部分
.share-section{
	width: 90%;
}

.introduction{
    @extend .share-section;
}

```



### Mixins

::: tip

类似自定义函数

:::

```scss

@mixin custom-name(){
	display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
}

@mixin media-min-width($width){
    @media(min-width: $width){
        // 动态添加内容
        @content: 
    }
}

.container{
    @include custom-name();
    
    @include media-min-width(40rem){
        // 动态添加内容
        font-size: 125%;
    }
}

.sub-container{
    @include media-min-width(40rem);
}
```
