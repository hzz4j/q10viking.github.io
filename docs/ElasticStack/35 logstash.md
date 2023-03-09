---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /ElasticStack/
typora-root-url: ..\.vuepress\public
---



> 能够从多个来源采集数据，转换数据， 然后将数据发送到您最喜欢的存储库中

## 安装

[Logstash 7.17.3 | Elastic](https://www.elastic.co/cn/downloads/past-releases/logstash-7-17-3)

直接解压

## 测试安装

```sh
#‐e选项表示，直接把配置放在命令中，这样可以有效快速进行测
 bin/logstash -e 'input { stdin{ } } output { stdout{ } }'
```

![image-20230309125617481](/images/elasticsearch/image-20230309125617481.png)



## Grok插件

Grok是一种将非结构化日志解析为结构化的插件。这个工具非常适合用来解析系统日志、 Web服务器日志

## Grok语法

Grok是通过模式匹配的方式来识别日志中的数据,可以把Grok插件简单理解为升级版本的正 则表达式。**grok模式的语法是**

```java
%{SYNTAX:SEMANTIC}
```

[GROK模式参考 (aliyun.com)](https://help.aliyun.com/document_detail/129387.html?scm=20140722.184.2.173)

