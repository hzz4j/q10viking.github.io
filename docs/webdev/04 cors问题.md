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

>  出现跨域的根本原因：浏览器的同源策略不允许非同源的URL之间进行资源的交互

一个跨域的例子，从`https://domain-a.com`的前端js代码请求`https://domain-b.com/data.json`提供的数据。

![image-20220926122703916](/images/webdev/image-20220926122703916.png)



### 浏览器对跨域请求的拦截

> 浏览器允许发起跨域请求，但是，跨域请求回来的数据，会被浏览器拦截，无法被页面获取到!
>
> 这是针对简单请求的，如果是预检请求没有返回相应的cors请求头，那么真正的请求不会发送到服务端。

![image-20220926154823739](/images/webdev/image-20220926154823739.png)

### 代码验证

::: tip

验证 1. cors问题的出现. 2.cors只发生在浏览器端

[Source Code](https://github.com/Q10Viking/learncode/tree/main/node/08%20cors/01%20browser-action)

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

浏览器中出现跨域请求`http://127.0.0.1:5500/dist/index.html`请求`http://localhost:9000/test`的资源,此时跨域问题出现了

![image-20220926125820871](/images/webdev/image-20220926125820871.png)

```sh
Access to XMLHttpRequest at 'http://localhost:9000/test' from origin 'http://127.0.0.1:5500'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

在index.js脚本当中,请求了不同源的资源.浏览器限制加载该资源.(可以看到api接口返回的是200,是可以调通的,但是浏览器限制了资源的加载)

![image-20220926130314335](/images/webdev/image-20220926130314335.png)

> 在node环境中执行前端的index.js脚本,可以看到有数据.

![image-20220926131603859](/images/webdev/image-20220926131603859.png)



## 解决跨域(Simple Request)❤️

[Source Code](https://github.com/Q10Viking/learncode/tree/main/node/08%20cors/01%20browser-action-solved)

上面的请求资源是一个简单请求(Simple Request).对应的还有预检请求(Preflight request),如自己添加了HTTP header头部信息.

根据[Cross-Origin Resource Sharing (CORS) - HTTP | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests)提供的解决方案

> This operation performs a simple exchange between the client and the server, **using CORS headers to handle the privileges**:

![image-20220926133921077](/images/webdev/image-20220926133921077.png)



从浏览器中查看请求头,发现浏览器自动为我们添加请求头的Origin.要解决cors跨域问题,只需要我们在服务端添加相应的响应头`Access-Control-Allow-Origin`即可

![image-20220926133729516](/images/webdev/image-20220926133729516.png)

在服务端(app.js)添加响应头`Access-Control-Allow-Origin`

```js{}
import express from "express";

const app = express()
app.get("/test",(req,res)=>{
    console.log("get req");
    // add Access-Control-Allow-Origin header
    res.setHeader("Access-Control-Allow-Origin","*")
    res.json({name:'Q10Viking'})
})

app.listen(9000,()=>{
    console.log("server start at 9000");
})
```

![image-20220926135217955](/images/webdev/image-20220926135217955.png)



## Preflight request⭐

::: tip

与简单请求相比，浏览器自己多发送了一个请求

:::

[Preflight request - MDN Web Docs Glossary: Definitions of Web-related terms | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)

> 浏览器在发现页面发出的请求非简单请求，并不会立即执行对应的请求代码，而是会触发预先请求模式。预先请求模式会先发送preflight request（预先验证请求），preflight request是一个OPTION请求，用于询问要被跨域访问的服务器，是否允许当前域名下的页面发送跨域的请求。在得到服务器的跨域授权后才能发送真正的HTTP请求。

It is an [`OPTIONS`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS) request, using three HTTP request headers: [`Access-Control-Request-Method`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method), [`Access-Control-Request-Headers`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers), and the [`Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) header.

1. 如下面的案例自己添加了一个X-PINGOTHER的头部信息，在跨域的情况下会先发送预检请求
2. 然后再发送正真的请求

![img](/images/webdev/preflight_correct.png)

### 代码验证❤️

::: tip

通过自定义头部信息，来发送跨域请求，观察preflight request

