



## 用索引来记录要移动的元素

::: tip

用索引来记录要移动的元素

:::

### closest方法

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