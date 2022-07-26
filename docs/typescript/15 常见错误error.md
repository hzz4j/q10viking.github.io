---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /typescript/
---



## ts(1109)

Expression expected Error in TypeScript

```tsx
// error
export default const RAND_USER_API = "https://randomuser.me/api?results=50"

// correct
const RAND_USER_API = "https://randomuser.me/api?results=50"
export default RAND_USER_API
```

[Solve - Expression expected Error in TypeScript | bobbyhadz](https://bobbyhadz.com/blog/typescript-expression-expected-error)

```
export default function xxx(){}???
```









https://bobbyhadz.com/blog/typescript-instanceof-only-refers-to-type-but-is-being-used-as-value







```js
export interface IconPack {
  [key: string]: IconDefinition; //这是啥意思？
}
```

https://bobbyhadz.com/blog/typescript-key-string-string