---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---



## Auto Text Effect



## input

::: tip

1. type = number

2. 监听的是input事件

:::

```html
<input type="number"
            name="speed"
            id="speed"
            min="1"
            max="10"
            step="1"
            value="1">
```

```js
// 监听input事件,也可以监听change事件
speedEl.addEventListener('input',e => speed = 300 / e.target.value)
// speedEl.addEventListener('change',e => speed = 300 / e.target.value)
```



## 使用setTimeout进行回调

::: tip

只是用setTimeout而没有使用setInterval

:::



```js
function writeMessage(){
    textEl.innerText = message.slice(0,idx)
    idx++
    if(idx > message.length){
        idx = 1
    }
    setTimeout(writeMessage,speed) // 递归调用
}
```

