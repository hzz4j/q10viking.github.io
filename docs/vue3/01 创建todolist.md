---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vue3/
---



## todoList

融合了一下vue的知识点

1. vue的数据驱动
2. 组件封装

> vue引入到普通页面的方式

::: details 点击查看代码

```js {2,33,38}

const app = Vue.createApp({
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
        <todo-item v-for="(item,index) of items"
          :content="item"
          :index="index"
        />
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
});

app.component('todo-item',{
  props: ['content','index'],
  template: `<li>{{index}} ---  {{content}}</li>`
});

app.mount('#root');
```

:::

<common-codepen-snippet title="TodoList" slug="ZEJgdzb" />





