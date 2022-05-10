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

微信登录跳转之后

```
https://lp.open.weixin.qq.com/connect/l/qrconnect?uuid=021HqDC11ERu0w3k&_=1652195923321
```

```java
https://qq.jd.com/new/wx/callback.action?view=null
&uuid=8324f6ab01524cba82bce36e940795d6
&code=031Hez000ZBUNN1ERi000GzXDT0Hez0v    // 京东就可拿到这个微信传回来的code去访问用户微信的资源
&state=6CE24196ED8492E89B95165D4672DBAC0FB4BCF2822A24FD9744EC18DCD6A2922329ED0CE3741EF090751FC59B01F883
```



## 问题

我手机上点击登录之后，浏览器是怎么知道我点击了？然后自动跳转到京东页面的？触发时机是什么