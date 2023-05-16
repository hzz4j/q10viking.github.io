---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /javahelper/
typora-root-url: ..\.vuepress\public
---



[alibaba/fastjson2: 🚄 FASTJSON2 is a Java JSON library with excellent performance. (github.com)](https://github.com/alibaba/fastjson2)

`FASTJSON 2`是一个性能极致并且简单易用的Java JSON库。

- `FASTJSON 2`是`FASTJSON`项目的重要升级，和FASTJSON 1相比，性能有非常大的提升，解决了autoType功能因为兼容和白名单的安全性问题。
- 性能极致，性能远超过其他流行JSON库，包括jackson/gson/org.json

![image-20230516124030558](/images/javahelper/image-20230516124030558.png)

## 依赖

```java
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2</artifactId>
    <version>2.0.32</version>
</dependency>
```



## 常用语法



## mixin

[fastjson2/mixin_cn.md at main · alibaba/fastjson2 · GitHub](https://github.com/alibaba/fastjson2/blob/main/docs/mixin_cn.md)







## JSONPath

[fastjson2/jsonpath_cn.md at main · alibaba/fastjson2 · GitHub](https://github.com/alibaba/fastjson2/blob/main/docs/jsonpath_cn.md)

- 在FASTJSON2中，JSONPath是一等公民，支持通过JSONPath在不完整解析JSON Document的情况下，根据JSONPath读取内容
- 也支持用JSONPath对JavaBean求值，可以在Java框架中当做对象查询语言（OQL）来使用

### 支持语法

| JSONPATH                       | 描述                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| $                              | 根对象，例如$.name                                           |
| [num]                          | 数组访问，其中num是数字，可以是负数。例如$[0].leader.departments[-1].name |
| [num0,num1,num2...]            | 数组多个元素访问，其中num是数字，可以是负数，返回数组中的多个元素。例如$[0,3,-2,5] |
| [start:end]                    | 数组范围访问，其中start和end是开始小表和结束下标，可以是负数，返回数组中的多个元素。例如$[0:5] |
| [start:end :step]              | 数组范围访问，其中start和end是开始小表和结束下标，可以是负数；step是步长，返回数组中的多个元素。例如$[0:5:2] |
| [?(@.key)]                     | 对象属性非空过滤，例如$.departs[?(@.name)]                   |
| [?(@.key > 123)]               | 数值类型对象属性比较过滤，例如$.departs[id >= 123]，比较操作符支持=,!=,>,>=,<,<= |
| [?(@.key = '123')]             | 字符串类型对象属性比较过滤，例如$.departs[?(@..name = '123')]，比较操作符支持=,!=,>,>=,<,<= |
| [?(@.key like 'aa%')]          | 字符串类型like过滤， 例如$.departs[?(@..name like 'sz*')]，通配符只支持%支持not like |
| [?(@.key rlike 'regexpr')]     | 字符串类型正则匹配过滤，                                     |
| [?(@.key in ('v0', 'v1'))]     | IN过滤, 支持字符串和数值类型	例如: $.departs[?(@.name in ('wenshao','Yako'))] $.departs[id not in (101,102)] |
| [?(@.key between 234 and 456)] | BETWEEN过滤, 支持数值类型，支持not between 例如: $.departs[?(@.id between 101 and 201)] <br/> $.departs[?(@.id not between 101 and 201)] |
| length() 或者 size()           | 数组长度。例如$.values.size() 支持类型java.util.Map和java.util.Collection和数组 |
| keySet()                       | 获取Map的keySet或者对象的非空属性名称。例如$.val.keySet() 支持类型：Map和普通对象. 不支持：Collection和数组（返回null） |
| .                              | 属性访问，例如$.name                                         |
| ..                             | deepScan属性访问，例如$..name                                |
| *                              | 对象的所有属性，例如$.leader.*                               |
| ['key']                        | 属性访问。例如$['name']                                      |
| ['key0','key1']                | 多个属性访问。例如$['id','name']                             |

以下两种写法的语义是相同的：

```java
$.store.book[0].title
```

和

```java
$['store']['book'][0]['title']
```

### 函数

| Function      | 返回类型 | Description                |
| ------------- | -------- | -------------------------- |
| type          | string   | 返回对象的类型             |
| length/size   | integer  | 返回集合或者字符串的长度   |
| first         | Any      | 集合中第一个元素           |
| last          | Any      | 集合中最后一个元素         |
| keys / keySet | sequence | 返回Map类型的KeySet        |
| values        | sequence | Map类型的Values            |
| entries       | sequence | Map类型的EntrySet          |
| trim          | string   | 对字符串做trim后返回       |
| double        | double   | 将目标类型转换为double类型 |
| ceil          | number   | 对数值类型做ceil处理返回   |
| abs           | number   | 返回对数值类型的绝对值     |
| lower         | string   | 将字符串转换小写           |
| upper         | string   | 将字符串转换成大写         |
| index(x)      | int      | 其中参数x支持数值和字符串  |

### 聚合函数

| Function | 返回类型 | Description                |
| -------- | -------- | -------------------------- |
| min      |          |                            |
| max      |          |                            |
| first    |          | 返回集合中的第一个元素     |
| last     |          | 返回集合中的最后一个个元素 |
| avg      | double   |                            |

### Filter Operators

| Operator        | Description       |
| --------------- | ----------------- |
| =               | 相等              |
| !=  or <>       | 不等              |
| >               | 大于              |
| >=              | 大于等于          |
| <               | 小于              |
| <=              | 小于等于          |
| ~=              |                   |
| like            | 类似SQL中LIKE语法 |
| not like        |                   |
| rlike           |                   |
| not rlike       |                   |
| in              |                   |
| not in          |                   |
| between         |                   |
| not between     |                   |
| starts_with     |                   |
| not starts_with |                   |
| ends_with       |                   |
| not ends_with   |                   |
| contains        |                   |
| not contains    |                   |

### 语法举例

| JSONPath | 语义              |
| -------- | ----------------- |
| $        | 根对象            |
| $[-1]    | 最后元素          |
| $[:-2]   | 第1个至倒数第2个  |
| $[1:]    | 第2个之后所有元素 |
| $[1,2,3] | 集合中1,2,3个元素 |



### API

> 重点是`JSONPath.eval`执行表达式

```java
@Data
public class Entity {
    private Integer id;
    private String name;
    private Object value;

    public Entity() {}
    public Entity(Integer id, Object value) { this.id = id; this.value = value; }
    public Entity(Integer id, String name) { this.id = id; this.name = name; }
    public Entity(String name) { this.name = name; }
}
```



> 简单对象

```java
@Test
public void test_jsonpath(){
    Entity entity = new Entity(123, new Object());
    System.out.println(JSONPath.eval(entity,"$.id")); // 123
    assertSame(entity.getValue(), JSONPath.eval(entity, "$.value"));
    assertTrue(JSONPath.contains(entity, "$.value"));
    // fastjson版本2中没有containsValue方法和size方法
    // fastjson版本1中有containsValue方法和size方法

    //assertTrue(JSONPath.containsValue(entity, "$.id", 123));
    //assertTrue(JSONPath.containsValue(entity, "$.value", entity.getValue()));
    //assertEquals(2, JSONPath.size(entity, "$"));
    //assertEquals(0, JSONPath.size(new Object[], "$"));
}
```

> 读取集合所有元素的name

```java
@Test
public void read_list_name(){
    List<Entity> entities = new ArrayList<Entity>();
    entities.add(new Entity("Q10Viking"));
    entities.add(new Entity("hzz"));
    List<String> result = (List<String>)JSONPath.eval(entities, "$[*].name");
    System.out.println(Arrays.toString(result.toArray())); // [Q10Viking, hzz]
}
```

