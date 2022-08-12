---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /ElasticStack/
typora-root-url: ..\.vuepress\public
---



## **ES数据管理概述**

1. ES是面向文档(document oriented)的，这意味着它可以存储整个对象或文档(document)。

2. 然而它不仅仅是存储，还会索引(index)每个文档的内容使之可以被搜索。

3. 在ES中，你可以对文档（而非成行成列的数据）进行索引、搜索、排序、过滤。

4. ES使用JSON作为文档序列化格式。(JSON现在已经被大多语言所支持，而且已经成为NoSQL领域的标准格式。)

5. ES存储的一个员工文档的格式示例：

   ```json
   {
       "email":"584614151@qq.com",
       "name":"张三",
       "age":30,
       "interests":[
           "篮球",
           "健身"
       ]
   }
   ```

   

