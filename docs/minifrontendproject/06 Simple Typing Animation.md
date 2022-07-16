---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---





## Simple Typing Animation

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/10%20Simple%20Typing%20animation/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/10%20Simple%20Typing%20animation)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/10%20Simple%20Typing%20animation/"/>



## 笔记

::: tip

纯css来实现

:::

### 光标闪现

```css
h1{
    border-right: 3px solid;
    animation: blink 0.5s step-end infinite alternate;
}

@keyframes blink{
    50%{
        border-color: transparent;
    }
}
```

### 文字出现

::: tip

通过控制宽度来控制文字的显示

:::

```css
/* 用一个容器框住设置 */
.container{
    display: inline-block;
}

h1{   
    border-right: 3px solid;
    white-space: nowrap;
    overflow: hidden;
    animation: typings 2s steps(12) infinite alternate  /*alternate是回退的意思*/
    ,blink 0.5s step-end infinite alternate;
}

@keyframes typings{
    from{
        width: 0;
    }
    to{
        width: 110%;  /*容器的宽度，这样就能够自适应内容*/
    }
}
```



## 参考

[15 Gorgeous CSS Text Animation Effects](https://alvarotrigo.com/blog/css-text-animations/)