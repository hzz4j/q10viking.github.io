---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Increment Counter









## 利用属性

::: tip

自定义的data-target

:::

```html
<div class="item">
    <i class="fa-brands fa-tiktok"></i>
    <p class="counter" data-target="23000"></p>
    <span>Tiktok Fans</span>
</div>
```

在js代码中可以获取到

```tsx
const target = +counter.getAttribute("data-target")!
```



## 如何并行的？

程序不应该按顺序执行的吗？利用定时器，可以达到并发的效果。主程序主要是设置定时器。接下的程序则由定时器自己运行

```js
const counters = document.querySelectorAll(".counter")!

counters.forEach(counter => {
  counter.innerHTML = "0"
  const target = +counter.getAttribute("data-target")!
  const step = target / 200
  let val = 0

  // 这段函数设置在这里的意义是方便访问外边的变量
  const updateNumber = ()=>{
    val += step
    if(val<target){
      counter.innerHTML = val+""
      // 递归调用 setTimeout这里并不会第一次阻塞下一次的循环，程序设置完定时器后继续执行了
      setTimeout(updateNumber,1)
    }else{
      counter.innerHTML = target+""
    }
  }
  
  updateNumber()
})
```





## 响应式布局

```scss
.container{
    display: flex;
    flex-direction: row;

    @media(max-width: 580px){
        flex-direction: column;
    }
}
```

