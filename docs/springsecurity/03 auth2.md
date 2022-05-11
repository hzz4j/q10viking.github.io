---
typora-root-url: images
---

## 京东微信登录（授权码模式）

[OAuth2 京东登录流程](https://www.processon.com/view/link/5fc4a242079129329898f55d)

```
https://open.weixin.qq.com/connect/qrconnect?
appid=wx827225356b689e24
&state=6CE24196ED8492E89B95165D4672DBAC0FB4BCF2822A24FD9744EC18DCD6A2922329ED0CE3741EF090751FC59B01F883
&redirect_uri=https://qq.jd.com/new/wx/callback.action?view=null
&uuid=8324f6ab01524cba82bce36e940795d6
&response_type=code
&scope=snsapi_login#wechat_redirect
```



关于微信扫码页面为什么知道，用户的手机端进行了何种操作，它的前端不断发送了轮询请求。去微信服务端查询了用户操作的状态。

```java
// 不断发送这个请求
https://lp.open.weixin.qq.com/connect/l/qrconnect?uuid=0510X1L21rfcGa14&last=404&_=1652249139352

// 如果没有扫码
window.wx_errcode=408;window.wx_code='';
// 扫码成功
window.wx_errcode=404;window.wx_code='';
// 取消登录
window.wx_errcode=403;window.wx_code='';
// 授权登录
window.wx_errcode=405;window.wx_code='071vDl000X8kON13q5000PWr744vDl05';
```

```java
https://qq.jd.com/new/wx/callback.action?view=null
&uuid=8324f6ab01524cba82bce36e940795d6
&code=031Hez000ZBUNN1ERi000GzXDT0Hez0v    // 京东就可拿到这个微信传回来的code去访问用户微信的资源
&state=6CE24196ED8492E89B95165D4672DBAC0FB4BCF2822A24FD9744EC18DCD6A2922329ED0CE3741EF090751FC59B01F883
```



## 问题

我手机上点击登录之后，浏览器是怎么知道我点击了？然后自动跳转到京东页面的？触发时机是什么？

![image-20220511144256729](/image-20220511144256729.png)

回调地址：redirect_uri=https://qq.jd.com/new/wx/callback.action?view=null

**后端回调地址的使用**

微信后端会回调京东后台服务的这个接口。此时京东服务器就能拿到code，得到了用户的授权，从微信服务器中获取到用户的资料

**前端回调地址的使用**

微信服务器和京东服务器的交互，对用户来说是完全透明的。那么用户浏览器的交互怎么处理呢？经过分析，在用户停留在扫码页面时的阶段，该页面不端发送了请求，查询用户在微信服务端的操作状态。当收到微信服务端传回来的wx_errcode，前端进行相应的处理。如果时405，那么浏览器将会使用回调地址，跳转到京东的页面。

```java
// 不断发送这个请求
https://lp.open.weixin.qq.com/connect/l/qrconnect?uuid=0510X1L21rfcGa14&last=404&_=1652249139352
// 如果没有扫码
window.wx_errcode=408;window.wx_code='';
// 扫码成功
window.wx_errcode=404;window.wx_code='';
// 取消登录
window.wx_errcode=403;window.wx_code='';
// 授权登录
window.wx_errcode=405;window.wx_code='071vDl000X8kON13q5000PWr744vDl05';
```

