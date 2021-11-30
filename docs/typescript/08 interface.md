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

:::: code-group
::: code-group-item 接口规范

```typescript
interface Greetable {
  name: string;
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