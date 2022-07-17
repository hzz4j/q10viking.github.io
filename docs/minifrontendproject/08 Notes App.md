---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---



## Notes App

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/12%20Notes%20App/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/12%20Notes%20App)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/12%20Notes%20App/"/>





## font awsome icons

[Icons | Font Awesome](https://fontawesome.com/icons)

## cdnjs markdown语法解析

[cdnjs - The #1 free and open source CDN built to make life easier for developers](https://cdnjs.com/)

```html
marked @ 4.0.18 28k
A markdown parser built for speed
```

```js
marked.parse('')
```



## textarea

### 禁止改变大小

```css
resize: none; /*disables resizing behavior for textarea elements:*/
```



## 批量添加元素

```js
const note = document.createElement('div')
note.classList.add("note")
note.innerHTML = `
        <div class="tools">
            <button class="edit ${text ? '': 'hidden'}" title="编辑" ><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="save ${text ? 'hidden': ''}" title="保存"><i class="fa-solid fa-floppy-disk"></i></button>
            <button class="delete" title="删除"><i class="fa-solid fa-trash"></i></button>

        </div>
        <div class="main ${text ? '': 'hidden'}"></div>
        <textarea class="${text ? 'hidden': ''}"></textarea>
    `
document.body.appendChild(note)
```

## 删除元素

```
note.remove()
```



## focus输入框

```js
textArea.focus() // focus 新的textarea
```

## 获取textarea的内容

```js
textArea.value
```



## flex的使用

### flex-wrap使用

::: tip

布局

:::

```css
body{
    display: flex;
    flex-wrap: wrap;
}
```

### justify-content使用

::: tip

编辑，删除按钮的使用

:::

```css
.note .tools{
    display: flex;
    justify-content: flex-end; /*flex end*/
    background-color: var(--second-color);
    padding: 0.5rem;
}
```





