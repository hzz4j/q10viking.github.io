---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vue3/
---



## todoList

融合了一下知识点

1. v-model
2. v-for
3. methods
4. data
5. template

> vue引入到普通页面的方式

::: details 点击查看代码

```js {5,31}
<div id="root">
</div>

<script>
Vue.createApp({
  data(){
    return {
      inputValue: '',
      items: ['vue基础特性']
    }
  },
  template: `
    <div>
      <input v-model="inputValue" />
      <button @click="handleAddItem">增加</button>
      <ul>
        <li v-for="item of items">{{item}}</li>
      </ul>
    </div>
  `,
  methods: {
    handleAddItem(){
      if(this.inputValue === ''){
        alert("不能为空😊");
        return;
      } 
      this.items.push(this.inputValue);
      this.inputValue = '';
    }
  }
}).mount('#root');

</script>
```

:::

<common-codepen-snippet title="TodoList" slug="ZEJgdzb" />





