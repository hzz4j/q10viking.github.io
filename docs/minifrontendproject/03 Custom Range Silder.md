---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---

## Custom Range Slider

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/07%20custom%20range%20slider)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/07%20custom%20range%20slider/"/>

## 笔记

::: tip

input标签的处理

:::

1. 选择input滑块的选择器

```css
input[type = 'range']::-webkit-slider-runnable-track{
    appearance: none;
    background-color: purple;
    border-radius: 4px;
    width: 100%;
    height: 10px;
}

input[type = 'range']::-webkit-slider-thumb{
    appearance: none;
    height: 24px;
    width: 24px;
    background-color: #fff;
    border-radius: 50%;
    border: 1px solid purple;
    margin-top: -7px;
    cursor: pointer;
}
```

2. js处理标签动态跟随

```js
const range = document.getElementById('range');

range.addEventListener('input', e => {
    const value = +e.target.value;
    // 获取下一个邻近元素
    const label = e.target.nextElementSibling
    // 使用内置的函数获取属性 
    const range_width = getComputedStyle(e.target).getPropertyValue('width')
    const label_width = getComputedStyle(label).getPropertyValue('width')
    
    const num_range_width = +range_width.substring(0,range_width.length - 2)
    const num_label_width = +label_width.substring(0,label_width.length - 2)
    const max = +e.target.max
    const min = +e.target.min

    // calcute left
    // const left = value * (num_range_width / max) - num_label_width / 2
    const left = value * (num_range_width / max) - num_label_width / 2 + scale(value, min, max, 10, -10)
    
    label.innerHTML = value
    label.style.left = `${left}px`
    console.log(num_range_width,num_label_width);
})


// https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
```

