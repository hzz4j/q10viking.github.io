---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MongoDB/
typora-root-url: ..\.vuepress\public
---



## Query Operators

[Query and Projection Operators — MongoDB Manual](https://www.mongodb.com/docs/manual/reference/operator/query/)

### Comparison

[Query and Projection Operators — MongoDB Manual](https://www.mongodb.com/docs/manual/reference/operator/query/#comparison)

```js
db.trips.find({ "tripduration": { "$lte" : 70 },
                "usertype": { "$ne": "Subscriber" } }).pretty()
```

### Logical

[Logical Query Operators — MongoDB Manual](https://www.mongodb.com/docs/manual/reference/operator/query-logical/)

![image-20221014114747470](/images/MongoDB/image-20221014114747470.png)



> Which is **the most succinct** query to return all documents from the `sample_training.inspections` collection where the inspection date is either `"Feb 20 2015"`, or `"Feb 21 2015"` and the company is **not** part of the `"Cigarette Retail Dealer - 127"` sector?

::: details

```js
// $and隐式
db.inspections.find(
  { "$or": [ { "date": "Feb 20 2015" },
             { "date": "Feb 21 2015" } ],
    "sector": { "$ne": "Cigarette Retail Dealer - 127" }}).pretty()
```

:::



#### $nor的理解

[$nor — MongoDB Manual](https://www.mongodb.com/docs/manual/reference/operator/query/nor/)

```js
db.zips.find({ "pop": { "$gte": 5000, "$lte": 1000000 }}).count()
// 等价
db.zips.find({ "$nor": [ { "pop": { "$lt":5000 } },
             { "pop": { "$gt": 1000000 } } ] } ).count()
```

- pop字段不能小于5000 并且（AND）
- pop字段不能大于1000000