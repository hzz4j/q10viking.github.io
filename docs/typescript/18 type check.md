https://stackoverflow.com/questions/51528780/typescript-check-typeof-against-custom-type

You can't use `typeof` **at runtime to check** for `interface` types, which only exist at compile time.  Instead you can write a [user-defined type guard function](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) to check for such types:



https://stackoverflow.com/questions/40081332/what-does-the-is-keyword-do-in-typescript

