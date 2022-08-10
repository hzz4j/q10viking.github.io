---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---



## setbit

```sh
setbit key offset value 
    1. 对 key 所储存的字符串值，设置或清除指定偏移量上的位(bit)。
    2. 位的设置或清除取决于 value 参数，可以是 0 也可以是 1 。
    3. 当 key 不存在时，自动生成一个新的字符串值。
    4. ⭐字符串会进行伸展(grown)以确保它可以将 value 保存在指定的偏移量上。当字符串值
    进行伸展时，空白位置以 0 填充。⭐
    5. offset 参数必须大于或等于 0 ，小于 2^32 (bit 映射被限制在 512 MB 之内)
```



## bitcount

```sh
bitcount key [start] [end] 
	1. 计算给定字符串中，被设置为 1 的比特位的数量。
	2. 一般情况下，给定的整个字符串都会被进行计数，通过指定额外的 start 或 end 参数，可以让计数只在特定的位上进行
```

## bitop

```sh
bitop operation destkey key [key ...] 
	1. 对一个或多个保存二进制位的字符串 key 进行位元操作，并将结果保存到 destkey 上。
	2. operation 可以是 AND 、 OR 、 NOT 、 XOR 这四种操作中的任意一种：
```



## 亿级用户统计

```
		0 1 0 1 0 1 0 1         1byte  就可以存储8个用户
offset   1 2 3 4 5 6 7 8
```

![image-20220811023410916](/images/Redis/image-20220811023410916.png)

如果用户userId，是一个整型值，那么就可以使用userId来当成offset

```sh
# 如用户（userId=100）在11-06号登录，
setbit login_11_06 100 1    # 找到对应的bit位设置为1

# 统计bitmap中所有bit为1的个数
BITCOUNT login_11_06
```

但需要注意的是用户是数量比较多的情况，如果只有两个用户userId 1,userId = 2^32-1,那么就会浪费内存资源

-----------

统计用户连续登录的情况

```sh
	login_11_05: 0 1 0 1 1 1 0 1 1 1 0 1 0 0 1 0 1
	login_11_06: 1 1 0 1 0 1 0 1 1 1 0 1 0 0 1 0 1 &
	--------------------------------------------------
	BITOP and login_11_5-6 login_11_05 login_11_06
通过按位&来得到    1 1 0 1 1 1 0 1 1 1 0 1 0 0 1 0 1
然后再做统计BITCOUNT login_11_5-6
```



## 统计用户上线次数

假设现在我们希望记录自己网站上的用户的上线频率，比如说，计算用户 A 上线了多 少天，用户 B 上线了多少天，诸如此类，以此作为数据，从而决定让哪些用户参加 beta 测 试等活动 —— 这个模式可以使用 SETBIT 和 BITCOUNT 来实现。

 比如说，每当用户在某一天上线的时候，我们就使用 SETBIT ，以用户名作为 key ， 将那天所代表的网站的上线日作为 offset 参数，并将这个 offset 上的为设置为 1 。 

举个例子，如果今天是网站上线的第 100 天，而用户 peter 在今天阅览过网站，那么 执行命令 SETBIT peter 100 1 ；如果明天 peter 也继续阅览网站，那么执行命令 SETBIT  peter 101 1 ，以此类推。 当要计算 peter 总共以来的上线次数时，就使用 BITCOUNT 命令：执行 BITCOUNT  peter ，得出的结果就是 peter 上线的总天数。

### 性能

前面的上线次数统计例子，即使运行 10 年，占用的空间也只是每个用户 10*365 比特 位(bit)，也即是每个用户 456 字节。对于这种大小的数据来说， BITCOUNT 的处理速度就 像 GET 和 INCR 这种 O(1) 复杂度的操作一样快。