## 	Generic Families & Font Families

![image (1)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112142315541.jpg)

::: tip

浏览器默认会设置一些字体，那么浏览器展示的时候会如何展示呢，有一下几种方式

:::

![image (2)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112142322970.jpg)



## 系统平台安装的字体User's computer

可以从这里查询到 https://www.cssfontstack.com/

## web fonts

如 google fonts

font face 相当于font-weight



## from server

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