---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /vue3/
---



## Virtual DOM

::: tip

The virtual DOM is JavaScript object.It is a lightweight copy of the actual DOM.It's faster to perform comparisons and updates on the Virtual DOM than it is to perform them on the actual DOM

:::

**Vue Compiling the Template**

![image (10)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112031037698.jpg)

**Updates using the DOM**

![image (12)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112031045602.jpg)



**Updates using the Virtual DOM**

![image (11)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112031044795.jpg)



## Reactivity with Proxies

::: tip

Vue使用Proxy的方式来动态更新数据

:::



:::: code-group
::: code-group-item Javascript

```js {5-10}
const data = {
  msg: "Hello Reactivity",
};

const proxy = new Proxy(data, {
  set(target, key, value) {
    document.getElementById("app").textContent = value;
    target[key] = value;
  },
});

proxy.msg = "Change Reactivity"
console.log(proxy);

```

:::
::: code-group-item html

```html
<div id="app"></div>
```

:::
::::