---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /css/
typora-root-url: ..\.vuepress\public
---



## Grid

[详细介绍了CSS Grid Layout (w3schools.com)](https://www.w3schools.com/css/css_grid.asp)





## grid-template-areas

[W3Schools Tryit Editor 示例](https://www.w3schools.com/css/tryit.asp?filename=trycss_grid_layout_named)





## fr unit

[An Introduction to the `fr` CSS unit | CSS-Tricks - CSS-Tricks](https://css-tricks.com/introduction-fr-css-unit/)

> setting each column to 1fr takes that 10px into account automatically and subtracts it from the total width available for each column. 

> The `fr` unit (a “fraction”) can be used when defining grids like any other [CSS length](https://css-tricks.com/the-lengths-of-css/) such as `%`, `px` or `em`

很方便来计算长度,并且不会担心overflow.

```scss
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);  // 会将10px包括进来,repeat(4,25%)则不会,实际是(25%+10px)
  grid-column-gap: 10px;  
}
```

如下面的快速布局

```scss
.grid {
  display: grid;
  grid-template-columns: 250px repeat(12, 1fr);
  grid-column-gap: 10px;
}
```

![image-20220927173343800](/images/css/image-20220927173343800.png)



### repeat function

```scss
grid-template-columns: 25% 25% 25% 25%
// 新特性
grid-template-columns: repeat(4, 25%);
// repeat(number of columns/rows, the column width we want);
```



## 属性

-  [grid-template-columns](https://www.w3schools.com/cssref/pr_grid-template-columns.asp) specifies the number (and the widths) of columns in a grid layout.
- [grid-column-gap](https://www.w3schools.com/cssref/pr_grid-column-gap.asp)  defines the size of the gap between the columns in a grid layout.
