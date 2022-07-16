---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /javascript/
typora-root-url: ..\.vuepress\public
---

## 1 DOM 常用属性

```js
let val;

val = document;
val = document.all;
val = document.all[2];
val = document.all.length;
val = document.head;
val = document.body;
val = document.doctype;
val = document.domain;
val = document.URL;
val = document.characterSet;
val = document.contentType;


val = document.forms;
val = document.forms[0];
val = document.forms[0].id;
val = document.forms[0].method;
val = document.forms[0].action;


val = document.links;
val = document.links[0];
val = document.links[0].id;
val = document.links[0].className;  // className
val = document.links[0].classList[0];	// classList

val = document.images;

val = document.scripts;
val = document.scripts[2].getAttribute('src');	// getAttribute

```



## 2 HTMLCollection转化为Array



```js
let scripts = document.scripts;

let scriptsArr = Array.from(scripts);

scriptsArr.forEach(function(script) {
  console.log(script.getAttribute('src'));
});

```

