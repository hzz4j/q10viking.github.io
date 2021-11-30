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

