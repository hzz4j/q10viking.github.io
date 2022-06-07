---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /RocketMQ/
typora-root-url: ..\.vuepress\public
---

## 测试mqadmin管理工具

RocketMQ的源代码中并没有为我们提供类似于Nacos或者RabbitMQ那样的控制台，只提供了一个mqadmin指令来管理RocketMQ，命令在bin目录下。使用方式是 mqadmin {command} {args},如

```sh
mqadmin clusterList -n localhost:9876
```

注意：

1. 几乎所有指令都需要通过-n参数配置nameServer地址，格式为ip:port

2. 几乎所有执行都可以通过-h参数获得帮助

3. 当既有Broker地址(-b)又有集群名称clustername(-c)配合项，则优先以Broker地址执行指令。如果不配置Broker地址，则对集群中所有主机执行指令

```sh
# 指令查看帮助
mqadmin help {command} 
```

