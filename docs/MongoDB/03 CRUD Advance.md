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

用中括号来包裹条件

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



### Expressive

::: tip

Allows for more complex queries and for **comparing fields whith a document**

:::

- $ can be use to access the field value

> 下面的例子注意$gt,$eq后面是数组

![image-20221014145213960](/images/MongoDB/image-20221014145213960.png)

```js
db.companies.find({ "$expr": { "$eq": [ "$permalink", "$twitter_username" ] }
                  }).count()
```



### 案例

> How many companies in the `sample_training.companies` dataset were
>
> either founded in `2004`
>
> > - [and] either have the *social* `category_code` [or] *web* `category_code`,
>
> [or] were founded in the month of `October`
>
> > - [and] also either have the *social* `category_code` [or] *web* `category_code`?

我的写法

```js
 db.companies.find({ "$or": [ 
     					{ "founded_year": 2004, 
                         	"$or": [ { "category_code": "web" }, { "category_code": "social" }] 
                          },
     					{ "founded_month": 10, 
                         	"$or": [ { "category_code": "web" }, { "category_code": "social" }] }] 
                          }). count()
```

更加简洁的写法

```js
db.companies.find({ "$and": [
                        { "$or": [ { "founded_year": 2004 },
                                   { "founded_month": 10 } ] },
                        { "$or": [ { "category_code": "web" },
                                   { "category_code": "social" }]}]}).count()
```

