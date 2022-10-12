---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---





## 整体居中布局

```scss
// 容器的宽度
.container{
    width: 1240px;
    margin: 0 auto;
    position: relative;
}
```





## 激活导航栏的菜单

[javascript - toggle active class on list menu items - vue js - Stack Overflow](https://stackoverflow.com/questions/48857670/toggle-active-class-on-list-menu-items-vue-js/73872765#73872765)

```vue
<template>
    <ul class="titles">
      <li
        v-for="(title, index) in titles"
        class="title"
        :key="index"
        :class="{ active: active === index }"
        @click="updateActive(index)"
      >
        {{ title }}
      </li>
    </ul>
</template>

<script lang="ts" setup>
import { ref } from "vue"
const titles = [
  "首页",
  "美食",
  "服饰"
]
const active = ref(-1)
function updateActive(val: number) {
  active.value = val
}
</script>
```



## ts+axios+vue组件获取数据

axios获取数据的，以及API数据类型的封装



## Composables 思想

::: tip

代码复用的思想

- [Vue3 Composables](https://vuejs.org/guide/reusability/composables.html)
- [Vueuse useWindowScroller Example](https://vueuse.org/core/useWindowScroll/#usewindowscroll)

:::

:::: code-group
::: code-group-item useWindowScroll.ts

```tsx
import { ref } from "vue"
import useEventListener from "./useEventListener"
// 参考：https://vueuse.org/core/useWindowScroll/#usewindowscroll
// https://vuejs.org/guide/reusability/composables.html

export default function useWindowScroll() {
  const x = ref(window.scrollX)
  const y = ref(window.scrollY)

  function scrollerListener() {
    x.value = window.scrollX
    y.value = window.scrollY
  }

  useEventListener(window, "scroll", scrollerListener)
  return { x, y }
}

```
:::
::: code-group-item useEventListener

```tsx
import { onMounted, onUnmounted } from "vue"

type Target = Window | HTMLElement
type Callback = () => void

export default function useEventListener(
  target: Target,
  event: string,
  callback: Callback
) {
  onMounted(() => {
    target.addEventListener(event, callback)
  })

  onUnmounted(() => {
    target.removeEventListener(event, callback)
  })
}
```
:::
::::



## 目前用到Vue3的知识

- ts
- 单文件组件
- Composables复用思想
- 列表渲染
- 条件渲染
- 生命周期mounted,onMounted运用
- computed属性
- vite
- props
- store
- router
- style
- 自定义插件





## 项目问题

[Typescript: IDE reports TS2307: Cannot find module error for Vue components imports](https://github.com/vitejs/vite/issues/965)

shims-vue.d.ts文件的作用，解决ide中main.ts文件中导入vue组件报错的问题

![image-20221011173437831](/images/minifrontendproject/image-20221011173437831.png)

```tsx
/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<{}, {}, any>
  export default component
}
```



## 引入pina

![image-20221011184120640](/images/minifrontendproject/image-20221011184120640.png)

注意事项

> 直接访问state

```js
// count不是响应式的
const count = categoryStore.count 
// 响应式
const count = computed(() => categoryStore.count)
```


![image-20221011221328233](/images/minifrontendproject/image-20221011221328233.png)

![image-20221011221230896](/images/minifrontendproject/image-20221011221230896.png)

> 访问getter方法，在setup方式编程中，尽管getter方式变成了computed的方式，但是在使用的时候如果不使用computed.仍然还不是响应式的

```tsx
// doubleCount不是响应式的
const doubleCount = categoryStore.doubleCount
// doubleCount响应式
const doubleCount = computed(() => categoryStore.doubleCount)
```

```tsx
export const useCategoryStore = defineStore("category", () => {
  const categoryHeads: Ref<CategoryHead[]> = ref(DefaultCategoryHead)
  const count = ref(0)

  // getter 方法
  const doubleCount = computed(() => count.value * 2)

  // actions
  async function initCategoryHead() {
    categoryHeads.value = await categoryApi()
  }

  function increment() {
    count.value++
  }

  return { categoryHeads, initCategoryHead, count, doubleCount, increment }
})
```



## 引入VueRouter

- 好处之一，可以根据路由来解耦代码
- components与views的区别也在与此，views下面的组件用于router [StackOverFlow: what-is-the-difference-between-the-views-and-components-folders-in-a-vue-project](https://stackoverflow.com/questions/50865828/what-is-the-difference-between-the-views-and-components-folders-in-a-vue-project)



## Vue3开发小技巧

- v-show+computed控制显示

