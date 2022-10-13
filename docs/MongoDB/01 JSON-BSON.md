---
sidebarDepth: 3
prev:
  text: Back To 目录
  link: /MongoDB/
typora-root-url: ..\.vuepress\public
---



[The MongoDB Database Tools Documentation — MongoDB Database Tools](https://www.mongodb.com/docs/database-tools/)

## BSON

实验目的：将altas上的数据进行备份，然后导入到本地的mongdb上

### mongodump备份

将MongoDB中的数据备份(导出)成BSON的格式

```sh
# 将数据库sample_supplies全部备份 默认会在当前目录dump\sample_supplies
PS D:\learncode\mongodb\M001> mongodump --uri "mongodb+srv://m001-q10viking:m001-mongodb-basic@sandbox.he3gsda.mongodb.net/sample_supplies"
```

```sh
PS D:\learncode\mongodb\M001> tree /f
卷 DATA 的文件夹 PATH 列表
卷序列号为 0641-76D2
D:.
└─dump
    └─sample_supplies
            sales.bson
            sales.metadata.json
```



### mongorestore恢复

将BSON数据导入到本地mongodb

```sh
# 出于于实验的目的 添加--drop选项，删除mongod中的数据，(mongod就是mongodb server service instance的意思)
恢复dump目录下的数据，文件夹sample_supplies代表数据库，sales.bson文件名，代表collection
mongorestore --uri "mongodb://localhost:27017"  --drop dump/
# 可以简写为
mongorestore   --drop dump/
```

```sh
2022-10-13T17:22:40.290+0800    preparing collections to restore from
2022-10-13T17:22:40.319+0800    reading metadata for sample_supplies.sales from dump\sample_supplies\sales.metadata.json
2022-10-13T17:22:40.321+0800    dropping collection sample_supplies.sales before restoring
2022-10-13T17:22:40.606+0800    restoring sample_supplies.sales from dump\sample_supplies\sales.bson
2022-10-13T17:22:40.963+0800    finished restoring sample_supplies.sales (5000 documents, 0 failures)
2022-10-13T17:22:40.964+0800    no indexes to restore for collection sample_supplies.sales
2022-10-13T17:22:40.965+0800    5000 document(s) restored successfully. 0 document(s) failed to restore.
```



## JSON

### mongoexport导出

导出数据以JSON格式

```sh
# 导出sample_supplies数据库下的集合sales到sales.json文件
mongoexport --uri="mongodb+srv://m001-q10viking:m001-mongodb-basic@sandbox.he3gsda.mongodb.net/sample_supplies" --collection=sales --out=sales.json
```

```sh
PS D:\learncode\mongodb\M001> ls

    Directory: D:\learncode\mongodb\M001

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d----          2022/10/13    16:36                dump
-a---          2022/10/13    16:59        4204134 sales.json
```



### mongoimport导入

```sh
# 导入sales.json到数据库sample_supplies,集合默认为文件名sales
# --drop会删除mongodb中的sales集合的数据
PS D:\learncode\mongodb\M001> mongoimport --uri="mongodb://localhost:27017/sample_supplies" --drop sales.json

2022-10-13T17:07:56.654+0800    no collection specified
2022-10-13T17:07:56.672+0800    using filename 'sales' as collection
2022-10-13T17:07:57.304+0800    connected to: mongodb://localhost:27017/sample_supplies
2022-10-13T17:07:57.304+0800    dropping: sample_supplies.sales
2022-10-13T17:07:57.938+0800    5000 document(s) imported successfully. 0 document(s) failed to import.
```



## 小结

通过上面的例子，可以简单理解一下MongoDB，数据库就像文件夹，数据集合就是文件名，文件内容里面是一个个document.document里面是field

```sh
D:.
│
└─dump
    └─sample_supplies
            sales.bson
            sales.metadata.json
```

