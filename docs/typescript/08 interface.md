---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /typescript/
---



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