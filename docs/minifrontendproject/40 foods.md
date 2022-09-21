---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Foods





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

