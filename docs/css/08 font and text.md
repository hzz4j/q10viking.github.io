---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /css/
typora-root-url: ..\.vuepress\public
---



## 	Generic Families & Font Families

![202112142315541](/images/css/202112142315541.jpg)

::: tip

浏览器默认会设置一些字体，那么浏览器展示的时候会如何展示呢，有一下几种方式

:::

![202112142322970](/images/css/202112142322970.jpg)

## 系统平台安装的字体User's computer

可以从这里查询到 https://www.cssfontstack.com/

## web fonts

如 google fonts

font face 相当于font-weight



## from server

::: tip

:one: ttf TrueType/OpenType font that contains information 目前浏览器中都广泛使用

:two: woff Web Open Font Format 他是压缩的compressed

:three: woff2.0

:::

1. 下载字体
2. 定义字体

```css
@font-face {
    font-family: "AnonymousePro";
	src: url('./aonymousePro-Regular.ttf');
}

@font-face {
    font-family: "AnonymousePro";
	src: url('./aonymousePro-Bold.ttf');
    font-weight: 700;
}

/*指定format*/
@font-face {
    font-family: "AnonymousePro";
	src: url('./aonymousePro-Regular.woff2') format("woff2"),
         url('./aonymousePro-Regular.woff') format("woff"),
         url('./aonymousePro-Regular.ttf') format("truetype");
}
```

3. 使用

   ```css
   .info {
   	font-family: "AnonymousePro";
   }
   ```

   

## font其他样式

- font-weight

- font-style

- font-variant

- font-strech

- letter-spacing

- white-space

- line-height  可以相对与font-size [line-height - CSS: Cascading Style Sheets | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height)

- text-decoration

  ```css
  /*红色波浪线*/
  text-decoration: underline wavy red;
  ```

- **text-shadow**

