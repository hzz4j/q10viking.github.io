---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /ElasticStack/
typora-root-url: ..\.vuepress\public
---



## best fields策略进行多字段搜索

::: tip

best fields策略： 搜索的document中的某一个field，尽可能多的匹配搜索条件。如百度搜索使用这种策略。

:::

## dis_max

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