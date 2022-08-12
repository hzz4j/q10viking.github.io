---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /ElasticStack/
typora-root-url: ..\.vuepress\public
---



## boost权重控制

::: tip

控制搜索精准度（❤️排序❤️）

:::

搜索document中remark字段中包含java的数据，如果remark中包含developer或architect，则包含architect的document优先显示。（就是将architec**t数据匹配时的相关度分数增加**）。

一般用于搜索时相关度排序使用。如：电商中的综合排序。将一个商品的销量，广告投放，评价值，库存，单价比较综合排序。在上述的排序元素中，广告投放权重最高，库存权重最低。

```json
GET /es_db/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "remark": "java"
          }
        }
      ],
      "should": [
        {
          "match": {
            "remark": {
              "query": "developer",
              "boost": 1
            }
          }
        },
        {
          "match": {
            "remark": {
              "query": "architect",
              "boost": 3
            }
          }
        }
      ]
    }
  }
}
```

