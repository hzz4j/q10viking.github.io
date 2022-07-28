---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Memory Card Game

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/38%20Memory%20Card%20Game/vite-project/dist/)

[vanilla Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/38%20Memory%20Card%20Game/vanilla)

[Vue3+ts重构 Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/38%20Memory%20Card%20Game/vite-project)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/38%20Memory%20Card%20Game/vite-project/dist/"/>





## 如何做到翻转的效果



### backface-visibility⭐

::: tip

1. 一个容器中有两个div,其中一个前面的展示，一个是后面的展示
2. 通过定位让他们重合在一起
3. 通过Y轴旋转180deg到背面，并设置`backface-visibility:hidden` 将翻转到背面的元素隐藏
4. 添加过渡效果就可以实现翻转的效果

:::

```scss
.card{
      position: relative;
      .view{
        position: absolute;  // 脱离文档流
        backface-visibility: hidden;  // 反转到背面隐藏
        transition: transform 0.2s linear;  //动画效果
      }
	  // 前面的展示
      .front-view{
        @extend .view;   // scss语法继承.view
        font-size: 2rem;
        color: orange;
        transform: rotateY(0deg)  // 正面先展示
      }
      // 后面的展示
      .back-view{
        @extend .view;
        transform: rotateY(180deg); // 反转到背面隐藏
      }

      &:hover{
        .front-view{
          transform: rotateY(180deg);  // 隐藏
        }

        .back-view{
          transform: rotateY(0deg);  // 展示
        }
      }
```



## 如果做到抖动效果

::: tip

动画效果，水平移动位置

:::

```scss
// 抖动
&:hover{
    animation: shake 0.35s ease-in-out;

    @keyframes shake {
        0%,100%{
            transform: translateX(0);
        }
        20%{
            transform: translateX(12px);
        }
        40%{
            transform: translateX(-12px);
        }
        60%{
            transform: translateX(5px);
        }
        80%{
            transform: translateX(-5px);
        }
    }
}
```



## pointer-events

```scss
// 不赋值给event.target
pointer-events: none;
```

```
div 里面有一个子元素
	p 100%撑满div
		span p里面有span标签
```

当给div添加click事件的时候，点击div的区域，触发的event.target有可能不确定，当点击p时，触发的是event.target是p 元素，当点击span，触发的target是span。当给p和span标签设置pointer-events.后再次点击div区域，event.target就是div了。

## css计算容器100%

```
calc(100%/4 -10px)
```



## 如何打乱卡片

**更改img.src的就好**

[How to randomize (shuffle) a JavaScript array? - Stack Overflow](https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array)

```tsx
/**
 * 刷新牌面
 */
function shuffle(){
  const RANDOM_IMAGES = [
    ...[...IMAGES].sort(()=> Math.random() - 0.5),  // 随机
    ...[...IMAGES].sort(()=> Math.random() - 0.5)   // 随机
  ]
  cards.forEach((card,idx) => {
    const imgEl = card.querySelector("img")! as HTMLImageElement
    imgEl.src = RANDOM_IMAGES[idx]
  })
}
```

----------



## Vue3实现



## Refs inside `v-for`

[Refs in v-for](https://vuejs.org/guide/essentials/template-refs.html#refs-inside-v-for)

It should be noted that the ref array does **not** guarantee the same order as the source array.

[**child component wants to use it as a local data property**](https://vuejs.org/guide/components/props.html#one-way-data-flow)

[Ref On Component](https://vuejs.org/guide/essentials/template-refs.html#ref-on-component)

1. reference will be that of a component instance:
2. components using `<script setup>` are **private by default**: a parent component referencing a child component using `<script setup>` won't be able to access anything unless the child component chooses to expose a public interface using the `defineExpose` macro:
3. defineExpose是父组件拿到子组件的时候看到的样子

[Typing Component Template Refs](https://vuejs.org/guide/typescript/composition-api.html#typing-component-template-refs)

```tsx
// 官网的例子
import MyModal from './MyModal.vue'
const modal = ref<InstanceType<typeof MyModal> | null>(null)
```



----------





## 扩展

### perspective

[CSS perspective property (w3schools.com)](https://www.w3schools.com/cssref/css3_pr_perspective.asp)

[perspective - CSS: Cascading Style Sheets | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/CSS/perspective)

1. The `perspective` property is used to give a 3D-positioned element some perspective.

2. The `perspective` property defines **how far the object is away from the user.** So, a lower value will result in a more intensive 3D effect than a higher value.

3. When defining the `perspective` property for an element, **it is the CHILD elements that get the perspective view, NOT the element itself.**

## 参考

[(1) Build A Memory Card Game in HTML CSS & JavaScript - YouTube](https://www.youtube.com/watch?v=DABkhfsBAWw)