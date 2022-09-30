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









