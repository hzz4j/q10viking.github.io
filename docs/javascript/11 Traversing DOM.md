---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /javascript/
typora-root-url: ..\.vuepress\public
---

Traversing  the DOM

## 1  childNodes 

1. 包含文本节点

   ```js
   const list = document.querySelector('ul.collection');
   // Get child nodes
   let val = list.childNodes;
   ```

   

## 2 children 

1. 只包含元素节点

   ```js
   // Get children element nodes
   val = list.children;
   ```

----------



## 3 first Child

### 3.1 firstChild

```js
// First child
val = list.firstChild;
```

### 3.2 firstElementChild

```js
val = list.firstElementChild;
```



## 4 last child

### 4.1 lastChild

```js
// Last child
val = list.lastChild;
```

### 4.2 lastElementChild

```js
val = list.lastElementChild;
```



----------



## 5 *Count child elements*

```js
val = list.childElementCount;
```



## 6 *Get parent node*

```js
const listItem = document.querySelector('li.collection-item:first-child');
val = listItem.parentNode;
val = listItem.parentElement;
val = listItem.parentElement.parentElement;
```





## 7 *Get next sibling*

```js
val = listItem.nextSibling;
val = listItem.nextElementSibling
```



## 8 *Get prev sibling*

```js
val = listItem.previousSibling;
val = listItem.previousElementSibling;
```



## 9 node type

```js
val = list.childNodes[3].nodeType;
val = list.childNodes[0].nodeName;

1 - Element
2 - Attribute (deprecated)
3 - Text node
8 - Comment
9 - Document itself
10 - Doctype
```

