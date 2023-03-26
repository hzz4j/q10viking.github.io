---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /golang/
typora-root-url: ..\.vuepress\public
---



## Hash Table

![image-20230326162633150](/images/golang/image-20230326162633150.png)



## Map

> Hash Table的实现

![image-20230326163004127](/images/golang/image-20230326163004127.png)

也可以通过字面量创建

```go
idMap := map[string]int{
	"hzz": "1193094618@qq.com"
}
```

### 删除key/valule对

```go
delete(idMap,"hzz")
```

### 测试key是否存在

```go
// id is value ,p is presence of key
id,p := idMap["hzz"]
```

### 遍历map

![image-20230326163504667](/images/golang/image-20230326163504667.png)







