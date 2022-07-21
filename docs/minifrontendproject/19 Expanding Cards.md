---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Expanding Cards







## 屏幕缩小时展示

::: tip

当屏幕缩小时只展示3张图片

:::

```scss
.container{
        @include containerDisplayFlex();
        width: 60vw;

        @media(max-width: 580px){
            width: 90vw;
            .pannel:nth-of-type(4),
            .pannel:nth-of-type(5){
                display: none;
            }
        }
}
```



## flex:5应用

```scss
.pannel{
    flex: 0.5; // 统一大小
    transition: flex 0.7s ease;

    &.active{   // 当有active的class时，扩大
        flex: 5;
    }
}
```

