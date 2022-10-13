---
sidebarDepth: 3
prev:
  text: Back To 目录
  link: /MongoDB/
typora-root-url: ..\.vuepress\public
---

::: tip

MongoDB is a NoSQL database that uses documents to store data in an organized way

:::

[Altas MongoDB云平台](https://cloud.mongodb.com/v2/6344901a4678943557d643e8#clusters)

目前我使用 outlook 账户进行学习

```
m001-q10viking
m001-mongodb-basic
```

## 安装 MongoDB

### macOS

[https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/#std-label-osx-prereq)

[MongoDB GUI Studio3T](https://studio3t.com/) 还有官方提供的 MongoDB Compass

或者使用 vscode mongodb 插件



## 连接Altas

```sh
# 使用mongosh myFirstDatabase代表要连接的数据库
mongosh "mongodb+srv://sandbox.he3gsda.mongodb.net/myFirstDatabase" --username m001-q10viking

# compass
mongodb+srv://m001-q10viking:<password>@sandbox.he3gsda.mongodb.net/myFirstDatabase
```

### windows平台

`mongosh`命令行连接mongodb。需要配置环境变量[Install mongosh — MongoDB Shell](https://www.mongodb.com/docs/mongodb-shell/install/)

![image-20221013145208345](/images/MongoDB/image-20221013145208345.png)





## 资源

[论坛：MongoDB Developer Community Forums - A place to discover, learn, and grow with MongoDB technologies](https://www.mongodb.com/community/forums/)

[Online Courses | MongoDB University](https://university.mongodb.com/courses/catalog?_ga=2.56807458.903548860.1665632456-835634694.1665632456)
