---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /tomcat/
---

::: tip

阅读Java™ Servlet Specification，加强理解Serlvet,先准被好环境

:::

## Request

### post请求multipart/form-data

```java {6}
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("=============POST METHOD==================");
        String[] as = req.getParameterValues("a");
        // read body data
        String collect = req.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        System.out.println(collect);
        System.out.println(Arrays.toString(as));
    }
```

![image (22)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112050620460.jpg)

结果输出

```
=============POST METHOD==================
----------------------------818265112593556460216598
Content-Disposition: form-data; name="a"

goodbye
----------------------------818265112593556460216598
Content-Disposition: form-data; name="a"

world
----------------------------818265112593556460216598--
[hello]
```

### post请求application/x-www-form-urlencoded:star:

::: tip

Data from the query string and the post body are aggregated into the request parameter set. Query string data is presented before post body data. For example, if a request is made with a query string of a=hello and a post body of a=goodbye&a=world, the resulting parameter set would be ordered a=(hello, goodbye, world).

:::

The following are the conditions that must be met before post **form data will be populated to the parameter set**:

1. The request is an HTTP or HTTPS request.
2. The HTTP method is POST.
3. The content type is application/x-www-form-urlencoded.
4. The servlet has made an initial call of any of the getParameter family of methods on the request object.

![image (20)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112050618418.jpg)

```sh
=============POST METHOD==================

[hello, goodbye, world]
```

### 两种请求类型的区别

::: tip

:one: `application/x-www-form-urlencoded`, the body of the HTTP message sent to the server is essentially one giant query string -- name/value pairs are separated by the ampersand (`&`), and names are separated from values by the equals symbol (`=`)

:two: `multipart/form-data` transmitting name/value pairs, each pair is represented as a "part" in a MIME message.**Parts** are separated by a particular string **boundary** (chosen specifically so that this boundary string does not occur in any of the "value" payloads). Each part has its own set of MIME headers like `Content-Type`, and particularly `Content-Disposition`, which can give each part its "name." The value piece of each name/value pair is the payload of each part of the MIME message.

:::

参考：https://stackoverflow.com/a/4073451/7628578

请求头传入：

```json
content-type: multipart/form-data; boundary=--------------------------188143036584739792660095
```

服务端收到

```sh
----------------------------188143036584739792660095
Content-Disposition: form-data; name="a"

goodbye
----------------------------188143036584739792660095
Content-Disposition: form-data; name="a"

world
----------------------------188143036584739792660095--
```

