---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /typescript/
---



## addEventListener callback function

```tsx
fill.addEventListener("dragstart",e => dragStart(e as DragEvent))

function dragStart(event:DragEvent){
  console.log(this)  // compiler error
  console.log("drag start")
}
```



## 在方法上声明this

> 必须声明在第一个参数

[TypeScript: Documentation - declaring-this-in-a-function](https://www.typescriptlang.org/docs/handbook/2/functions.html?#declaring-this-in-a-function)

```tsx
fill.addEventListener("dragstart",dragStart)
function dragStart(this:HTMLElement){
  console.log(this)
}

// 效果等价与
fill.addEventListener("dragstart",e => {
  dragStart.call(e.target as HTMLElement)
})

function dragStart(this:HTMLElement){
  console.log(this)
  console.log("drag start")
}
```

-----------

调用方式

```tsx
fill.addEventListener("dragstart",e => {
  dragStart.call(e.target as HTMLElement,1) // 输出DOM元素
  // 不一样  
  dragStart(e.target as HTMLElement,1)   // 输出undefined
})

function dragStart(this:HTMLElement,num:number){
  console.log(this)
}
```

但是只有一个参数的时候，就不一样了

```tsx
fill.addEventListener("dragstart",e => {
  dragStart.call(e.target as HTMLElement)
  // error
  // dragStart(e.target as HTMLElement)
})

function dragStart(this:HTMLElement){
  console.log(this)
  console.log("drag start")
}
```

----------------

### 转化成js

```
const btn = document.getElementById('btn')!

btn?.addEventListener('click',showMe)
btn?.addEventListener('click',showMeAnthor)

function showMe(this:HTMLElement){
    console.log(this)
}

function showMeAnthor(event:Event){
    console.log(event.target)
}
```

ts转换成js的样子

```js
const btn = document.getElementById('btn');
btn === null || btn === void 0 ? void 0 : btn.addEventListener('click', showMe);
btn === null || btn === void 0 ? void 0 : btn.addEventListener('click', showMeAnthor);
function showMe() {
    console.log(this);
}
function showMeAnthor(event) {
    console.log(event.target);
}
```

