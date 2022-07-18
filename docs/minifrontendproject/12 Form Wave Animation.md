---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---



## Form Wave Animation

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/16%20Form%20Wave%20Animation/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/16%20Form%20Wave%20Animation)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/16%20Form%20Wave%20Animation/"/>





## 标签波浪

::: tip

利用**transition-delay**属性

:::

```js
const labels = document.querySelectorAll('.form-control label')

/**
 将<label>Email</lable>变成
 <label>
    <span style="transition-delay:0ms">E</span>
    <span style="transition-delay:50ms">a</span>
    <span style="transition-delay:150ms">m</span>
    <span style="transition-delay:200ms">i</span>
    <span style="transition-delay:250ms">l</span>
 </label>
 */

labels.forEach(label => {
    label.innerHTML = label.innerText
        .split('')
        .map((letter,idx) => `<span style='transition-delay:${idx * 50}ms'>${letter}</span>`)
        .join('')
})


```



```css
.form-control label span{
    display: inline-block;
    min-width: 5px;
    font-size: 18px;
    transition: 0.3s ease; /*动画*/
}

.form-control input:focus + label span,
.form-control input:valid + label span{
    color: lightseagreen;
    transform: translateY(-30px);
} 
```

::: tip

有内容后如何不再下降通过valid属性控制

:::



```html
<!-- 添加required属性 -->
<input type="text" required>
<input type="password" required>
```



```css
/*通过valid伪类标记状态*/
.form-control input:valid{

}
```

