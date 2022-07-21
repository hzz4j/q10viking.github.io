---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Image Carousel



## TODO

1. 带点的
2. 手动切换



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



## 如何解决循环时的闪现问题？

::: tip

1. 自动切换时到最后一张图片，接着跳到第一张图片
2. 解决这种没有平滑过度问题

:::

https://codepen.io/jonathan-asbell/pen/QWgampv