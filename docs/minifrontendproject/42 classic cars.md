---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Classic Cars



## 3D效果

[CSS perspective property (w3schools.com)](https://www.w3schools.com/cssref/css3_pr_perspective.asp)

perspective越小，3D效果越敏感

> 一个perspective管一个子元素

```html
<div class="wrapper">
	<section class="section-1"></section>
    <!-- 不要放置多个，另外起一个 -->
    <!-- <section class="section-2"></section>  -->  
</div>
div class="wrapper">
	<section class="section-2"></section>
</div>
```

```scss
.wrapper{
    perspective: 50rem;
    section{
        transform: rotateY(10deg);
    }
  }
```



## Video