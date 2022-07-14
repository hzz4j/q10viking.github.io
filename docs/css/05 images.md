---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /css/
typora-root-url: ..\.vuepress\public
---



::: tip

Because a Picture says more than a Thousand Words.

:::

![202112100957450](/images/css/202112100957450.jpg)

## background-size

```css
/*width,height */
background-size: 100%;
background-size: 100% auto;
background-size: 100% 100%;
/*内置关键字*/
background-size: cover;  ⭐
background-size: contain;
```

## background-position

::: tip

:one: x-axis

:two: y-axis

:::

```css
background-position: center; ⭐ 
background-position: left 10% bottom 20%;
```

## linear-gradient

```css
/* 角度，start color */
background-image: linear-gradient(100deg,red,trasparent);
background-image: linear-gradient(100deg,red 70%,blue 80%,rgba(0,0,0,0.5));
```

## radial-gradient

```css
/* shape position，start color */
background-image: radial-gradient(red,blue)
background-image: radial-gradient(circle,red,blue)
background-image: radial-gradient(circle at top,red,blue)
background-image: radial-gradient(circle at top left,red,blue)
background-image: radial-gradient(circle at 20% 50%,red,blue)
background-image: radial-gradient(circle 20px at 20% 50% ,red,blue)
```

## fileter

::: tip

[filter - CSS: Cascading Style Sheets | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)

:::

![202112101250200](/images/css/202112101250200.jpg)