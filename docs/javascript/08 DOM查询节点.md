---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /javascript/
typora-root-url: ..\.vuepress\public
---

## 1 查询单个节点



### 1.1 getElementById

```js
document.getElementById('task-title').id
```



### 1.2  querySelector

```js
console.log(document.querySelector('#task-title'));
console.log(document.querySelector('.card-title'));
console.log(document.querySelector('h5'));

document.querySelector('li').style.color = 'red';
document.querySelector('ul li').style.color = 'blue';

document.querySelector('li:last-child').style.color = 'red';
document.querySelector('li:nth-child(3)').style.color = 'yellow';
document.querySelector('li:nth-child(4)').textContent = 'Hello World';
document.querySelector('li:nth-child(odd)').style.background = '#ccc';
document.querySelector('li:nth-child(even)').style.background = '#f4f4f4';
```



----------



## 2 查询多个节点



### 2.1 getElementsByTagName

1. 返回的是HTMLCollection

```js
let lis = document.getElementsByTagName('li');

// Conver HTML Collection into array
lis = Array.from(lis);

lis.reverse();

lis.forEach(function(li, index){
  console.log(li.className);
  li.textContent = `${index}: Hello`;
});
```



### 2.2 getElementsByClassName

1. 返回的是HTMLCollection

```js
const listItems = document.querySelector('ul').getElementsByClassName('collection-item');

console.log(listItems);
```



### 2.3 querySelectorAll

1. 返回的是NodeList

```javascript
const items = document.querySelectorAll('ul.collection li.collection-item');

items.forEach(function(item, index){
    item.textContent = `${index}: Hello`;
});
//	选择所有基数节点
const liOdd = document.querySelectorAll('li:nth-child(odd)');
const liEven = document.querySelectorAll('li:nth-child(even)');

liOdd.forEach(function(li, index){
  li.style.background = '#ccc';
});

for(let i = 0; i < liEven.length; i++){
  liEven[i].style.background = '#f4f4f4';
}
```



#### 2.3.1 过滤节点

在界面UI上只显示查询的关键词

```js
function filterTask(e){
    const text = e.target.value.toLowerCase();
    
    document.querySelectorAll('.collection-item').forEach(function(task){
        const item = task.firstChild.textContent;
        
        if(item.indexOf(text) !== -1){
            task.style.display = 'block';	//	显示
        }else{
            task.style.display = 'none';	//	隐藏
        }
    })
}
```

