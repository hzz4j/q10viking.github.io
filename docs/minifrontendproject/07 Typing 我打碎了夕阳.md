---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---





## Typing by JS

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/11%20Simple%20Typing%20animation%20by%20js/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/11%20Simple%20Typing%20animation%20by%20js)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/11%20Simple%20Typing%20animation%20by%20js/"/>





## 笔记

::: tip

使用setInterval一个个字符输出

:::





```js
const words = ['我打碎了夕阳','洒在你身上','你满是圣光','我黯然退场']
const linesDiv = document.querySelectorAll(".line")

const word = document.getElementById('word')
// ,'洒在你身上','你满是圣光','我黯然退场'
let arrayIndex = 0;
let charIndex = 1;
let allText = ''

let currentLine = linesDiv[arrayIndex]

let refresh = setInterval(() => {
    let content = words[arrayIndex].substring(0,charIndex);
    currentLine.innerText = content

    if(content.length === words[arrayIndex].length){
        allText += content;
        if(arrayIndex === words.length-1){
            // 清空内容重新书写
            linesDiv.forEach(div => div.innerText='')
            charIndex = 0;
            arrayIndex = 0;
            // clearInterval(refresh)
        }else{
            // next line
            arrayIndex++
            charIndex = 0;
        }
    }
    currentLine = linesDiv[arrayIndex]
    charIndex++;
    
}, 300);
```



### 背景图片设置

```css
background-image: url('./sun-night.jpg');
background-size: cover;
background-repeat: no-repeat;
background-position: center;
```

