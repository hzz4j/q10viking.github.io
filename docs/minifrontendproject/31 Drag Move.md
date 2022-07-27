---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Drag Move



[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/36%20Drag%20Move/vanilla/dist/)

[vanilla Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/36%20Drag%20Move/vanilla)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/36%20Drag%20Move/vanilla/dist/"/>



## 原理

::: tip

1. 在元素的mousedown,mouseup开启和关闭移动的状态
2. 移动主要是通过移动position:absolute的left和top属性
3. 移动的距离，通过mouseup时鼠标的位置得到开始的位置，mousemove，得到移动的位置，两者之差就是left和top要移动的距离
   1. 通过event.clientX,event.clientY得到位置
4. 同时注意边界的处理

:::

开始的位置

```javascript
function moveStart(event:MouseEvent){
        
        // 第一次变换到absolute后仍然保持现在的位置
        if(!content.style.position){
            console.log(content.offsetLeft,content.offsetTop)
            content.style.left = content.offsetLeft-10+'px'
            content.style.top = content.offsetTop-10+'px'
        }
        
        // 开始的位置
        startX = event.clientX
        startY = event.clientY
        left = +content.style.left.replace("px","")
        top = +content.style.top.replace("px","")

        // 在document上监听mousemove事件
        document.addEventListener("mousemove",moveMove)

        startMove = true
        // console.log(event.clientX,event.clientY);

    }
```

计算移动的距离，最终确定left,top要移动到的位置

```js
function moveMove(event:MouseEvent){
    if(!startMove) return
    content.style.position='absolute'
    let xmove = event.clientX - startX
    let ymove = event.clientY - startY

    content.style.left = `${calcMove(left,xmove,maxLeft)}px`
    content.style.top = `${calcMove(top,ymove,maxTop)}px`
}
```



## 如何做到在页面平滑移动的？

::: tip

1. 监听mousemove,mousedown,mouseup
2. position:定位

:::

**mousemove的事件监听在document元素上，而不是在移动的元素上**

```js
content.addEventListener("mousedown",moveStart)
content.addEventListener("mouseup",moveStop)

function moveStart(event:MouseEvent){
        // 在document上监听mousemove事件
        document.addEventListener("mousemove",moveMove)
}

function moveStop(){
    startMove = false
    // clear event listener
    document.removeEventListener("mousemove",moveMove)
}
```





## 获取width

[Getting Width & Height of an Element in JavaScript (javascripttutorial.net)](https://www.javascripttutorial.net/javascript-dom/javascript-width-height/)

```js
/**
* width: 600px;
* width: 100%; // 会进行计算
*/
function getWidth(el:HTMLElement){
  let v = getComputedStyle(el).getPropertyValue("width")  
  return +v.replace("px","")
}
```



## 参考

[Draggable elements that have been styled to indicate draggability to users (github.com)](https://gist.github.com/mhull/e3f6caa5734519ed06fa/)

[JavaScript DOM Tutorial (javascripttutorial.net)](https://www.javascripttutorial.net/javascript-dom/)
