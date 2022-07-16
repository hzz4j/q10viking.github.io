---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /javascript/
typora-root-url: ..\.vuepress\public
---

##   1 注册事件（绑定事件）

### 1.1  dom零级事件

#### 1.1.1 缺点后面事件会覆盖前面的事件

```js
element.onClick(callback)
```



### 1.2 dom二级事件

#### 1.2.1 addEventListener

1. 同一个元素可以绑定多个事件

#### 1.2.2 兼容处理

```js
// 兼容处理
function addEventListener(ele,eventName,callback) {
    if (ele.addEventListener) {
    	ele.addEventListener(eventName,callback);
    } else if (ele.attachEvent) {
    	ele.attachEvent('on' + eventName, callback);
    } else {
        // ele.onclick = function() {}
        ele['on'+eventName] = callback;
    }
}
```



## 2 删除事件

### 2.1 DOM零级事件解绑

#### 2.1.1 事件源.事件 = null



### 2.2 DOM二级事件解绑

#### 2.2.1 removeEventListener(事件类型，事件处理程序)

## 3 DOM事件流

1. 页面接受事件的顺序
2. 事件发生后会在元素节点之间按照某种顺序传播

### 3.1 事件流三个阶段

```css
document->html->body->div->body->html->document
         捕获阶段        当前目标阶段    冒泡阶段
```

#### 3.1.1 捕获阶段

#### 3.1.2 当前目标阶段 

##### 1. 目标阶段同时绑定了捕获和冒泡，则取决于书写顺序

#### 3.1.3 冒泡阶段

### 3.1.4 通过addEvenListener的第三个参数设定

#### 1. true 事件捕获

#### 2 false (默认值)为事件冒泡



## 4 event事件对象

### 4.1 事件对象获取

#### 4.1.1 通过事件处理函数形参

#### 4.1.2 通过window对象window.event

#### 4.1.3 处理兼容

```js
el.addEventListener("click",function(e){
	e = e || window.event;
});
```

### 4.2 事件对象的属性

#### 4.2.1 target触发事件的元素

##### 1. this则是绑定事件的元素

##### 2. 在事件代理中会不同



#### 4.2.2 type事件类型

```js
// 如 click ,mouseover
e.type
```



#### 4.2.3 鼠标坐标

鼠标对于浏览器窗口可视化

```
e.clientX
e.clientY
```

相当于电脑屏幕的坐标

```js
e.screenX
e.screenY
```

相当于元素本身

```
e.offsetX
e.offsetY
```

相当于文档页面

```js
e.pageX
e.pageY
```



#### 4.2.4 键盘对象

##### 1. key

```js
event.key
```



### 4.3 事件对象的方法

#### 4.3.1 preventDefault阻止默认行为

##### 1. 如表单提交,超链接跳转

##### 2. 也可以return false阻止默认行为

#### 4.3.2 stopPropagation阻止冒泡





## 5 事件委托delegation

> 基于事件冒泡bubbling的机制

1. 给父元素绑定事件
2. 统一管理子元素的事件
3. 通过过滤，如比较指定的class name，来对事件源进行相应的操作



```js
document.body.addEventListener('click', deleteItem);

function deleteItem(e){

  //	过滤
  if(e.target.parentElement.classList.contains('delete-item')){
    console.log('delete item');
    e.target.parentElement.parentElement.remove();
  }
}
```



--------------

## 6 this值

### 6.1 this.value获取值

#### 6.1.1 select的value,input的value

```js
// 添加事件
selectEl.onchange = function () {
    console.log("onchange事件", this.value);
}
```

