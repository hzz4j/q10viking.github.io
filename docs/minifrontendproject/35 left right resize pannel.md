---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Resize Pannel

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/40%20resize%20panel/vanilla/dist/)

[vanilla Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/40%20resize%20panel/vanilla)


<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/40%20resize%20panel/vanilla/dist/"/>

## 原理

::: tip

设置一个入口：mousedown，然后监听window/document 的mousemove。然后改变相应的width

:::

### getBoundingClientRect

> MouseEvent.x === MouseEvent.clientX

```tsx
const leftPannel = document.querySelector(".left-pannel")! as HTMLElement
const rightPannel = document.querySelector(".right-pannel")! as HTMLElement
const gutter = document.querySelector(".gutter")! as HTMLElement

gutter.addEventListener('mousedown',resizePannel)
function resizePannel(event:MouseEvent){
  // 居然是一样的
  // console.log(event.x,event.clientX);
  window.addEventListener('mousemove',mousemove)
  window.addEventListener('mouseup',mouseup)
  let prevX = event.x

  let lefthPannelWidth = leftPannel.getBoundingClientRect().width
  let rightPannelWidth = rightPannel.getBoundingClientRect().width
  function mousemove(e:MouseEvent){
   let distance =  e.x - prevX
   // 除了getComputedStyle获得width的方式还有getBoundingClientRect
   leftPannel.style.width = `${lefthPannelWidth+distance}px`
   rightPannel.style.width = `${rightPannelWidth-distance}px`
  }

  function mouseup(){
    window.removeEventListener('mousemove',mousemove)
    window.removeEventListener('mouseup',mouseup)
  }
}

```



## 鼠标

::: tip

cursor: col-resize

:::

## 参考

[Resize Panels vanilla JS (codepen.io)](https://codepen.io/pablowbk/pen/bGbxZoz?editors=1111)

[cursor - CSS: Cascading Style Sheets | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)

[resize - CSS: Cascading Style Sheets | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/CSS/resize)



