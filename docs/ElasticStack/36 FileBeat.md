---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /ElasticStack/
typora-root-url: ..\.vuepress\public
---



[Filebeat 7.17.3 | Elastic](https://www.elastic.co/cn/downloads/past-releases/filebeat-7-17-3)



## 配置文件

> 修改配置文件输出到logstash





## WIndows环境

```sh
# 查看可以模块列表
E:\apache\filebeat-7.17.3-windows-x86_64>filebeat.exe modules list
```



## 启动

```
filebeat.exe ‐e ‐c filebeat.yml
```



## 实践

[静默-日志搜索](https://q10viking.github.io/skywalking/05%20es%E6%8C%81%E4%B9%85%E5%8C%96%E4%B8%8E%E6%97%A5%E5%BF%97%E6%90%9C%E7%B4%A2.html)
