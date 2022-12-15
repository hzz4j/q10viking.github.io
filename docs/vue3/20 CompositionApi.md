---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vue3/
typora-root-url: ..\.vuepress\public
---



## local注册组件

```vue
<script setup lang="ts">
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

4. toRefs是保持reactive属性的响应性



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



## 标签规范

```vue
<script setup lang="ts">
  import IncrementCounter from './components/IncrementCounter.vue';
</script>

<!-- 这样方便看样式 -->
<template>
</template>
<style scoped lang="scss">

</style>
```



## Template Ref

[TypeScript with Composition API | Vue.js (vuejs.org)](https://vuejs.org/guide/typescript/composition-api.html#typing-template-refs)

**注意：名字要相同**

官网的建议

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```

自己的实战案例

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 定义
const tiktok = ref<HTMLParamElement | null>(null)

onMounted(() => {
  // 使用获取属性
  tiktok.value?.getAttribute("data-target")
})
</script>

<template>
  <div class="item">
        <font-awesome-icon icon="fa-brands fa-tiktok" class="icon"/>
        <p class="counter" 
            data-target="23000"
            ref="tiktok"></p>   <!-- 名字要相同 -->
        <span>Tiktok Fans</span>
      </div>
</template>
```



### 组件的Refs inside `v-for`

[Refs in v-for](https://vuejs.org/guide/essentials/template-refs.html#refs-inside-v-for)

It should be noted that the ref array does **not** guarantee the same order as the source array.（不能一定保证，但是目前的这个项目中，我得到的还是顺序的）

### defineExpose

[Ref On Component](https://vuejs.org/guide/essentials/template-refs.html#ref-on-component)

1. **reference will be that of a component instance**:
2. components using `<script setup>` are **private by default**: a parent component referencing a child component using `<script setup>` won't be able to access anything unless the child component chooses to expose a public interface using the `defineExpose` macro:
3. defineExpose是父组件拿到子组件的时候看到的样子

[Typing Component Template Refs](https://vuejs.org/guide/typescript/composition-api.html#typing-component-template-refs)

```tsx
// 官网的例子
import MyModal from './MyModal.vue'
const modal = ref<InstanceType<typeof MyModal> | null>(null)
```

我的例子

```vue
import Card from '@/components/Card.vue'
const cardRefs:Ref<InstanceType<typeof Card>[]> = ref([])

<Card v-for="(image,idx) in RANDIMAGES"
        :img-url="image"
        :idx="idx"
        :key="idx"
        :isClickable="isClickable"
        @active="handleActiveCard"
        ref="cardRefs">
</Card>
```

父组件MemoryCardGame看到的子组件Card.vue暴露的数据

```js
// Card.vue
/**
 * 定义子组件暴露的样子
 */
defineExpose({
  id: id.value,
  shakeCard,
  closeCard,
  callMeTest
})
```

![image-20220729124357315](/images/minifrontendproject/image-20220729124357315.png)

## v-html 

[Event KeybordCodes](https://q10viking.github.io/minifrontendproject/29%20Event%20KeyCodes.html)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/34%20Event%20KeyCodes/vite-project/dist/"/>

### 不能有内容

```js
<template>
    <div class="container" v-html="content">
        <div class="msg">
            Press any key to get the keyCode
        </div>
    </div>
</template>
```

更改为

```vue
<template>
    <div v-if="content.length" class="container" v-html="content">
    </div>
    <div v-else class="container" >
        <div class="msg">
            Press any key to get the keyCode
        </div>
    </div>
</template>
```





### :deep() inner-selector

::: tip

使用v-html样式不生效的问题.[vue3 api v-html](https://vuejs.org/api/built-in-directives.html#v-html)

官网的描述：In `Single-File Components`, `scoped` styles will not apply to content inside `v-html`, because that HTML is not processed by Vue's template compiler.

:::

scss中添加`:deep()` [javascript - CSS styles not being applied to HTML within a Vue Component - Stack Overflow](https://stackoverflow.com/questions/48331383/css-styles-not-being-applied-to-html-within-a-vue-component/73122233#73122233)

```vue
<script setup lang="ts">

import {onMounted,ref } from 'vue'
const content = ref("")

onMounted(()=>{
    window.addEventListener('keydown',event =>{
        content.value = `
            <div class="key">
                <span class="content">${event.keyCode}</span>
                <small>event.keyCode</small>
            </div>
        `
    })
})

</script>

<template>
    <div class="container" v-html="content">
    </div>
</template>

<style lang="scss" scoped>  <!-- 不需要添加module -->
    
