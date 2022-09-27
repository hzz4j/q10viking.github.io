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

