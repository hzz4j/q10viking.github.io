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