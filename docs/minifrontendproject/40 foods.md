---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Foods

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/44%20foods/dist/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/44%20foods)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/44%20foods/dist/"/>



## 动画出现

```scss
i{
    position: absolute;
    transform: translate(-50%,-50%) scale(0);
    transition: transform 0.3s;
    &.change{
        transform: translate(-50%,-50%) scale(1);
        // 延迟一下，无缝衔接
        transition: transform 0.3s 0.3s;
    }
}
```



## 多层次的效果

![image-20220921195142152](/images/minifrontendproject/image-20220921195142152.png)

```scss
.food-img{
    width: 100%;
    height: 100%;
    object-fit: cover;

    box-shadow: 0.3rem 0.3rem 0.1rem #e92929, 
        0.5rem 0.5rem 0.1rem #a2e946,
        0.7rem 0.7rem 0.1rem #297ce9, 
        0.9rem 0.9rem 0.1rem #e92999;
    transition: all 0.5s;
}
```

![image-20220921195931535](/images/minifrontendproject/image-20220921195931535.png)

```scss
.food-img{
    transform: scale(1.1);
    filter: blur(0.2rem);
    opacity: 0.5;
    box-shadow: 0.6rem 0.6rem 0.1rem #e92929, 
        1rem 1rem 0.1rem #a2e946,
        1.4rem 1.4rem 0.1rem #297ce9, 
        2rem 2rem 0.1rem #e92999;
}
```



## 下拉菜单的延迟

![image-20220921231719189](/images/minifrontendproject/image-20220921231719189.png)

```scss
.menu{
    position: fixed;
    top: 1rem;
    transition: top $unit-time $unit-time;
  
    &.change{
        top: calc($navbar-height + 1rem);
        transition: top $unit-time;
    }
}
```



## 响应式❤️

> 页面设计的时候使用rem或者百分号来适应设备

通过浏览器不断调整页面大小，来调整样式

![image-20220922003405151](/images/minifrontendproject/image-20220922003405151.png)

```css
1400px 1000px 900px 700px 550px
```

使用sass的方式使得@media更加接近标签。

```scss
.footer{
    height: 16rem;
    @media(max-width: 1400px){  // 屏幕小于1400px
        height: 20rem;   
    }
    @media(max-width: 700px){  // 屏幕更小，小于700px
        height: 26rem;
    }
}
```

