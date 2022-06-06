---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vue3/
typora-root-url: ..\.vuepress\public
---



## Quick start Vue

::: tip

Quick start Vue Project

:::

引入CDN

```js
  <script src="https://unpkg.com/vue@next"></script>
```

浏览器安装**Vue.js devtools**扩展



![202112021044125](/images/vue3/202112021044125.jpg)

## Accessing the Instance Data:star:

```javascript {11}
// Vue Model
const vm = Vue.createApp({
  data() {
    return {
      msg: "Hello Vue",
    };
  },
}).mount("#app");

setTimeout(() => {
    vm.msg = "Learning Vue FrameWork"
}, 2000);
```



![202112021057333](/images/vue3/202112021057333.jpg)

## Multiple Vue Instances:star:

:::: code-group
::: code-group-item js

```js
// Vue Model
const vm1 = Vue.createApp({}).mount("#app-test1");
const vm2 = Vue.createApp({}).mount("#app-test2");
```

:::

::: code-group-item html

```js
  <div id="app-test1">
  </div>
  <div id="app-test2">
  </div>
```

:::

::::

![202112021128352](/images/vue3/202112021128352.jpg)

## v-cloak

::: tip

当页面网速慢得时候，不希望在页面上看到未编译的 Mustache 标签，可以使用该指令

:::

[vue3-directives#v-cloak](https://v3.cn.vuejs.org/api/directives.html#v-cloak)

这个指令保持在元素上直到关联组件实例结束编译。和 CSS 规则如 `[v-cloak] { display: none }` 一起用时，这个指令可以**隐藏未编译的 Mustache 标签**直到组件实例准备完毕。

:::: code-group
::: code-group-item html

```html
<div id="app" v-cloak>
  {{ message }}
</div>
```

:::

::: code-group-item css

```css
[v-cloak] {
  display: none;
}
```

:::

::::



## Two-way data binding:star:

::: tip

Reactivity is when any changes to the data immediately reflected on the page.

:::

<div id="app" v-cloak>
    <section>
      <h2>Hi {{userName}}</h2>
      <p>{{description}}</p>
    </section>
    <hr/>
    <label>UserName:</label>
    <input type="text" v-model="userName"/>
    <label>Description:</label>
    <input type="text" v-model="description" placeholder="Please input some info"/>
  </div>



:::: code-group
::: code-group-item html

```html
<div id="app" v-cloak>
    <section>
        <h2>Hi {{userName}}</h2>
        <p>{{description}}</p>
    </section>
    <hr/>
    <label>UserName:</label>
    <input type="text" v-model="userName"/>
    <label>Description:</label>
    <input type="text" v-model="description" placeholder="Please input some info"/>
</div>
```

:::

::: code-group-item js

```js
// Vue Model
const vm = Vue.createApp({
    data(){
        return {
            userName: "静默",
            description: "Learning Vue"
        }
    }
}).mount("#app");
```

:::

::::

Vanilla Javascript来实现这种绑定

![202112021320117](/images/vue3/202112021320117.jpg)

::: tip

v-model可以使用v-bind+listening event来实现

:::

:::: code-group
::: code-group-item html

```html {2-4}
<div id="app" v-cloak>
    <input type="text" v-model="userName" />
    <!-- 等价 -->
    <input type="text" v-model="userName" @input="updateUserName" />
</div>
```

:::
::: code-group-item js

```js
// Vue Model
const vm = Vue.createApp({
  data() {
    return {
      userName: "静默",
    };
  },
  methods: {
    updateUserName(event) {
      this.userName = event.target.value;
    },
  },
}).mount("#app");

```

::

::::



### v-model modifies

::: tip

number,lazy,trim用来处理input输入框的信息

:::

```html
<div id="app" v-cloak>
    {{count}} {{typeof count}} --- {{username}}
    <!-- v-model.number 在处理数据的时候会忽略字母，只关心number -->
    <input type="number" v-model.number="count" />
    <!-- 不实时更新，当焦点移除的时候才更新 -->
    <input v-model.lazy.trim()="username" />
</div>
```



## Binding Attributes

:::: code-group
::: code-group-item html

```html
<p><a :href="blogLink" target="_blank">静默's Vlog</a></p>
```

:::

::: code-group-item js

```js
// Vue Model
const vm = Vue.createApp({
    data(){
        return {
            userName: "静默",
            description: "Learning Vue",
            blogLink:'https://q10viking.github.io'
        }
    }
}).mount("#app");
```

:::

::::

## Outputting Raw HTML

:::: code-group
::: code-group-item html

```html
<p v-html="raw_url"></p>
```

:::

::: code-group-item js

```js
// Vue Model
const vm = Vue.createApp({
  data() {
    return {
      raw_url: '<a href="https://q10viking.github.io" target="_blank">静默 Blog </a>',
    };
  },
}).mount("#app");
```

:::

::::

::: tip

v-html存在跨站攻击的危险

:::



![202112021343053](/images/vue3/202112021343053.jpg)


----------



<script>
    export default {
    data(){
        return {
           userName: "静默",
           description: "Learning Vue"
        }
    }
}
</script>
<style scoped>
input[type="text"] {
  margin: 10px 0;
  display: block;
}
</style>




