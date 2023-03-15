---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /nacos/
typora-root-url: ..\.vuepress\public
---



## 从应用层分析BIO Socket通信

https://www.processon.com/view/link/62903c09f346fb41eeb5b997)

## 底层使用

```
RestResultResponseHandler 返回结果时时怎么处理泛型的？
```



## HttpURLConnection

1. 基于http协议的
2. 是阻塞式的
3. 处理了粘包粘包的需求？



## JDK

```
// string to byte[]
  byte[] bytes = "hello".getBytes(StandardCharsets.UTF_8);

  // byte[] to string
  String s = new String(bytes, StandardCharsets.UTF_8);
```

HttpURLConnection是**基于http协议的类**，用于与服务端进行http协议的通信。只有调用过相关的getResponseXXX才会将数据发送出去。即使之前outputstream.write  并且 flush也没用。http协议是一个有去有回的协议。

[HTTP消息 - HTTP | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Messages)

[POST - HTTP | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/POST)

[HTTP Headers - HTTP | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers)

看看发送一个对象是怎么处理的

```java
application/x-www-form-urlencoded: 数据被编码成以 '&' 分隔的键-值对, 同时以 '=' 分隔键和值. 非字母或数字的字符会被 percent-encoding: 这也就是为什么这种类型不支持二进制数据(应使用 multipart/form-data 代替).
```

```http
application/json;charset=UTF-8 
{"body-key2":"body-val2","body-key1":"body-val1"}

application/x-www-form-urlencoded
body-key2=body-val2&body-key1=body-val1&
```




[java URL和URI_PacosonSWJTU的博客-CSDN博客_java url和uri](https://blog.csdn.net/PacosonSWJTU/article/details/121070498)







