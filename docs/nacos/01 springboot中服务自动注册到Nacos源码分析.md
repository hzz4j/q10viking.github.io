## 服务注册



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



## Spring Cloud的接口

```
ServiceInstance  Represents an instance of a service in a discovery system.
```









## Java代码学习

多线程模式，单例工厂双重检查

```java
private NamingService buildNamingService(Properties properties) {
		if (Objects.isNull(namingService)) {
			synchronized (NacosServiceManager.class) {
				if (Objects.isNull(namingService)) {
					namingService = createNewNamingService(properties);
				}
			}
		}
		return namingService;
	}
```



## 找IP地址

[(27条消息) Java中InetAddress的使用(二)：获取本机IP地址的正确姿势【享学Java】_方向盘(YourBatman)的博客-CSDN博客](https://blog.csdn.net/f641385712/article/details/105233229/)



## JAVA JDK http请求

用服务端 用socket测试一下

```

```

```java
HttpURLConnection conn = (HttpURLConnection) uri.toURL().openConnection();
conn.setConnectTimeout
conn.setReadTimeout
    conn.setRequestMethod
```

HttpURLConnection处理了粘包，拆包问题吗？获取数据时是InputStream流



伪造响应

```
HTTP/1.1 200 OK
Bdpagetype: 1
Bdqid: 0x9755367200005f7f
Cache-Control: private
Connection: keep-alive
Content-Encoding: gzip
Content-Type: text/html;charset=utf-8
Date: Thu, 26 May 2022 17:16:22 GMT
Expires: Thu, 26 May 2022 17:16:22 GMT
Server: BWS/1.1
Set-Cookie: BDSVRTM=22; path=/
Set-Cookie: BD_HOME=1; path=/
Set-Cookie: H_PS_PSSID=36455_31253_35912_36165_36487_36074_36055_36419_36233_26350_36299_36468_22158_36447; path=/; domain=.baidu.com
Strict-Transport-Security: max-age=172800
Traceid: 1653585382242458036210904681936001720191
X-Frame-Options: sameorigin
X-Ua-Compatible: IE=Edge,chrome=1
Transfer-Encoding: chunked
```

