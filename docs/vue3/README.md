---
prev:
  text: Back To 目录
  link: /topicNav/
---



::: tip 提示
学习 vue3之旅  [介绍 | Vue.js (vuejs.org)](https://v3.cn.vuejs.org/guide/introduction.html)

使用vuepress博客仿照vue的官网，进行交互式学习

:::

![image (1)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112020913845.jpg)


<div id="root">
    {{msg}}
    <button @click="greet">Geet！</button>
</div>


::: details 点击查看代码

```js
<div id="root">
    {{msg}}
    <button @click="greet">Geet！</button>
</div>

<script>

export default {
    setup(){
        const msg = 'Hello Vue'
        return {
            msg
        }
    },
    methods: {
        greet(e){
            alert('😁'+this.msg)
        }
    }
}
</script>
```

:::







<script>

export default {
    setup(){
        const msg = 'Hello Vue'
        return {
            msg
        }
    },
    methods: {
        greet(e){
            alert('😁'+this.msg)
        }
    }
}
</script>



## 学习项目

[VueCook (liuwenxing1996.github.io)](https://liuwenxing1996.github.io/vue-cook/)

