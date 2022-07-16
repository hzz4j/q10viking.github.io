---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /javascript/
typora-root-url: ..\.vuepress\public
---

## 1 window事件



### 1.1 load

### 1.2 hashchange

```js
window.onhashchange = function () {
    vm.current = location.hash.slice(2) // home
}
```

### 1.3 DOMContentLoaded

```js
document.addEventListener('DOMContentLoaded', ()=>{
	//	加载数据
});
```



The `DOMContentLoaded` event will fire as soon as the DOM hierarchy has been fully constructed, the `load` event will do it when all the images and sub-frames have finished loading.

-----------



## 2 鼠标事件

### 2.1  mouseover与mouseout

1. 父元素进入子元素时父元素绑定的事件会被触发

### 2.2 mouseenter与mouseleave

### 2.3 mousemove

```js
// Event Handler
function runEvent(e) {
  console.log(`EVENT TYPE: ${e.type}`);

  heading.textContent= `MouseX: ${e.offsetX} MouseY: ${e.offsetY}`;
  //	改变背景色	
  document.body.style.backgroundColor = `rgb(${e.offsetX}, ${e.offsetY}, 40)`;
}
```



### 2.4 contextmenu 

右键菜单显示

### 2.5 selectstart 

选中文本



### 2.6 mousedown

### 2.7 mouseup

### 2.8 click

### 2.9 dblclick



------------



## 3 表单相关事件

### 3.1 keypress

### 3.2 keyup

#### 3.2.1 模拟事件触发

可以直接调用事件方法

##### 1 玩法：s键触发自动聚焦

```js
// 给document绑定键盘事件
document.addEventListener("keyup", e => {
    console.log(e.key);
    if (e.key === 's') {
        // 调用input.focus方法 
        document.getElementById("search").focus();
    }
});
```

------------



### 3.3 keydown

### 3.4 cut 剪切

### 3.5 paste 粘贴

### 3.6 input 监听内容输入

#### 3.6.1 input输入框实时监测

```js
// 获取input输入框
let username = document.getElementById("username")
username.oninput = function () {
    console.log("你正在输入：", this.value)
}
/**
你正在输入： h
你正在输入： he
你正在输入： hel
你正在输入： hell
你正在输入： hello
你正在输入： hellow
你正在输入： hellowo
你正在输入： hellowor
你正在输入： helloworl
你正在输入： helloworld
*/
```



#### 3.6.2 输入提示框⭐⭐

1. 边框transparent
2. 旋转
3. after的伪元素的相对定位
4. 相关事件的监听处理

<iframe height="409" style="width: 100%;" scrolling="no" title="Input Arrow prompt" src="https://codepen.io/Q10Viking/embed/RwRaRvR?height=409&theme-id=dark&default-tab=css,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/Q10Viking/pen/RwRaRvR'>Input Arrow prompt</a> by 黄壮壮
  (<a href='https://codepen.io/Q10Viking'>@Q10Viking</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>




### 3.7 change

#### 3.7.1 主要是针对value的改变

##### 如：select,radio

1 select元素的值改变时

```javascript
let selectEl = document.getElementById('city')

// 添加事件
selectEl.onchange = function () {
    console.log("onchange事件", this.value);
}
```


### 3.8 focus

### 3.9 blur

### 3.10 submit

```js
form.addEventListener('submit', callback);
```

