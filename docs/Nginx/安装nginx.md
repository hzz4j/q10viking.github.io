---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /nginx/
typora-root-url: ..\.vuepress\public
---



## windows安装

::: tip

在windows上安装，方便测试

:::

### 启动nginx

[nginx: download](http://nginx.org/en/download.html)直接下载压缩包，然后解压到指定的目录

点击执行的`nginx.exe`运行或者输入`start nginx`

![image-20220809190619569](/images/nginx/image-20220809190619569.png)

### 验证生效

#### 浏览器访问

```
访问： 
localhost:80
localhost
```

![image-20220809190451631](/images/nginx/image-20220809190451631.png)

#### 命令行验证

```sh
PS E:\nginx\nginx-1.22.0> tasklist /fi "imagename eq nginx.exe"

映像名称                       PID 会话名              会话#       内存使用
========================= ======== ================ =========== ============
nginx.exe                    12020 Console                    4      9,248 K
nginx.exe                     7608 Console                    4      9,580 K
```

### 关闭nginx

```
taskkill /f /t /im nginx.exe
```

