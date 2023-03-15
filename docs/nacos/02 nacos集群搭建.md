---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /nacos/
typora-root-url: ..\.vuepress\public
---

## nacos集群

1. 单机搭建伪集群，复制nacos安装包，修改为nacos8849，nacos8850，nacos8851

2. 以nacos8849为例，进入nacos8849目录

3. 修改conf\application.properties的配置，使用外置数据源  要使用mysql5.7+（不支持MariaDB）（包括）

   ```properties
   # 修改端口
   server.port=8849
   #使用外置mysql数据源 
   spring.datasource.platform=mysql 
   
   ### Count of DB:
    db.num=1
   
   ### Connect URL of DB:
    db.url.0=jdbc:mysql://192.168.88.131:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
    db.user.0=nacos
    db.password.0=nacos
   ```

4. 将conf\cluster.conf.example改为cluster.conf,添加节点配置

   ```
   192.168.88.131:8849
   192.168.88.131:8850
   192.168.88.131:8851
   ```

5. 创建mysql数据库,sql文件位置：conf\nacos-mysql.sql

6. 如果出现内存不足：修改启动脚本（bin\startup.sh）的jvm参数

   ```
   JAVA_OPT="${JAVA_OPT} -server -Xms512m -Xmx512m -Xmn256m -XX:MetaspaceSize=64m -XX:MaxMetaspaceSize=128m"
   ```

7. 查看结果

   ![image-20210802133108501](/images/nacos/image-20210802133108501.png)

## Ngnix反向代理

![img](/images/nacos/16045.png)

```conf
upstream nacoscluster {
        server 127.0.0.1:8849;
        server 127.0.0.1:8850;
        server 127.0.0.1:8851;
    }
    server {
        listen        8847;
        server_name   localhost;
        
        location /nacos/{
            proxy_pass http://nacoscluster/nacos/;
        }
    }
```

网页访问http://192.168.88.131:8848/nacos/

项目中添加则为

```yml
server-addr: 192.168.88.131:8848
```

