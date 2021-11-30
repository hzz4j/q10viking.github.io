

## Rest paramter

数组Array

```typescript {1}
function addNumbers(...numbers: number[]){
    return numbers.reduce((currentResult,currentValue)=>{
        return currentResult+currentValue;
    },0);
}

console.log(addNumbers(5,10,3.7));
```

Tuple

```typescript {1}
function addNumbers(...numbers: [number, number, number]) {
  return numbers.reduce((currentResult, currentValue) => {
    return currentResult + currentValue;
  }, 0);
}

```



## 数组的扩展

```sh
const hobbies = ["Sport", "Reading"];
const hobbActivies = [...hobbies];
```



## 对象复制

```js
const person = {
  name: "静默",
  developer: "Java",
};

const Q10Viking = { ...person };
```



## 箭头函数

```typescript {1-2}
const printOut1: (msg: string) => void = (msg) => console.log(msg);
const printOut2 = (msg: string) => console.log(msg);

console.log(printOut1('Hello World'));
console.log(printOut2('Hello World'));
```



