---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /typescript/
typora-root-url: ..\.vuepress\public
---



## d-ts声明文件

https://stackoverflow.com/questions/21247278/about-d-ts-in-typescript

```tsx
// 区别？
export declare const thing: number;
export  const thing: number;  
```

[https://www.typescriptlang.org/dt/search?search=](https://www.typescriptlang.org/dt/search?search=)

[https://github.com/DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)



## npm管理

> 在node_modules的@types模块下

![image-20220919170711721](/images/typescript/image-20220919170711721.png)

:::: code-group
::: code-group-item app.ts

```typescript
import calculator from 'calculate'
calculator('plus',[1,2])
calculator.plus([1,2])

```

:::
::: code-group-item calculate.d.ts

```typescript
type IOperator = 'plus' | 'minus'

interface ICalculator{
    (operator: IOperator, numbers: number[]): number;
    plus: (numbers: number[]) => number;
    minus: (numbers: number[]) => number;
}

declare const calculator: ICalculator
export default calculator
```

:::
::::