.container{
    display: flex;
	<!-- v-html 加入的html，只需要在最外层的容器添加:deep() -->
    :deep(.key){
        font-weight: bold;
        
        .content{
            font-size: 1.5rem;
        }
        
        small{
            font-size: 14px;
        }
    }
}
</style>
```



----------

### 深层次修改组件样式

**除了上面v-html应用deep之外，修改内部组件的样式也可用**

[css - How do I use /deep/ or >>> or ::v-deep in Vue.js? - Stack Overflow](https://stackoverflow.com/questions/48032006/how-do-i-use-deep-or-or-v-deep-in-vue-js)

In Vue 2:

- The `/deep/` syntax is deprecated
- Use `::v-deep` with Sass, use `>>>` without Sass

In Vue 3:

- `::v-deep .child-class` is deprecated in favor of `:deep(.child-class)`
- The `::v-` prefix is deprecated in favor of `:`
- The `>>>` syntax is deprecated
- The `/deep/` syntax is deprecated
- There are new `:slotted` and `:global` selectors

With every version/syntax, the `<style>` tag for this component must be `scoped`:

```scss
::v-deep .prev {
    left: 27rem;
}
// scss
:deep(.prev) {
    left: 27rem;
}
```





## Props

### 普通定义

```tsx
// 不需要导入
// import { defineProps } from 'vue'
defineProps(['idx'])
```

### 带类型

```tsx
defineProps({
    idx:Number
})

// 在使用的时候{{idx+1}}
// editor会报错：对象可能为“未定义”。ts(2532)
// 这样就需要校验，提前类型类型检查，防止报错
```

### 带校验

```tsx
defineProps({
    idx: {
        type: Number,
        required: true
    }
})
```

### js访问属性

```js
const props = defineProps({
    idx: {
        type: Number,
        required: true
    },
    book: {
        type:String,
        required: true
    }
})

function dragStart(event:DragEvent){
    // 访问属性的方式
    event.dataTransfer?.setData("text/plain", `${props.idx}`)
    console.log("start");
}
```



### props as local data

[**child component wants to use it as a local data property**](https://vuejs.org/guide/components/props.html#one-way-data-flow)

```js
const props = defineProps({
    idx:{
      type:Number,
      required: true
    }
})
const id = ref(props.idx)
```



### 默认值

```tsx
defineProps({
  unit: {
    type: String,
    default: "¥",
  },
})
```

带类型

```tsx
interface Props {
  mainTitle?: string
  subTitle?: string
}

withDefaults(defineProps<Props>(), {
  mainTitle: "",
  subTitle: "",
})
```



## Events



[Event Modifiers](https://vuejs.org/guide/essentials/event-handling.html#event-modifiers)

```vue
<li class="book"
        :data-idx="idx" 
        :data-counter="counter"
        @dragenter="dragEnter"
        @dragover.prevent="dragOver"   <!-- 使用.prevent修饰符，event.preventDefault() -->
        @dragleave="dragLeave">
```



### 定义事件

[Sortable List demo](https://q10viking.github.io/minifrontendproject/32%20Sorted%20LIst.html)

 [typing-component-emits](https://vuejs.org/guide/typescript/composition-api.html#typing-component-emits)

```tsx
// 普通定义
// defineEmits(['change'])
// 定义事件，并带有参数
const emit = defineEmits<{
    (e:'change',srcIdx:number,targetIdx:number):void  // 方法签名
    }>()
```

### 发送事件

```tsx
function dragDrop(event:DragEvent){
    const srcIdxStr = event.dataTransfer?.getData("text/plain")
    let srcIdx = 0
    if(typeof srcIdxStr === 'string'){
        srcIdx = parseInt(srcIdxStr)
        console.log(srcIdx,props.idx)
        emit("change",srcIdx,props.idx) // 发送数据  
    }
    
    console.log("drag drop");
}
```

### 在父组件接受事件

```vue
<template>
<ListItem v-for="(book,idx) in BOOKS"
        :book="book"
        :idx="idx"
        :key="idx"
        @change="swap">  <!-- 接受事件交给swap处理 -->
</ListItem>
<template>
<script setup lang="ts">
    
function swap(srcIdx:number,targetIdx:number){
  console.log("parent component receive",srcIdx,targetIdx);
}
</script>
```



## class样式

[Sortable List demo](https://q10viking.github.io/minifrontendproject/32%20Sorted%20LIst.html)

### 添加class

::: tip

使用isActive,hasError语义很明确

:::

```vue
<template>
<li class="book" :class="{hover: isActive}" @dragenter="dragEnter"></li>
</template>
<script setup lang="ts">
const isActive = ref(false)
function dragEnter(){
    isActive.value = true // 添加hover
    // 被渲染成,class会自动合并
    // <li class="book hover"></li>
}
</script>

```



### 条件检查添加样式

Vue支持属性向下传递[Fallthrough Attributes](https://vuejs.org/guide/components/attrs.html),在这里ListItem设置的class会条件在ListItem的根标签上，这里案例时Li标签

```vue
<template>
<ListItem v-for="(book,idx) in RANDOM_BOOKS"
        :book="book"
        :idx="idx"
        :key="idx"
        :class="checked ? checkedResult[idx]? 'right':'error' :''"  <!--  条件检查来设置样式 -->
        @change="swap">
</ListItem>
</template>
```

相关的script

```vue
<script setup lang="ts">
const checkedResult:boolean[] = reactive([])
const checked = ref(false)

function checkOrder(){
  for(let i = 0; i < BOOKS.length;i++){
    checkedResult[i] = BOOKS[i] === RANDOM_BOOKS[i]
  }
  checked.value = true   // 打开设置样式的开关
}
</script>
```

