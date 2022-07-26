---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Event KeyCodes

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/34%20Event%20KeyCodes/vite-project/dist/)

[vanilla Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/34%20Event%20KeyCodes/vanilla)

[Vue3+ts重构 Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/34%20Event%20KeyCodes/vite-project)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/34%20Event%20KeyCodes/vite-project/dist/"/>





## 监听windows事件

```js
// event类型推断为KeyboardEvent
window.addEventListener('keydown',event =>{
    
    container.innerHTML = `
        <div class="key">
            <span class="content">
            ${event.key === " " ? event.code : event.key}
            </span>
            <small>event.key</small>
        </div>
        
        <div class="key">
            <span class="content">${event.keyCode}</span>
            <small>event.keyCode</small>
        </div>
        
        <div class="key">
            <span class="content">${event.code}</span>
            <small>event.code</small>
        </div>
    `
    console.log(event)
})
```





## Vue3 v-html :deep() inner-selector

::: tip

使用v-html样式不生效的问题.[vue3 api v-html](https://vuejs.org/api/built-in-directives.html#v-html)

官网的描述：In [Single-File Components](https://vuejs.org/guide/scaling-up/sfc.html), `scoped` styles will not apply to content inside `v-html`, because that HTML is not processed by Vue's template compiler.

:::

scss中添加`:deep()` [javascript - CSS styles not being applied to HTML within a Vue Component - Stack Overflow](https://stackoverflow.com/questions/48331383/css-styles-not-being-applied-to-html-within-a-vue-component/73122233#73122233)

```vue
<script setup lang="ts">

import {onMounted,ref } from 'vue'
const content = ref("")

onMounted(()=>{
    window.addEventListener('keydown',event =>{
        content.value = `
            <div class="key">
                <span class="content">${event.keyCode}</span>
                <small>event.keyCode</small>
            </div>
        `
    })
})

</script>

<template>
    <div class="container" v-html="content">
    </div>
</template>

<style lang="scss" scoped>  <!-- 不需要添加module -->
@import '../scss/_common_variables';
.container{
    display: flex;
	<!-- v-html 加入的html，只需要在最外层的容器添加:deep() -->
    :deep(.key){
        font-weight: bold;
        
        .content{
            font-size: 1.5rem;
        }
        
        small{
            font-size: 14px;
        }
    }
}
</style>
```

