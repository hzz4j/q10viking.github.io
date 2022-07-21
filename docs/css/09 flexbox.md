---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /css/
typora-root-url: ..\.vuepress\public
---



::: tip

The modern way to change the way our elements are displayed

:::

## Understanding the Flexbox

![202112150857259](/images/css/202112150857259.jpg)

## flex Container

::: tip

默认的行为

- display: flex
- flex-direction: row
- flex-wrap: nowrap;
- align-items: stretch;

:::



## Main Axis vs Cross Axis



![202112150933745](/images/css/202112150933745.png)

## Align items and Justify content

::: tip

- justify-content: space-between  是main方向的
- align-items  是 cross方向的

:::

![202112150954144](/images/css/202112150954144.jpg)



## Notes App 案例

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/12%20Notes%20App/)

[相关笔记](https://q10viking.github.io/minifrontendproject/08%20Notes%20App.html)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/12%20Notes%20App/"/>

### flex-wrap使用

::: tip

布局

:::

```css
body{
    display: flex;
    flex-wrap: wrap;
}
```

### justify-content使用

::: tip

编辑，删除按钮的使用

:::

```css
.note .tools{
    display: flex;
    justify-content: flex-end; /*flex end*/
    background-color: var(--second-color);
    padding: 0.5rem;
}
```



## flex: 数值

[ flex: 1 Drink Water](https://q10viking.github.io/minifrontendproject/13%20Drink%20Water.html#flex)

[flex: 5 Expanding Cards](https://q10viking.github.io/minifrontendproject/19%20Expanding%20Cards.html)