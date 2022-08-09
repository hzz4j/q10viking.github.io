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



## Linux安装Nginx

::: tip

目前只有在192.168.187.135机器下安装

编译源码的方式安装

:::

### 相关环境工具安装

```sh
# 安装gcc环境
yum install gcc-c++
# 安装PCRE,用于解析正则表达式
yum install -y pcre pcre-devel
# zlib压缩与解压缩
yum install -y zlib zlib-devel
#SSL安全加密套接字协议层，即https

```

### 编译安装nginx

```sh

# 将nginx-1.16.1.tar.gz放到/usr/nginx目录下
# 解压
tar -zxvf nginx-1.16.1.tar.gz
# 创建nginx临时目录
mkdir /var/temp/nginx -p
# 进入到解压的nginx目录
cd nginx-1.16.1
# 在解压的nginx目录下输入命令，创建Makefile

./configure \
--prefix=/usr/nginx \
--pid-path=/var/run/nginx/nginx.pid \
--lock-path=/var/lock/nginx.lock \
--error-log-path=/var/log/nginx/error.log \
--http-log-path=/var/log/nginx/access.log \
--with-http_gzip_static_module \
--http-client-body-temp-path=/var/temp/nginx/client \
--http-proxy-temp-path=/var/temp/nginx/proxy \
--http-fastcgi-temp-path=/var/temp/nginx/fastcgi \
--http-uwsgi-temp-path=/var/temp/nginx/uwsgi \
--http-scgi-temp-path=/var/temp/nginx/scgi

# make编译
make

#安装
make install
```



![](/images/nginx/image-20210313121126138.png)



### 启动❤️

```sh
# 进入
cd /usr/nginx/sbin
# 启动
./nginx
```



### 验证生效

查看80端口`netstat -nltp`

```sh
[root@localhost sbin]# netstat -nltp | grep nginx
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      4381/nginx: master
```

网页版测试

```
http://192.168.187.135/
```

![image-20220810010842303](/images/nginx/image-20220810010842303.png)



### nginx常用命令❤️

```sh
./nginx -s stop		#	暴力关闭nginx，不管有没有用户正在进行请求
./nginx -s quit		#	没有用户请求时，才关闭
./nginx -s reload	#	重启nginx 当修改配置文件后，需要重启生效❤️⭐
./nginx -t	#	检测nginx配置是否有效
./nginx -v	#	查看版本
./nginx -V  #	查看详细信息包括安装时指定设置的日志目录
./nginx -c  filename	#   手动切换nginx配置文件
```



## Nginx请求默认页面分析

1. `nginx/conf/nginx.conf`

   ```c
   server {
           listen       80;
           server_name  localhost;
   
           location / {
               root   html;
               index  index.html index.htm;
           }
           error_page   500 502 503 504  /50x.html;
           location = /50x.html {
               root   html;
           }
    }
   ```

   

![](/images/nginx/image-20210313122955103.png)

