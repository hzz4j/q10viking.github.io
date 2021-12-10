## Unit

![image (3)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112101314216.jpg)



## Where Unit Matter

![image (4)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112101319695.jpg)



## How is the Size Calulated

::: tip

字体**font: 75%** 参照的是浏览器字体设置

:::

![image (5)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112101332430.jpg)

## % Units Calculated

::: tip

与containing block有关

:::

![image (6)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112101334152.jpg)

### 3 Rules to 

::: tip

如果**position:abosulte;** 没有找到对应的ancestor则以viewport的大小作为百分比参考

:::

![image (8)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112101346383.jpg)

## min-widthheight & max-widthheight

::: tip

结合 :one: width的相对值 :two: min max的绝对值 来控制展示效果

:::

```css {2-4}
.testimonial__image-container {
  width: 65%;
  min-width: 350px;
  max-width: 580px;
  display: inline-block;
  vertical-align: middle;
  box-shadow: 3px 3px 5px 3px rgba(0, 0, 0, 0.3);
}
```

## font-size with rem & em

::: tip

dynamic

:::

em会乘以一个value,如浏览器默认设置的字体大小medium是16px,那么**font-size: 2em;** 最终计算的大小是2x16  = 32px