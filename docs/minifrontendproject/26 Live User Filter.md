---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## LIve User Filter

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/32%20Live%20User%20Filter/vanilla/dist/)

[vanilla Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/32%20Live%20User%20Filter/vanilla)

[Vue3+ts重构 Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/32%20Live%20User%20Filter/refactor-by-vue)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/32%20Live%20User%20Filter/vanilla/dist/"/>

## 解构

```tsx
/**
 * 获取用户列表
 * @returns 用户列表
 */
async function getUserList<T>(){
    const res = await fetch(RAND_USER_API)
    const {results} = await res.json() // 解构
    console.log(results);
    
    return results as T
}
```



## ts函数泛型

```tsx
// 定义
async function getUserList<T>(){
    const res = await fetch(RAND_USER_API)
    const {results} = await res.json() // 解构
    console.log(results);

    return results as T
}

// 使用
const userList = await getUserList<any[]>()

userList.forEach(user => {
    // 在进一步解析成类型数据
    let userInfo:UserInfo = {
        img: user.picture.large,
        name: user.name.first,
        location: user.location.city
    }
 })

```





## small标签

```html
<small class="subtitle">Search by name and/or location</small>
```

```scss
.subtitle{
    display: inline-block;
    margin: 10px 0 20px;  // small 标签得变成inline-block margin才会生效
}
```



## max-height&overflow-y理解

::: tip

用户列表设置高度采用max-height.当用户数量较少得时候,内容完全由内容撑开，当用户数量很多，超出容器得时候，max-height就会生效。这是overflow-y:auto；就会出现滚动条

:::

```scss
.userlist{
      max-height: 400px;
      overflow-y: auto;
}
```





## 最后一个元素没有下划线

```scss
.userinfo{
    display: flex;
    padding: 20px;

    // 下划线得设置
    &:not(:last-of-type){
        border-bottom: 1px solid $gray;
    }
}
```

