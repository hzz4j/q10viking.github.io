---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



## Bigdecimal

**BigDecimal 是 Java 中的一个类，用于精确表示和操作任意精度的十进制数。它提供了高精度的数值计算，并且可以避免浮点数计算中常见的精度丢失问题。**
**它提供了大量的方法来支持基本的数学运算，如加法、减法、乘法、除法等。它还支持比较操作和取整操作，可以设置小数位数、舍入模式等。此外，BigDecimal 还提供了一些其他功能，如转换为科学计数法、格式化输出、判断是否是整数等。**
**适用场景：需要处理精确计算或防止浮点数计算精度丢失的场景**



### 使用BigDecimal的构造函数传入浮点数

**其实这个问题我们在使用Float、Double等浮点类型进行计算时，也会经常遇到，比如说下面这个代码**

```java
@Test
public void bigDecimalDemo1() {
    float float1 = 1;
    float float2 = 0.9f;
    System.out.println(float1 - float2);
}
```

**输出结果是多少呢？0.1？不是，输出结果是0.100000024。因为 0.9 无法被精确表示为有限位数的二进制小数。在转换为二进制时可能会产生近似值。因此，在进行减法运算时，实际上是对近似值进行计算，而不是对准确的 0.9 进行计算。这导致了精度丢失，最终的计算结果也是一个近似值。因此，输出结果不是准确的 0.1，而是一个近似值。**
**小伙伴肯定能想到使用BigDecimal来避免这个问题，这时候第一个需要避免的陷阱就来了。看以下代码**

```java
@Test
public void bigDecimalDemo2(){
    BigDecimal bigDecimal1 = new BigDecimal(0.01);
    BigDecimal bigDecimal2 = BigDecimal.valueOf(0.01);
    System.out.println("bigDecimal1 = " + bigDecimal1);
    System.out.println("bigDecimal2 = " + bigDecimal2);
}
```

**输出结果如下：**

```java
bigDecimal1 = 0.01000000000000000020816681711721685132943093776702880859375
bigDecimal2 = 0.01
```

**观察输出结果我们可以知道，使用BigDecimal时同样会有精度的问题。所以我们在创建BigDecimal对象时，有初始值使用BigDecimal.valueOf()的方式，可以避免出现精度问题**

### 陷阱 equals

日常项目我们是如何进行BigDecimal数值比较呢？使用equals方法还是compareTo方法？如果使用的是equals方法，那就需要注意啦。看一下示例

```java
@Test
public void bigDecimalDemo3(){
    BigDecimal bigDecimal1 = new BigDecimal("0.01");
    BigDecimal bigDecimal2 = new BigDecimal("0.010");
    System.out.println(bigDecimal1.equals(bigDecimal2));
    System.out.println(bigDecimal1.compareTo(bigDecimal2));
}
```

输出结果如下

```
false
0
```

观察结果可以知道使用equals比较结果是不相等的；compareTo的结果为0代表两个数相等；

- compareTo实现了Comparable接口，比较的是值的大小，返回的值为-1-小于，0-等于，1-大于。

### 小结

- 使用BigDecimal.valueOf来处理精度，内部会使用字符串，防止精度丢失
- 比较用compareTo

### 四舍五入

使用BigDecimal进行运算时，一定要正确的使用舍入模式，避免舍入误差引起的问题，并且有时候出现结果是无限小数，程序会抛出异常，比如说

```java
@Test
public void bigDecimalDemo4(){
    BigDecimal bigDecimal1 = new BigDecimal("1.00");
    BigDecimal bigDecimal2 = new BigDecimal("3.00");
    BigDecimal bigDecimal3 = bigDecimal1.divide(bigDecimal2);
    System.out.println(bigDecimal3);
}
```

报错：

```
java.lang.ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result.
```

简单的来说，如果在除法运算过程中，其结果是一个无限小数，而操作的结果预期是一个精确的数字，那么将会抛出ArithmeticException异常
此时，我们只要正确指定结果精度即可：

```java
@Test
public void bigDecimalDemo4(){
    BigDecimal bigDecimal1 = new BigDecimal("1.00");
    BigDecimal bigDecimal2 = new BigDecimal("3.00");
    BigDecimal bigDecimal3 = bigDecimal1.divide(bigDecimal2, 2, RoundingMode.HALF_UP);
    System.out.println(bigDecimal3); // 0.33
}
```

