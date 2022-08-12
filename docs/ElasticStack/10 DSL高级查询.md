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

