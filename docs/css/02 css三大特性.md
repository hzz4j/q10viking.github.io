---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /css/
typora-root-url: ..\.vuepress\public
---



## Inheritance继承性

::: tip

css中有**一部分属性**可以被继承,盒子属性，如宽和高**不能被继承**

:::

如：文字和文本相关的属性，**可以被继承**

>  玩法：可以直接在body中设置字体，来控制整个页面的字体显示

```css
body {
	font-family: sans-serif;
}
```

可以作为属性填入

```css
.section-title {
	font-family: inherid;
}
```



## 层叠性

::: tip

**样式直接作用在标签上**

:::



## 优先级



![202112081225792](/images/css/202112081225792.jpg)

**权重比较**

1. 比较id选择器，类选择，标签选择器的个数
2. 权重相同，则选择后编写的代码样式

### !important提升权重

::: tip

**Overwrites** specifity and all other selectors

**在直接作用在标签上的属性，通过`!important`可以提高权重**

:::

```css
div {
	color: red !important;
}
```



### 通过继承获得的样式属性

1. 谁描述的近，则使用谁
2. 一样近，按权重比较方式处理