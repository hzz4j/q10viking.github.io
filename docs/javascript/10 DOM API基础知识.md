---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /javascript/
typora-root-url: ..\.vuepress\public
---

## 1 元素的标准属性

### 1.1 innerHTML

### 1.2(1) innerText

一般用于设置值

### 1.2(2) textContent

一般用于获取

### 1.3 表单的属性

#### 1.3.1 checkbox属性checked

```js
checkbox.checked = true or false
```

#### 1.3.2 value

#### 1.3.3 disabled

#### 1.3.4 type



### 1.4 src

#### 1.4.1 img图片的src

## 2 元素的非标准属性(自定义）

```html
<a href="#" index="1"></a>
```

### 2.1 getAttribute

### 2.2 setAttribute 

### 2.3  显示添加属性和动态添加属性

#### 2.3.1 setAttribute添加

1. 会出现在html文档显示中
2. 只能通过getAttribute获取值

#### 2.3.2 this.属性

1. 不会出现在html文档显示中
2. 只能通过this.属性获取值

#### 2.3.3 推荐使用setAttribute操作⭐

 



## 2 操作元素样式

### 2.1 style

1. 可以设置所有css属性值，包括定位等

#### 2.1.2 with表达式

```js
el.style.width = 30px;
el.style.height = 30px;
el.style.backgroundColor = red;

// 用with表达式简写
with(el.style){
	width = 30px;
	height = 30px;
	backgroundColor=red;
}
```

### 2.2 className

#### 2.2.1 直接覆盖元素样式

```js
el.className = "className"
```

