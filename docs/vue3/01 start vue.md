## Quick start Vue

::: tip

Quick start Vue Project

:::

引入CDN

```js
  <script src="https://unpkg.com/vue@next"></script>
```

浏览器安装**Vue.js devtools**扩展

![image (2)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112021044125.jpg)



## Proxy

```javascript {11}
// Vue Model
const vm = Vue.createApp({
  data() {
    return {
      msg: "Hello Vue",
    };
  },
}).mount("#app");

setTimeout(() => {
    vm.msg = "Learning Vue FrameWork"
}, 2000);
```

![image (3)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112021057333.jpg)