```
● RoundingMode.UP：向远离零的方向舍入
● RoundingMode.DOWN：向靠近零的方向舍入
● RoundingMode.CEILING：向正无穷方向舍入
● RoundingMode.FLOOR：向负无穷方向舍入
● RoundingMode.HALF_UP：四舍五入，如果舍弃部分大于等于 0.5
● RoundingMode.HALF_DOWN：四舍五入，如果舍弃部分大于 0.5
● RoundingMode.HALF_EVEN：银行家舍入法，遵循 IEEE 754 标准
```



## 金额用long还是BigDecimal

首先float和double肯定是排除的，因为它们内部使用科学计数法，转换二进制的时候有可能出现无限小数位的问题 

那么大家就会选择Long和BigDecimal， Long类型在存储时(比如保留2位小数点)x100,  取出来/100。

其实本质都是一样的，都是避免使用浮点数进行表达，只是Long属于隐式设定小数点，BigDecimal属于显示设定小数点。

我的建议是： 在代码层面用**BigDecimal ，**数据库层面可视情况定

 首先long性能更好：

- 整数类型（如 **long**）通常在计算机硬件上的性能更好，因为它们的操作可以在硬件层面上更有效地执行。
- **BigDecimal**  需要额外的空间和计算开销。

![image.png](/images/java/1706533593289-04bb4fa9-ab67-45da-ae32-433843c76619.png)

> 阿里的java开发手册是推荐用分存储的，希望大家都能用Long存储分，照顾一下彼此的开发体验。
> “8.【强制】任何货币金额，均以最小货币单位且为整型类型进行存储。”
>
> 但是对于一些金融系统要求小数点位数要求比较多， 比如精确后六位，  如果每次存x1000000   那long类型的内存开销也荡然无存了也会降低可读性即易用性，   不如用Decimal。
>
> **所以数据库在需求阶段能确定小数点位数可以用long， 如果位数不确定，或者要求太精准可以用DECIMAL**

java类型对应mysql中类型

- long->INTEGER
- BigDecimal->DECIMAL

| 类型名称  | 显示长度 | 数据库类型            | JAVA类型             | JDBC类型索引(int) |
| --------- | -------- | --------------------- | -------------------- | ----------------- |
| VARCHAR   | L+N      | VARCHAR               | java.lang.String     | 12                |
| CHAR      | N        | CHAR                  | java.lang.String     | 1                 |
| BLOB      | L+N      | BLOB                  | java.lang.byte[]     | -4                |
| TEXT      | 65535    | VARCHAR               | java.lang.String     | -1                |
|           |          |                       |                      |                   |
| INTEGER   | 4        | INTEGER UNSIGNED      | java.lang.Long       | 4                 |
| TINYINT   | 3        | TINYINT UNSIGNED      | java.lang.Integer    | -6                |
| SMALLINT  | 5        | SMALLINT UNSIGNED     | java.lang.Integer    | 5                 |
| MEDIUMINT | 8        | MEDIUMINT UNSIGNED    | java.lang.Integer    | 4                 |
| BIT       | 1        | BIT                   | java.lang.Boolean    | -7                |
| BIGINT    | 20       | BIGINT UNSIGNED       | java.math.BigInteger | -5                |
| FLOAT     | 4+8      | FLOAT                 | java.lang.Float      | 7                 |
| DOUBLE    | 22       | DOUBLE                | java.lang.Double     | 8                 |
| DECIMAL   | 11       | DECIMAL               | java.math.BigDecimal | 3                 |
| BOOLEAN   | 1        | 同TINYINT             |                      |                   |
|           |          |                       |                      |                   |
| ID        | 11       | PK (INTEGER UNSIGNED) | java.lang.Long       | 4                 |
|           |          |                       |                      |                   |
| DATE      | 10       | DATE                  | java.sql.Date        | 91                |
| TIME      | 8        | TIME                  | java.sql.Time        | 92                |
| DATETIME  | 19       | DATETIME              | java.sql.Timestamp   | 93                |
| TIMESTAMP | 19       | TIMESTAMP             | java.sql.Timestamp   | 93                |
| YEAR      | 4        | YEAR                  | java.sql.Date        | 91                |