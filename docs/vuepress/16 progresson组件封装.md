---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vuepress/
typora-root-url: ..\.vuepress\public
---



::: tip

[静默 on Process](https://www.processon.com)

:::



## 使用

::: tip

:one: 必填，分享的地址连接

:two: 可选项 height 默认 345,width默认625

:::

```vue
<common-progresson-snippet src="https://www.processon.com/embed/61b8656e637689712447357c"/>
<!-- 选题height,width -->
<common-progresson-snippet height="345" width="625" 
                           src="https://www.processon.com/embed/61b8656e637689712447357c"/>
```

![202112141818657](/images/vuepress/202112141818657.jpg)

## 源码实现

::: tip

使用iframe标签来实现网页的预览

:::



::: details 点击查看代码

```vue {2-8}
<template>
  <iframe
    id="embed_dom"
    name="embed_dom"
    frameborder="0"
    :style="`display: block; width: ${width}px; height: ${height}px`"
    :src="src"
  ></iframe>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: null,
      require: true,
    },
    width: {
      type: Number,
      default: 625,
    },
    height: {
      type: Number,
      default: 345,
    },
  },
};
</script>

<style>
</style>
```

:::