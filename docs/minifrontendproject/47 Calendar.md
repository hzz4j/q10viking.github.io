---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Calendar

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/50%20Calendar/dist/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/50%20Calendar)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/50%20Calendar/dist/"/>



## 日期的获取

[Date - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

- 尤其是一个这天是星期几，有有相关的API可以调用

```tsx

let date = new Date();
// 年,月
let [currentYear, currentMonth] = [date.getFullYear(), date.getMonth()];

// render days
function renderDays() {
  // 获取到这个月的1号是星期几
  let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  // 获取到前一个月的总天数
  let lastDateOfPreMonth = new Date(currentYear, currentMonth, 0).getDate();
  // 获取这个月总共的天数
  let totalDateOfCurrentMonth = new Date(
    currentMonth,
    currentMonth + 1,
    0
  ).getDate();
  // 获取这个月最后一天是星期几
  // let lastDayOfCurrentMonth = new Date(
  //   currentYear,
  //   currentMonth,
  //   totalDateOfCurrentMonth
  // ).getDay();

  let liTag = "";
  let count = 42;
  // 前一个月处理好了
  for (let i = 1; i < firstDayOfMonth; i++, count--) {
    liTag += `<li class="inactive">${lastDateOfPreMonth - i + 1}</li>`;
  }

  // 当前月很容易
  for (let i = 1; i <= totalDateOfCurrentMonth; i++, count--) {
    let active =
      currentYear === new Date().getFullYear() &&
      currentMonth === new Date().getMonth() &&
      i === new Date().getDate();
    liTag += `<li class="${active ? "active" : ""}">${i}</li>`;
  }

  // 处理下一个月
  for (let i = 1; i <= count; i++) {
    liTag += `<li class="inactive">${i}</li>`;
  }

  daysEl.innerHTML = liTag;
}
```

