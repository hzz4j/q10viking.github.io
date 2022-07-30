---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Code Show


[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/39%20valentine/vanilla/dist/)

[vanilla Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/39%20valentine/vanilla)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/39%20valentine/vanilla/dist/"/>


## 原理

::: tip

可以在`<style>`DOM元素中使用`innerHTML`

:::



## scrollTop

```js
const app = document.getElementById('app')! as HTMLDivElement
app.scrollTop = 100  // 当内容超出盒子出现滚动条的时候，可以通过js控制滚动的高度
```



## Prism语法高亮

https://prismjs.com/

安装

::: tip

vite+vanilla+ts

:::

```
npm i prismjs
npm i -D @types/prismjs
```



```tsx
// 参考 https://gist.github.com/awran5/b2fb99b91d279b700aff6d3a0f1f223d
import Prism from 'prismjs'
import 'prismjs/components/prism-java' // Language
import 'prismjs/themes/prism-okaidia.css' // Theme

let code = Prism.highlight(codesample,Prism.languages.java,"java")
```



### 代码为什么这么整齐

::: tip

使用 pre 标签 对空行和 空格 进行控制，渲染的时候，代码怎么写的，就是怎么渲染

:::



```html
<!-- prism 会在处理代码后，在代码中应用language-xxx的样式 -->
<pre>
   <code class="language-java">
   </code>
</pre>
<pre>
    <code class="language-javascript">
    </code>
</pre>
<pre>
    <code class="language-css">
    </code>
</pre>
```

js代码

```tsx
import './style.css'
import { codesample } from './ts/codesample'
import Prism from 'prismjs'
import 'prismjs/components/prism-java' // Language
import 'prismjs/themes/prism-okaidia.css' // Theme


const codes = document.querySelectorAll<HTMLElement>('code')!

const PrismLanguages = [Prism.languages.java,Prism.languages.javascript,Prism.languages.css]
const langTypes = ['java','javascript','css']

codes.forEach((code,idx) => {
  code.innerHTML = Prism.highlight(codesample[idx],PrismLanguages[idx],langTypes[idx])
  return
})
```

渲染后的结果

![image-20220730131649956](/images/minifrontendproject/image-20220730131649956.png)

![image-20220730131741091](/images/minifrontendproject/image-20220730131741091.png)



## 小爱心是怎么撒下来的？

🎉🎉✨✨✨🎊🎊🎈🎈🎈

::: tip

通过绝对定位确定，开始的位置，结束的位置，通过transition过渡效果来实现移动的

:::

```scss
/*庆祝*/
    .celebrate{
        position: absolute;
        font-size: 2rem;
        top: 10px;
        left: 10px;
        transition: all 3s linear;
    }

    .code-box:hover ~.celebrate{
        top: 500px;
        left: 500px;
    }
```



### window

```js
const { innerWidth, innerHeight } = window;
```



## Promise的应用

```js
function handleCode(idx:number,code:string,isCss:boolean){  // 返回的是个promise
  let line = 0
  const showCode = (index:number) => new Promise(resolve => {
      // 代码输出速度
      setTimeout(()=> resolve(showCode(++index)),30)
    }else{
      console.log("finished");
      resolve(null)
    }
  })
  return showCode(0)  // 调用
}
```





## 参考

[yacan8/valentine: 七夕快乐！😝 (github.com)](https://github.com/yacan8/valentine)
