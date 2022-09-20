---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---





## DropDown Menu

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/42%20dropdown%20menu/dist/#/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/42%20dropdown%20menu)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/42%20dropdown%20menu/dist/#/"/>



## 核心思想

主要是通过定位和隐藏来实现

## 鼠标hover

![image-20220920163734866](/images/minifrontendproject/image-20220920163734866.png)



## 鼠标点击

1. 隐藏了一个input check的选项框，然后通过css 的checked状态来控制显示

   ```scss
   .toggler{
       position: absolute;
       width: 100%;
       height: 100%;
       z-index: 2;
       appearance: none;  // 控制显示
   
       &:checked ~ .menu{
           visibility: visible; // 将下拉栏显示
           opacity: 1;
       }
   }
   ```

   

2. 三个点的控制，可以使用before,after等来控制

3. 定位的对齐，小技巧

   ```scss
   .menu{
       position: absolute;
       top: 38px;
       right: -10px;  // 向右-10px
   }
   ```

   

![image-20220920163904639](/images/minifrontendproject/image-20220920163904639.png)