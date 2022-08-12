---
prev:
  text: Back To 目录
  link: /ElasticStack/
typora-root-url: ..\.vuepress\public
---



## **ElasticSearch（简称ES）**

Elasticsearch是用Java开发并且是当前最流行的开源的企业级搜索引擎。

能够达到实时搜索，稳定，可靠，快速，安装使用方便。

客户端支持Java、.NET（C#）、PHP、Python、Ruby等多种语言

**官方网站:** **https://www.elastic.co/**

**下载地址** https://www.elastic.co/cn/start



## **应用场景**

![](/images/elasticsearch/3219)

![](/images/elasticsearch/3220.png)



## **ElasticSearch与Lucene的关系**

> es底层基于Lucene

Lucene可以被认为是迄今为止最先进、性能最好的、功能最全的**搜索引擎库**（框架）

但是想要使用Lucene，必须使用Java来作为开发语言并将其直接集成到你的应用中，并且Lucene的配置及使用非常复杂，你需要深入了解检索的相关知识来理解它是如何工作的。

Lucene缺点：

1. 只能在Java项目中使用,并且要以jar包的方式直接集成项目中
2. 使用非常复杂-创建索引和搜索索引代码繁杂
3. 不支持集群环境-索引数据不同步（不支持大型项目）
4. 索引数据如果太多就不行，索引库和应用所在同一个服务器,共同占用硬盘.共用空间少.

上述Lucene框架中的缺点,ES全部都能解决.



## **哪些公司在使用Elasticsearch**

```
1. 京东
2. 携程
3. 去哪儿
4. 58同城
5. 滴滴
6. 今日头条
7. 小米
8. 哔哩哔哩
9. 联想
10. GitHup
11. 微软
12. Facebook
```



## **ES vs Solr比较**

1. Solr 利用 Zookeeper 进行分布式管理，而Elasticsearch 自身带有分布式协调管理功能。 
2. Solr 支持更多格式的数据，比如JSON、XML、CSV，而 Elasticsearch 仅支持json文件格式。 
3. Solr 在传统的搜索应用中表现好于 Elasticsearch，但在处理实时搜索应用时效率明显低于 Elasticsearch。 
4. Solr 是传统搜索应用的有力解决方案，但 Elasticsearch更适用于新兴的实时搜索应用。

### **ES vs Solr 检索速度**

当单纯的对已有数据进行搜索时，Solr更快。

![](/images/elasticsearch/3221.png)

当**实时建立索引**时, Solr会产生io阻塞，查询性能较差, Elasticsearch具有明显的优势。

![](/images/elasticsearch/3222.png)

大型互联网公司，实际生产环境测试，将搜索引擎从Solr转到 Elasticsearch以后的平均查询速度有了50倍的提升。



## **ES vs 关系型数据库**⭐

![](/images/elasticsearch/image-20210501224440651.png)

