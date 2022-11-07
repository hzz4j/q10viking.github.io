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

[values.go](https://github.com/Q10Viking/Learn-golang/blob/main/basic/02%20values/values.go)

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





## Variables

::: tip

声明变量的方式

:::

[https://gobyexample.com/variables](https://gobyexample.com/variables)

```go
package main

import "fmt"

func main() {
	// 自动类型推断
	var name = "静默"
	fmt.Println(name)

	// 声明多个变量并指定类型
	var a, b int = 3, 2
	fmt.Println(a, b)

	// var 简化写法
	f := true
	fmt.Println(f)

	// var tmp1  会报错：没有指定类型
	var tmp2 int
	fmt.Println(tmp2)
}

/**output
静默
3 2
true
0
*/

```

### 多个变量

```go
func multiVar() {
	var (
		hello string = "Hello "
		world string = "World"
	)
	fmt.Println(hello)
	fmt.Println(world)
}
```



## Constant

[https://gobyexample.com/constants](https://gobyexample.com/constants)

```go
package main

import "fmt"

const name = "静默"

var greeting = "Hello"

func main() {
	fmt.Println(greeting, name)

	//name = "Q10Viking" 常量不能改变
	greeting = "Hello again"
	fmt.Println(greeting, name)
}

/**
Hello 静默
Hello again 静默
*/

```



## For

[https://gobyexample.com/for](https://gobyexample.com/for)

```go
package main

import "fmt"

func main() {
	i := 1
	for i < 3 {
		fmt.Println(i)
		i++
	}

	for j := 7; j < 9; j++ {
		fmt.Println(j)
	}

	for {
		fmt.Println("Loop")
		break
	}
}

```



## If-else

[https://gobyexample.com/if-else](https://gobyexample.com/if-else)

```go
package main

import "fmt"

func main() {
	if num := 9; num < 0 {
		fmt.Println(num, "is negative")
	} else if num < 10 {
		fmt.Println(num, "has 1 digit")
	} else {
		fmt.Println(num, "has multiple digits")
	}
}

/**
9 has 1 digit
*/

```



