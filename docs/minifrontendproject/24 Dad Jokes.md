---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Dad Jokes

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/30%20Dad%20Jokes/dist/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/30%20Dad%20Jokes)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/30%20Dad%20Jokes/dist/"/>



## fetch api

::: tip

主要学习如何从后端获取数据

:::

抽离文件

```tsx
const API_URL =  "https://icanhazdadjoke.com"
const config = {
    headers: {
        Accept: 'application/json'
    }
}

export {
    API_URL,
    config
}
```



```tsx
import { API_URL,config } from './ts/config'
async function getJoke(){
  const resp = await fetch(API_URL,config)
  const data = await resp.json() as Joke
  jokeDiv.innerHTML = data.joke
}
```



## 素材

```java
https://icanhazdadjoke.com
```

