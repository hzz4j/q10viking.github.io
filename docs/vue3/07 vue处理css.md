---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vue3/
---



## Binding Classes

对css操作的数据形式

```js
// 字符串
'red',		
// 对象
{			
    red: false,
    green: false
},
// 数组
['red','green',{brown: true}] 
```

::: tip

将属性的变化结合computed来使用

:::

:::: code-group
::: code-group-item html

```html {10}
    <div id="app">
      <label>
        <input type="checkbox" v-model="isPurpleSelected" />Purple
      </label>
      <select v-model="textColor">
        <option value="">White</option>
        <option value="text-black">Black</option>
        <option value="text-orange">Orange</option>
      </select>
      <div class="circle" :class="[textColor,circle_class]">静默</div>
    </div>
```

:::

::: code-group-item js

```js {9-13}
let vm = Vue.createApp({
  data() {
    return {
      textColor:"",
      isPurpleSelected: false,
    };
  },
  computed: {
    circle_class() {
      return {
        purple: this.isPurpleSelected,
      };
    },
  },
}).mount("#app");
```

:::

::::



<common-codepen-snippet title="css style vue-1" slug="qBPdqjg"/> 

## Binding Styles

```js
styleString: 'color: yellow',
styleOject: {
	color: 'orange'
}
```

