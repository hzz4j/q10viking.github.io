---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /golang/
typora-root-url: ..\.vuepress\public
---



## 运行

```sh
go run hello-world.go 
```



## 构建

编译成二进制文件

```sh
$ go build hello-world.go
$ ls
hello-world    hello-world.go
$ ./hello-world
hello world
```

制定目录和文件名

```sh
# -o 文件夹/文件名
go build -o bin/hello-world  hello-world.go
```

## install

```go
go install
```



## mod

```
go mod tidy 
```

```
mkdir name
cd name
go mod init name
```

