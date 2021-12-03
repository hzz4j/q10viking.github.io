---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vue3/
---



::: tip

使用Vue提供的API创建component

:::

组件中的数据都是独立的

:::: code-group
::: code-group-item js

```js {2-9}
const app = Vue.createApp({});
app.component("hello-world", {
  data() {
    return {
      msg: "Hello World",
    };
  },
  template: `{{msg}}`,
});

app.mount("#app");
```

:::
::: code-group-item html

```html
<div id="app">
    <hello-world></hello-world>
    <hello-world></hello-world>
    <hello-world></hello-world>
</div>
```

:::
::::

![image (14)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112031304331.jpg)