---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Linux/
typora-root-url: ..\.vuepress\public
---



- 启动docker

  ```
  systemctl start docker
  service docker start
  ```


### 服务器重启后，Docker安装的mysql怎么重启？

- 列出Docker中创建的容器

  ```
  docker ps -a
  ```

  ![image-20210927113953340](/images/linux/image-20210927113953340.png)

- 启动mysql

  ```
  docker restart ecf6a94a11d4
  ```

- 查看是否启动成功

  ```
  docker ps
  ```

  

### mysql is blocked because of many connection errors;问题

修改默认的max_connect_errors连接数（mysql 5.6以上默认是100）

显示默认连接数：show variables like '%max_connect_errors%';

修改连接数为500：**set global max_connect_errors = 500; （基本上同一IP不可能超过500）**

**flush privileges;**

**service mysql restart**

