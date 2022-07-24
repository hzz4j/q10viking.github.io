---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Background Slider

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/31%20Background%20slider/vanilla/dist/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/31%20Background%20slider/vanilla)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/31%20Background%20slider/vanilla/dist/"/>



## 图片的衔接

::: tip

1. 展示的图片和背景图片的在宽高上都相等
2. 采用定位，将展示图片向上和向做移动，移动距离就是展示的容器距离父容器的距离

:::



![image-20220725012011657](C:\Users\11930\AppData\Roaming\Typora\typora-user-images\image-20220725012011657.png)

```scss
body{
    height: 100vh;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;

    .slider-container{
        width: 70vw;
        height: 70vh;
        border: 1px solid black;
        overflow: hidden;
        position: relative;
        
        /**图片衔接上背景
         * 1. 展示的slide设置为和背景容器宽高一样
         * 2. 移动距离 为slider-container距离body的距离
         */
        .slide{
            position: absolute;
            top: -15vh;   // 移动距离
            left: -15vw;  // 移动距离
            width: 100vw;
            height: 100vh;
            background-position: center;
            background-size: cover;
            opacity: 0;  // 隐藏

            &.active{
                opacity: 1;  // 展示
            }
        }
    }
}
```



## 图片的更换

::: tip

由于图片采用了定位都是脱离了文档流的，展示与隐藏只需要设置opacity即可

:::