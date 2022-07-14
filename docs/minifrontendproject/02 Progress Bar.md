---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---



## Progress Bar

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/06 progress)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/06%20progress/"/>



## 笔记

1. 进度条与圆圈数字中心对齐

```css
.progress-container:before{
    content: " ";
    background-color: var(--line-border-empty);
    height: 4px;
    width: 100%;
    position: absolute;
    top: 50%;
    width: 100%;
    z-index: -1;
    transform: translateY(-50%); /* 对齐数字*/
}
```



2. button点击的时候动态效果

```css
.btn:active{
    transform: scale(0.98);
}
```

3. 进度条伸长和缩短的动画效果

```css
.progress{
    background-color: var(--line-border-fill);
    height: 4px;
    width: 100%;
    position: absolute;
    top: 50%;
    width: 0%;
    z-index: -1;
    transition: 0.4s ease;  /* 动画效果 */
    transform: translateY(-50%); /* 对齐数字*/
}
```

4. css3中变量生命和使用

```css
:root {
    --line-border-fill: #318a62;
    --line-border-empty: #e0e0e0;
}

.circle.active{
    border-color: var(--line-border-fill);
    background-color: var(--line-border-fill);
    color: #fff;
}
```

