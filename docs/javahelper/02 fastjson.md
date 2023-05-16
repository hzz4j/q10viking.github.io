---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /javahelper/
typora-root-url: ..\.vuepress\public
---



[fastjson 2](https://github.com/alibaba/fastjson2/wiki)的wiki文档目前看还比较少，没有[fastjson1 wike](https://github.com/alibaba/fastjson/wiki)全面，比如`TypeReference`的介绍使用都没有

[fastjson2 2.0.32 javadoc (com.alibaba.fastjson2)](https://javadoc.io/doc/com.alibaba.fastjson2/fastjson2/latest/index.html)

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

与fastjson1兼容的版本：官网说-》如果原来使用`fastjson 1.2.x`版本，可以使用兼容包，兼容包不能保证100%兼容，请仔细测试验证，发现问题请及时反馈

```java
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>2.0.32</version>
</dependency>
```

::: tip

本次试验使用fastjson2的2.0.32版本,[Source Code](https://github.com/Q10Viking/learncode/tree/main/javahelper/fastjson2-demo/src/main/java/org/hzz)

:::

## 常用语法

### 普通对象

```java
@Test
public void test_object(){
    Book book = new Book("Thinking in Java", "Bruce Eckel");
    String json = JSON.toJSONString(book); // {"author":"Bruce Eckel","name":"Thinking in Java"}
    Book book1 = JSON.parseObject(json, Book.class);
    // assertSame(book, book1); // 失败，报错
    assertEquals(book, book1); // 成功
}

@Data
@AllArgsConstructor
public class Book {
    private String name;
    private String author;
}
```



### 集合

```java
@Test
public void test_list_tojson(){
    List<Entity> entities = new ArrayList<Entity>();
    entities.add(new Entity(1,"Q10Viking"));
    entities.add(new Entity("hzz"));
    System.out.println(JSON.toJSONString(entities)); // [{"id":1,"name":"Q10Viking"},{"name":"hzz"}]
}

@Test
public void test_json_tolist(){
    String json = "[{\"id\":1,\"name\":\"Q10Viking\"},{\"name\":\"hzz\"}]";
    List<Entity> entities = JSON.parseArray(json, Entity.class);
    // [Entity(id=1, name=Q10Viking, value=null), Entity(id=null, name=hzz, value=null)]
    System.out.println(Arrays.toString(entities.toArray()));
}

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



### TypeReference泛型处理❤️

[TypeReference · alibaba/fastjson Wiki (github.com)](https://github.com/alibaba/fastjson/wiki/TypeReference)



#### 单参数

```java
@Data
public class Result<T>{
    T data;
    Status status;
    public Result(T t,Status status){
        this.data = t;
        this.status = status;
    }
}

@Test
public void single_test(){
    Result<List<Integer>> result = new Result(Arrays.asList(3,20), Status.OK);
    String json = JSON.toJSONString(result);
    // 反序列化
    Result<List<Integer>> result1 = JSON.parseObject(json, new TypeReference<Result<List<Integer>>>() {
    });
    assertEquals(result, result1); // 成功
}
```

> 官方建议使用如下的方式，性能更高

```java
private static final Type type = new TypeReference<Result<List<Integer>>>(){}.getType();
@Test
public void single_test2(){
    Result<List<Integer>> result = new Result(Arrays.asList(3,20), Status.OK);
    String json = JSON.toJSONString(result);
    // 反序列化
    Result<List<Integer>> result1 = JSON.parseObject(json, type);
    assertEquals(result, result1); // 成功
}
```

#### 多参数

```java
@Data
public class MultiResult <T,R>{
    final T data1;
    final R data2;
}
private static final Type type2 = new TypeReference<MultiResult<List<Integer>,List<String>>>() {}.getType();
@Test
public void multi_test(){
    MultiResult<List<Integer>,List<String>> multiResult = new MultiResult(Arrays.asList(3,20),
                                                                          Arrays.asList("hzz","Q10Viking"));
    String json = JSON.toJSONString(multiResult);
    System.out.println(json); // {"data1":[3,20],"data2":["hzz","Q10Viking"]}
    // 反序列化
    MultiResult<List<Integer>,List<String>> multiResult1 = JSON.parseObject(json,type2);
    assertEquals(multiResult, multiResult1); // 成功
}
```



#### 封装

```java
public class Response<T> {
     public T data;
}
public static <T> Response<T> parseToMap(String json, Class<T> type) {
     return JSON.parseObject(json, 
                            new TypeReference<Response<T>>(type) {});
}
```



```java
public static <K, V> Map<K, V> parseToMap(String json, 
                                            Class<K> keyType, 
                                            Class<V> valueType) {
     return JSON.parseObject(json, 
                            new TypeReference<Map<K, V>>(keyType, valueType) {
                            });
}

// 可以这样使用
String json = "{1:{name:\"ddd\"},2:{name:\"zzz\"}}";
Map<Integer, Model> map = parseToMap(json, Integer.class, Model.class);
assertEquals("ddd", map.get(1).name);
assertEquals("zzz", map.get(2).name);
```



### 枚举❤️

fastjson在序列化枚举类型的时候，会使用枚举字面常量。比如

```json
{"data":"hello","status":"OK"}
```

但是我们期望的是具体的值，比如

```json
{"data":"hello","status": 200}
```



#### 实现

> 使用serializeUsing，我在实验的时候，使用的是2.0.31版本，这个版本没有ObjectSerializer接口[[QUESTION\]fastjson2 的 serializeUsing属性 不再支持了？ · Issue #1449 · alibaba/fastjson2 (github.com)](https://github.com/alibaba/fastjson2/issues/1449)

然后11小时之前，发布了2.0.32版本，其中修复了这个问题。[Release fastjson 2.0.32发布 · alibaba/fastjson2 (github.com)](https://github.com/alibaba/fastjson2/releases/tag/2.0.32)

版本1的ObjectSerializer使用，参考[Fastjson处理枚举 - 个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000039984173)

这里我们使用fastjson2,ObjectWriter替换了ObjectSerializer，但是兼容版本还保留着ObjectSerializer

[Source Code](https://github.com/Q10Viking/learncode/tree/main/javahelper/fastjson2-demo/src/main/java/org/hzz/enumm)

> 定义一个枚举类型，然后实现一个接口，方便我们接下来实现的ObjectWriter和ObjectReader通用。

```java
public interface  Status {
    Integer getCode();
}

public enum HttpStatus implements Status{
    OK(200,"OK"),
    BAD_REQUEST(400,"Bad Request"),
    NOT_FOUND(404,"Not Found");
    private Integer code;
    private String desc;
    private HttpStatus(Integer code, String desc){
        this.code = code;
        this.desc = desc;
    }

    @Override
    public Integer getCode(){
        return this.code;
    }
}
```



> 序列化与反序列化实现

```java
import com.alibaba.fastjson2.JSONReader;
import com.alibaba.fastjson2.reader.ObjectReader;

import java.lang.reflect.Type;

public class StatusEnumReader implements ObjectReader {

    /**
     * 读取json中的status字段，转换为枚举类型
     * @param jsonReader
     * @param fieldType 比如：class org.hzz.enumm.HttpStatus
     * @param fieldName 比如：status
     * @param features 一个标识位 6755399441055744
     * @return
     */
    @Override
    public Object readObject(JSONReader jsonReader, Type fieldType, Object fieldName, long features) {
        // 读取json中的status字段，转换为枚举类型
        Integer code = jsonReader.read(Integer.class);
        if(code == null) return null;

        // 从class转变为枚举类型
        if (fieldType instanceof Class && Enum.class.isAssignableFrom((Class<?>) fieldType)) {
            Class<?> clazz = (Class<?>) fieldType;
            Enum<?>[] enums = (Enum<?>[]) clazz.getEnumConstants();
            for (Enum<?> e : enums) {
                if (e instanceof Status && ((Status) e).getCode().equals(code)) {
                    return e;
                }
            }
        }
        return null;
    }
}
```

```java
public class StatusEnumWriter implements ObjectWriter {
    @Override
    public void write(JSONWriter jsonWriter, Object object, Object fieldName, Type fieldType, long features) {
        if(object == null) jsonWriter.writeNull();
        if(object instanceof Status){
            jsonWriter.writeInt32(((Status)object).getCode());
        }else{
            throw new RuntimeException("not support type"+object.getClass().getName());
        }
    }
}
```



> 使用

```java
@Data
@AllArgsConstructor
public class R<T>  {
    T data;

    @JSONField(serializeUsing = StatusEnumWriter.class,
               deserializeUsing = StatusEnumReader.class)
    HttpStatus status;

    public static <T> R<T> ok(T t){
        return new R<T>(t,HttpStatus.OK);
    }
}
```



> 测试

```java
@Test
public void test_enum_writer(){
    String json = JSON.toJSONString(R.ok("hello"));
    System.out.println(json); // {"data":"hello","status":200}
}

@Test
public void test_enum_reader(){
    String json = "{\"data\":\"hello\",\"status\":200}";
    R<String> r = JSON.parseObject(json,R.class);
    System.out.println(r); // R(data=hello, status=OK)
    assertEquals(r.getStatus(),HttpStatus.OK); // true
}
```



## Annotations❤️

[fastjson2_annotations · alibaba/fastjson2 Wiki (github.com)](https://github.com/alibaba/fastjson2/wiki/fastjson2_annotations#11-定制名字序列化和反序列化)





## 通过Features配置序列化和反序列化的行为



## mixin

[fastjson2/mixin_cn.md at main · alibaba/fastjson2 · GitHub](https://github.com/alibaba/fastjson2/blob/main/docs/mixin_cn.md)







## JSONPath❤️

[fastjson2/jsonpath_cn.md at main · alibaba/fastjson2 · GitHub](https://github.com/alibaba/fastjson2/blob/main/docs/jsonpath_cn.md)

- 在FASTJSON2中，JSONPath是一等公民，支持**通过JSONPath在不完整解析JSON Document的情况下，根据JSONPath读取内容**
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



### 使用

> 重点是`JSONPath.eval`执行表达式,它有两个方法，通过jsonpath表达式既能从java对象也能从json字符串获取数据

```java
public static Object eval(String str, String path)
public static Object eval(Object rootObject, String path)
```



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

#### 简单对象

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

#### 集合❤️

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

> 读取json的所有name

```json
@Test
public void readNameFromJsonList(){
    String json = "[{\"id\":1,\"name\":\"Q10Viking\"},{\"name\":\"hzz\"}]";
    List<String> list = (List<String>)JSONPath.eval(json, "$[*].name");
System.out.println(Arrays.toString(list.toArray())); // [Q10Viking, hzz]
}
```

