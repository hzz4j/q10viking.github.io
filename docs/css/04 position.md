---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /css/
typora-root-url: ..\.vuepress\public
---



::: tip

position能将所有元素改变为inline-block

:::

## Document flow

::: tip

默认属性position的值是static

:one: static

:two: absolute 如果祖先（ancestor）有position的类型则以最近的为参照来移动，否则直接参照html标签的位置

:three: relative the positioning context is the element itself and the element is also not taken out of the document flow

:four: fixed  depends on **viewport**

:five: sticky

:::

![202112081832684](/images/css/202112081832684.jpg)

## Changine the position

::: tip

Posting移动的位置需要有一个参照物，也就是refer to **Positioning context**

:one: top

:two: right

:three: bottom

:four: left

以上属性要想起作用，position不能是static

:::

![202112081829836](/images/css/202112081829836.jpg)

## z-index

::: tip

work when use position,因为元素脱离了文档流了，会产生覆盖的效果.默认是0

:::



## overflow

::: tip

当元素在容器中溢出时可以使用它来使得它的定位超出容器之后不可见

:::
