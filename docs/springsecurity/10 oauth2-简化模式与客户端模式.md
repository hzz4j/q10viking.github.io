## 简化模式

::: tip

有些 Web 应用是纯前端应用，没有后端。**允许直接向前端颁发令牌，这种方式没有授权码这个中间步骤**

:::

[Source Code]()

```java
//配置grant_type，表示授权类型
.authorizedGrantTypes("implicit");
```

登录之后进入授权页面，确定授权后浏览器会重定向到指定路径，并以Hash的形式存放在重定向uri的fargment中：  

http://localhost:8080/oauth/authorize?client_id=client&response_type=token&scope=all&redirect_uri=http://www.baidu.com

结果：

```sh
https://www.baidu.com/#access_token=f24c7edc-24a3-4a7a-9306-270702480292&token_type=bearer&expires_in=3599
```



## 客户端模式

::: tip

指客户端以自己的名义，而不是以用户的名义，向"服务提供商"进行授权。

**适用于没有前端的命令行应用，即在命令行下请求令牌**

:::