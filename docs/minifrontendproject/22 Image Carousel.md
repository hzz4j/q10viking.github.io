---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Image Carousel 1





## 左右图片

::: tip

右箭头居右布局

:::

```scss
.btn-container{
    width: 100%;
    display: flex; // 需要flex布局

    button{
        &:last-child{
            margin-left: auto;  // 才生效
        }
    }
}
```





## 下点

::: tip

ol-li 圆圈化，默认是数字

:::



```scss
// dots样式
.dots{
    position: absolute;
    bottom: 20px;
    list-style: none; // 去掉默认样式
    display: flex;
    justify-content: center;
    width: 100%;

    li{
        width: $dot-size;  // 给它宽度和高度，在加上边框
        height: $dot-size;
        border-radius: 50%;
        border: 1px solid $arrow-color;
        margin-left: 10px;

        &.active{
            background-color: $arrow-color;
        }
    }
}
```



## 图片如何移动

1. 设置了两个容器: A容器负责展示，B容器负责移动
2. 所有的图片在一个容器B中在同一行排列
3. 然后控制容器改变translateX即可
4. 注意容器A展示的需要有宽度，容器B的宽度则是由里面的图片撑开，而不控制其宽度。并且每张图片的宽度与展示的容器A宽度一样。移动时移动的大小为该宽度

```scss
// 容器A
.carousel{
    width: $size;
    height: 50vh;
    overflow: hidden;
    // 容器B
    .image-container{
        display: flex;
        // js中改变size
        transform: translateX(0);
        transition: transform 0.8s ease-in-out;

        img{
            width: $size;
            height: 100%;
            object-fit: cover; // 图片调整
        }
    }
}
```

----------



## Image Carousel 2



## 如何解决循环时的闪现问题？

::: tip

1. 自动切换时到最后一张图片，接着跳到第一张图片
2. 解决这种没有平滑过度问题

:::



### transitionend事件

::: tip

1. 添加了首尾克隆
2. js控制过渡css style
3. transitionend事件监听检查是否过渡到了首尾克隆

:::

参考 https://codepen.io/jonathan-asbell/pen/QWgampv

```tsx
// loop
// https://codepen.io/jonathan-asbell/pen/QWgampv

function changeImage(){
    if(idx > imgs.length - 1 || idx < 0){
        // first limit counter to prevent fast-change bugs
        // 解决快速回退的问题  
        return
    }
    hightDots()
    imgsContainer.style.transition = `transform 0.8s ease-in-out`
    imgsContainer.style.transform = `translateX(${-size * idx}px)`
}

/**
 * 
 * 添加克隆首尾
 */
 function getCloneImgs():NodeListOf<HTMLElement>{
    const firstImgClone = imgs[0].cloneNode() as HTMLElement
    const lastImgClone = imgs[imgs.length-1].cloneNode() as HTMLElement

    firstImgClone.classList.add('first-clone')
    lastImgClone.classList.add('last-clone')

    imgsContainer.appendChild(firstImgClone)
    imgsContainer.prepend(lastImgClone)

    return imgsContainer.querySelectorAll('img')
}

/**
 * 每次检查是否是移动到了克隆的地方
 */
imgsContainer.addEventListener('transitionend',()=>{
   // 每次移动完之后进行检查
   if(imgs[idx].classList.contains('first-clone')){
    imgsContainer.style.transition = 'none'
    idx = 1
    imgsContainer.style.transform = `translateX(${-size * idx}px)`
    // imgsContainer.style.transition = val
   }else if(imgs[idx].classList.contains('last-clone')){
    imgsContainer.style.transition = 'none'
    idx = imgs.length - 2
    imgsContainer.style.transform = `translateX(${-size * idx}px)`
   }
    
})
```



同时处理点的位置

```js
function hightDots(){
    // remove all active then add active class
    const activeCls = 'active'
    dots.forEach(dot => dot.classList.remove(activeCls))
    let dotIdx:number = null
    if(idx === imgs.length-1){
        dotIdx = 0
    }else if(idx === 0){
        dotIdx = dots.length -1
    }else{
        dotIdx = idx-1
    }

    dots[dotIdx].classList.add(activeCls)
}
```



### 鼠标悬浮停止自动切换

```js
imgsContainer.addEventListener('mouseover',()=>{
    console.log("mouseover");
    
    clearInterval(interval)
})

imgsContainer.addEventListener('mouseout',()=>{
    console.log("mouseout");
    
    interval = setInterval(forward,seconds)
})
```







