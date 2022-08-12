---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /ElasticStack/
typora-root-url: ..\.vuepress\public
---



## match❤️

match：模糊匹配，**需要指定字段名，但是输入会进行分词**，比如"hello world"会进行拆分为hello和world，然后匹配，如果字段中包含hello或者world，或者都包含的结果都会被查询出来，也就是说match是一个部分匹配的模糊查询。查询条件相对来说比较宽松。

::: tip

match : 通过match关键词模糊匹配条件内容

:::

```json
POST /es_db/_search
{
  "from": 0,
  "size": 5,
  "query": {
    "match": {
      "address": "广州"
    }
  }
}
```

![image-20220812225735111](/images/elasticsearch/image-20220812225735111.png)



::: tip

match的复杂用法

:::

```
query : 指定匹配的值
operator : 匹配条件类型
	and : 条件分词后都要匹配
	or : 条件分词后有一个匹配即可(默认)
minmum_should_match : 指定最小匹配的数量
```

#### 



## 逻辑条件控制精准度

下述搜索中，如果document中的remark字段包含java或developer词组，都符合搜索条件

```json
GET /es_db/_search
{
  "query": {
    "match": {
      "remark": "java developer"
    }
  }
}
```

如果需要搜索的document中的remark字段，包含java和developer词组，则需要使用下述语法：

>  使用: operator的逻辑 and or

```json
GET /es_db/_search
{
  "query": {
    "match": {
      "remark": {
        "query": "java developer",
        "operator": "and"
      }
    }
  }
}
```

上述语法中，如果将operator的值改为or。则与第一个案例搜索语法效果一致。默认的ES执行搜索的时候，operator就是or。



----------



## 指定匹配出现的比例

`minimum_should_match`可以**使用百分比或固定数字**。

- **百分比代表query搜索条件中词条百分比**，如果无法整除，向下匹配（如，query条件有3个单词，如果使用百分比提供精准度计算，那么是无法除尽的，如果需要至少匹配两个单词，则需要用67%来进行描述。如果使用66%描述，ES则认为匹配一个单词即可。）。
- 固定数字代表**query搜索条件中的词条，至少需要匹配多少个**。

如果在搜索的结果document中，需要remark字段中包含多个搜索词条中的一定比例，可以使用下述语法实现搜索。

```json
GET /es_db/_search
{
  "query": {
    "match": {
      "remark": {
        "query": "java architect assistant",
        "minimum_should_match": "68%"
      }
    }
  }
}
```



----------



## 组合多条件查询

**如果使用should+bool搜索的话，也可以控制搜索条件的匹配度。**

具体如下：下述案例代表搜索的document中的remark字段中，必须匹配java、developer、assistant三个词条中的至少2个。

```json
GET /es_db/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "remark": "java"
          }
        },
        {
          "match": {
            "remark": "developer"
          }
        },
        {
          "match": {
            "remark": "assistant"
          }
        }
      ],
      "minimum_should_match": 2
    }
  }
}
```

