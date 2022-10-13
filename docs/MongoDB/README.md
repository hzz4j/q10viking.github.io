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
# 使用mongosh myFirstDatabase代表要连接的数据库默认
mongosh "mongodb+srv://sandbox.he3gsda.mongodb.net/myFirstDatabase" --username m001-q10viking

# compass
mongodb+srv://m001-q10viking:<password>@sandbox.he3gsda.mongodb.net/myFirstDatabase
```

## windows环境配置

MongoDB中所有的工具下载链接[Download MongoDB Software Locally for Free | MongoDB](https://www.mongodb.com/try/download)



### MongoDB Server

::: tip

安装MongoDB服务器作为Windows的一个服务

:::

[Install MongoDB Community Edition on Windows — MongoDB Manual](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/#install-mongodb-community-edition)

在安装的过程会出现提示是否安装**MongoDB Compass**，很好用的GUI工具，建议安装。



### MongoDB Shell

::: tip

`mongosh`命令行连接mongodb。需要配置环境变量[Install mongosh — MongoDB Shell](https://www.mongodb.com/docs/mongodb-shell/install/)

:::



![image-20221013145208345](/images/MongoDB/image-20221013145208345.png)

```sh
#版本
C:\Users\11930>mongosh --version
1.6.0
# 连接
C:\Users\11930>mongosh "mongodb+srv://sandbox.he3gsda.mongodb.net/myFirstDatabase" --apiVersion 1 --username m001-q10viking
```

![image-20221013145544474](/images/MongoDB/image-20221013145544474.png)



## MongoDB Database Tools

::: tip

提供了mongoimport,mongoexport等工具

[Installation — MongoDB Database Tools](https://www.mongodb.com/docs/database-tools/installation/installation/)

:::

官网描述：这些命令行工具，已经从MongoDB Server中剥离出来了，所以安装了MongoDB Server，并没有这些工具，需要单独安装。

> Starting with MongoDB 4.4, the MongoDB Database Tools are now released separately from the MongoDB Server and use their own versioning, with an initial version of `100.0.0`.  --- from [Installing the Database Tools on Windows — MongoDB Database Tools](https://www.mongodb.com/docs/database-tools/installation/installation-windows/)













## 资源

[论坛：MongoDB Developer Community Forums - A place to discover, learn, and grow with MongoDB technologies](https://www.mongodb.com/community/forums/)

[Online Courses | MongoDB University](https://university.mongodb.com/courses/catalog?_ga=2.56807458.903548860.1665632456-835634694.1665632456)

[Altas MongoDB云平台](https://cloud.mongodb.com/v2/6344901a4678943557d643e8#clusters)
