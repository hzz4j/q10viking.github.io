## watch model

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

