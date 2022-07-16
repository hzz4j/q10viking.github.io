---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /javascript/
typora-root-url: ..\.vuepress\public
---

## 1 Math

### 1. floor 地板

### 2. ceil 天花板

### 3. random

### 4. 玩法：产生指定范围随机数

> 产生[2-8]

```js
let arr = []

while (arr.length < 7) {
    // 产生[2,8]的随机数
    let num = Math.floor(Math.random() * 7) + 2;
    if (arr.indexOf(num) === -1) {
        arr.push(num)
    }
}
// 7,8,5,3,4,2,6
console.log(arr.toString());


```



## 2 Date

### 2.1 getFullYear

### 2.2 getMonth 

#### 2.2.1 值为0到11

#### 2.2.2 0表示1月份

### 2.3 getDate 获取日

### 2.4 getHours

### 2.6 getMinutes

### 2.7 getSeconds

### 2.8 getDay 获取星期

#### 2.8.1 值为0到6

#### 2.8.2  0为星期日

### 2.9 玩法：拼接成指定时间格式⭐⭐

```js
let date = new Date()

let year = date.getFullYear();
//月份为0-11，加一处理
let month = date.getMonth() + 1;
let day = date.getDate();
let hours = date.getHours();
let minutes = date.getMinutes();
let seconds = date.getSeconds();
// 星期0-6,0表示星期日
let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
let week = weeks[date.getDay()];

// ("0"+hours).slice(-2) 主要是转化为两位数，7->07
let result = `${year}年${month}月${day}日 ${("0" + hours).slice(-2)}::${("0" + minutes).slice(-2)}::${("0" + seconds).slice(-2)} ${week}`;
// 2020年10月15日 19::14::01 星期四
console.log(result)
```



### 2.10 字符串到日期

```js
let d = new Date("2019/12/12")
```



### 2.11 玩法：秒杀倒计时⭐⭐

![](/images/javascript/timecalc202010152012.gif)

```javascript
// 截至时间
let endTime = new Date("2020/11/11 00:00:00");

function calcTime() {
    let d = document.getElementById("box");
    // 当前时间
    let nowTime = new Date();
    // 转化为相差得秒数
    let diff = (endTime.getTime() - nowTime.getTime()) / 1000;

    // 剩余的天
    let day = parseInt(diff / (24 * 60 * 60));
    let minutes = parseInt((diff % (24 * 60 * 60)) / 3600);
    let seconds = parseInt(diff % 60);

    let result = `距离2020/11/11 还剩${day}天${minutes}分${seconds}秒`;

    console.log(d, result)
    d.innerHTML = result
    console.log(result);
}

setInterval(calcTime, 1000);
```

### 2.12 计算年龄

```js
function calculateAge(birthDay){
	const diff = Date.now() - birthDay;
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
```

