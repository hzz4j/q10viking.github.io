## 服务注册

[springboot中服务自动注册到Nacos源码分析 | ProcessOn免费在线作图,在线流程图,在线思维导图 |](https://www.processon.com/view/link/6290d8e67d9c085adb70702b)

## 服务拉取

切入点

**NamingProxy**   callServer  api 是 list



## nacosRestTemplate分析

setInterceptors 拦截器的作用

org.apache.http.HttpStatus

服务实例

```
serviceId 取的是应用名       应用名@@group (mall-user@@group)
group： 默认DEFAULT_GROUP
IP: IP地址
port: 端口 
clusterName：集群名称 DEFAULT
weight: 权重 默认为1
enabled: 实例是否允许接收请求 默认true
metadata: 扩展的属性
ephemeral: 是否是临时的 默认true
```

```
namespaceId
serviceName  应用名@@group (mall-user@@group)
group： 默认DEFAULT_GROUP
```

> **虽然最后使用的post方法发送，但是这些参数都被携带再来url中**

## Spring Cloud的接口

```
ServiceInstance  Represents an instance of a service in a discovery system.
```



## 找IP地址

TODO

[(27条消息) Java中InetAddress的使用(二)：获取本机IP地址的正确姿势【享学Java】_方向盘(YourBatman)的博客-CSDN博客](https://blog.csdn.net/f641385712/article/details/105233229/)


