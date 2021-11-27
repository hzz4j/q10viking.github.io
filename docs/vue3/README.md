---
prev:
  text: Back To 目录
  link: /topicNav/
---



::: tip 提示
学习 vue3之旅
:::


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