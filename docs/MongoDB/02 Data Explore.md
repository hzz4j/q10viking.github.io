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

### 使用Compass

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



### 使用shell

![image-20221013205936187](/images/MongoDB/image-20221013205936187.png)



