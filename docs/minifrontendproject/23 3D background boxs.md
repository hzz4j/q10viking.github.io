---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## 3D Background boxs

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/29%203D%20Background%20Boxs/dist/index.html)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/29%203D%20Background%20Boxs)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/29%203D%20Background%20Boxs/dist/index.html"/>





## 图片切割

::: tip

每个box都设置为统一张图片，通过改变`background-position`来控制每个块显示的图片部分

:::

```css
/**
 * 控制显示整张图片的区域
 */
@mixin backgroundImageSet($url,$size) {
    background-image: url($url);
    background-repeat: no-repeat;
    background-size: calc($size*2) $size;
    background-position: -300px 0px;
}
```

在通过js计算改变position的位置

```js
/**
 * 原始图片在展示框的居中位置
 */
const x = -300
const y = 0
const step = 125

/**
 * 拼凑出完整的图片
 */
function createBox(){
  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
      let xPos = x + column * -step
      let yPos = y + row * -step
      let div = document.createElement('div')
      div.classList.add('box')
      div.style.backgroundPosition = `${xPos}px ${yPos}px`  // 控制要显示的部分
      boxes.appendChild(div)
    }
  }
}
```

最后html中渲染出来的效果

```html
<div class="boxes" id="boxes">
    <div class="box" style="background-position: -300px 0px;"></div>
    <div class="box" style="background-position: -425px 0px;"></div>
    <div class="box" style="background-position: -550px 0px;"></div>
    <div class="box" style="background-position: -675px 0px;"></div>
    <div class="box" style="background-position: -300px -125px;"></div>
    <div class="box" style="background-position: -425px -125px;"></div>
    <div class="box" style="background-position: -550px -125px;"></div>
    <div class="box" style="background-position: -675px -125px;"></div>
    <div class="box" style="background-position: -300px -250px;"></div>
    <div class="box" style="background-position: -425px -250px;"></div>
    <div class="box" style="background-position: -550px -250px;"></div>
    <div class="box" style="background-position: -675px -250px;"></div>
    <div class="box" style="background-position: -300px -375px;"></div>
    <div class="box" style="background-position: -425px -375px;"></div>
    <div class="box" style="background-position: -550px -375px;"></div>
    <div class="box" style="background-position: -675px -375px;"></div>
</div>
```



## 底部和右边的3D视觉

::: tip

通过before和after伪元素来设置宽高，通过`skewX,skewY`偏斜45度来设置，同时通过颜色来加深视觉冲击

:::

```scss
.box{
    @include backgroundImageSet($image-url,$size);
    position: relative;
    height: calc($size/4);
    width: calc($size/4);
    transition: transform $time linear;

    &::before{
        content: "";
        position: absolute;
        top: 8px;
        right: -15px;
        width: 15px;
        height: 100%;
        background-color: $blue-color;
        transform: skewY(45deg);  // 偏斜
    }

    &::after{
        content: "";
        position: absolute;
        bottom: -15px;
        left: 8px;
        width: 100%;
        height: 15px;
        background-color: $blue-color-deep;
        transform: skewX(45deg);
    }

}
```


