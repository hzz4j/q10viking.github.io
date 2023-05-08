---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---





[Source Code](https://github.com/Q10Viking/learncode/tree/main/dubbo/dubbo-api-task)

## 定义服务接口

服务接口 Dubbo 中沟通消费端和服务端的桥梁。

```java
public interface GreetingService {
    String sayHi(String name);
}
```



## 定义服务端的实现

定义了服务接口之后，可以在服务端这一侧定义对应的实现，这部分的实现相对于消费端来说是远端的实现，本地没有相关的信息。

```java
public class GreetingServiceImpl implements GreetingService{
    @Override
    public String sayHi(String name) {
        return "Hi, " + name;
    }
}
```



## 服务端发布服务

在实现了服务之后，通过 Dubbo 的 API 在网络上发布这个服务。

1. 首先是基于 `ServiceConfig` 定义了发布的服务信息，包括接口的信息以及对应的实现类对象

2. 然后是配置 Dubbo 启动器，传入了应用名，注册中心地址，协议的信息以及服务的信息等

   > 注：DubboBootstrap 中的`registry` 、`protocol` 和 `service` 可以多次传入。

```java
public class Application {
    public static void main(String[] args) {
        // 定义具体的服务
        ServiceConfig<GreetingService> service = new ServiceConfig<>();
        service.setInterface(GreetingService.class);
        service.setRef(new GreetingServiceImpl());

        // 启动 Dubbo
        DubboBootstrap.getInstance()
                .application("first-dubbo-provider")
                .registry(new RegistryConfig("zookeeper://172.29.96.105:2181"))
                .protocol(new ProtocolConfig("dubbo", -1))
                .service(service)
                .start()
                .await();
    }
}
```





## 消费端订阅并调用

对于消费端，可以通过 Dubbo 的 API 可以进行消费端订阅。

1. 首先是基于 `ReferenceConfig` 定义了订阅的服务信息，包括接口的信息

2. 其次是配置 Dubbo 启动器，传入了应用名，注册中心地址，协议的信息以及服务的信息等

3. 最后是获取到动态代理的对象并进行调用

   > 注：DubboBootstrap 中支持 `service` 和 `reference` 可以同时传入，意味着一个应用可以同时即是消费端、也是服务端

```java
public class Application {
    public static void main(String[] args) throws IOException {
        ReferenceConfig<GreetingService> reference = new ReferenceConfig<>();
        reference.setInterface(GreetingService.class);

        DubboBootstrap.getInstance()
                .application("first-dubbo-consumer")
                .registry(new RegistryConfig("zookeeper://172.29.96.105:2181"))
                .reference(reference);

        GreetingService service = reference.get();
        String message = service.sayHi("Q10Viking");
        System.out.println("Receive result ======> " + message);
        System.in.read();
    }
}
```





## 启动

> 先启动服务提供者，日志中打印出`DubboBootstrap awaiting...`代表成功

![image-20230508231221043](/images/dubbo/image-20230508231221043.png)

> 接着在启动服务端，可以看到调用成功

![image-20230508231443870](/images/dubbo/image-20230508231443870.png)





## zk中的信息

> 我启动了两个服务提供实例，只启动了一个消费者实例，在zk的体现如下

![image-20230508232806950](/images/dubbo/image-20230508232806950.png)



借助[URL解码 URL编码 在线URL解码/编码工具 iP138在线工具](https://tool.ip138.com/urlencode/)，进行解码

> 服务端信息，可以看到服务提供者的【ip+port】不同

```http
dubbo://192.168.1.5:20882/org.hzz.GreetingService?anyhost=true&application=first-dubbo-provider&background=false&deprecated=false&dubbo=2.0.2&dynamic=true&environment=product&executor-management-mode=isolation&file-cache=true&generic=false&interface=org.hzz.GreetingService&methods=sayHi&pid=21056&prefer.serialization=fastjson2,hessian2&release=3.2.0&service-name-mapping=true&side=provider&timestamp=1683559572642
```

```http
dubbo://192.168.1.5:20880/org.hzz.GreetingService?anyhost=true&application=first-dubbo-provider&background=false&deprecated=false&dubbo=2.0.2&dynamic=true&environment=product&executor-management-mode=isolation&file-cache=true&generic=false&interface=org.hzz.GreetingService&methods=sayHi&pid=18156&prefer.serialization=fastjson2,hessian2&release=3.2.0&service-name-mapping=true&side=provider&timestamp=1683559174104
```

> 消费订阅者的信息

```http
consumer://192.168.1.5/org.hzz.GreetingService?application=first-dubbo-consumer&background=false&category=consumers&check=false&dubbo=2.0.2&environment=product&executor-management-mode=isolation&file-cache=true&interface=org.hzz.GreetingService&methods=sayHi&pid=20456&release=3.2.0&side=consumer&sticky=false&timestamp=1683559454009&unloadClusterRelated=false
```



--------------

![image-20230508233347656](/images/dubbo/image-20230508233347656.png)

```json
{
  "name" : "first-dubbo-provider",
  "id" : "192.168.1.5:20880",
  "address" : "192.168.1.5",
  "port" : 20880,
  "sslPort" : null,
  "payload" : {
    "@class" : "org.apache.dubbo.registry.zookeeper.ZookeeperInstance",
    "id" : "192.168.1.5:20880",
    "name" : "first-dubbo-provider",
    "metadata" : {
      "dubbo.endpoints" : "[{\"port\":20880,\"protocol\":\"dubbo\"}]",
      "dubbo.metadata-service.url-params" : "{\"prefer.serialization\":\"fastjson2,hessian2\",\"version\":\"1.0.0\",\"dubbo\":\"2.0.2\",\"release\":\"3.2.0\",\"side\":\"provider\",\"port\":\"20880\",\"protocol\":\"dubbo\"}",
      "dubbo.metadata.revision" : "02c0ec2be52e9d9f54872b85d88e351c",
      "dubbo.metadata.storage-type" : "local",
      "timestamp" : "1683559174104"
    }
  },
  "registrationTimeUTC" : 1683559180249,
  "serviceType" : "DYNAMIC",
  "uriSpec" : null
}
```



## 参考

[2 - 基于 Dubbo API 开发微服务应用 | Apache Dubbo](https://cn.dubbo.apache.org/zh-cn/overview/quickstart/java/api/)

