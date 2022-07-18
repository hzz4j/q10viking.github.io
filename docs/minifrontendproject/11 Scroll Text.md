---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---



## Scrolling Text







## 文字

::: tip

1. 不换行的滑动效果
2. 文字居中
3. 如何话滑动动画时间内滑动完全部文字？直接在h2采用了定位的方式⭐⭐⭐
4. 文字滑动衔接上⭐⭐⭐

:::



采用定位的方式，来滑动完全部文字

```css
section{
    display: flex;
    width: 100%;
    height: 100vh;
}

section div{
    width: 50%;
    position: relative;
    overflow: hidden; /*文字溢出隐藏*/
}

section div:nth-child(1){
    /* background-color: red; */
    background-image: url("./assets/img.jpg");
    background-position: center;
    background-size: cover;
    object-fit: cover;
}


/* --------------文字处理-------------- */
section div h2{
    position: absolute; /* 添加绝对定位来处理translateX */
    white-space: nowrap;
    line-height: 100vh; /*居中 前提是margin:0,padding:0;box-sizing:bord-box*/
    font-size: 10rem;
    animation: scrolling 60s linear infinite;
}

/*测试滑动完全部文字*/
/* section div:nth-child(2) h2{
    position: absolute;
    animation: scrolling 3s linear infinite;
} */

/* 动画效果 */
@keyframes scrolling{
    0%{
        transform: translateX(0);
    }

    100%{
        transform: translateX(-100%);
    }
}

/* 文字颜色处理 */
section div:nth-child(1) h2{
    -webkit-text-stroke: 2px #fff; /*文字边框处理*/
    -webkit-text-fill-color: transparent;
    left: 100%;  /*文字衔接上*/
}
```





## text-stroke

```css
/* 文字颜色处理 */
section div:nth-child(1) h2{
    -webkit-text-stroke: 2px #fff; /*文字边框处理*/
    -webkit-text-fill-color: transparent;
}
```

