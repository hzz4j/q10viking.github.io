---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---



## Blurry Loading

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/22%20Blurry%20Loading/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/22%20Blurry%20Loading)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/22%20Blurry%20Loading/"/>

## 模糊处理图片Filter

::: tip

在处理图片模糊的边框，通过定位移动

:::

```css
.bg{
    background: url('./sun-night.jpg') no-repeat center center/cover;
    position: absolute;
    top: -10px;
    left: -30px;
    bottom: -10px;
    right: -30px;
    width: calc(100vw + 30px);  /*计算大小*/
    height: calc(100vh + 10px);
    filter: blur(30px);  /*模糊效果*/
    z-index: -1;
}
```

js处理

```js
let loaded = 0
let flag = setInterval(blurring,30)

function blurring() {
    loaded++
    if(loaded > 99){
        loaded = 100
        clearInterval(flag)
    }

    loadingText.innerText = `${loaded}%`
    // map [0,100]->[1,0]
    loadingText.style.opacity = `${scale(loaded,0,100,1,0)}`
    // map [0,100]->[30,0]
    bgSection.style.filter = `blur(${scale(loaded,0,100,30,0)}px)`
}
```



## 一个区间map到另外一个区间

如[0,100] 映射到[30,0]

```js
// https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
const scale = (num, in_min, in_max, out_min, out_max) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}
```

