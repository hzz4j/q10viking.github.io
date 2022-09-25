---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /webdev/
typora-root-url: ..\.vuepress\public
---

## Node.js 中的 HTTP 模块

Node.js 附带内置的 HTTP 模块。 这是一个相当小的模块，用于处理大多数类型的请求。 它支持常见类型的数据，例如标头、URL 和有效负载。

以下类可在整个过程中帮助管理请求：

- `http.Server`：表示 HTTP Server 的实例。 需要指示此对象侦听特定端口和地址上的不同事件。
- `http.IncomingMessage`：此对象是由 `http.Server` 或 `http.ClientRequest` 创建的可读流。 使用它访问状态、标头和数据。
- `http.ServerResponse`：此对象是 HTTP 服务器在内部创建的流。 此类定义响应应有的外观，例如标头的类型和响应内容。

[HTTP | Node.js v18.9.1 Documentation (nodejs.org)](https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener)

[Source Code](https://github.com/Q10Viking/learncode/tree/main/node/03%20http-web-demo)

```js
const http = require("http")
const PORT = 9000

const app = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      data: 'Hello World!'
    }))
})

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})
```

[使用 Express 框架创建新的 Web 应用 - Training | Microsoft Learn](https://learn.microsoft.com/zh-cn/training/modules/build-web-api-nodejs-express/2-create-app)



## express框架

构建一些 Web 应用程序后，你会注意到你在反复解决相同的问题。 路由管理、身份验证和授权、错误管理等问题很常见。 此时，你会开始寻找可解决其中部分或全部问题的库或框架。

为什么要将 Express 作为构建下一个应用的框架？

- **良好功能**：Express 提供了一系列功能，使你能够快速、高效地工作。
- 使复杂性抽象化：例如，Express 使复杂概念（例如流）抽象化，并使整个开发体验变得更加容易。
- 解决常见的 Web 问题：Express 有助于解决路由管理、缓存和重定向等常见问题。
- **由数百万开发者信任**：根据 GitHub，目前有 680 万开发者对其 Web 应用程序使用 Express。

```sh
npm install express
```

提供静态内容的路由

[Source Code](https://github.com/Q10Viking/learncode/tree/main/node/04%20express%20web%20demo)

```js
const express = require("express");

const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));
app.get("/products", (req,res) => {
    const products = [
    {
      id: 1,
      name: "hammer",
    },
    {
      id: 2,
      name: "screwdriver",
    },
    {
      id: 3,
      name: "wrench",
    },
   ];
  
   res.json(products);
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```



## 使用中间件管理请求生命周期

考虑将请求作为一系列步骤来处理。 如果用户需要登录才能处理请求的资源，则步骤可能如下所示：

1. **Pre 请求**：调查用户是否通过请求标头发送了正确的凭据。 如果验证了凭据，则将请求发送到下一步。
2. **构造响应**：与某种数据源（如数据库或终结点）通信。 只要请求正确请求资源，此步骤就会返回资源。
3. **Post 请求**： 一个可选步骤，用于在请求处理后运行一段代码。 出于日志记录目的，可以运行此步骤。

Express 框架对以此方式处理请求提供内置支持。 若要运行 pre 或 post 请求，需要对 Express 实例化对象实现 `use()` 方法。 Express 中的 pre 或 post 请求称为“中间件(middle-ware)”，具有以下语法形式：

```
app.use((req, res, next) => {})
```

递给 `use()` 方法的方法具有三个参数：`req`、`res` 和 `next`。 这些参数具有以下含义：

- `req`：包含请求标头和调用 URL 的传入请求。 如果客户端随请求发送数据，它也可能具有一个数据主体。
- `res`：用于写入要发送回调用客户端的标头和数据等信息的响应流。
- `next`：指示请求正常并已准备好处理的参数。 如果未调用 `next()`，则请求的处理将停止。 此外，最佳做法是告诉客户端请求未处理的原因，例如调用 `res.send('\<specify a reason why the request is stopped>'\)`。

### 请求管道

- 需要在请求之前运行的中间件（pre 请求）定义在实际请求前。

- 需要在请求之后运行的中间件（post 请求）定义在实际请求后。

  ```js
  app.use((req, res, next) => {
    // Pre request
  })
  app.get('/protected-resource', () => {
    // Handle the actual request
  })
  app.use((req, res, next) => {
    // Post request
  })
  
  app.get('/login', () => {})
  ```

  还可以将 pre 请求中间件代码作为处理请求的参数来运行

  ```js
  app.get(
    '/<some route>',
   () => {
     // Pre request middleware
   }, () => {
     // Handle the actual request
   })
  ```

  
  
  [Source Code](https://github.com/Q10Viking/learncode/tree/main/node/05%20express-middle-ware)
  
  
  
  :::: code-group
  ::: code-group-item app.js
  
  ```js
  import { isAuthorized } from "./helper.js";
  import express from "express";
  const app = express();
  const port = 3000;
  
  
  app.get("/", (req, res) => res.send("Hello World!"));
  
  app.get("/users", isAuthorized,(req, res) => {
    res.json([
      {
        id: 1,
        name: "User Userson",
      },
    ]);
  });
  
  app.get("/products", (req, res) => {
    res.json([
      {
        id: 1,
        name: "The Bluest Eye",
      },
    ]);
  });
  
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  ```
  :::
  ::: code-group-item helper.js
  
  ```js
  export function isAuthorized(req, res, next) {
      const auth = req.headers.authorization;
      if (auth === 'secretpassword') {
          next();
      } else {
          res.status(401);
          res.send('Not permitted');
      }
  }
  ```
  :::
  ::::

## 

### 配置应用以接收数据

1. “导入正文分析器”。 需要将传入数据转换为可读的格式。 导入随 Express 一起安装的库 `body-parser`：

```js
let bodyParser = require('body-parser');
```

2. 配置数据。 配置 Express 以将传入的正文数据分析为预期格式。 以下代码将数据转换为 JSON：

   ```
   app.use(bodyParser.json({ extended: false }));
   ```

   客户端发送的数据现在可用于 `req` 请求对象上的 `body` 属性。 现在，你可以读取此数据并与数据源对话。 然后，还可以从该数据创建资源或更新资源，具体取决于请求使用 POST 还是 PUT 谓词。

```js
app.post('/<path>', (req, res) => {
  console.log('req.body', req.body) // contains incoming data
})
```



## CRUD

[Source Code](https://github.com/Q10Viking/learncode/tree/main/node/06%20express-reading-writing)

为资源实现 CRUD 是一项常见任务。 Express 有一种 `route()` 方法正用于此目的。 使用 `route()`方法时，可以对代码进行分组，使其更易于阅读。

```js
const express = require('express')
const app = express()
const port = 3000

let bodyParser = require('body-parser');
app.use(bodyParser.json());

let products = [];

app.route('/products')
 .get((req, res) => {
   res.json(products);
 })
 .post((req, res) => {
   const newProduct = { ...req.body, id: products.length + 1 }
   products = [...products, newProduct]
   res.json(newProduct);
 })
.put((req, res) => {
   let updatedProduct;
   products = products.map(p => {
     if (p.id === req.body.id) {
       updatedProduct = { ...p, ...req.body };
       return updatedProduct;
     }
     return p;
   })
   res.json(updatedProduct);
 })
 .delete((req, res) => {
   const deletedProduct = products.find(p => p.id === +req.body.id);
   products = products.filter(p => p.id !== +req.body.id);
   res.json(deletedProduct);
 })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```



### 路由参数

delete可以带body

```js
app.delete('/products/:id', function(req, res) {
  const deletedProduct = products.find(p => p.id === +req.params.id);
  products = products.filter(p => p.id !== +req.params.id);
  res.json(deletedProduct);
});
```

发送参数

```js
const http = require('http');

const productToDelete = {
  id: 1
}
const data = JSON.stringify(productToDelete)

const options = {
  hostname: 'localhost',
  port: 3000,
  path: `/products/${productToDelete.id}`,
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

const request = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += "" + chunk; })
  res.on('error', (err) => console.error('err', err))
  res.on('end', () => { console.log('response', body) })
  res.on('close', () => { console.log('Closed connection') })
})

request.end(data);
```

