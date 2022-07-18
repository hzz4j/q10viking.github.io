---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
---



## Drink Water

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/17%20Drink%20Water/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/17%20Drink%20Water)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/17%20Drink%20Water/"/>





## 大容器的元素占位

### JS处理

```js
function updateBigCup(){
    const fullCups = document.querySelectorAll('.cup-small.full').length
    const totalCups = smallCups.length


    // update content
    liters.innerText = `${2 - fullCups / totalCups}L`
    percentage.innerText = `${fullCups / totalCups *100}%`
    

    if(fullCups === 0){
        percentage.style.visibility = 'hidden'
        percentage.style.height = 0
    }else{
        percentage.style.visibility = 'visible'
        percentage.style.height = `${fullCups / totalCups * 330}px`
    } 
    
    if(fullCups === totalCups){
        // 结合使用
        remained.style.visibility = "hidden"
        remained.style.height = 0
    }else{
        // 有内容了height = 0不再生效
        remained.style.visibility = "visible"
    }
}
```



### css

::: tip

1. **剩余空间用flex: 1占满**
2. **已喝的百分比区域则用height来表示**

:::

```css
.cup .remained{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1; /*尽量占据剩余空间*/
    width: 100%;
    color: var(--border-color);
}
```





## flex

[Understanding flex-grow, flex-shrink, and flex-basis | CSS-Tricks - CSS-Tricks](https://css-tricks.com/understanding-flex-grow-flex-shrink-and-flex-basis/)

```css
flex: 0 1 auto; /*默认*/
/*等于*/
flex-grow: 0;
flex-shrink: 1;
flex-basis: auto;


flex: 1
flex-grow : 1;  
flex-shrink : 1;
flex-basis : 0;
```

