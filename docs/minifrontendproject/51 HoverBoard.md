---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---

## Hover Board

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/54%20hoverboard/dist/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/54%20hoverboard)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/54%20hoverboard/dist/"/>



## 延迟的过渡效果

```scss
.square{
    margin: .2rem;
    width: 1.6rem;
    height: 1.6rem;
    background-color: $square-color;
    box-shadow: 0 0 .2rem #000;
    transition: 3s ease;  // 过渡效果

    &:hover{
      transition-duration: 0s; // 一开始不进行过渡，马上显示
    }
  }
```

```js
  div.addEventListener("mouseover", () => setColor(div));
  div.addEventListener("mouseout", () => removeColor(div));
```

