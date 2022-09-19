---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vue3/
typora-root-url: ..\.vuepress\public
---



## axios获取api

[https://www.typescriptlang.org/dt/search?search=axios](https://www.typescriptlang.org/dt/search?search=axios)

:::: code-group
::: code-group-item axios定义

```typescript
import { ref } from "vue"
import axios from 'axios'

function useURLLoader<T>(url: string){
    const result = ref<T | null>(null)
    const loading = ref(true)
    const loaded = ref(false)
    const error = ref(null)

    axios.get(url).then(rawData => {
        result.value = rawData.data
        loading.value = false
        loaded.value = true
    }).catch(e => {
        error.value = e
        loading.value = false
        loaded.value = true
    })

    return {
        result,
        loading,
        loaded,
        error
    }
}

export default useURLLoader
```

:::

::: code-group-item axios使用

```vue
<script setup lang="ts">
import useURLLoader from '../hooks/useURLLoader'

interface DogResult{
  message: string,
  status: string
}
const { result,loading } = useURLLoader<DogResult>('https://dog.ceo/api/breeds/image/random')

</script>

<template>
  <h2 v-if="loading">Loading</h2>
  <img :src="result?.message" width="500" height="500" v-else>
</template>

<style scoped>
</style>

```

:::

::::

