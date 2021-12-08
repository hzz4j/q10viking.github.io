---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /css/
---

## Box model

::: tip

:one: margin :two: border :three: padding :four: height :five: width

:::   

![image (5)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112081622568.jpg)

## margin collapsing

::: tip

In General: Use either **margin-top** or **margin-bottom**

:::

![image](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112081409876.jpg)



## Shorthand Properties

![image (1)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112081414323.jpg)



## Width and Height计算

::: tip

默认width and height只是对content起作用，并不将border and padding计算在内，因为样式是**box-sizing: content-box;**

:::

:star: **box-sizing: border-box;** ---> The **width** and **height** of the element apply to all parts of the element: the **content**, the **padding** and the **borders**.

[详细解释 box-sizing - CSS Reference](https://cssreference.io/property/box-sizing/)

![image (2)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112081437884.jpg)



## display

::: tip

:one: block :two: inline :three: inline-block

:::

- Control behavior (**block** vs **inline**) of elements
- Mix behavior via **inline-block**
- Hidden elements via **none**

