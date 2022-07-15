---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---



## Modal Menu Slider

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/08%20modal%20menu%20slider/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/08%20modal%20menu%20slider)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/08%20modal%20menu%20slider/"/>



## 笔记

### 素材网站

[font-awesome - Libraries - cdnjs - The #1 free and open source CDN built to make life easier for developers](https://cdnjs.com/libraries/font-awesome)

[Random User Generator | Home](https://randomuser.me/)

## vscode随机字符快捷

```
Lorem40
```



### Menu slider

::: tip

1. fixed定位
2. 动画效果

:::

#### 头像

```html
<!-- 用一个div包裹起来 -->
<div class="logo">
    <img src="https://avatars.githubusercontent.com/u/26297672" alt="">
</div>
```

圆形头像

```css
/* 用一个容器包裹的好处 */
nav .logo{
    padding: 30px 0;
    text-align: center;
}

nav .logo img{
    height: 75px;
    width: 75px;
    border-radius: 50%;
}
```



#### 菜单处理

::: details 查看代码

```css
/* --------------------侧边栏处理----------------------------- */

nav{
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100vh;
    z-index: 100;
    background-color: var(--primary-color);
    color: #fff;
    /* 渐变效果先隐藏 */
    transform: translateX(-100%);
}

/* 用一个容器包裹的好处 */
nav .logo{
    padding: 30px 0;
    text-align: center;
}

nav .logo img{
    height: 75px;
    width: 75px;
    border-radius: 50%;
}


nav ul{
    margin: 0;
    padding: 0;
    list-style-type: none; /* 去除点 */
}

nav ul li{
    padding: 20px;
    border-bottom: 2px solid rgba(200, 200, 200, 0.5);
}

/* 添加第一条横线 */
nav ul li:first-of-type{
    border-top: 2px solid rgba(200, 200, 200, 0.5);
}

nav ul li a{
    color: #fff;
    text-decoration: none;
}

nav ul li a:hover{
    text-decoration: underline;
}
```



#### 侧边栏的展示

::: tip

通过transform: translateX来实现

:::

```css
body{
    margin: 0;
    transition: transform 0.3s ease; /*过度效果*/
}

body.show-nav{
    transform: translateX(200px); /*对应nav的width*/
}

/* --------------------侧边栏处理----------------------------- */

nav{
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100vh;
    z-index: 100;
    background-color: var(--primary-color);
    color: #fff;
    /* 渐变效果先隐藏 */
    transform: translateX(-100%);
}
```

js代码处理只需要添加一个css属性

```js
const toggle = document.getElementById("toggle")

// 展示nav
toggle.addEventListener('click',e =>
    document.body.classList.toggle("show-nav"))  // 使用toggle
```

:::



#### 侧边栏关闭

::: tip

当点击其他地方时能够关闭侧边栏

:::



```js
function closeNav(e){
    if (
        document.body.classList.contains('show-nav') &&
        e.target !== toggle  &&
        !toggle.contains(e.target) &&   // 处理toggle的按钮
        e.target !== navbar &&
        !navbar.contains(e.target)
      ) {
        console.log(e.target === toggle)
        document.body.classList.toggle('show-nav');
        document.body.removeEventListener('click', closeNav);
      } else if (!document.body.classList.contains('show-nav')) {
        document.body.removeEventListener('click', closeNav);
      }
}

// 展示nav
toggle.addEventListener('click',e => {
    document.body.classList.toggle("show-nav")
    document.addEventListener('click',closeNav)
})

```



### Modal遮罩

::: tip

就是一个div块，只不过采用了定位的技术

:::

#### 展示

```css
.modal-container{
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
```

```css
/* 遮罩中一般都有一个输入框 */
.modal{
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    max-width: 100%;
    border-radius: 5px;
}
```

```css
/* 关闭按钮去除背景色 */
.close-btn{
    position: absolute;
    top: 0;
    right: 0;
    font-size: 25px;
    background-color: transparent; /* 去除背景色*/
}
```

#### 关闭遮罩

```js
// 关闭遮罩
close.addEventListener('click',()=>{
    modal.classList.remove('show-modal')
})

// 点击遮罩外的地方关闭遮罩
window.addEventListener('click', e => 
    e.target === modal ? modal.classList.remove('show-modal'):false)
```

#### 遮罩中的弹窗动画

```css
/* 遮罩中一般都有一个输入框 */
.modal{
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    max-width: 100%;
    border-radius: 5px;
    animation-name: modalopen;
    animation-duration: var(--modal-duration);
}

/* 动画效果 */
@keyframes modalopen {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
```



### 登录表单类型

::: details 查看代码

```html
<form class="modal-form">
    <div>
        <label for="name">Name</label>
        <input 
               type="text"
               id="name" 
               placeholder="Enter Name" 
               class="form-input" />
    </div>
    <div>
        <label for="email">Email</label>
        <input 
               type="email"
               id="name" 
               placeholder="Enter Email" 
               class="form-input" />
    </div>
    <div>
        <label for="password">Password</label>
        <input 
               type="password"
               id="name" 
               placeholder="Enter Password" 
               class="form-input" />
    </div>
    <div>
        <label for="password2">Confirm Password</label>
        <input 
               type="password"
               id="name" 
               placeholder="Enter Password" 
               class="form-input" />
    </div>
    <input type="submit" value="Submit">
</form>
```

:::

### 内容

::: tip

处理屏幕小时的内容宽度，防止出现滑块滚动条

:::

```css
.container{
    margin: 0 auto;
    padding: 15px;
    width: 800px;
    max-width: 100%; /*当屏幕小于800px时，就以当前大小为准，而不是800px*/
}
```

