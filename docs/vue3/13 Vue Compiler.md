---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vue3/
---



## 2 Versions of Vue

- One version WITH the compiler
- One version WITHOUT the compiler

[runtime-compiler-vs-runtime-only](https://v3.vuejs.org/guide/installation.html#runtime-compiler-vs-runtime-only)

If you need to compile templates on the client (e.g. passing a string to the template option, or mounting to an element using its in-DOM HTML as the template), you will need the compiler and thus the full build:

```js
// this requires the compiler
Vue.createApp({
  template: '<div>{{ hi }}</div>'
})

// this does not
Vue.createApp({
  render() {
    return Vue.h('div', {}, this.hi)
  }
})
```

