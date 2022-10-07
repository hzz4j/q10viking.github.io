## Lookup Types

### keyof  Type

::: tip

获取类型的属性

:::

[官网keyof关键字](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#keyof-and-lookup-types) 

```tsx
interface Person {
  name: string;
  age: number;
  location: string;
}
type K1 = keyof Person; // "name" | "age" | "location"
type K2 = keyof Person[]; // "length" | "push" | "pop" | "concat" | ...
type K3 = keyof { [x: string]: Person }; // string
```

----------

与extends结合使用 [Pick (ghaiklor.github.io)](https://ghaiklor.github.io/type-challenges-solutions/en/easy-pick.html)

```tsx
type MyPick<T, K extends keyof T> = {
  [key in K]: T[key];
};

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyPick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```





## Indexed Type

### number

::: tip

If we access the `T[number]`, TypeScript will return a union of all elements from `T`. E.g. if you have a `T = [1, 2, 3]`, accessing it via `T[number]` will return `1 | 2 | 3`.

But, there is an error “Type ‘number’ cannot be used to index type ‘T’”. It is because we don’t have a ❤️constraint ❤️over `T`. We need to tell TypeScript that `T` is an array.

来自--[Includes (ghaiklor.github.io)](https://ghaiklor.github.io/type-challenges-solutions/en/easy-includes.html)

```tsx
type Includes<T extends readonly any[], U> = U extends T[number] ? true : false;

const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];
// constraint array
type Person = typeof MyArray[number];
```

:::

[TypeScript: Documentation - Indexed Access Types (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)

using `number` to get the type of an array’s elements. We can combine this with `typeof` to conveniently capture the element type of an array literal:

```tsx
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];
 
type Person = typeof MyArray[number];
```



```tsx
type TupleToObject<T extends readonly (string | number)[]> = {
  [k in T[number]]: k;
};

const tupleMix = [1, "2", 3, "4"] as const;

TupleToIbject(typeof tupleMix)
```

