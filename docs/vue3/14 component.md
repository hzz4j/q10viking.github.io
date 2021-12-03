---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vue3/
---

## Component

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



## Communicating with components

![image (15)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112040131096.jpg)

### Emit

::: tip

To produce or trigger an event

:::





## Dynamic Component

```vue
<component :is="currentComponentNM"></component>  
```

### keep-alive

```vue
<!-- 保持组件的状态 -->
  <keep-alive>
    <component :is="currentComponentNM"></component>  
  </keep-alive>
```

![image](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112040320630.jpg)

在组件激活和取消激活，有相应的lifecycle hook

```javascript
    activated(){
        console.log("Home activated");
    },
    deactivated(){
        console.log("Home deactivated");
    }
```

