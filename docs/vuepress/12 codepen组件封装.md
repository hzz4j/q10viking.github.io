---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vuepress/
typora-root-url: ..\.vuepress\public
---



## 封装组件

::: tip

[静默 on CodePen](https://codepen.io/Q10Viking)

:::

在引入codepen embed的时候，总是一堆代码，为了维护简单，封装了一个`codepen-snippet.vue`

![202111271454395](/images/vuepress/202111271454395.png)

::: details 点击查看代码

```vue

<template>
  <p
    class="codepen"
    :data-theme-id="theme"
    :data-preview="preview || null"
    :data-editable="editable || null"
    :data-height="height"
    :data-default-tab="tab"
    :data-user="user"
    :data-slug-hash="slug"
    :data-pen-title="title"
    :data-embed-version="version"
    :style="`height: ${height}px`">
    <span>See the Pen <a :href="href">{{ title }}</a>
    by {{ name || user }} (<a :href="`https://codepen.io/${user}`">@{{user}}</a>)
    on <a href="https://codepen.io">CodePen</a>.</span>
  </p>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null,
      required: true,
    },

    slug: {
      type: String,
      default: null,
      required: true,
    },

    tab: {
      type: String,
      default: 'result',
    },

    team: {
      type: Boolean,
      default: false,
    },

    user: {
      type: String,
      default: 'Q10Viking',
    },

    name: {
      type: String,
      default: null,
    },

    height: {
      type: Number,
      default: 300,
    },

    theme: {
      type: String,
      default: 'dark',
    },

    preview: {
      type: Boolean,
      default: true,
    },

    editable: {
      type: Boolean,
      default: true,
    },

    version: {
      type: String,
      default: null,
    }
  },
  mounted() {
    const codepenScript = document.createElement('script')
    codepenScript.setAttribute('src', 'https://cpwebassets.codepen.io/assets/embed/ei.js')
    codepenScript.async = true
    this.$el.appendChild(codepenScript)
  },
  computed: {
    href() {
      return `https://codepen.io/${this.team ? 'team' : ''}${this.user}/pen/${this.slug}`
    }
  },
}
</script>

<style lang="scss">
.codepen {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  margin: 1em 0;
  padding: 1em;
}
</style>
```

:::

## 使用

::: tip

在markdown文件中直接引用该插件，⭐必须填写对应的**slug**和**title**信息

- 选填 theme 默认是dark,  （值 dark 或 light）
- 选填 height 默认是300,

:::

![202111271451430](/images/vuepress/202111271451430.png)

## 效果

```vue
<common-codepen-snippet title="TodoList" slug="ZEJgdzb" />
```

<common-codepen-snippet title="TodoList" slug="ZEJgdzb" />

