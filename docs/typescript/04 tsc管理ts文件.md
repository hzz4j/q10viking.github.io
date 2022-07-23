---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /typescript/
---



## tsc管理ts文件

### 单个文件

```sh
tsc file.ts -w
# 或者
tsc file.ts --watch
```



### 整个项目

将整个项目交给TypeScript Compiler管理

```sh
# 执行命令会生成 tsconfig.json
tsc --init
# model模式
tsc --watch   # 或者tsc -w

#直接执行tsc，则一次性编译所有ts文件
tsc
```



## tsconfig.json文件

用于配置tsc如何编译ts文件

```json
"target": "es6", /*指定typescript compiler编译的版本*/
"sourceMap": true, /* 用于debug ts文件⭐*/
"outDir": "./dist", /*编译后的js文件存放根目录*/
"rootDir": "./src", /*指定要编译的文件所在的根目录*/
"noEmitOnError": true, /*如果报告任何类型检查错误，则禁用编译文件*/
// =================严格模式================================
"strictNullChecks": true  /*对于可能为null的进行检查*/
"noUnusedLocals": true /*对声明却没有被使用的进行检查*/

// ======================配置相对路径=====================================
"baseUrl": ".",
"paths": {
    "@/*": [
        "src/*"
    ]
}
// 这样就能导入 import TodoItem from '@/types/TodoItems'     在src/types/TodoItems.ts
// ==========================================================================
```



```typescript {2}
// !告诉typescript compiler 这个不会返回null,是永远存在的
const button = document.querySelector('button')!;

// 为了确保的确存在，自己需要处理一下
if(button){
    // ... ...
}
```

