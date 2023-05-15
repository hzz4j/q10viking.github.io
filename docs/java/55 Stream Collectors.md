---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



## 1. groupingBy

### 1.1 group by key根据分类函数进行分组

> grouping elements according to a classification function
>
> ```java
> groupingBy(Function<? super T, ? extends K> classifier) 
> ```
>
> 

```java
List<Item> items = Arrays.asList(
    new Item("apple", 10, new BigDecimal("9.99")),
    new Item("banana", 20, new BigDecimal("19.99")),
    new Item("orang", 10, new BigDecimal("29.99")),
    new Item("watermelon", 10, new BigDecimal("29.99"))
);


//group by price
Map<BigDecimal, List<Item>> groupByPriceMap = items.stream().collect(groupingBy(Item::getPrice));
System.out.println(groupByPriceMap);
```

```json
{
    19.99=[Item{name='banana', qty=20, price=19.99}], 
    29.99=[Item{name='orang', qty=10, price=29.99}, Item{name='watermelon', qty=10, price=29.99}], 
    9.99=[Item{name='apple', qty=10, price=9.99}]
}
```

----------



### 1.2 group by key and count根据分类函数统计个数

```java
groupingBy(
			Function<? super T, ? extends K> classifier,
             Collector<? super T, A, D> downstream
           )
```

```java
List<Item> items = Arrays.asList(
            new Item("apple", 10, new BigDecimal("9.99")),
            new Item("banana", 20, new BigDecimal("19.99")),
            new Item("orang", 10, new BigDecimal("29.99")),
            new Item("watermelon", 10, new BigDecimal("29.99"))
        );


//group by price
Map<String, Long> counting = items.stream().collect(
groupingBy(Item::getName, Collectors.counting()));

System.out.println(counting);
```

```json
{banana=1, apple=1, orang=1, watermelon=1}
```

----------

### 1.3 group by key and sum根据分类函数求和

```java
groupingBy(
			Function<? super T, ? extends K> classifier,
             Collector<? super T, A, D> downstream
           )
```

```java
List<Item> items = Arrays.asList(
        new Item("apple", 10, new BigDecimal("9.99")),
        new Item("banana", 20, new BigDecimal("19.99")),
        new Item("orang", 10, new BigDecimal("29.99")),
        new Item("apple", 20, new BigDecimal("9.99"))
    );


//group by price
Map<String, Integer> sum = items.stream().collect(
groupingBy(Item::getName, Collectors.summingInt(Item::getQty)));

System.out.println(sum);
```

```java
{banana=20, apple=30, orang=10}
```







## 2 参考

[mkyong groupingBy](https://mkyong.com/java8/java-8-collectors-groupingby-and-mapping-example/)