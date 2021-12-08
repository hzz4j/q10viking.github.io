---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /css/
---



## id选择器

![image (2)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112081217328.jpg)



## 类选择器

![image](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112081215350.jpg)

### 玩法： Google样式




<common-codepen-snippet title="类选择器" slug="VwjyREg" />

## 标签选择器  

![image (14)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112081213294.jpg)

## 通配符*全选择器

![image (1)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112081216292.jpg)

## Combinator组合

###  Descend后代选择器

![image (8)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112081301739.jpg)



### Child子选择器

::: tip

这里的子 指的是 亲儿子 不包含孙子 重孙子之类

:::

![image (7)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112081300044.jpg)



### 交集选择器

1. 两个选择器之间**不能有空格**

   ```css
   h3.special{}
   ```

### 并集选择器

1. 并集选择器通常用于集体声明 ，**逗号隔开的（和的意思）**

   ```css
   .one, p , #test {color: #F00;}  
   ```


### Adjacent Sibling相邻

![image (5)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112081257664.jpg)



### General Sibling

![image (6)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112081259877.jpg)



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

![image (3)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112081219231.jpg)

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

### 2.2 结构选择器（伪类选择器）

#### 2.2.1 :first-child 第一个元素

#### 2.2.2 :last-child 最后一个元素

#### 2.2.3 :nth-child

##### 1. even偶数

四个单词的是偶数

##### 2. odd 奇数

##### 3. 表达式 a*n+b

##### 4. 数字

#### 2.2.4 :nth-last-child



### 2.3 类型选择器

#### 2.3.1 :nth-of-type

参数同:nth-child

#### 2.3.2 :nth-last-of-type

参数同:nth-child



### 2.4 状态选择器

#### 2.4.1 input[type=radio]:checked

#### 24.2 .wrap:nth-child(1):hover



## 3 特殊选择器

#### 3.1 selection 选中的元素

```css
::selection { background: yellow; }
```

## 4 a标签的伪元素love hate原则

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



### 4.1 应用

1. 用a标签进行包裹，以便使用hover

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

   

## css 优先级

![image (4)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112081225792.jpg)

