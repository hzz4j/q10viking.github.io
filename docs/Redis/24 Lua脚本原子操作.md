---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---



## Redis Lua脚本

Redis在2.6推出了脚本功能，允许开发者使用Lua语言编写脚本传到Redis中执行。使用脚本的好处如下:

1. **减少网络开销**：本来5次网络请求的操作，可以用一个请求完成，原先5次请求的逻辑放在redis服务器上完成。使用脚本，减少了网络往返时延。**这点跟管道类似**。

2. **原子操作**：Redis会将整个脚本作为一个整体执行，中间不会被其他命令插入。**管道不是原子的，不过redis的批量操作命令(类似mset)是原子的。**

3. **替代redis的事务功能**：redis自带的事务功能很鸡肋，而redis的lua脚本几乎实现了常规的事务功能，官方推荐如果要使用redis的事务功能可以用redis lua替代。

   **官网文档上有这样一段话：**

   > A Redis script is transactional by definition, so everything you can do with a Redis transaction, you can also do with a script,  and usually the script will be both simpler and faster.              



从Redis2.6.0版本开始，通过内置的Lua解释器，可以使用EVAL命令对Lua脚本进行求值。EVAL命令的格式如下：

```
EVAL script numkeys key [key ...] arg [arg ...]　
```

script参数是一段Lua脚本程序，它会被运行在Redis服务器上下文中，这段脚本**不必(也不应该)定义为一个Lua函数**。numkeys参数用于指定键名参数的个数。键名参数 key [key ...] 从EVAL的第三个参数开始算起，表示在脚本中所用到的那些Redis键(key)，这些键名参数可以在 Lua中通过全局变量KEYS数组，**用1为基址**的形式访问( KEYS[1] ， KEYS[2] ，以此类推)。

在命令的最后，那些不是键名参数的附加参数 arg [arg ...] ，可以在Lua中通过全局变量**ARGV**数组访问，访问的形式和KEYS变量类似( ARGV[1] 、 ARGV[2] ，诸如此类)。例如：

```sh
127.0.0.1:6379> eval "return {KEYS[1],KEYS[2],ARGV[1],ARGV[2]}" 2 key1 key2 first second
1) "key1"
2) "key2"
3) "first"
4) "second"
```

其中 "return {KEYS[1],KEYS[2],ARGV[1],ARGV[2]}" 是被求值的Lua脚本，数字2指定了键名参数的数量， key1和key2是键名参数，分别使用 KEYS[1] 和 KEYS[2] 访问，而最后的 first 和 second 则是附加参数，可以通过 ARGV[1] 和 ARGV[2] 访问它们。

⭐在 Lua 脚本中，可以使用**redis.call()**函数来执行Redis命令⭐



## Java代码示例

::: tip

[Source Code LuaApp.java](https://github.com/Q10Viking/learncode/blob/main/redis/_01_java_redis/src/main/java/org/hzz/LuaApp.java)

:::

> Lua脚本能确保原子性操作

> 模拟一个商品减库存的原子操作

```java
//lua脚本命令执行方式：redis-cli --eval /tmp/test.lua , 10
jedis.set("product_stock_10016", "15");  //初始化商品10016的库存
String script = " local count = redis.call('get', KEYS[1]) " +
    " local a = tonumber(count) " +
    " local b = tonumber(ARGV[1]) " +
    " if a >= b then " +
    "   redis.call('set', KEYS[1], a-b) " +
    //模拟语法报错回滚操作
    // "   bb == 0 " +
    "   return 1 " +
    " end " +
    " return 0 ";
// 返回的就是Lua脚本返回的return
Object obj = jedis.eval(script, Arrays.asList("product_stock_10016"), Arrays.asList("10"));
System.out.println(obj); // 1
System.out.println(jedis.get("product_stock_10016")); // 5
```

**注意，不要在Lua脚本中出现死循环和耗时的运算，否则redis会阻塞，将不接受其他的命令， 所以使用时要注意不能出现死循环、耗时的运算。redis是单进程、单线程执行脚本。管道不会阻塞redis。**

