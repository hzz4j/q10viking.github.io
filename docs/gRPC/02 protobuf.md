---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /gRPC/
typora-root-url: ..\.vuepress\public
---





## 什么是ProtoBuf

ProtoBuf(Protocol Buffers)是一种跨平台、语言无关、可扩展的序列化结构数据的方法，可用于网络数据交换及存储。

在序列化结构化数据的机制中，ProtoBuf是灵活、高效、自动化的，相对常见的XML、JSON，描述同样的信息，ProtoBuf序列化后数据量更小 (在网络中传输消耗的网络流量更少)、序列化/反序列化速度更快、更简单。

**一旦定义了要处理的数据的数据结构之后，就可以利用ProtoBuf的代码生成工具生成相关的代码**。只需使用 Protobuf 对数据结构进行一次描述，即可利用各种不同语言(proto3支持C++, Java, Python, Go, Ruby, Objective-C, C#)或从各种不同流中对你的结构化数据轻松读写。





## ProtoBuf协议工作流程

![img](/images/grpc/163592231440.png)



在开发 gRPC 应用程序时，先要定义服务接口，其中应包含如下信息：消费者消费服务的方式、消费者能够远程调用的方法以及调用这些方法所使用的参数和消息格式等。在服务定义中所使用的语言叫作**接口定义语言**（interface definition language，IDL）。

借助服务定义，可以生成服务器端代码，也就是服务器端骨架 （这里的“骨架”和“存根”都是代理。服务器端代理叫作“骨架”（skeleton），客户端代理叫作“存根”（stub）。），它通过提供低层级的通信抽象简化了服务器端的逻辑。同时，还可以生成客户端代码，也就是客户端存根，它使用抽象简化了客户端的通信，为不同的编程语言隐藏了低层级的通信。就像调用本地函数那样，客户端能够远程调用我们在服务接口定义中所指定的方法。底层的 gRPC 框架处理所有的复杂工作，通常包括确保严格的服务契约、数据序列化、网络通信、认证、访问控制、可观察性等。



为了理解 gRPC 的基本概念，我们来看一个使用 gRPC 实现微服务的实际场景。假设我们正在构建一个在线零售应用程序，该应用程序由多个微服务组成。

如图 1-1 所示，假设我们要构建一个微服务来展现在线零售应用程序中可售商品的详情。例如，将 `ProductInfo` 服务建模为 gRPC 服务，通过网络对外暴露。

![img](/images/grpc/1636103739847-5bc59.png)



服务定义是在 ProductInfo.proto 文件中声明的，服务器端和客户端都会使用该文件来生成代码。这里假设 `ProductInfo` 服务使用 Go 语言来实现，消费者使用 Java 语言来实现，两者之间的通信则通过 HTTP/2 来进行。

典型的序列化和反序列化过程往往需要如下组件：

- IDL（Interface description language）文件：参与通讯的各方需要对通讯的内容需要做相关的约定（Specifications）。为了建立一个与语言和平台无关的约定，这个约定需要采用与具体开发语言、平台无关的语言来进行描述。这种语言被称为接口描述语言（IDL），采用IDL撰写的协议约定称之为IDL文件。
- IDL Compiler：IDL文件中约定的内容为了在各语言和平台可见，需要有一个编译器，将IDL文件转换成各语言对应的动态库。
- Stub/Skeleton Lib：负责序列化和反序列化的工作代码。Stub是一段部署在分布式系统客户端的代码，一方面接收应用层的参数，并对其序列化后通过底层协议栈发送到服务端，另一方面接收服务端序列化后的结果数据，反序列化后交给客户端应用层；Skeleton部署在服务端，其功能与Stub相反，从传输层接收序列化参数，反序列化后交给服务端应用层，并将应用层的执行结果序列化后最终传送给客户端Stub。
- Client/Server：指的是应用层程序代码，他们面对的是IDL所生存的特定语言的class或struct。
- 底层协议栈和互联网：序列化之后的数据通过底层的传输层、网络层、链路层以及物理层协议转换成数字信号在互联网中传递。



> 可以看到，对于序列化协议来说，使用方只需要关注业务对象本身，即 idl （Interface description language）定义，序列化和反序列化的代码只需要通过工具生成即可。





## protobuf定义消息❤️

在Java 中，构建一个`Person类`的数据结构，包含成员变量`name、id、email`等等

```java
// Java类

public class Person
{
    private String name;
    private Int id;
    private String email;
...
}
```

根据上述数据结构的需求，在demo`.proto`里 通过 `Protocol Buffer` 语法写入对应 `.proto`对象模型的代码



> proto2版本

```protobuf


package protocobuff_Demo;
// 关注1：包名,防止不同 .proto 项目间命名 发生冲突

option java_package = "org.hzz.protobuf";//// 作用：指定生成的类应该放在什么Java包名下
option java_outer_classname = "Demo";//作用：生成对应.java 文件的类名（不能跟下面message的类名相同）
// 关注2：option选项,作用：影响 特定环境下 的处理方式

// 关注3：消息模型 作用：真正用于描述 数据结构
// 下面详细说明
// 生成 Person 消息对象（包含多个字段，下面详细说明）
message Person {
  required string name = 1;
  required int32 id = 2;
  optional string email = 3;

  enum PhoneType {
    MOBILE = 0;
    HOME = 1;
    WORK = 2;
  }

  message PhoneNumber {
    required string number = 1;
    optional PhoneType type = 2 [default = HOME];
  }

  repeated PhoneNumber phone = 4;
}

message AddressBook {
  repeated Person person = 1;
}

```



> proto3版本

```protobuf
syntax = "proto3"; // 协议版本(proto3中，在第一行非空白非注释行，必须写：syntax = "proto3";)
package protocobuff_Demo;
// 关注1：包名,防止不同 .proto 项目间命名 发生冲突

option java_package = "org.hzz.protobuf";//// 作用：指定生成的类应该放在什么Java包名下
option java_outer_classname = "Demo";//作用：生成对应.java 文件的类名（不能跟下面message的类名相同）
// 关注2：option选项,作用：影响 特定环境下 的处理方式

// 关注3：消息模型 作用：真正用于描述 数据结构
// 下面详细说明
// 生成 Person 消息对象（包含多个字段，下面详细说明）
message Person {
     string name = 1;//(proto3消息定义时，移除了 “required”、 “optional” ：)
     int32 id = 2;//(proto3消息定义时，移除了 “required”、 “optional” ：)
     string email = 3;//(proto3消息定义时，移除了 “required”、 “optional” ：)

    enum PhoneType {
        MOBILE = 0;
        HOME = 1;
        WORK = 2;
    }

    message PhoneNumber {
        string number = 1;
        PhoneType type = 2 ;//(proto3消息定义时,移除了 default 选项：)
    }

    repeated PhoneNumber phone = 4;
}

message AddressBook {
    repeated Person person = 1;
}

```



### **消息对象**

在 `ProtocolBuffers` 中：

- 一个消息对象（`Message`） = 一个 结构化数据
- 消息对象用 修饰符 `message` 修饰
- 消息对象 含有 字段：消息对象（`Message`）里的 字段 = 结构化数据 里的成员变量

### 字段

消息对象的字段 组成主要是：**字段 = 字段修饰符 + 字段类型 +字段名 +标识号**

![img](/images/grpc/1635930091676-afecab0e-52a8-4b94-8783-079e31013bcf.png)



### 字段修饰符

作用：设置该字段解析时的规则

![img](/images/grpc/1635930240413-09e90ef1-48a2-431a-902e-16f1569c7cf0.png)

### **字段类型**

字段类型主要有 三 类：

- 基本数据 类型
- 枚举 类型
- 消息对象 类型

#### 基本数据类型

`.proto`基本数据类型 对应于 各平台的基本数据类型如下

![img](/images/grpc/1635930641089-85a62711-241f-40a3-8bef-a268b5d84cfd.png)

#### **枚举类型**

用：为字段指定一个 可能取值的字段集合，该字段只能从 该指定的字段集合里 取值

下面例子，电话号码 可能是手机号、家庭电话号或工作电话号的其中一个，那么就将`PhoneType`定义为枚举类型，并将加入电话的集合（ `MOBILE`、 `HOME`、`WORK`）



```protobuf
// 枚举类型需要先定义才能进行使用

// 枚举类型 定义
 enum PhoneType {
    MOBILE = 0;
    HOME = 1;
    WORK = 2;
// 电话类型字段 只能从 这个集合里 取值
  }

// 特别注意：
// 1. 枚举类型的定义可在一个消息对象的内部或外部
// 2. 都可以在 同一.proto文件 中的任何消息对象里使用
// 3. 当枚举类型是在一消息内部定义，希望在 另一个消息中 使用时，需要采用MessageType.EnumType的语法格式

  message PhoneNumber {
    required string number = 1;
    optional PhoneType type = 2 [default = HOME];
    // 使用枚举类型的字段（设置了默认值）
  }

// 特别注意：
// 1.  枚举常量必须在32位整型值的范围内
// 2. 不推荐在enum中使用负数：因为enum值是使用可变编码方式的，对负数不够高


```



### 标识号

作用：通过二进制格式唯一标识每个字段

1. 一旦开始使用就不能够再改变
2. 标识号使用范围：[1,2的29次方 - 1]



每个字段在进行编码时都会占用内存，而 占用内存大小 取决于 标识号：

1. 范围 [1,15] 标识号的字段 在编码时占用1个字节；
2. 范围 [16,2047] 标识号的字段 在编码时占用2个字节





## 生成代码❤️

```sh
# 从项目的根路径执行该命令，并添加了两个参数：java_out，定义./src/main/java/为Java代码的输出目录；
protoc --java_out=./src/main/java ./demo.proto
```

(编译器为每个.proto文件里的每个消息类型生成一个.java文件&一个Builder类 (Builder类用于创建消息类接口))

```java

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;

public class TestProto {
    public static void main(String[] args) {
        // 步骤1:通过 消息类的内部类Builder类 构造 消息类的消息构造器
        Demo.Person.Builder personBuilder =  Demo.Person.newBuilder();

        // 步骤2:设置你想要设置的字段为你选择的值
        personBuilder.setName("Lisi");// 在定义.proto文件时,该字段的字段修饰符是required,所以必须赋值
        personBuilder.setId(123);// 在定义.proto文件时,该字段的字段修饰符是required,所以必须赋值
        personBuilder.setEmail("lisi.ho@foxmail.com"); // 在定义.proto文件时,该字段的字段修饰符是optional,所以可赋值 / 不赋值(不赋值时将使用默认值)

        Demo.Person.PhoneNumber.Builder phoneNumber =  Demo.Person.PhoneNumber.newBuilder();
        phoneNumber.setType( Demo.Person.PhoneType.HOME);// 直接采用枚举类型里的值进行赋值
        phoneNumber.setNumber("0157-23443276");
        // PhoneNumber消息是嵌套在Person消息里,可以理解为内部类
        // 所以创建对象时要通过外部类来创建

        // 步骤3:通过 消息构造器 创建 消息类 对象
        Demo.Person person = personBuilder.build();

        // 步骤4:序列化和反序列化消息(两种方式)

        /*方式1：直接 序列化 和 反序列化 消息 */
        // a.序列化
        byte[] byteArray1 = person.toByteArray();
        // 把 person消息类对象 序列化为 byte[]字节数组
        System.out.println(Arrays.toString(byteArray1));
        // 查看序列化后的字节流

        // b.反序列化
        try {

            Demo.Person person_Request = Demo.Person.parseFrom(byteArray1);
            // 当接收到字节数组byte[] 反序列化为 person消息类对象

            System.out.println(person_Request.getName());
            System.out.println(person_Request.getId());
            System.out.println(person_Request.getEmail());
            // 输出反序列化后的消息
        } catch (IOException e) {
            e.printStackTrace();
        }


        /*方式2：通过输入/ 输出流（如网络输出流） 序列化和反序列化消息 */
        // a.序列化
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        try {

            person.writeTo(output);
            // 将消息序列化 并写入 输出流(此处用 ByteArrayOutputStream 代替)

        } catch (IOException e) {
            e.printStackTrace();
        }

        byte[] byteArray = output.toByteArray();
        // 通过 输出流 转化成二进制字节流

        // b. 反序列化
        ByteArrayInputStream input = new ByteArrayInputStream(byteArray);
        // 通过 输入流 接收消息流(此处用 ByteArrayInputStream 代替)

        try {

            Demo.Person person_Request = Demo.Person.parseFrom(input);
            // 通过输入流 反序列化 消息

            System.out.println(person_Request.getName());
            System.out.println(person_Request.getId());
            System.out.println(person_Request.getEmail());
            // 输出消息
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```





### 序列化原理解析

请记住`Protocol Buffer`的 **三个关于数据存储** 的重要结论：

- 结论1： `Protocol Buffer`**将 消息里的每个字段 进行编码后，再利用**`T - L - V` **存储方式 进行数据的存储，最终得到的是一个 二进制字节流**

`T - L - V` 的数据存储方式

即 `Tag - Length - Value`，标识 - 长度 - 字段值 存储方式

以 **标识 - 长度 - 字段值** 表示单个数据，最终将所有数据拼接成一个 **字节流**，从而 实现 数据存储 的功能

其中 `Length`可选存储，如 储存`Varint`编码数据就不需要存储`Length`

**示意图**

![img](/images/grpc/1636008674522-79d7e0c2-0259-424e-9ff0-5d81d46f0b98.png)

优点从上图可知，`T - L - V`存储方式的优点是

1. 1. 不需要**分隔符** 就能 分隔开**字段**，减少了 **分隔符** 的使用
   2. 各字段 存储得非常紧凑，存储空间利用率非常高
   3. 若 字段没有被设置字段值，那么该字段在序列化时的数据中是完全不存在的，即不需要编码



- 结论2：`Protocol Buffer`对于不同数据类型 采用不同的 序列化方式（编码方式 & 数据存储方式），如下图：

![img](/images/grpc/1636008478634-52a9c152-6f3b-458e-af4c-1fd50bdd92a4.png)

从上表可以看出：

1. 对于存储`Varint`编码数据，就不需要存储字节长度 `Length`，所以实际上`Protocol Buffer`的存储方式是 `T - V`；
2. 若`Protocol Buffer`采用其他编码方式（如`LENGTH_DELIMITED`）则采用`T - L - V`
3. 因为 `Protocol Buffer`对于数据字段值的 **独特编码方式** & `T - L - V`**数据存储方式**，使得 `Protocol Buffer`序列化后数据量体积如此小



#### 总结

Protocol Buffer的序列化 & 反序列化简单 & 速度快的原因是：

1. 编码 / 解码 方式简单（只需要简单的数学运算 = 位移等等）
2. 采用 Protocol Buffer 自身的框架代码 和 编译器 共同完成

Protocol Buffer的数据压缩效果好（即序列化后的数据量体积小）的原因是：

1. 采用了独特的编码方式，如Varint、Zigzag编码方式等等
2.  采用T - L - V 的数据存储方式：减少了分隔符的使用 & 数据存储得紧凑



--------



## protobuf定义服务

如果想要将消息类型用在RPC(远程方法调用)系统中，可以在.proto文件中定义一个RPC服务接口，protocol buffer编译器将会根据所选择的不同语言生成服务接口代码及存根。如，想要定义一个RPC服务并具有一个方法，该方法能够接收 SearchRequest并返回一个SearchResponse，此时可以在.proto文件中进行如下定义

```protobuf
service SearchService {
  rpc Search (SearchRequest) returns (SearchResponse);
}
```



## 扩展

[Protobuf2 语法指南](https://colobu.com/2015/01/07/Protobuf-language-guide/)



[Protobuf3 语法指南](https://colobu.com/2017/03/16/Protobuf3-language-guide/)

