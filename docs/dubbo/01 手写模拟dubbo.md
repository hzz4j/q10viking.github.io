---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



## 框架选型

- 通信框架基于netty
- 注册中心使用zookeeper



## 具体实现

[Source Code](https://github.com/Q10Viking/learncode/tree/main/dubbo/dubbo-simulate)

### Dubbo协议

```java
public class DubboProtocol implements Protocol {
    // 启动一个Netty服务端
    @Override
    public void start(URL url) {
        NettyServer nettyServer = new NettyServer();
        nettyServer.start(url.getHostname(), url.getPort());

    }

    // 消费这每次请求的服务的时候临时创建一个Netty客户端
    @Override
    public String send(URL url, Invocation invocation) {
        NettyClient nettyClient = new NettyClient();
        return nettyClient.send(url.getHostname(),url.getPort(), invocation);
    }
}
```



### 服务端

服务启动的时候往注册中心注册服务。让后再本地的JVM中注册具体的服务实现类

```java
// 注册服务
URL url = new URL("localhost", 8888); //NetUtil
ZookeeperRegister.regist(HelloService.class.getName(), url);

//  服务：实现类
LocalRegister.regist(HelloService.class.getName(), HelloServiceImpl.class);
```

当消费端请求服务的时候，从本地注册中心获取具体的类，进行反射调用

```java
Class serviceImpl = LocalRegister.get(invocation.getInterfaceName());

Method method = serviceImpl.getMethod(invocation.getMethodName(), invocation.getParamTypes());
Object result = method.invoke(serviceImpl.newInstance(), invocation.getParams());
```



### 消费端

通过代理创建一个服务的本地存根

```java
// 创建本地存根
HelloService helloService = ProxyFactory.getProxy(HelloService.class);
// 进行调用
String xxx = helloService.sayHello("hzz");
```

代理实现

```java
public class ProxyFactory<T> {

    @SuppressWarnings("unchecked")
    public static <T> T getProxy(final Class interfaceClass) {
        return (T)Proxy.newProxyInstance(interfaceClass.getClassLoader(), new Class[]{interfaceClass}, new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                String mock = System.getProperty("mock");
                if (mock != null && mock.startsWith("return:")) {
                    String result = mock.replace("return:", "");
                    return result;
                }

                Invocation invocation = new Invocation(interfaceClass.getName(), method.getName(), method.getParameterTypes(), args);
                
                List<URL> urlList = ZookeeperRegister.get(interfaceClass.getName());
                URL url = LoadBalance.random(urlList);
                Protocol protocol = ProtocolFactory.getProtocol();
                String result = protocol.send(url, invocation);
                return result;
            }
        });
    }

}
```





## 补充

> 通过jvm参数选择dubbo协议

![image-20230508222216259](/images/dubbo/image-20230508222216259.png)
