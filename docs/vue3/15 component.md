---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vue3/
typora-root-url: ..\.vuepress\public
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

![202112031304331](/images/vue3/202112031304331.jpg)

## Communicating with components

![202112040131096](/images/vue3/202112040131096.jpg)

### Emit

::: tip

To produce or trigger an event

和 prop 类似，现在可以通过 `emits` 选项来定义组件可触发的事件：

:::

:::: code-group
::: code-group-item User.vue

```vue {10-16,18-20}
<template>
  <button type="button" @click="onClickCount">Update Count Event</button>
  <p>The user is {{ count }} count</p>
  <p>{{ countDoubled }}</p>
</template>

<script>
export default {
  name: "User",
  emits:['count-change'],
  props: {
    count: {
      type: Number,
      require: true,
    },
  },
  computed: {
    countDoubled() {
      return this.count * 2;
    },
  },
  methods: {
      onClickCount(){
          this.$emit('count-change',3);
      }
  }
};
</script>
```

:::

::: code-group-item App.vue

```vue {3}
<template>
  <Greeting :count="count"></Greeting>
  <User :count="count" @count-change="onCountChange"></User>
</template>

<script>
import Greeting from "./components/Greeting.vue";
import User from "./components/User.vue";

export default {
  name: "App",
  components: { Greeting, User },
  data() {
    return {
      count: 25,
    };
  },
  methods: {
    onCountChange(num) {
      console.log("change?",num);
      this.count += num;
    },
  },
};
</script>
```

:::

::::



### 回调函数

:::: code-group
::: code-group-item User.vue

```vue {3,17-19}
<template>
  <button type="button" @click="onClickCount">Update Count Event</button>
  <button type="button" @click="countFn(3)">Update Count By CB</button>
  <p>The user is {{ count }} count</p>
  <p>{{ countDoubled }}</p>
</template>

<script>
export default {
  name: "User",
  emits:['count-change'],
  props: {
    count: {
      type: Number,
      require: true,
    },
    countFn:{
        type: Function
    }
  },
  computed: {
    countDoubled() {
      return this.count * 2;
    },
  },
  methods: {
      onClickCount(){
          this.$emit('count-change',3);
      }
  }
};
</script>
```

:::

::: code-group-item App.vue

```vue {3}
<template>
  <Greeting :count="count"></Greeting>
  <User :count="count" @count-change="onCountChange" :countFn="countCB"></User>
</template>

<script>
import Greeting from "./components/Greeting.vue";
import User from "./components/User.vue";

export default {
  name: "App",
  components: { Greeting, User },
  data() {
    return {
      count: 25,
    };
  },
  methods: {
    onCountChange(num) {
      console.log("change?",num);
      this.count += num;
    },
    countCB(num){
      this.count += num
    }
  },
};
</script>
```

:::

::::



## Slot

::: tip

:one: 默认插槽

:two: 具名插槽

:::

:::: code-group
::: code-group-item Form.vue

```vue {13}
<template>
  <form>
    <div class="help">
        <p>Can you see me</p>
      <slot name="help"></slot>
    </div>
    <div class="fields">
      <slot name="fields"></slot>
    </div>
    <div class="buttons">
      <slot name="buttons"></slot>
    </div>
    <slot></slot>
  </form>
</template>
```

:::
::: code-group-item App.vue

```vue {19}
<template>
  <app-form>
    <template v-slot:help>
      <p>{{ help }}</p>
    </template>
    <template v-slot:fields>
      <input type="text" placeholder="email">
      <input type="text" placeholder="username">
      <input type="password" placeholder="password">
    </template>
    <template v-slot:buttons>
      <button type="submit">Submit</button>
    </template>
    <p>Default slot</p>
  </app-form>
</template>

<script>
import AppForm from './components/Form.vue'

export default {
  name: 'App',
  components: {
    AppForm
  }
}
</script>
```

:::
::::



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



![202112040320630](/images/vue3/202112040320630.jpg)

在组件激活和取消激活，有相应的lifecycle hook [生命周期钩子 | Vue.js (vuejs.org)](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#生命周期钩子)

```javascript
    activated(){
        console.log("Home activated");
    },
    deactivated(){
        console.log("Home deactivated");
    }
```

