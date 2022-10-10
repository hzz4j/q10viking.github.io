---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /golang/
typora-root-url: ..\.vuepress\public
---

::: tip

[https://gobyexample.com](https://gobyexample.com)

:::

## Hello World

[https://gobyexample.com/hello-world](https://gobyexample.com/hello-world)

[hello-world.go](https://github.com/Q10Viking/Learn-golang/blob/main/basic/01%20hello%20world/hello-world.go)

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello World.静默 learning Go Programming Language")
}
```



## Values

[https://gobyexample.com/values](https://gobyexample.com/values)

[values.go]()

```go
package main

import "fmt"

func main() {
	fmt.Println("Go" + "lang")
	fmt.Println("7.0/3.0 = ", 7.0/3.0)
	fmt.Println("true && true", true && true)
	fmt.Println("true || false", true || false)
	fmt.Println("!true", !true)
}

/**output
Golang
7.0/3.0 =  2.3333333333333335
true && true true
true || false true
!true false
*/

```

