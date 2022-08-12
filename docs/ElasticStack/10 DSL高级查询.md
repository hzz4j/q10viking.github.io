---
sidebarDepth: 4
sidebar: auto
prev:
  text: Back To 目录
  link: /ElasticStack/
typora-root-url: ..\.vuepress\public
---

## **Query DSL概述**

::: tip

1. **Domain Specific Language** 领域专用语言
2. **Elasticsearch provides a ful1 Query DSL based on JSON to define queries**  Elasticsearch提供了基于JSON的DSL来定义查询。
3. DSL由叶子查询子句和复合查询子句两种子句组成。

:::

![image-20210502152538965](/images/elasticsearch/image-20210502152538965.png)



----------

## DSL 分类

 DSL查询语言中存在两种：查询DSL（query DSL）和过滤DSL（filter DSL）

![img](/images/elasticsearch/3368)



### 查询DSL(query DSL)

在查询上下文中，查询会回答这个问题——“这个文档匹不匹配这个查询，它的相关度高么？”

如何验证匹配很好理解，如何计算相关度呢？ES中索引的数据都会存储一个**_score**分值，分值越高就代表越匹配。另外关于某个搜索的分值计算还是很复杂的，因此也需要一定的时间。

### 过滤DSL(filter DSL)

在过滤器上下文中，查询会回答这个问题——“这个文档匹不匹配？” 答案很简单，是或者不是。它不**会去计算任何分值，也不会关心返回的排序问题**，因此效率会高一点。

过滤上下文 是在使用filter参数时候的执行环境，比如在bool查询中使用must_not或者filter

另外，经常使用过滤器，**ES会自动的缓存过滤器的内容**，这对于查询来说，会提高很多性能。

```json
POST /es_db/_search
{
  "query": {
    "bool": {
      "filter": {
        "term": {
          "age": 25
        }
      }
    }
  }
}
```



## 无条件查询❤️

::: tip

无查询条件是查询所有，默认是查询所有的，或者使用**match_all**表示所有

:::

```json
GET /article/_search
{
  "query": {
    "match_all": {}
  }
}
```

## 叶子(单条件)查询

### 模糊匹配

模糊匹配主要是针对文本类型的字段，文本类型的字段会对内容进行分词，对查询时，也**会对搜索条件进行分词**，然后通过倒排索引查找到匹配的数据，模糊匹配主要通过match等参数来实现

- match : 通过match关键词模糊匹配条件内容
- prefix : 前缀匹配
- regexp : 通过正则表达式来匹配数据

#### match❤️

::: tip

[match 具体文章](https://q10viking.github.io/ElasticStack/12%20match%E6%9F%A5%E8%AF%A2.html)

:::

match：模糊匹配，**需要指定字段名，但是输入会进行分词**，比如"hello world"会进行拆分为hello和world，然后匹配，如果字段中包含hello或者world，或者都包含的结果都会被查询出来，也就是说match是一个部分匹配的模糊查询。查询条件相对来说比较宽松。

::: tip

match : 通过match关键词模糊匹配条件内容

:::

```json
POST /es_db/_search
{
  "from": 0,
  "size": 5,
  "query": {
    "match": {
      "address": "广州"
    }
  }
}
```

![image-20220812225735111](/images/elasticsearch/image-20220812225735111.png)



::: tip

match的复杂用法

:::

```
query : 指定匹配的值
operator : 匹配条件类型
	and : 条件分词后都要匹配
	or : 条件分词后有一个匹配即可(默认)
minmum_should_match : 指定最小匹配的数量
```

#### multi_match❤️

::: tip

多字段模糊查询

:::

> 相当于：   `select * from student  where name like '%张三%' or address like '%张三%'` 	    

```json
POST /es_db/_search
{
  "query": {
    "multi_match": {
      "query": "张三",
      "fields": [
        "address",
        "name"
      ]
    }
  }
}
```

#### query_string❤️

::: tip

query_string：和match类似，但是match需要指定字段名，**query_string是在所有字段中搜索，范围更广泛**

未指定字段条件查询 **query_string** , 含 AND 与 OR 条件

:::

```json
POST /es_db/_search
{
  "query": {
    "query_string": {
      "query": "广州 AND 天河"
    }
  }
}
```

![image-20220812230438903](/images/elasticsearch/image-20220812230438903.png)

::: tip

指定字段条件查询 query_string , 含 AND 与 OR 条件

:::

```json
POST /es_db/_search
{
  "query": {
    "query_string": {
      "query": "admin OR 张三",
      "fields": [
        "name",
        "address"
      ]
    }
  }
}
```

![image-20220812230845510](/images/elasticsearch/image-20220812230845510.png)

### match_phase

::: tip

match_phase：不会对输入做分词(???)，但是需要结果中也包含所有的分词，而且顺序要求一样。以"hello world"为例，要求结果中必须包含hello和world，而且还要求他们是连着的，顺序也是固定的，hello that world不满足，world hello也不满足条件。

:::



### 精准匹配

- term : 单个条件相等
- terms : 单个字段属于某个数组内的值（聚合中用到了）
- range : 字段属于某个范围内的值
- exists : 某个字段的值是否存在
- ids : 通过ID批量查询

#### term

> term:  这种查询和match在有些时候是等价的，比如我们查询单个的词hello，那么会和match查询结果一样，但是如果查询"hello world"，结果就相差很大，**因为这个输入不会进行分词**，就是说查询的时候，是查询字段分词结果中是否有"hello world"的字样，而不是查询字段中包含"hello world"的字样。当保存数据"hello world"时，elasticsearch会对字段内容进行分词，"hello world"会被分成hello和world，不存在"hello world"，因此这里的查询结果会为空。这也是term查询和match的区别。

::: tip

根据名称精确查询姓名 term, term查询不会对字段进行分词查询，会采用精确匹配 

:::

> 注意: 采用term精确查询, 查询字段映射类型属于为keyword.

```json
POST /article/_search
{
  "query": {
    "term": {
      "title.keyword": "learn es 3"
    }
  }
}
```



## 组合(多条件)查询

组合条件查询是将叶子条件查询语句进行组合而形成的一个完整的查询条件

- bool : 各条件之间有and,or或not的关系

  - must : 各个条件都必须满足，即各条件是and的关系
  - should : 各个条件有一个满足即可，即各条件是or的关系
  - must_not : 不满足所有条件，即各条件是not的关系
  - filter : 不计算相关度评分，它不计算_score即相关度评分，效率更高

- constant_score : 不计算相关度评分



**must/filter/shoud/must_not** 等的子条件是通过 **term/terms/range/ids/exists/match** 等叶子条件为参数的

> 注：以上参数，当只有一个搜索条件时，must等对应的是一个对象，当是多个条件时，对应的是一个数组



## 连接查询

::: tip

多文档合并查询

:::

- 父子文档查询：parent/child
- 嵌套文档查询: nested





## 辅助的查询

### range

::: tip

范围查询

:::

```sh
注：json请求字符串中部分字段的含义
	range：范围关键字
	gte 大于等于
	lte  小于等于
	gt 大于
	lt 小于
	now 当前时间
```

```json
POST /es_db/_search
{
  "query": {
    "range": {
      "age": {
        "gte": 25,
        "lte": 28
      }
    }
  }
}
```

### 分页、输出字段、排序查询❤️

```json
POST /es_db/_doc/_search
{
  "query": {
    "range": {
      "age": {
        "gte": 25,
        "lte": 28
      }
    }
  },
  "from": 0,
  "size": 2,
  "_source": [
    "name",
    "age"
  ],
  "sort": {
    "age": "desc"
  }
}
```

