---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vue3/
---



## local注册组件

```vue
<script setup>
// 直接导入即可
import ComponentA from './ComponentA.vue'
</script>
```



## computed

::: tip

接收一个函数，返回一个值。在typescript中它会自动进行类型推断

:::

```js
import {computed } from 'vue'
/**
 * 通过computed属性来控制数据
 */
const userListFilter = computed(()=>{ 
    let content = search.value.toLowerCase()
    // let res = userList.value.filter(user => user.name.toLowerCase().trim().includes(content))
    let res = userList.filter(user => user.name.toLowerCase().trim().includes(content))

    return res
})
```

应用

```vue
<li v-for="(userInfo,idx) in userListFilter"   // 直接应用
    :key="idx"
    class="userinfo">
    <img :src="userInfo.img" alt="">
    <div>
        <h4 class="username">{{userInfo.name}}</h4>
        <p class="location">{{userInfo.location}}</p>
    </div>
</li>
```



## v-if与v-for

::: tip

当v-if与v-for一起使用的时候，使用标签template标签包裹，vue在渲染的时候会自动去除

:::

[Live User Filter Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/32%20Live%20User%20Filter/refactor-by-vue)

```vue
<ol class="userlist" id="userlist">
        <li v-if="userList.length===0" class="userinfo">
          <h3>Loading...</h3>
        </li>
        <template v-else>  
            <li v-if="userListFilter.length===0" class="userinfo">
                <h3>Not Match...</h3>
            </li>
            <template v-else>
                <li v-for="(userInfo,idx) in userListFilter"
                :key="idx"
                class="userinfo">
                    <img :src="userInfo.img" alt="">
                    <div>
                        <h4 class="username">{{userInfo.name}}</h4>
                        <p class="location">{{userInfo.location}}</p>
                    </div>
                </li>
            </template>
        </template>
```



## ref vs  reactive

::: tip

两个都是响应式的api设计。但是他们有一些区别

:::

1. js普通的类型只能用ref，而不能使用reactive

```js
import {ref } from 'vue' 
const search = ref("")
 // const search = reactive("")  报错
```

2. 两者都能作用数组和对象，但是使用ts的声明类型的时候，ref需要使用Ref

```js
import {ref,reactive } from 'vue'
import type { Ref } from 'vue'  // ref方式需要额外引入Ref

const userList:Ref<UserInfo[]> = ref([])
const userList:UserInfo[] = reactive([])
```

3. 在js代码中，访问值的方式的不同ref方式需要携带`.value`的方式。**但是在html代码中访问时会自动拆箱，不需要`.value`** 

```js
userList.value.push(userInfo)  // ref方式访问数据方式
userList.push(userInfo)    // reactive访问数据方式
```

```html
<!-- search = ref("")  -->
<input type="text" 
          class="search" 
          v-model.trim="search"  <!-- 并不需要search.value -->    
          placeholder="Search...">
```



## onMounted

::: tip

接收一个函数

:::

```js
import {onMounted } from 'vue'

// 有async，是因为函数内部使用了await
onMounted(async ()=>{
    const res = await fetch(RAND_USER_API)
    const data = await res.json()// 解构
    let results = data.results as any[]
    results.forEach((user:any) => {
        let userInfo:UserInfo = {
            img: user.picture.large,
            name: user.name.first,
            location: user.location.city
        }

        // userList.value.push(userInfo)
        userList.push(userInfo)
    })
})
```



## watch

```js
import { watch } from 'vue'
// watch search这属性，val是新值
watch(search,(val)=>{
    console.log(val)
})
```

