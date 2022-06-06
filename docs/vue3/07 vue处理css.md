---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vue3/
---

::: tip

 Vue provides special enhancements when `v-bind` is used with `class` and `style`. In addition to strings, the expressions can also evaluate to objects or arrays

[Class and Style Bindings | Vue.js (vuejs.org)](https://v3.vuejs.org/guide/class-and-style.html#class-and-style-bindings)

:::

## Binding Classes

对css操作的数据形式

```js
	
// Object Syntax
{			
    red: false,
    green: false
},
// Array,Syntax
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
// Object Syntax
styleOject: {
	color: 'orange'
}
// Array Syntax
```

<label>
    <input type="checkbox" v-model="isPurpleSelected" />Purple
</label>

<select v-model="textColor">
    <option value="">White</option>
    <option value="text-black">Black</option>
    <option value="text-orange">Orange</option>
</select>
<input type="number" v-model.number="size" />
<div
     class="circle"
     :class="[textColor,circle_class]"
     :style="[
             {width: size+'px',height: size+'px',lineHeight: size+'px'},
             {transform:'rotate(30deg)'}]"
     >
    静默
</div>




:::: code-group
::: code-group-item html

```html {11-17}
<div id="app">
    <label>
        <input type="checkbox" v-model="isPurpleSelected" />Purple
    </label>
    <select v-model="textColor">
        <option value="">White</option>
        <option value="text-black">Black</option>
        <option value="text-orange">Orange</option>
    </select>
    <input type="number" v-model.number="size" />
    <div
         class="circle"
         :class="[textColor,circle_class]"
         :style="[
                 {width: size+'px',height: size+'px',lineHeight: size+'px'},
                 {transform:'rotate(30deg)'}]"
         >
        静默
    </div>
</div>
```

:::
::: code-group-item js

```js
let vm = Vue.createApp({
  data() {
    return {
      textColor: "",
      isPurpleSelected: false,
      size: 150,
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















<script>
  export default {
    data() {
      return {
        textColor: "",
        isPurpleSelected: false,
        size: 150,
      };
    },
    computed: {
      circle_class() {
        return {
          purple: this.isPurpleSelected,
        };
      },
    }
  }
</script>
<style>
    label {
        margin-bottom: 20px;
        font-size: 20px;
        display: block;
    }
    select{
        font-size: 20px;
        margin-bottom: 20px;
    }
    input[type=number]{
        display: block;
        font-size: 20px;
        margin-bottom: 20px;
    }
    .circle{
        width: 150px;
        height: 150px;
        border-radius: 100%;
        background-color: #45D619;
        text-align: center;
        color: #fff;
        line-height: 150px;
        font-size: 32px;
        font-weight: bold;
    }
    .purple{
        background-color: #767DEA;
    }
    .text-black{
        color: #424242;
    }
    .text-orange{
        color: #FFC26F;
    }
</style>



