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

```typescript {7}
// 传入的参数constructor取决于decorator使用在哪里，这里是构造函数
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

:::: code-group
::: code-group-item decorator

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

:::

::: code-group-item html

```html
<div id="app"></div>
```

:::

::::

---------



## Decorator使用的位置

::: tip

除了在class上使用，还可以在Property,Accessor(setter,getter),Method,Parameter

:::



:::: code-group
::: code-group-item 使用

```typescript {2,6,20-21}
class Product {
  @LogProperty
  title: string;
  private _price: number;

  @LogAccessor
  set price(val: number) {
    if (val >= 0) {
      this._price = val;
    } else {
      throw new Error("Invalid price - should be positive!");
    }
  }

  constructor(n: string, p: number) {
    this.title = n;
    this._price = p;
  }

  @LogMethod
  getPricewithTax(@LogParameter tax: number) {
    return this._price * (1 + tax);
  }
}
```

::: 

::: code-group-item LogProperty

```typescript {1}
function LogProperty(target: any, name: string) {
  console.log("Property Decorator");
  console.log(target);
  console.log(name);
}
```

::: 

::: code-group-item LogAccessor

```typescript {1}
function LogAccessor(
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) {
  console.log("Accessor Decorator");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}
```

::: 

::: code-group-item  LogMethod

```typescript {1}
function LogMethod(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log("Method Decorator");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}
```

::: 

::: code-group-item LogParameter

```typescript {1}
function LogParameter(target: any, name: string, position: number) {
  console.log("Parameter Decorator");
  console.log(target);
  console.log(name);
  console.log(position);
}
```

::: 

::::