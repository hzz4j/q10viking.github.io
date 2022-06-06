---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vue3/
typora-root-url: ..\.vuepress\public
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



## vue应用分析

createApp 表示创建一个Vue应用，传入的参数表示，这个应用最外层的组件，应该如何展示，

```js
app = Vue.createApp({...})
```

采用mvvm设计模式，m->model数据，v->view视图，vm->viewModel视图数据连接层

```js
// vm代表的就是vue应用的根组件
const vm = app.mount('#root');

// 可以通过vm.$data的方式来访问数据
vm.$data.inputValue
```

​										

![202111280616562](/images/vue3/202111280616562.png)

