---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /gRPC/
typora-root-url: ..\.vuepress\public
---



## 依赖

[yidongnan/grpc-spring-boot-starter: Spring Boot starter module for gRPC framework. (github.com)](https://github.com/yidongnan/grpc-spring-boot-starter)

> gRPC Server + Client
> To add a dependency using Maven, use the following:

```xml
<dependency>
  <groupId>net.devh</groupId>
  <artifactId>grpc-spring-boot-starter</artifactId>
  <version>2.12.0.RELEASE</version>
</dependency>
```

- 在 spring boot 应用中，通过 `@GrpcService` 自动配置并运行一个嵌入式的 gRPC 服务。
- 使用 `@GrpcClient` 自动创建和管理您的 gRPC Channels 和 stubs
- 使用`@GrpcGlobalClientInterceptor`和`@GrpcGlobalServerInterceptor`来设置拦截器

分开

> gRPC Client

To add a dependency using Maven, use the following:

```xml
<dependency>
  <groupId>net.devh</groupId>
  <artifactId>grpc-client-spring-boot-starter</artifactId>
  <version>2.12.0.RELEASE</version>
</dependency>
```

> gRPC Server

To add a dependency using Maven, use the following:

```xml
<dependency>
  <groupId>net.devh</groupId>
  <artifactId>grpc-server-spring-boot-starter</artifactId>
  <version>2.12.0.RELEASE</version>
</dependency>
```





## springboot整合

[Source Code](https://github.com/Q10Viking/learncode/tree/main/rpc/spring-boot-grpc)

### grpc模块

::: tip

用于转门存放protobuf生成的java代码

:::

在spring-boot-grpc-lib模块的src/main/proto目录下新增名为helloworld.proto的文件，这里面定义了一个gRPC服务，里面含有一个接口，并且还有这个接口的入参和返回结果的定义：

![image-20230419173116019](/images/grpc/image-20230419173116019.png)

```java
syntax = "proto3";

option java_multiple_files = true;
option java_package = "org.hzz.grpc.lib";
option java_outer_classname = "HelloWorldProto";

// The greeting service definition.
service Simple {
  // Sends a greeting
  rpc SayHello (HelloRequest) returns (HelloReply) {
  }
}

// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}

// The response message containing the greetings
message HelloReply {
  string message = 1;
}
```





### 服务端

依赖

```xml
<dependencies>
    <dependency>
        <groupId>net.devh</groupId>
        <artifactId>grpc-server-spring-boot-starter</artifactId>
        <version>2.12.0.RELEASE</version>
    </dependency>

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>

    <dependency>
        <groupId>org.hzz</groupId>
        <artifactId>spring-boot-grpc-lib</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>
</dependencies>

```

> 配置：grpc server的配置

```yml

spring:
  application:
    name: spring-boot-grpc-server
# gRPC有关的配置，这里只需要配置服务端口号
grpc:
  server:
    port: 9898
server:
  port: 8888
```



> 接下来是最重要的service类，gRPC服务在此处对外暴露出去` @GrpcService`

```java
@GrpcService
public class GrpcServerService extends SimpleGrpc.SimpleImplBase {
    @Override
    public void sayHello( HelloRequest request,
                         StreamObserver<HelloReply> responseObserver) {
        HelloReply reply = HelloReply.newBuilder().setMessage("Hello " + request.getName()).build();
        responseObserver.onNext(reply);
        responseObserver.onCompleted();
    }
}
```

是使用@GrpcService注解，再继承SimpleImplBase，这样就可以借助grpc-server-spring-boot-starter库将sayHello暴露为gRPC服务；

SimpleImplBase是前文中根据proto自动生成的java代码，在spring-boot-grpc-lib模块中；

sayHello方法中处理完毕业务逻辑后，调用HelloReply.onNext方法填入返回内容；

调用HelloReply.onCompleted方法表示本次gRPC服务完成；



### 客户端

> 依赖

```xml
<dependencies>
    <dependency>
        <groupId>net.devh</groupId>
        <artifactId>grpc-client-spring-boot-starter</artifactId>
        <version>2.12.0.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>

    <dependency>
        <groupId>org.hzz</groupId>
        <artifactId>spring-boot-grpc-lib</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>
</dependencies>
```

> 应用配置文件src/main/resources/application.yml，注意address的值就是gRPC服务端的信息
>
> 客户端需要知道调用服务的地址

```yml
server:
  port: 8889
spring:
  application:
    name: local-client

grpc:
  client:
    # gRPC配置的名字，GrpcClient注解会用到
    local-grpc-server:
      # gRPC服务端地址
      address: 'static://127.0.0.1:9898'
      enableKeepAlive: true
      keepAliveWithoutCalls: true
      negotiationType: plaintext
```

> 使用`@GrpcClient`注入存根stub服务

```java
@Service
public class GrpcClientService {
    @GrpcClient("local-grpc-server") // 配置的属性
    private SimpleGrpc.SimpleBlockingStub simpleStub;

    public String sendMessage(final String name) {
        try {
            final HelloReply response = this.simpleStub.sayHello(HelloRequest.newBuilder().setName(name).build());
            return response.getMessage();
        } catch (final StatusRuntimeException e) {
            return "FAILED with " + e.getStatus().getCode().name();
        }
    }
}
```

用@Service将GrpcClientService注册为spring的普通bean实例；

用@GrpcClient修饰SimpleBlockingStub，这样就可以通过grpc-client-spring-boot-starter库发起gRPC调用，被调用的服务端信息来自名为local-grpc-server的配置；

SimpleBlockingStub来自前文中根据helloworld.proto生成的java代码；

SimpleBlockingStub.sayHello方法会远程调用local-server应用的gRPC服务；



### 全局拦截器

> 服务端实现`ServerInterceptor`接口，并使用`@GrpcGlobalServerInterceptor`注解，注入spring容器

```java
@GrpcGlobalServerInterceptor
@Slf4j
public class LogGrpcInterceptor implements ServerInterceptor {
    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(ServerCall<ReqT, RespT> call, Metadata headers, ServerCallHandler<ReqT, RespT> next) {
        log.info(call.getMethodDescriptor().getFullMethodName());
        return next.startCall(call, headers);
    }
}
```

> 客户端实现接口`ClientInterceptor`，并使用`@GrpcGlobalClientInterceptor`注解，注入spring容器

```java
@GrpcGlobalClientInterceptor
@Slf4j
public class LogGrpcInterceptor implements ClientInterceptor {
    @Override
    public <ReqT, RespT> ClientCall<ReqT, RespT> interceptCall(MethodDescriptor<ReqT, RespT> method, CallOptions callOptions, Channel next) {
        log.info(method.getFullMethodName());
        return next.newCall(method, callOptions);
    }
}
```

