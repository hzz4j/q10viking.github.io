---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Drag N Drop

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/35%20Drag%20N%20Drop/vanilla/dist/)

[vanilla Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/35%20Drag%20N%20Drop/vanilla)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/35%20Drag%20N%20Drop/vanilla/dist/"/>





## 原理

::: tip

1. 元素设置draggable,打开可拖拽的可能性
2. 监听相关的拖拽事件：其中分两部分，可拖拽元素的事件dragstart,dragend；拖拽元素落脚的容器元素的事件：dragenter,dragover,drop.
3. 在每个监听事件触发的函数中我们就可以做一些程序的逻辑处理
4. 最后在drop事件对应的函数中处理拖拽元素的转移。代码层面就是在落脚的容器元素append这个拖拽的元素。这个元素就会从原来的地方转移过来。

:::



## html属性draggable

::: tip

dom元素设置了这个属性`draggable=true`,就能将元素拖拽起来

:::



## drop事件为什么没触发？

::: tip

原因是dragover有默认的行为，我们需要阻止它，否则的话在容器上一直处于dragover状态，不会触发drop事件

:::

```tsx
function dragOver(event:Event){
  event.preventDefault()  // 阻止dragover的默认行为，否者drop事件不会触发
  console.log("drag over on")
}
```





## DOM元素是如何移动的？

::: tip

通过选择器获取到元素之后，直接在插入到另外一个容器中，就能实现转移效果

:::

```js
const fill = document.querySelector(".fill")!
const empties = document.querySelectorAll(".empty")!
empties[2].appendChild(fill) // 直接转移
```

原来的html 结构是这样

```html
<div class="container">
  <div class="empty">
    <div class="fill"></div>
  </div>
  <div class="empty"></div>
  <div class="empty"></div>
</div>
```

在执行了`empties[2].appendChild(fill) `之后fill的DOM元素直接转移了

```html
<div class="container">
  <div class="empty"></div>
  <div class="empty"></div>
  <div class="empty">
      <div class="fill"></div>   <!-- 转移到了这里 -->
  </div>
</div>
```

> 下面实现了图片这个元素每隔1s自动在容器中转移，主要通过append添加到另外一个容器



<common-codepen-snippet title="Move DOM" slug="poLWgPN" />

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/35%20Drag%20N%20Drop/move-on/dist/"/>

[Auto Move Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/35%20Drag%20N%20Drop/move-on)

```js
const fill = document.querySelector(".fill")!
const empties = document.querySelectorAll(".empty")!


let idx = 0
setTimeout(moveImage,1500)
function moveImage(){
  idx++
  if(idx>empties.length-1){
    idx = 0
  }
  // 移动元素 核心代码
  empties[idx].appendChild(fill)
  // 无限循环
  setTimeout(moveImage,1500)
}
```



## ts中函数参数声明this

::: tip

1. 传进来的就是e.target
2. 我这样写的原因是想使用this,尝试一下typescript的this语法。为了达到这个效果也可以将函数设计为传入event.

:::

```tsx
fill.addEventListener("dragstart",dragStart)
/**
 * 传进来的就是e.target
 * @param this 
 */
function dragStart(this:HTMLElement){
  console.log(this.getAttribute("name-attr"),"drag start")
}
```

也可设计成

```js
fill.addEventListener("dragstart",dragStart)
function dragStart(event:Event){
  let el = event.target as HTMLElement
  console.log(el.getAttribute("name-attr"),"drag start")
}
```



## 拖拽开始后如何隐藏在原来容器的位置？

::: tip

拖拽之后立刻去除样式，但是样式在拖拽的元素中仍然生效

:::

```tsx
function dragStart(this:HTMLElement){
  // 设置新的样式
  this.classList.add("hold")

  // 拖拽之后立刻去除样式，但是样式在拖拽的元素中仍然生效
  setTimeout(() => {
    this.className = ""
  }, 1);
  
  console.log(this.getAttribute("name-attr"),"drag start")
}
```



## 参考

[HTML Drag and Drop API - Web APIs | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)

