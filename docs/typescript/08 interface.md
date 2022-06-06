---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /typescript/
---

## interface

::: tip

接口定义规范结构

:::

:::: code-group
::: code-group-item 接口规范

```typescript
interface Person {
  name: string;
  score: number;
  greet(phrase: string): void;
}
```

:::
::: code-group-item 实现

```typescript
let user1: Person = {
  name: "静默",
  score: 100,
  greet(phrase: string) {
    console.log("Greet: " + phrase);
  },
};

```

:::

::::



## class 实现 interface

::: tip

接口中可以使用readonly修饰

:::

:::: code-group
::: code-group-item 接口规范

```typescript {2}
interface Greetable {
  readonly name: string;
  greet(phrase: string): void;
}
```

:::
::: code-group-item 实现

```typescript
class Person implements Greetable {
  name: string;
  score: number = 100;

  constructor(n: string) {
    this.name = n;
  }

  greet(phrase:string){
      console.log(phrase+this.name);
      
  }
}
```

:::
::: code-group-item 使用

```typescript {1}
let user1: Greetable = new Person("静默");
user1.greet('Hi there,I\'m ');
```

:::

::::

---------

## Interface as Function Type:star:

```typescript {1-2}
// type AddFn = (number1:number,number2:number)=>number;
interface AddFn{
    (number1:number,number2:number):number;
}

let add:AddFn;
add = (number1,number2)=>number1+number2;

console.log(add(1,2));
```



## optional properties and paramter :star:

```typescript {2,7-8,22}
interface Greetable {
  readonly name?: string;
  greet(phrase: string): void;
}

class Person implements Greetable {
  name?: string;
  constructor(n?: string) {
    if (n) {
      this.name = n;
    }
  }
  greet(phrase: string) {
    if (this.name) {
        console.log(phrase+this.name);
    } else {
      console.log("Hi!");
    }
  }
}

let user1: Greetable = new Person();
user1.greet('Hi there,I\'m '); // 输出： Hi!
```

