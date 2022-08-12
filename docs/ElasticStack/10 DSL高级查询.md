---
sidebarDepth: 3
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



## 无条件查询

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

#### match

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

### 精准匹配

- term : 单个条件相等
- terms : 单个字段属于某个值数组内的值
- range : 字段属于某个范围内的值
- exists : 某个字段的值是否存在
- ids : 通过ID批量查询

#### term

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