---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /css/
typora-root-url: ..\.vuepress\public
---



## id选择器

![202112081217328](/images/css/202112081217328.jpg)



## 类选择器

![202112081215350](/images/css/202112081215350.jpg)

### 玩法： Google样式



<common-codepen-snippet title="类选择器" slug="VwjyREg" />

## 标签选择器  

![202112081213294](/images/css/202112081213294.jpg)

## 通配符*全选择器

![202112081216292](/images/css/202112081216292.jpg)

## Combinator组合

###  Descend后代选择器

![202112081301739](/images/css/202112081301739.jpg)



### Child子选择器

::: tip

这里的子 指的是 亲儿子 不包含孙子 重孙子之类

:::

![202112081300044](/images/css/202112081300044.jpg)


### Adjacent Sibling相邻

![202112081257664](/images/css/202112081257664.jpg)

### General Sibling

![202112081259877](/images/css/202112081259877.jpg)



比如有如下的html结构代码

```html
<li>Item1</li>
<li>Item2</li>
<li>Item3</li>
```

当选择器为如下形式的时候,只有Item2,Item3为红色

```css
li{
  color: green;
}

li ~ li{
  color: red;
}
```

<common-codepen-snippet title="Sibling Genenal" slug="MWGrBwW" />

### 交集选择器

::: tip

select a tag that has the class

两个选择器之间**不能有空格**

:::

![202112081634183](/images/css/202112081634183.jpg)

### 1.3 清除默认样式（重要）

1. 清除样式能够在开发中避免浏览器突然添加的默认样式（这会影响开发的预期效果）

从效率上来看并集选择器在书写上繁琐，但是效率比较高

```css
// 通配符*全选择器
*{
	margin: 0;
    padding: 0;
}

// 并集选择器
div,p{
   margin: 0;
   padding: 0; 
}

```



## 属性选择器

![202112081219231](/images/css/202112081219231.jpg)



![202112142110428](/images/css/202112142110428.jpg)

### 普通选择器

```css
E[attr="val"]
```

### ^属性开头

```css
E[attr^="val"]  选择拥有attr属性且属性值为val开头的E元素
```

### $属性结束

```css
E[attr$="val"]  选择拥有attr属性且属性值以val结束的E元素
```

### *包含属性

```css
E[attr*="val"]   选择拥有attr属性且属性值中包含val的E元素
```



----------

## Grouping Rule

::: tip

并集选择器通常用于集体声明 ，**逗号隔开的（和的意思）**

share the same declaration set

:::

:::: code-group
::: code-group-item Grouping Rule

```css
.main-nav__item a:hover, 
.main-nav__item a:active{
    color: white;
}
```

:::
::: code-group-item 等同于

```css
.main-nav__item a:hover{
    color: white;
}

.main-nav__item a:active{
    color: white;
}
```

:::
::::



## Pseudo-classes 伪类选择器

![202112081600641](/images/css/202112081600641.jpg)

::: tip

[Pseudo-classes - CSS: Cascading Style Sheets | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)

:::

### :first-child 第一个元素

### :last-child 最后一个元素

###  :nth-child

#### 1. even偶数

::: tip

四个单词的是偶数

:::

#### 2. odd 奇数

#### 3. 表达式 a*n+b

#### 4. 数字

### :nth-last-child



### 类型选择器

#### :nth-of-type

::: tip

参数同:nth-child

:::

[Expanding Cards](https://q10viking.github.io/minifrontendproject/19%20Expanding%20Cards.html)

#### :nth-last-of-type

::: tip

参数同:nth-child

:::



### 状态选择器

```css
input[type=radio]:checked

.wrap:nth-child(1):hover
```

### a标签的伪元素love hate原则

```css
a:link{
    color: red;
}
a:visited{
    color: green;
}
a:hover{
    color: blue;
}
a:active{
    color: yellow;
}
```

**玩法：**用a标签进行包裹，以便使用hover

```html
a:hover .mask{
	display: block; // 显示
}

<a href="#">
	<!-- 遮罩 -->
	<div class="mask"></div>
	<img src="path">
</a>
```



##  Pseudo-elements

::: tip

[Pseudo-elements - CSS: Cascading Style Sheets | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)

:::

![202112081600641](/images/css/202112081600641.jpg)

### selection 选中的元素

```css
div::selection { background: yellow; }
```

input 类型为range的标签

```css
input[type = 'range']::-webkit-slider-runnable-track{}
input[type = 'range']::-webkit-slider-thumb{}
```



## not

::: tip

排除特定的选择器

:::

```css {1}
.signup-form input:not([type="checkbox"]):focus,
.signup-form select:focus{
    outline: none;
    background-color: #d8f3cf;
    border: 1px solid #2ddf5c;
}
```

最后一个元素没有下划线

[Live User Filter](https://q10viking.github.io/minifrontendproject/26%20Live%20User%20Filter.html)

```scss
// 下划线得设置
&:not(:last-of-type){
    border-bottom: 1px solid $gray;
}
```





## css 优先级

![202112081225792](/images/css/202112081225792.jpg)
