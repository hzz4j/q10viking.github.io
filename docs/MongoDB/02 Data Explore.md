---
sidebarDepth: 3
prev:
  text: Back To 目录
  link: /MongoDB/
typora-root-url: ..\.vuepress\public
---





> json中，field居然可以有空格

```json
{
    "birth year": 1961,
    "start station name": "Howard St & Centre St"
}
```



## find

::: tip

Data Explore

:::

### count

::: tip

使用JSON来进行查询query，JSON用来过滤

:::

![image-20221013201642737](/images/MongoDB/image-20221013201642737.png)

### pretty

![image-20221013202003051](/images/MongoDB/image-20221013202003051.png)



## insert

### insertOne

#### 使用Compass

使用Compass插入一个document，体验感很好。

![image-20221013204057844](/images/MongoDB/image-20221013204057844.png)

```json
{
  "_id": {
    "$oid": "634805f1fdc811be8ae13b1c"
  },
  "id": "1012-2015-VIKI",
  "business_name": "Learning MongoDB",
  "date": {
    "$date": {
      "$numberLong": "1429632000000"
    }
  },
  "result": "Violation Issued",
  "sector": "Home Improvement Contractor - 100",
  "address": {
    "city": "BeiJing",
    "zip": 11428,
    "street": "210TH ST",
    "number": 9440
  }
}
```



#### 使用shell

>  由于`_id`是唯一的，复制后先删除它，在进行内容的修改, `_id`会由MongDB自动生成，如果不指定

在MongoDB中文档的内容可以完全一样，但是必须`_id`不一样。当然可以通过MongoDB's schema validation functionality来限制插入文档的内容。

![image-20221013205936187](/images/MongoDB/image-20221013205936187.png)

### 插入多个

用数组包裹

```sh
db.inspections.insert([{ "_id": 1, "test": 1 },{ "_id": 1, "test": 2 },
                       { "_id": 3, "test": 3 }])
```

#### ordered

::: tip

默认是true

:::

看下面的案例，test 2和test 3都没有被插入进去，由于是顺序插入，当发现错误的时候，后面的就停止插入了，最后只有一条数据test 1被插入进去。

::: details


```sh
Atlas atlas-tt61iy-shard-0 [primary] sample_training> db.inspections.insert([{ "_id": 1, "test": 1 },{ "_id": 1, "test": 2 },
...                        { "_id": 3, "test": 3 }])
Uncaught:
MongoBulkWriteError: E11000 duplicate key error collection: sample_training.inspections index: _id_ dup key: { _id: 1 }
Result: BulkWriteResult {
  result: {
    ok: 1,
    writeErrors: [
      WriteError {
        err: {
          index: 1,
          code: 11000,
          errmsg: 'E11000 duplicate key error collection: sample_training.inspections index: _id_ dup key: { _id: 1 }',
          errInfo: undefined,
          op: { _id: 1, test: 2 }
        }
      }
    ],
    writeConcernErrors: [],
    insertedIds: [
      { index: 0, _id: 1 },
      { index: 1, _id: 1 },
      { index: 2, _id: 3 }
    ],
    nInserted: 1,
    nUpserted: 0,
    nMatched: 0,
    nModified: 0,
    nRemoved: 0,
    upserted: [],
    opTime: { ts: Timestamp({ t: 1665667043, i: 4 }), t: Long("17") }
  }
}
Atlas atlas-tt61iy-shard-0 [primary] sample_training> db.inspections.find({"_id":3})

Atlas atlas-tt61iy-shard-0 [primary] sample_training> db.inspections.find({"_id":1})
[ { _id: 1, test: 1 } ]
```

:::

> 设置ordered为false,当出现错误的时候仍然插入后面的。此时可以看到test 3被插入进去了，尽管前面的test 1,test 2出现了key重复的问题。

::: details

```sh
Atlas atlas-tt61iy-shard-0 [primary] sample_training> db.inspections.insert([{ "_id": 1, "test": 1 },{ "_id": 1, "test": 2 },
...                        { "_id": 3, "test": 3 }],{ "ordered": false })
Uncaught:
MongoBulkWriteError: E11000 duplicate key error collection: sample_training.inspections index: _id_ dup key: { _id: 1 }
Result: BulkWriteResult {
  result: {
    ok: 1,
    writeErrors: [
      WriteError {
        err: {
          index: 0,
          code: 11000,
          errmsg: 'E11000 duplicate key error collection: sample_training.inspections index: _id_ dup key: { _id: 1 }',
          errInfo: undefined,
          op: { _id: 1, test: 1 }
        }
      },
      WriteError {
        err: {
          index: 1,
          code: 11000,
          errmsg: 'E11000 duplicate key error collection: sample_training.inspections index: _id_ dup key: { _id: 1 }',
          errInfo: undefined,
          op: { _id: 1, test: 2 }
        }
      }
    ],
    writeConcernErrors: [],
    insertedIds: [
      { index: 0, _id: 1 },
      { index: 1, _id: 1 },
      { index: 2, _id: 3 }
    ],
    nInserted: 1,
    nUpserted: 0,
    nMatched: 0,
    nModified: 0,
    nRemoved: 0,
    upserted: [],
    opTime: { ts: Timestamp({ t: 1665667392, i: 6 }), t: Long("17") }
  }
}
Atlas atlas-tt61iy-shard-0 [primary] sample_training> db.inspections.find({"_id":3})
[ { _id: 3, test: 3 } ]
```
:::
