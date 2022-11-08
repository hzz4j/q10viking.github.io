---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /golang/
typora-root-url: ..\.vuepress\public
---



## defer

defer关键字可以让函数或语句延迟到函数语句块的最结尾时，即即将退出函数时执行，即便函数中途报错结束、即便已经panic()、即便函数已经return了，也都会执行defer所推迟的对象。

其实defer的本质是，**当在某个函数中使用了defer关键字，则创建一个独立的defer栈帧，并将该defer语句压入栈中**，同时将其使用的相关变量也拷贝到该栈帧中（显然是按值拷贝的）。因为栈是LIFO方式，所以先压栈的后执行。**因为是独立的栈帧，所以即使调用者函数已经返回或报错，也一样能在它们之后进入defer栈帧去执行**

```go
func main() {
	fmt.Println("Starting")
	defer fmt.Println(1)
	defer fmt.Println(2)
	defer fmt.Println(3)
	defer fmt.Println(4)
	fmt.Println("Ended")
}

/**
Starting
Ended
4
3
2
1
*/

```

### defer与匿名函数

::: tip

因为函数传参是值copy,所以x为10的值在defer定义的时候已经copy传入defer, 后面的修改并不会影响到defer中的值

:::

```go
func main() {
	x := 2
	defer func(num int) {
		fmt.Printf("x = %d\n", num)
	}(x)
	x = 10
	fmt.Printf("x = %d\n", x)
}

/**
x = 10
x = 2
*/

```

