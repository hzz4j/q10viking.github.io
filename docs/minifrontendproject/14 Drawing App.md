---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---



## Drawing App





## Canvas API

[Canvas API - Web APIs | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)





## 最后一个元素靠右

```css
/*最后一个元素靠右的操作*/
.tools > *:last-child{
    margin-left: auto;
}
```



## canvas的宽高

在标签中定义，用css来修饰在画图的时候会出问题

```
<canvas id="canvas" height="500" width="800"></canvas>
```



## input type=color

```html
<input type="color" id="color">
```

监听事件

```js
colorBtn.addEventListener('change',e => {
    color = e.target.value
})
```

