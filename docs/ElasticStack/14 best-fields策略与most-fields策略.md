---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /ElasticStack/
typora-root-url: ..\.vuepress\public
---



## best fields策略

::: tip

best fields策略： 搜索的document中的某一个field，尽可能多的匹配搜索条件。如百度搜索使用这种策略。

:::

## dis_max❤️

::: tip

基于dis_max实现best fields策略进行多字段搜索

:::

> **dis_max语法： 直接获取搜索的多条件中的，单条件query相关度分数最高的数据，以这个数据做相关度排序**

下述的案例中，就是找name字段中rod匹配相关度分数或remark字段中java developer匹配相关度分数，哪个高，就❤️使用哪一个相关度分数进行结果排序❤️。

```json
GET /es_db/_search
{
  "query": {
    "dis_max": {
      "queries": [
        {
          "match": {
            "name": "rod"
          }
        },
        {
          "match": {
            "remark": "java developer"
          }
        }
      ]
    }
  }
}
```



- **优点：精确匹配的数据可以尽可能的排列在最前端，且可以通过minimum_should_match来去除长尾数据，避免长尾数据字段对排序结果的影响**

> 长尾数据比如说我们搜索4个关键词，但很多文档只匹配1个，也显示出来了，这些文档其实不是我们想要的

- **缺点：相对排序不均匀**

### tie_breaker❤️

::: tip

基于tie_breaker参数优化dis_max搜索效果

tie_breaker参数代表的含义是：将其他query搜索条件的相关度分数乘以参数值，再参与到结果排序中。如果不定义此参数，相当于参数值为0。所以其他query条件的相关度分数被忽略。

:::

**dis_max是将多个搜索query条件中相关度分数最高的用于结果排序，忽略其他query分数**，在某些情况下，可能还需要其他query条件中的相关度介入最终的结果排序，这个时候可以使用tie_breaker参数来优化dis_max搜索。

```json
GET /es_db/_search
{
  "query": {
    "dis_max": {
      "queries": [
        {
          "match": {
            "name": "rod"
          }
        },
        {
          "match": {
            "remark": "java developer"
          }
        }
      ],
      "tie_breaker": 0.5
    }
  }
}
```

----------



### multi_match❤️

::: tip

使用multi_match简化dis_max+tie_breaker

:::

```json
GET /es_db/_search
{
  "query": {
    "dis_max": {
      "queries": [
        {
          "match": {
            "name": "rod"
          }
        },
        {
          "match": {
            "remark": {
              "query": "java developer",
              "boost": 2,
              "minimum_should_match": 2
            }
          }
        }
      ],
      "tie_breaker": 0.5
    }
  }
}
```

> 使用multi_match语法为：其中type常用的有best_fields和most_fields。^n代表权重，相当于"boost":n             

```json
GET /es_db/_search
{
  "query": {
    "multi_match": {
      "query": "rod java developer",
      "fields": [
        "name",
        "remark^2"
      ],
      "type": "best_fields",
      "tie_breaker": 0.5,
      "minimum_should_match": "50%"
    }
  }
}
```

----------



## most fields策略❤️

::: tip

cross fields ： 一个唯一的标识，分部在多个fields中，使用这种唯一标识搜索数据就称为cross fields搜索。如：人名可以分为姓和名，地址可以分为省、市、区县、街道等。那么使用人名或地址来搜索document，就称为cross fields搜索。

实现这种搜索，一般都是使用most fields搜索策略。因为这就不是一个field的问题。

:::

Cross fields搜索策略，是从多个字段中搜索条件数据。默认情况下，和most fields搜索的逻辑是一致的，计算相关度分数是和best fields策略一致的。一般来说，如果使用cross fields搜索策略，那么都会携带一个额外的参数operator。用来标记搜索条件如何在多个字段中匹配。

当然，在ES中也有cross fields搜索策略。具体语法如下：

> 搜索条件中的java必须在name或remark字段中匹配，developer也必须在name或remark字段中匹配。

```json
GET /es_db/_search
{
  "query": {
    "multi_match": {
      "query": "java developer",
      "fields": [
        "name",
        "remark"
      ],
      "type": "cross_fields",
      "operator": "and"
    }
  }
}
```



### 缺点

most field策略问题：most fields策略是尽可能匹配更多的字段，所以会导致精确搜索结果排序问题。又因为cross fields搜索，不能使用minimum_should_match来去除长尾数据

所以在使用most fields和cross fields策略搜索数据的时候，都有不同的缺陷。所以商业项目开发中，都推荐使用best fields策略实现搜索。

