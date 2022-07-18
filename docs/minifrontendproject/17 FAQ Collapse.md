---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---

## FAQ Collapse

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/21%20FAQ%20Collapse/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/21%20FAQ%20Collapse)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/21%20FAQ%20Collapse/"/>

## active样式的子选择器

```css
.faq .faq-text{
    display: none;
}

.faq.active .faq-text{
    display: block;
}
```



## css样式处理Font  Awesome Icon code

```css
/*使用*/
.faq.active::before,
.faq.active::after{
    content: "\f075";
    font-family: 'Font Awesome 6 Free';
}
```

具体样式使用

```css
/* 处理Font Awosome css */
.faq.active::before,
.faq.active::after{
    content: "\f075";
    font-family: 'Font Awesome 6 Free';
    color: #2ecc71;
    font-size: 7rem;
    position: absolute;
    opacity: 0.2;
    top: 20px;
    left: 20px;
    z-index: 0;
}

.faq.active::before{
    color: #3498db;
    top: -30px;
    left: -30px;
    transform: rotateY(180deg);
}
```



## 获取父节点

::: tip

1. parentElement
2. parentNode

:::

```js
const faqToggleBtns = document.querySelectorAll('.faq-toggle')

faqToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // btn.parentElement.classList.toggle('active')
        btn.parentNode.classList.toggle('active')
    })
})
```

