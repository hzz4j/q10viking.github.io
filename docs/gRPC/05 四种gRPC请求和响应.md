---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /gRPC/
typora-root-url: ..\.vuepress\public
---



当数据量大或者需要不断传输数据时候，我们应该使用流式RPC，它允许我们边处理边传输数据

gRPC主要有4种请求和响应模式，分别是`简单模式(Simple RPC)`、`服务端流式（Server-side streaming RPC）`、`客户端流式（Client-side streaming RPC）`、和`双向流式（Bidirectional streaming RPC）`。

- `简单模式(Simple RPC)`：客户端发起请求并等待服务端响应。
- `服务端流式（Server-side streaming RPC）`：客户端发送请求到服务器，拿到一个流去读取返回的消息序列。 客户端读取返回的流，直到里面没有任何消息。
- `客户端流式（Client-side streaming RPC）`：与服务端数据流模式相反，这次是客户端源源不断的向服务端发送数据流，而在发送结束后，由服务端返回一个响应。
- `双向流式（Bidirectional streaming RPC）`：双方使用读写流去发送一个消息序列，两个流独立操作，双方可以同时发送和同时接收。



## 服务端流案例

[Source Code](https://github.com/Q10Viking/learncode/tree/main/rpc/grpcStream)

以服务端流为例：

客户端发送请求到服务器，拿到一个流去读取返回的消息序列。 客户端读取返回的流，直到里面没有任何消息。

> proto文件,注意return回来的是stream 类型

```protobuf
syntax = "proto3";

option java_multiple_files = true;
// 生成java代码的package
option java_package = "org.hzz.grpc.api";
// 类名
option java_outer_classname = "MallProto";

// gRPC服务，这是个在线商城的订单查询服务
service OrderQuery {
  // 服务端流式：订单列表接口，入参是买家信息，返回订单列表(用stream修饰返回值)
  rpc ListOrders (Buyer) returns (stream Order) {}
}

// 买家ID
message Buyer {
  int32 buyerId = 1;
}

// 返回结果的数据结构
message Order {
  // 订单ID
  int32 orderId = 1;
  // 商品ID
  int32 productId = 2;
  // 交易时间
  int64 orderTime = 3;
  // 买家备注
  string buyerRemark = 4;
}

```



### 服务端

> 实现

```java
public class OrderQueryServiceImpl extends OrderQueryGrpc.OrderQueryImplBase{
    /**
     * mock一批数据
     * @return
     */
    private static List<Order> mockOrders(){
        List<Order> list = new ArrayList<>();
        Order.Builder builder = Order.newBuilder();

        for (int i = 0; i < 10; i++) {
            list.add(builder
                    .setOrderId(i)
                    .setProductId(1000+i)
                    .setOrderTime(System.currentTimeMillis()/1000)
                    .setBuyerRemark(("remark-" + i))
                    .build());
        }

        return list;
    }

    @Override
    public void listOrders(Buyer request, StreamObserver<Order> responseObserver) {
        // 持续输出到client
        for (Order order : mockOrders()) {
            try {
                TimeUnit.SECONDS.sleep(5); // 模拟耗时操作
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            responseObserver.onNext(order);
        }
        // 结束输出
        responseObserver.onCompleted();
    }

}

```



```java
public class GRPCServer {
    private static final int port = 50051;

    public static void main(String[] args) throws IOException, InterruptedException {
        //设置service端口
        ////创建server对象,监听端口,注册服务并启动
        Server server = ServerBuilder.forPort(port)//监听50051端口
                .addService(new OrderQueryServiceImpl())//注册服务
                .build()//创建Server对象
                .start();//启动
        System.out.println(String.format("GRpc服务端启动成功, 端口号: %d.", port));

        //我们将调用 awaittermination() 以保持服务器在后台保持运行。
        server.awaitTermination();
    }
}
```



### 客户端

```java
package org.hzz;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.hzz.grpc.api.Buyer;
import org.hzz.grpc.api.Order;
import org.hzz.grpc.api.OrderQueryGrpc;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Iterator;

public class GRPCClient {
    private static final Logger logger = LoggerFactory.getLogger(GRPCClient.class);
    private static final String host = "localhost";
    private static final int serverPort = 50051;
    public static void main(String[] args) {
        //1,拿到一个通信channel
        ManagedChannel channel = ManagedChannelBuilder.forAddress(host, serverPort).
                usePlaintext()////这里将使用纯文本，无需任何加密
                .build();
        try {

            //2.拿到stub对象
            OrderQueryGrpc.OrderQueryBlockingStub orderQueryBlockingStub = OrderQueryGrpc.newBlockingStub(channel);
            // 我们可以使用newBuilder 来设置 RPCDateRequest 对象的用户名属性。并得到从服务器返回的 RPCDateResponse 对象。
            // gRPC的请求参数
            Buyer buyer = Buyer.newBuilder().setBuyerId(101).build();

            // 通过stub发起远程gRPC请求

            // gRPC的响应
            Iterator<Order> orderIterator;
            orderIterator = orderQueryBlockingStub.listOrders(buyer);

            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            while (orderIterator.hasNext()) {
                Order order = orderIterator.next();
                logger.info("订单ID：{}产品ID：{}日期：{}备注：{}",
                        order.getOrderId(),
                        order.getProductId(),
                        // 使用DateTimeFormatter将时间戳转为字符串
                        dtf.format(LocalDateTime.ofEpochSecond(order.getOrderTime(), 0, ZoneOffset.of("+8"))),
                        order.getBuyerRemark());
            }
        } finally {
            // 5.关闭channel, 释放资源.
            channel.shutdown();
        }

    }
}
/**
 * 2023-04-19 16:38:21.729 [INFO ] org.hzz.GRPCClient [main] : 订单ID：0产品ID：1000日期：2023-04-19 16:38:16备注：remark-0
 * 2023-04-19 16:38:26.717 [INFO ] org.hzz.GRPCClient [main] : 订单ID：1产品ID：1001日期：2023-04-19 16:38:16备注：remark-1
 * 2023-04-19 16:38:31.725 [INFO ] org.hzz.GRPCClient [main] : 订单ID：2产品ID：1002日期：2023-04-19 16:38:16备注：remark-2
 * 2023-04-19 16:38:36.734 [INFO ] org.hzz.GRPCClient [main] : 订单ID：3产品ID：1003日期：2023-04-19 16:38:16备注：remark-3
 * 2023-04-19 16:38:41.735 [INFO ] org.hzz.GRPCClient [main] : 订单ID：4产品ID：1004日期：2023-04-19 16:38:16备注：remark-4
 * 2023-04-19 16:38:46.749 [INFO ] org.hzz.GRPCClient [main] : 订单ID：5产品ID：1005日期：2023-04-19 16:38:16备注：remark-5
 * 2023-04-19 16:38:51.758 [INFO ] org.hzz.GRPCClient [main] : 订单ID：6产品ID：1006日期：2023-04-19 16:38:16备注：remark-6
 * 2023-04-19 16:38:56.759 [INFO ] org.hzz.GRPCClient [main] : 订单ID：7产品ID：1007日期：2023-04-19 16:38:16备注：remark-7
 * 2023-04-19 16:39:01.766 [INFO ] org.hzz.GRPCClient [main] : 订单ID：8产品ID：1008日期：2023-04-19 16:38:16备注：remark-8
 * 2023-04-19 16:39:06.767 [INFO ] org.hzz.GRPCClient [main] : 订单ID：9产品ID：1009日期：2023-04-19 16:38:16备注：remark-9
 */
```

