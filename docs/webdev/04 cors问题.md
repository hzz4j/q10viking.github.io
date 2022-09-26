---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /webdev/
typora-root-url: ..\.vuepress\public
---



## CORS

Cross-Origin Resource Sharing。是浏览器的行为，出于安全原因，浏览器限制从脚本发起的跨源HTTP请求，浏览器通过HTTP的HEADER来判断是否允许加载跨域的资源。

一个跨域的例子，从https://domain-a.com的前端js代码请求https://domain-b.com/data.json提供的数据。

![image-20220926122703916](/images/webdev/image-20220926122703916.png)



### 代码验证

::: tip

验证 1. cors问题的出现. 2.cors只发生在浏览器端

:::

> 为了方便快速实验cors机制，采用node+express来开发一个简单的web服务器

服务端代码app.js

```js
import express from "express";

const app = express()
app.get("/test",(req,res)=>{
    res.json({name:'Q10Viking'})
})

app.listen(9000,()=>{
    console.log("server start at 9000");
})
```

客户端代码:

> 文件说明，项目采用webpack管理，默认不配置webpack.打包的逻辑是src/index.js,打包后成立main.js

:::: code-group

::: code-group-item index.js

```js
// 前端脚本
import axios from "axios";
const api = "http://localhost:9000/test"

axios.get(api).then(response => {
    console.log(response.data)
}).catch(e => console.log("cors appear"))
```

:::

::: code-group-item index.html

```html
<body>
    <h2>Cors 实验</h2>
    <div class="person">
        Hello: <span id="name"></span>
    </div>
    <script src="main.js"></script>
</body>
```
:::
::::

浏览器中出现跨域请求http://127.0.0.1:5500/dist/index.html请求http://localhost:9000/test的资源,此时跨域问题出现了

![image-20220926125820871](/images/webdev/image-20220926125820871.png)

```sh
Access to XMLHttpRequest at 'http://localhost:9000/test' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

在index.js脚本当中,请求了不同源的资源.浏览器限制加载该资源.(可以看到api接口返回的是200,是可以调通的,但是浏览器限制了资源的加载)

![image-20220926130314335](/images/webdev/image-20220926130314335.png)

> 在node环境中执行前端的index.js脚本,可以看到有数据.

![image-20220926131603859](/images/webdev/image-20220926131603859.png)



```
Access to XMLHttpRequest at 'https://api.co2signal.com/v1/latest?countryCode=FR' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```



```json
'access-control-allow-origin': '*',  
'access-control-allow-headers': 'Origin, X-Requested-With, Content-Type, Accept, electricitymap-token',
```

[Cross-Origin Resource Sharing (CORS) - HTTP | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

- the server returns a [`Access-Control-Allow-Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) header with `Access-Control-Allow-Origin: *`, which means that the resource can be accessed by **any** origin

### preflight request

> CORS also relies on a mechanism by which browsers make a "preflight" request to the server hosting the cross-origin resource, in order to check that the server will permit the actual request. In that preflight, the browser sends headers that indicate the HTTP method and headers that will be used in the actual request.

浏览器在发现页面发出的请求非简单请求，并不会立即执行对应的请求代码，而是会触发预先请求模式。预先请求模式会先发送preflight request（预先验证请求），preflight request是一个OPTION请求，用于询问要被跨域访问的服务器，是否允许当前域名下的页面发送跨域的请求。在得到服务器的跨域授权后才能发送真正的HTTP请求。

OPTIONS请求头部中会包含以下头部：

服务器收到OPTIONS请求后，设置头部与浏览器沟通来判断是否允许这个请求。

如果preflight request验证通过，浏览器才会发送真正的跨域请求。





https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS/Errors/CORSMissingAllowOrigin



# CORS header 'Access-Control-Allow-Origin' missing





## 使用插件自动添加

[Test CORS :: WebBrowserTools](https://webbrowsertools.com/test-cors/)

[Chrome extension to force-enable CORS based on request's *source* url (i.e. the url of the browser tab) rather than the target url (github.com)](https://gist.github.com/josephrocca/22f7f06925583a8c6630d55276c129db)

[Access Control-Allow-Origin - Unblock :: add0n.com](https://add0n.com/access-control.html?version=0.3.4&type=install)

[CORS Unblock - Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/cors-unblock/hkjklmhkbkdhlgnnfbbcihcajofmjgbh?hl=zh-CN)

## 插件开发没有跨域问题





preflight

要200系列才行，返回401还是不行