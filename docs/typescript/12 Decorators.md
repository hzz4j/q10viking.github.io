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



## Returning (and changing) a class when a Class Decorator:star:

::: tip

这段代码太惊艳了

让修饰class的decorator返回一个新的class,来修改原来的class,这里修改构造函数

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



## Returing a PropertyDescriptor when a method decorator:star:

::: tip

让修饰方法的decorator返回一个PropertyDescriptor,来修改原来的方法

:::

**自动绑定this的例子**

```typescript {8-10,16-17,20,26,34-38}
function AutoBind(
  target: any,
  name: string,
  propertyDescriptor: PropertyDescriptor
): PropertyDescriptor {
  console.log(propertyDescriptor);

  const originalMethod = propertyDescriptor.value;
  // 修改方法的描述
  const adjDescriptor: PropertyDescriptor = {
    // get是PropertyDescriptor接口的规范
    get() {
      console.log("xxx");
      console.log(this); // 这个例子就是Printer,因为方法绑定了@AutoBind
      // 给原来的方法绑定了this
      const boundFn = originalMethod.bind(this); // this是只被调的实例，当然是被修饰的方法
      return boundFn;
    },
  };
  return adjDescriptor;
}

class Printer {
  msg = "This works!";

  @AutoBind
  showMsg() {
    console.log(this.msg);
  }
}

const button = document.getElementById("app")!;
const p = new Printer();
// bind 让this指向p
//button.addEventListener('click',p.showMsg.bind(p));

// autobind
button.addEventListener("click", p.showMsg);
```

## Decorator use as Validator :star:

校验属性是否符合条件

::: details 点击查看代码

```typescript {3-5,11-14,20-22,38,51,53}
//=======================================================
interface ValidConfig {
  [properties: string]: {
    [properties: string]: string[];
  };
}
const registeredValidators: ValidConfig = {};

function Require(target: any, name: string) {
  console.log("require");
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [name]: ["require"],
  };
}

function PositiveNum(target: any, name: string) {
  console.log("PositiveNum");

  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [name]: ["positiveNum"],
  };
}

function valid(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    return;
  }
  let isValid = true;
  console.log(objValidatorConfig);

  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case "require":
          isValid = isValid && !!obj[prop];
          break;
        case "positiveNum":
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}
//=======================================================

class Course {
  @Require
  title: string;
  @PositiveNum
  price: number;
  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const form = document.querySelector("form")!;
const formButton = form.querySelector("button")!;

formButton.addEventListener("click", (e) => {
  e.preventDefault();
  const titlEl = form.querySelector("#title")! as HTMLInputElement;
  const priceEl = form.querySelector("#price")! as HTMLInputElement;

  const title = titlEl.value;
  const price = +priceEl.value;

  const createCourse = new Course(title, price);
  console.log(createCourse);

  if (!valid(createCourse)) {
    alert("Invalid input,please try again!");
    return;
  }
  console.log(createCourse);
});
```

:::