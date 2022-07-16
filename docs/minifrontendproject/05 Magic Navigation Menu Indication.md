---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---



## Magic Navigation Menu Indicator

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/09%20Magic%20Navigation%20Menu%20Indicator/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/09%20Magic%20Navigation%20Menu%20Indicator)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/09%20Magic%20Navigation%20Menu%20Indicator/"/>





## 笔记

### 素材

[Ionicons Usage Guide: Tips for installing and using the Ionicons free icon library](https://ionic.io/ionicons)

### 中文字体

[Zhi Mang Xing - Google Fonts](https://fonts.google.com/specimen/Zhi+Mang+Xing?subset=chinese-simplified)

```css
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@1,600&family=Meow+Script&family=Zhi+Mang+Xing&display=swap');
font-family: 'Zhi Mang Xing', cursive;
```

下载ttg字体在css中使用

```css
@font-face { 
    font-family: 'Zhi Mang Xing'; 
    src:url('./ZhiMangXing-Regular.ttf');
} 

font-family: 'Zhi Mang Xing', cursive;
```



### icon居中

```css
.navigation ul li a .icon {
    position: absolute;
    line-height: 70px;   /*居中与容器navigation的高度一样*/
    font-size: 1.5em;
}
```

### 凹形转的设计

```css
/* 圆圈设计 */
.indicator{
    position: absolute;
    top: -50%;
    background-color: var(--second-color);
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 6px solid var(--primary-color);
    transform: translateX(0);
    transition: 0.5s ease;
}

.indicator::before{
    position: absolute;
    top: 50%;
    left: -22px;
    content: " ";
    width: 20px;
    height: 20px;
    /* background: transparent; */
    border-top-right-radius: 20px;
    box-shadow: 1px -10px 0 0 var(--primary-color);
}

.indicator::after{
    position: absolute;
    top: 50%;
    right: -22px;
    content: " ";
    width: 20px;
    height: 20px;
    /* background-color: red; */
    /* background: transparent; */
    border-top-left-radius: 20px;
    box-shadow: -1px -10px 0 0 var(--primary-color);
}
```



### 通过计算移动圆圈

```css
/* Indicator Transitions */
.navigation ul li:nth-child(1).active ~ .indicator {
    transform: translateX(calc(70px * -2));
}

/* Indicator Transitions */
.navigation ul li:nth-child(2).active ~ .indicator {
    transform: translateX(calc(70px * -1));
}

/* Indicator Transitions */
.navigation ul li:nth-child(3).active ~ .indicator {
    transform: translateX(calc(70px * 0));
}

/* Indicator Transitions */
.navigation ul li:nth-child(4).active ~ .indicator {
    transform: translateX(calc(70px * 1));
}

/* Indicator Transitions */
.navigation ul li:nth-child(5).active ~ .indicator {
    transform: translateX(calc(70px * 2));
}
```

