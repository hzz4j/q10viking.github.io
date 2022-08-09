---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /nginx/
typora-root-url: ..\.vuepress\public
---



## nginx.conf配置文件

[Progresson On](https://www.processon.com/view/link/62f2a1ad5653bb1344cca1fa)

![image-20220810024257850](/images/nginx/image-20220810020213337.png)



## 全局配置

```sh
# 指的linux中的用户，会涉及到nginx操作目录或文件的一些权限，默认为nobody
# 可以配置成user root  这样worker工作进程就有了root的权限
user  nobody;
worker_processes  2;
```

默认是nobody

```sh
[root@localhost sbin]# ps -ef | grep nginx
root      10003      1  0 Mar12 ?        00:00:00 nginx: master process ./nginx
nobody    10119  10003  0 02:32 ?        00:00:00 nginx: worker process
nobody    10120  10003  0 02:32 ?        00:00:00 nginx: worker process
```
修改配置文件后，我们再看看,配置成了root

```sh
[root@localhost sbin]# ./nginx -s reload  
[root@localhost sbin]# ps -ef | grep nginx
root      10003      1  0 Mar12 ?        00:00:00 nginx: master process ./nginx
root      10124  10003  0 02:32 ?        00:00:00 nginx: worker process
root      10125  10003  0 02:32 ?        00:00:00 nginx: worker process
```



## events模块

::: tip

nginx的事件处理

:::

```sh
events {
    # 默认的多路复用linux epoll
    use	epoll;
    # 每个worker允许客户端最大连接数
    worker_connections  10240;
}
```

## http模块配置

### include 引入外部配置❤️

::: tip

提高可读性，避免单个配置文件过大

:::

```sh
#引入mime类型的配置，mime.types文件与nginx.conf在同一个文件夹下（同路径）
include       mime.types;
```

![image-20220810022820855](/images/nginx/image-20220810022820855.png)



### 高效文件传输

::: tip

sendfile使用高效文件传输，提升传输性能。启用后才能使用tcp_nopush，是指当数据表累积一定大小后才发送，提高了效率

:::

```sh
sendfile        on;
tcp_nopush      on;
```

### 请求超时时间

::: tip

keepalive_timeout设置客户端与服务端请求的超时时间，保证客户端多次请求的时候不会重复建立新的连接，节约资源损耗。

:::

```sh
#keepalive_timeout  0;
keepalive_timeout  65;	#	65s
```

### 压缩

::: tip

gzip启用压缩，html/js/css压缩后传输会更快

:::

```sh
gzip  on;
#	限制最小压缩，小于1字节文件不会被压缩
gzip_min_length 1;
#	定义压缩级别（压缩比，文件越大，压缩越多，但是cpu使用也越多）
gzip_comp_level 3;
#	定义压缩文件类型
gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg  image/gif  image/png application/json;

```



### server虚拟主机配置❤️

::: tip

可以配置多台虚拟主机：端口可以不同，端口相同，server_name可以不同

:::

1. listen 监听端口
2. **server_name 可以配置为localhost、ip地址、域名（一个服务器可以绑定多个域名）**
3. location 请求路由映射，匹配拦截
4. **root 请求位置 (相对路径的话是以nginx的安装目录为当前目录)**
5. index 首页设置

#### 实验案例❤️

::: tip

本次实现目的主要是测试root请求位置的地址以及server_name的作用

:::

> 我在/usr/webproject下分别放置了两个不同的前端页面。主要用于区分

```sh
server {
    listen 8001;
    server_name q10viking.formwave.org;
    location / {
        root    /usr/webproject/formwave;
        index   index.html;
    }
}

server {
    listen 8001;
    server_name q10viking.drinkwater.org;
    location / {
        root    /usr/webproject/drinkwater;
        index   index.html;
    }
}
```



当浏览器访问`http://q10viking.formwave.org:8001/`时出现表单

![image-20220810033400193](/images/nginx/image-20220810033400193.png)

当浏览器访问`http://q10viking.drinkwater.org:8001/`出现喝水的页面

![image-20220810033521336](/images/nginx/image-20220810033521336.png)

当以IP地址访问时`http://192.168.187.135:8001/`,出现的是表单

![image-20220810033643644](/images/nginx/image-20220810033643644.png)

#### server_name小结❤️

::: tip

server_name 有匹配优先级

:::

|                                       |      |
| ------------------------------------- | ---- |
| http://q10viking.drinkwater.org:8001/ | 表单 |
| http://q10viking.drinkwater.org:8001/ | 喝水 |
| http://192.168.187.135:8001/          | 表单 |

##### 匹配优先级❤️

```sh
server_name与host匹配优先级如下：

1、完全匹配

2、通配符在前的，如*.test.com

3、在后的，如www.test.*

4、正则匹配，如~^\.www\.test\.com$

如果都不匹配

1、优先选择listen配置项后有default或default_server的

2、找到匹配listen端口的第一个server块 ⭐
```

