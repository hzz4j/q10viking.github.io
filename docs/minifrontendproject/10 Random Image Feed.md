---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---

## Random Image Feed

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/14%20Random%20Image%20Feed/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/14%20Random%20Image%20Feed)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/14%20Random%20Image%20Feed/"/>



## unsplash image api

::: tip

会随机返回一张图片

::: 

```js
https://source.unsplash.com/random/
// 也可以带参数指定图片的大小
https://source.unsplash.com/random/300x301
```



## 获取图片

```js
const container = document.querySelector(".container")
const BASIC_API = "https://source.unsplash.com/random/"
let rows = 10

// load images
for(i = 0;i < rows * 3;i++){
    const img = document.createElement('img')
    img.src = generateRandomLink() // 直接设置连接 : https://source.unsplash.com/random/301x302
    container.appendChild(img)
}

console.log(generateRandomLink())

function getRandomNr(){
    return Math.floor(Math.random() * 10) + 300
}

function getRandomSize(){
    return `${getRandomNr()}x${getRandomNr()}`
}

function generateRandomLink(){
    return BASIC_API + getRandomSize()
}
```



## css样式

### object-fit

[object-fit - CSS（层叠样式表） | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit)

```css
.container{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin: auto;
    max-width: 1000px;  /*控制一行做多显示3张图片*/
}

.container img{
    height: 300px;
    width: 300px;
    margin: 10px;
    object-fit: cover; /*图片https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit*/
    box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.3);
}
```

