---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Sortable List

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/37%20Sortable%20List/vite-project/dist/)

[vanilla Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/37%20Sortable%20List/vanilla)

[Vue3+ts重构 Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/37%20Sortable%20List/vite-project)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/37%20Sortable%20List/vite-project/dist/"/>





## 用索引来记录要移动的元素

::: tip

用索引来记录要移动的元素

:::

### closest方法

[MDN closest API](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)官网的举例更加详细。简单说就是返回符合selector的最近祖先



```js
function dragStart(this:HTMLElement){
  dragIdx = +this.closest('li')!.getAttribute('data-idx')!
}
```



## justify-content

[W3Schools CSS justify-content demonstration](https://www.w3schools.com/cssref/playdemo.asp?filename=playcss_justify-content&preval=space-between)



## dragleave在遇到子元素时触发的问题解决方案⭐

::: tip

我的问题：我想在dragenter的时候为容器**li**添加一个样式，在dragleave的时候为容器**li**删除样式，但是dragleave会在遇到容器内的其他子元素时，会被提前触发，导致样式被删除。

[html - dragleave event is firing on inner childs - Stack Overflow的问题](https://stackoverflow.com/questions/50350406/dragleave-event-is-firing-on-inner-childs)

:::

```html
li.addEventListener("dragleave",dragLeave)
li 容器
<!-- 里面有其他的子元素-->
----span
----div
--------small
--------p
--------i
```

父容器监听事件，但是子元素也触发了事件,如拖拽元素进入到**li**时，会发生

```
drag enter li
drag enter span
drag leave li   
drag enter div
drag leave span  
```

最后还是导致样式被删除了



### 解决方案：

https://www.geeksforgeeks.org/how-to-dragleave-fired-when-hovering-a-child-element-in-html-5/

它的思路就是

```js
// div has an child element
divEl.addEventListen("dragenter",dragEnter)
divEl.addEventListen("dragleave",dragLeave)
counter = 0

function dragEnter(){
 counter++
}

function dragLeave(){
  counter--
  if(counter === 0){
    // then do something
  }
}
```

**但是上面这个解决方案只维护了一个全局的counter，全局的counter会有如下的问题**

```
drag enter <li class=​"book hover" data-idx=​"1">​…​</li>​
drag enter  1
drag enter <li class=​"book hover" data-idx=​"2">​…​</li>​  // 先进入另外一个，counter+1变成了2
drag enter  2
drag leave <li class=​"book hover" data-idx=​"1">​…​</li>​  // 离开的时候再减1,counter-1 变成了0
drag leave  1
```

**所以为每个dragenter和dragleave的容器设计一个counter**：我见counter设置在了属性上

> 属性的命名规范以`data-xxx`的形式比较好

```html
<!-- data-counter -->
<li class="book" data-idx="0" data-counter="0">
</li>
```

```tsx
liCollection.forEach(li => {
    li.addEventListener("dragenter",e => dragEnter(e,li))
    li.addEventListener("dragleave",e => dragLeave(e,li))
  })

// event.target 在遇到子元素的时候会变成子元素不应顶时li，也就是说，dragenter,dragleave，子元素也会触发
function dragEnter(event:DragEvent,el:HTMLElement){
  let counter = +el.getAttribute("data-counter")!
  counter++  // 每次触发dragenter,包括li容器的子元素触发的，都加1
  el.setAttribute("data-counter",counter+"")
  el.classList.add("hover")  // 添加样式
}

function dragLeave(event:DragEvent,el:HTMLLIElement){
  let counter = +el.getAttribute("data-counter")!
  counter--  // 每次触发dragleave,包括li容器的子元素触发的，都减1
  el.setAttribute("data-counter",counter+"")
  if(counter === 0){  // 当着到为0的时候，设置样式
    el.classList.remove("hover")
  }
}
```

**拖拽完之后需要进行counter进行清零，因为有dragenter,drop时没有对应的dragleave事件产生**

```
function dropBook(this:HTMLElement){
  
  const idx = +this.getAttribute("data-idx")!
  swap(dragIdx,idx)
  // 拖拽完之后需要进行清零
  this.setAttribute("data-counter","0")
  this.classList.remove("hover")
}
```





## 扩展Event Order

[Javascript - Event order (quirksmode.org)](https://www.quirksmode.org/js/events_order.html#link4)



-------------



## Vue3实现

::: tip

思想思路

1. Vue框架是基于数据驱动DOM元素操作的。所以我将注重在数据层面的操作。
2. dragstart事件开始时，记录li的idx，并将它存到到[`DataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer)中
3. drop时取出存在的DataTransfer的idx,然后将目标容器的li的idx,一起提交emit给父组件
4. 父组件收到子组件的事件后，根据这两个idx,交换数组里面的值，这样data就更新了。子组件的属性name,依赖父组件的传值，这样就实现了更新

:::



### 推荐的Drag Types

::: tip

官网推荐的使用作为key的类型信息

:::

[Recommended Drag Types - Web APIs | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types)

```js
// 我这里使用"text/plain"类型来传递，idx
event.dataTransfer?.setData("text/plain", `${props.idx}`)
```



### js访问属性

```js
const props = defineProps({
    idx: {
        type: Number,
        required: true
    },
    book: {
        type:String,
        required: true
    }
})

function dragStart(event:DragEvent){
    // 访问属性的方式
    event.dataTransfer?.setData("text/plain", `${props.idx}`)
    console.log("start");
}
```

### 事件Event

定义事件 [typing-component-emits](https://vuejs.org/guide/typescript/composition-api.html#typing-component-emits)

```js
// 普通定义
// defineEmits(['change'])
// 定义事件，并带有参数
const emit = defineEmits<{
    (e:'change',srcIdx:number,targetIdx:number):void  // 方法签名
    }>()
```

发送事件

```tsx
function dragDrop(event:DragEvent){
    const srcIdxStr = event.dataTransfer?.getData("text/plain")
    let srcIdx = 0
    if(typeof srcIdxStr === 'string'){
        srcIdx = parseInt(srcIdxStr)
        console.log(srcIdx,props.idx)
        emit("change",srcIdx,props.idx) // 发送数据  
    }
    
    console.log("drag drop");
}
```

在父组件接受事件

```vue
<template>
<ListItem v-for="(book,idx) in BOOKS"
        :book="book"
        :idx="idx"
        :key="idx"
        @change="swap">  <!-- 接受事件交给swap处理 -->
</ListItem>
<template>
<script setup lang="ts">
function swap(srcIdx:number,targetIdx:number){
  console.log("parent component receive",srcIdx,targetIdx);
}
</script>
```



### 维护counter⭐

::: tip

**对组件data的理解**

相比之前在原生开发的模式，每个ll的counter我们维护在li的属性`data-counter`上，现在使用vue，我们可以直接将其维护在组件的响应式数据上。访问counter直接基于响应式的方式，直接声明操作。不像之前需要setAttribute,getAttribute.这也是使用vue的好处，方便开发

:::

```js
// 之前
<li class="book" data-idx="0" data-counter="0">
// 使用vue后
import { ref } from 'vue'
const counter = ref(0)
```

#### vue插件bug

::: tip

响应式的数据变化要在，要在template中使用了，才会看到变化。在js更新，并不在在面板上更新

:::

```vue
<template>
    <li class="book"
        :data-idx="idx" 
        :data-counter="counter"    <!-- 要使用在插件界面更新才能看见，但是counter还是 -->
        @dragenter="dragEnter"
        @dragover.prevent="dragOver"
        @dragleave="dragLeave"
        @drop="dragDrop">
    </li>
</template>
```

![image-20220728184400351](/images/minifrontendproject/image-20220728184400351.png)



### 添加class

::: tip

使用isActive语义很明确

:::

```vue
<template>
<li class="book" :class="{hover: isActive}" @dragenter="dragEnter"></li>
</template>
<script setup lang="ts">
const isActive = ref(false)
function dragEnter(){
    isActive.value = true // 添加hover
    // 被渲染成,class会自动合并
    // <li class="book hover"></li>
}
</script>

```



### 条件检查添加样式

Vue支持属性向下传递[Fallthrough Attributes](https://vuejs.org/guide/components/attrs.html),在这里ListItem设置的class会条件在ListItem的根标签上，这里案例时Li标签

```vue
<template>
<ListItem v-for="(book,idx) in RANDOM_BOOKS"
        :book="book"
        :idx="idx"
        :key="idx"
        :class="checked ? checkedResult[idx]? 'right':'error' :''"  <!--  条件检查来设置样式 -->
        @change="swap">
</ListItem>
</template>
```

相关的script

```vue
<script setup lang="ts">
const checkedResult:boolean[] = reactive([])
const checked = ref(false)

function checkOrder(){
  for(let i = 0; i < BOOKS.length;i++){
    checkedResult[i] = BOOKS[i] === RANDOM_BOOKS[i]
  }
  checked.value = true   // 打开设置样式的开关
}
</script>
```

