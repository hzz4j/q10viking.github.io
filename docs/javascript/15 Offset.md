---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /javascript/
typora-root-url: ..\.vuepress\public
---

## 1 offset家族

::: tip

event.target的属性

:::

### 1.1  offsetParent

表示元素中最近的带有定位的祖先元素

### 1.2 offsetTop

相对于offsetParent的top

### 1.3 offsetLeft

相对于offsetParent的left

[HTML DOM Element offsetLeft Property (w3schools.com)](https://www.w3schools.com/jsref/prop_element_offsetleft.asp)

[HTML DOM offsetTop 属性 | 菜鸟教程 (runoob.com)](https://www.runoob.com/jsref/prop-element-offsettop.html)

### 1.4 offsetWidth

元素的实际宽度

### 1.5 offsetHeight

元素的实际高度



## clientTop

[HTML DOM Element clientTop Property (w3schools.com)](https://www.w3schools.com/jsref/prop_element_clienttop.asp)



## scrollTop

[HTML DOM Element scrollTop Property (w3schools.com)](https://www.w3schools.com/jsref/prop_element_scrolltop.asp)

## clientX与clientY

::: tip

event的属性clientX和clientY

:::

[MouseEvent clientX Property (w3schools.com)](https://www.w3schools.com/jsref/event_clientx.asp)

## offsetX和offsetY

::: tip

event的属性offsetX和offsetY

:::

[MouseEvent offsetX Property (w3schools.com)](https://www.w3schools.com/jsref/event_offsetx.asp)

```
offsetX = clientX - offsetLeft
offsetY = clientY - offsetTop
```



## Double Heart Click 项目

[静默のBlog (q10viking.github.io)](https://q10viking.github.io/minifrontendproject/09 Double Heart Click.html)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/13%20Double%20heart%20click/"/>





## 参考

[The difference between offsetTop, scrollTop & clientTop (& why you should never use them) | by Arnav Zedian | Medium](https://arnavzedian.medium.com/the-difference-between-offsettop-scrolltop-clienttop-36cf52b733ca)





[Smooth Scrolling | CSS-Tricks - CSS-Tricks](https://css-tricks.com/snippets/jquery/smooth-scrolling/)

[How to Make an Unobtrusive Scroll-to-Top Button | CSS-Tricks - CSS-Tricks](https://css-tricks.com/how-to-make-an-unobtrusive-scroll-to-top-button/)
