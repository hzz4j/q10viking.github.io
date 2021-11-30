---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /typescript/
---



## class

```typescript
class Department {
  name: string;
  constructor(n: string) {
    this.name = n;
  }
}

const accounting = new Department("Accounting");
```



## method & this :star:

```typescript {7-8,13,15}
class Department {
  name: string;
  constructor(n: string) {
    this.name = n;
  }

  describe(this: Department) {
    console.log("Department: " + this.name);
  }
}

const accounting = new Department("Accounting");
const accountingCopy = { name: "DUMMY", describe: accounting.describe };

accountingCopy.describe();
```

## private & public access Modifiers

```typescript {4}
class Department {
  // 默认是public
  name: string;
  private employees: string[] = [];

  constructor(n: string) {
    this.name = n;
  }

  describe(this: Department) {
    console.log("Department: " + this.name);
  }

  addEmployee(employee:string){
    this.employees.push(employee);
  }
}
```



## properties简化写法

:::: code-group
::: code-group-item 简化版本

```typescript {4}
class Department {
  private employees: string[] = [];

  constructor(private id: string, private n: string) {}
}
```

:::
::: code-group-item 传统版

```typescript 
class Department {
  private id: string;
  private name: string;
  private employees: string[] = [];

  constructor(id: string, n: string) {
    this.id = id;
    this.name = n;
  }
}

```

:::

::::