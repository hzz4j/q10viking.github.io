---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Portfolio

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/44%20foods/dist/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/44%20foods)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/44%20foods/dist/"/>



## 背景图片的处理

> 添上一层过滤色

```scss
background: linear-gradient(
            rgba(255, 255, 255, 0.2),
            rgba(255, 255, 255, 0.3)
        ),url('/images/bg.jpg') center/cover no-repeat;
```



## 导航栏

1. 使用window.pageYOffset和导航栏的offsetTop来解决。pageYOffset就是滚动的距离
2. 当滑动到指定的section时，更新导航栏对应的nav link。使用数组下表来建立对应的关系

> offsetTop可以通过offsetParent来查看相对的是谁的

```tsx
// 固定navbar
function fixNavBar(){
    if(window.pageYOffset >= navbarOffsetTop){
        navbar.classList.add("sticky")
    }else{
        navbar.classList.remove("sticky")
    }
}

// active navbar的link
function activeNavbarLink(){
    const navbarHeight = getHeight(navbar)
    sections.forEach((section,i) => {
     if(window.pageYOffset >= (section.offsetTop - navbarHeight)){
         navbarLinks.forEach(el => el.classList.remove("active"))
         navbarLinks[i].classList.add("active")
     }
    })
}
```



## 页面下拉到进度条更新

```tsx
// 动态处理进度条
function handleProgressPercentWidth(){
    if(window.pageYOffset + window.innerHeight >= progress.offsetTop){
        console.log("progress offsetTop = ",progress.offsetTop,progress.offsetParent)
        console.log("window innerHeight = ",window.innerWidth)
        console.log("window pageYOffset = ",window.pageYOffset)

        progressPercents.forEach((el,i) => {
            (el as HTMLElement).style.width = `${progressBarPercents[i]}%`;
            if(el.previousElementSibling && el.previousElementSibling.firstElementChild){
                el.previousElementSibling.firstElementChild.textContent = `${progressBarPercents[i]}`
            }
        })
    }
}
```



## scroll smooth

### css html实现

[W3Schools Tryit Editor](https://www.w3schools.com/cssref/tryit.asp?filename=trycss_scroll_behavior)

```css
html {
  scroll-behavior: smooth;
}
```

```html
<nav class="navbar">
    <a href="#section-1">home</a>
</nav>

<section id="section-1"></section>
```



### js实现

```js
var scrollToTopBtn = document.getElementById("scrollToTopBtn");
// 整个HTML文档
var rootElement = document.documentElement;

function scrollToTop() {
  // Scroll to top logic
  rootElement.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
scrollToTopBtn.addEventListener("click", scrollToTop);
```



### 此外windows.scrollBy

[W3Schools Tryit Editor](https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_win_pagexoffset)

```
window.scrollBy(100, 100);
```



## 监听页面滚动

```tsx
window.addEventListener("scroll",()=>{})
```



## 页面reload

```tsx
// resize window的时候，重新加载页面
window.addEventListener("resize",()=>{
    window.location.reload()
})
```

