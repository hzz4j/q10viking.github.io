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

### post请求application/x-www-form-urlencoded

::: tip

Data from the query string and the post body are aggregated into the request parameter set. Query string data is presented before post body data. For example, if a request is made with a query string of a=hello and a post body of a=goodbye&a=world, the resulting parameter set would be ordered a=(hello, goodbye, world).

:::

![image (20)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112050618418.jpg)

```sh
=============POST METHOD==================

[hello, goodbye, world]
```

