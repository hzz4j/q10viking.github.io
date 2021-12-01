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

**Decorator的执行时机是在定义的地方，而不是类实例化的时候**

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



## Returning(and changing) when a Class Decorator:star:

::: tip

这段代码太惊艳了

:::

```typescript {4-5,10-11,18,31-32}
function withTemplate(template: string, hookId: string) {
  console.log("Step 1");

  // T extends 一个方法的type,也可以直接写成 T extends new (...args: any[]) => { name: string }
  return function <T extends { new (...args: any[]): { name: string } }>(
    originalConstructor: T
  ) {
    console.log("Step 2");
    // 返回一个新的class，该类继承原有的类，做了一些修改
    return class extends originalConstructor {
      constructor(..._: any[]) {
        super();
        console.log("Step 3");
        const hookEl = document.getElementById(hookId);
        const p = new originalConstructor();
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector("h1")!.textContent = this.name;
        }
      }
    };
  };
}

// decorator会在类定义的地方执行
@withTemplate("<h1>Hello TypeScript</h1>", "app")
class Person {
  constructor(public name: string = "静默") {}
}

// step 3只会在实例化的时候才执行
const person = new Person();
```

