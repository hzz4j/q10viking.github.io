---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---



## Toast Notification

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/19%20Toast%20Notification/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/19%20Toast%20Notification)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/19%20Toast%20Notification/"/>





## 笔记

::: tip

定位加元素创建，其中message的类型颜色展示值得借鉴

:::



```js
const types = [
    'info',
    'error',
    'success'
]

function showNotification(message = '',type = ''){
    const div = document.createElement('div')
    div.classList.add('toast')
    div.classList.add(type ? type : getRandomType()) // 添加不同的类型

    div.innerText = message ? message : getRandomMsg()
    toastsContainer.appendChild(div)

    setTimeout(() => {
        div.remove()
    }, 3000);
}
```

对应的css

```css
.toast.info{
    color: orange;
}
.toast.error{
    color: red;
}
.toast.success{
    color: green;
}
```

