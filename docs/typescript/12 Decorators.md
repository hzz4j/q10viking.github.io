---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /typescript/
---



## Decorator

:::  tip

配置中允许 **"experimentalDecorators": true**

:::

```typescript {6}
function Logging(constructor: Function) {
  console.log("logging...");
  console.log(constructor);
}
// decorator会在类定义的地方执行
@Logging
class Person {
  constructor(private name: string = "静默") {}
}
```



## Decorator Factory:star:

::: tip

使得Decorator更加可配置化

:::

```typescript {2,9}
function Logging(logString:string) {
  return function(constructor: Function){
    console.log(logString);
    console.log(constructor);
  }

}
// decorator会在类定义的地方执行
@Logging("LOGGING - Person")
class Person {
  constructor(private name: string = "静默") {}
}
```



## Meta Programming:star:

::: tip

模仿Angular的形式

:::

```typescript {3,6,13}
function withTemplate(template: string, hookId: string) {
  return function (constructor: any) {
    const hookEl = document.getElementById(hookId);
    const p = new constructor();
    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector("h1")!.textContent = p.name;
    }
  };
}

// decorator会在类定义的地方执行
@withTemplate("<h1>Hello TypeScript</h1>", "app")
class Person {
  constructor(public name: string = "静默") {}
}
```

