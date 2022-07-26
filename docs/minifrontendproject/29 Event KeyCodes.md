

## Event KeyCodes







## 监听windows事件

```js
// event类型推断为KeyboardEvent
window.addEventListener('keydown',event =>{
    
    container.innerHTML = `
        <div class="key">
            <span class="content">
            ${event.key === " " ? event.code : event.key}
            </span>
            <small>event.key</small>
        </div>
        
        <div class="key">
            <span class="content">${event.keyCode}</span>
            <small>event.keyCode</small>
        </div>
        
        <div class="key">
            <span class="content">${event.code}</span>
            <small>event.code</small>
        </div>
    `
    console.log(event)
})
```

