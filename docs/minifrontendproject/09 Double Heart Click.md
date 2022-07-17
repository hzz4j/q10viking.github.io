---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---



## Double Heart Click

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/13%20Double%20heart%20click/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/13%20Double%20heart%20click)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/13%20Double%20heart%20click/"/>





## 图片处理

```css
.loveMe{
    width: 440px;
    height: 300px;
    max-width: 100%;
    margin: auto; /*居中*/
    background: url('./sun-night.jpg') no-repeat center/cover;
    /**
    background-image: url(./sun-night.jpg);
     background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    */
}
```



## small标签

```css
small{
    display: block;  /*块状元素，margin-bottom才生效*/
    margin-bottom: 30px;
}
```





## 爱心处理

### css样式

```css
/* 爱心 从小到大，最后消失*/
.loveMe .fa-heart{
    position: absolute;
    /* top: 50%;
    left: 50%; */
    animation: growing 1s linear;
    transform: translate(-50%,-50%) scale(0); /*-50%就是设置为中心，因为爱心自身有大小*/
}

@keyframes growing{
    to{
        transform: translate(-50%,-50%) scale(6);
        opacity: 0;
    }
}
```



### js处理显示位置

::: tip

e事件对象的clientX和clientY是点击位置距离浏览器的距离

e.target事件的目标对象的offsetTop和offsetLeft是监听事件的目标距离浏览器的距离

:::

```js
function showHeart(e){
    // 点击区域距离浏览器顶部和左边的距离
    const x = e.clientX
    const y = e.clientY

    // 图片区域距离浏览器顶部和左边的距离
    const offsetTop = e.target.offsetTop
    const offsetLeft = e.target.offsetLeft

    // 计算点击位置相对于图片的距离
    const top = y - offsetTop
    const left = x - offsetLeft

    // console.log(left,top)

    const heart = document.createElement('i')
    heart.style.top = `${top}px`
    heart.style.left = `${left}px`
    heart.classList.add("fa-solid")
    heart.classList.add("fa-heart")

    loveMe.appendChild(heart)

    // 5秒后删除元素
    setTimeout(()=>heart.remove(),5000)
}
```



## 模拟处理双击事件

```js
let clickTime = 0
loveMe.addEventListener('click',(e) => {
   // 模拟双击效果
   if(clickTime === 0){
    clickTime = new Date().getTime()
   }else{
    if((new Date().getTime()) - clickTime < 800){
        // 有效的双击
        // alert("有效的双击")
        // 重新设置
        clickTime = 0
        handleTimes()
        showHeart(e)
    }else{
        // 隔很长时间了，此次作为第一次计算
        // alert("隔很长时间了，此次作为第一次计算")
        clickTime = new Date().getTime()
    }
   }
})
```

