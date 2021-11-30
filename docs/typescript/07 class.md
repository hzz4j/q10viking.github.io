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

## access Modifiers

::: tip

类似Java一样，也有public,protected,private

:::

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



## readonly

```typescript
class Department {
  private employees: string[] = [];

  constructor(private readonly id: string, private n: string) {}

  updateId(){
      // 不能更新 error
      //this.id = 'xxx';
  }
}
```



## getter and setter

```typescript {8,15,37-39}
class Department {
  constructor(private id: string, private name: string) {}
}

class AccountingDepartment extends Department {
  private lastReport: string;
  // getter
  get mostRecentReport() {
    if (this.lastReport) {
      return this.lastReport;
    }
    throw new Error("No report found.");
  }
  // setter
  set mostRecentReport(value: string) {
    if (!value) {
      throw new Error("Please pass in a valid value!");
    }
    this.addReport(value);
  }

  constructor(id: string, private reports: string[]) {
    super(id, "Accounting");
    this.lastReport = reports[0];
  }

  addReport(report: string) {
    this.reports.push(report);
    this.lastReport = report;
  }

  printReports() {
    console.log(this.reports);
  }
}

const accountingDepartment = new AccountingDepartment("idx", []);
accountingDepartment.mostRecentReport = 'Hello Report';
console.log(accountingDepartment.mostRecentReport);
```



## 继承

```typescript {5}
class Department {
  constructor(private id: string, private name: string) {}
}

class AccountingDepartment extends Department {
  constructor(id: string, private reports: string[]) {
    super(id, "Accounting");
  }

  addReport(report: string) {
    this.reports.push(report);
  }

  printReports() {
    console.log(this.reports);
  }
}

const accountingDepartment = new AccountingDepartment('idx',[]);
accountingDepartment.addReport('Something error happen.');
accountingDepartment.printReports();
```



## static method & properties

```typescript {2,4}
class Department {
  static fiscalYear = 2021;
  constructor(private id: string, private name: string) {}
  static createEmployee(name: string) {
    return { name };
  }
}
```



## abstract class and abstract method

```typescript {1,3,11}
abstract class Department {
  constructor(protected id: string, private name: string) {}
  abstract describe(this: Department): void;
}

class ITDepartment extends Department {
  constructor(id: string) {
    super(id, "IT");
  }

  describe(this: ITDepartment) {
    console.log("IT Department id - " + this.id);
  }
}

```



## private constructor

```typescript {7-8,16}
abstract class Department {
  constructor(protected id: string, private name: string) {}
  abstract describe(this: Department): void;
}

class ITDepartment extends Department {
  static instance: ITDepartment;
  private constructor(id: string) {
    super(id, "IT");
  }

  describe(this: ITDepartment) {
    console.log("IT Department id - " + this.id);
  }

  static getInstance() {
    if (ITDepartment.instance) {
      return this.instance;
    }
    this.instance = new ITDepartment("idx");
    return this.instance;
  }
}
```

