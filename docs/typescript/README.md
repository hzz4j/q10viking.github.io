---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /topicNav/
---



::: tip

学习Typescript的语法，方便浏览一些有趣的开源项目

:::



[TypeScript: Handbook - The TypeScript Handbook (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/intro.html)

## TypeScript与JavaScript

- TypeScript兼容JavaScript的所有特性，并且在这基础上提供了强大的**TypeScript‘s type system**
- 另外TypeScript能够在程序执行前能够识别错误的代码行为，降低bugs的产生

### 类型推断

能够自动进行类型推断

```typescript
let helloWorld = "Hello World";
        let helloWorld: string
```

### 类型定义

:::: code-group
::: code-group-item JavaScript

```js
const user = {
  name: "Hayes",
  id: 0,
};
```

:::
::: code-group-item TypeScript

```typescript
interface User {
  name: string;
  id: number;
}

const user: User = {
  name: "Hayes",
  id: 0,
};
```

:::
::::