[Source Code](https://github.com/Q10Viking/learncode/tree/main/node/08%20cors/02%20browser-preflight-request-problem)

:::



:::: code-group
::: code-group-item 服务端app.js

```js
import express from "express";

const app = express()
app.get("/test",(req,res)=>{
    console.log("get req");
    res.json({name:'Q10Viking'})
})

// 添加一个options方法，来观察
app.options("/test",(req,res)=>{
    console.log("Preflight Appear");
    res.send("finished:)")
})

app.listen(9000,()=>{
    console.log("server start at 9000");
})
```
:::
::: code-group-item 浏览器脚本 index.js

```js
// 前端脚本
import axios from "axios";
const api = "http://localhost:9000/test"
const nameEl = document.getElementById("name")
// 自定义了一个header
const config = {
    headers: {
        'auth-token': 'q10viking-token'
    }
}

axios.get(api,config).then(response => {
    console.log(response.data)
    nameEl.textContent = response.data.name
    nameEl.className = "success"
}).catch(e => {
    console.log("cors appear")
    nameEl.className = "errors"
    nameEl.textContent = "Cors Appear"
})
```
:::
::::

浏览器在发送真正的请求之前（`http://localhost:9000/test`）先发送了一个请求方法为options的请求。预检请求没有返回相应的cors策略，导致跨域问题出现，真正的请求并没有发送。

```sh
Access to XMLHttpRequest at 'http://localhost:9000/test' from origin 'http://127.0.0.1:5500' 
has been blocked by CORS policy: Response to preflight request doesn\'t pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

![image-20220926171001344](/images/webdev/image-20220926171001344.png)

![image-20220926171706077](/images/webdev/image-20220926171706077.png)

预检查请求是一个options方法

![image-20220926171834319](/images/webdev/image-20220926171834319.png)



### 解决跨域

[Source Code](https://github.com/Q10Viking/learncode/tree/main/node/08%20cors/02%20browser-preflight-request-solved)

> 只需要更改服务端的预检请求即可。app.js

```js
import express from "express";

const app = express()
app.get("/test",(req,res)=>{
    console.log("get req");
    res.json({name:'Q10Viking'})
})

// 添加一个options方法，来观察
app.options("/test",(req,res)=>{
    console.log("Preflight Appear");
    // 添加允许的跨域的策略
    res.setHeader("Access-Control-Allow-Origin","*") // 允许所有来源
    // 由于自定义了头部，需要指定允许跨域指定的头部
    res.setHeader("Access-Control-Allow-Headers","auth-token")
    res.send("finished:)")
})

app.listen(9000,()=>{
    console.log("server start at 9000");
})
```

![image-20220926173206563](/images/webdev/image-20220926173206563.png)



### express提供cors中间件

::: tip

[Express cors middleware (expressjs.com)](http://expressjs.com/en/resources/middleware/cors.html)

express提供了cors中间件，专门解决express中跨域的问题，使得我们专注业务开发，不再关注处理跨域的问题。

:::

```sh
npm install cors
```

:::: code-group
::: code-group-item 使用cors

```js
import express from "express";
import cors from 'cors'

const app = express()

// 使用cors中间件
app.use(cors())

app.get("/test",(req,res)=>{
    console.log("get req");
    res.json({name:'Q10Viking'})
})

app.listen(9000,()=>{
    console.log("server start at 9000");
})
```
:::
::: code-group-item 没有使用cors

```js
import express from "express";

const app = express()
app.get("/test",(req,res)=>{
    console.log("get req");
    res.json({name:'Q10Viking'})
})

// 添加一个options方法，来观察
app.options("/test",(req,res)=>{
    console.log("Preflight Appear");
    // 添加允许的跨域的策略
    res.setHeader("Access-Control-Allow-Origin","*") // 允许所有来源
    // 由于自定义了头部，需要指定允许跨域指定的头部
    res.setHeader("Access-Control-Allow-Headers","auth-token")
    res.send("finished:)")
})

app.listen(9000,()=>{
    console.log("server start at 9000");
})
```
:::
::::



## cors相关header说明

### 响应首部字段

[跨源资源共享（CORS）- 响应首部字段](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS#http_响应首部字段)

#### Access-Control-Allow-Origin

> 顾名思义,访问控制允许的源,主要在server端设置响应的header

```js
// means that the resource can be accessed by any origin
Access-Control-Allow-Origin: *
```

If the resource owners at https://bar.other wished to restrict access to the resource to requests only from https://foo.example (i.e., no domain other than https://foo.example can access the resource in a cross-origin manner), they would send

```js
// 严格限制
Access-Control-Allow-Origin: https://foo.example
```

----------

#### Access-Control-Allow-Methods

首部字段用于预检请求的响应。其指明了实际请求所允许使用的 HTTP 方法。

#### Access-Control-Allow-Headers

首部字段用于预检请求的响应。其指明了实际请求中允许携带的首部字段

### 请求首部字段

[跨源资源共享（CORS） -  请求首部字段](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS#http_请求首部字段)

#### Origin

首部字段表明预检请求或实际请求的源站。

#### Access-Control-Request-Headers

首部字段用于预检请求。其作用是，将实际请求所携带的首部字段告诉服务器。



## 跨域问题出现的领域

跨域问题只出现在浏览器端发送的请求。如果是后端发送的请求（如node运行js,或者使用postman测试，则不会出现跨域）

但是如果是在浏览器，开发插件的话并不会出现跨域的问题。



## 使用插件自动添加

::: tip

[CORS Unblock - Microsoft Edge 插件下载地址](https://microsoftedge.microsoft.com/addons/detail/cors-unblock/hkjklmhkbkdhlgnnfbbcihcajofmjgbh?hl=zh-CN)

[Access Control-Allow-Origin - Unblock :: 该插件首页](https://add0n.com/access-control.html?version=0.3.4&type=install)

:::

![image-20220926175702008](/images/webdev/image-20220926175702008.png)

该插件会自动添加响应的信息，方便开发测试。

![image-20220926180551648](/images/webdev/image-20220926180551648.png)

值得注意的是，如果预检请求，尽管返回了响应的cors头部信息，但是如果返回的是不是2xx状态，比如401,那么还是会有跨域的问题。所以该插件尽管添加了这些信息，问题仍然出现。