---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /skywalking/
typora-root-url: ..\.vuepress\public
---



## **SkyWalking 环境搭建部署**

​    ![0](/images/skywalking/52908)



## 下载

[Downloads | Apache SkyWalking](https://skywalking.apache.org/downloads/)

![https://note.youdao.com/yws/public/resource/f46cb9250e146defacf3c707ba847246/xmlnote/327C9D3647CE4BB482CB8301C62499DD/55045](/images/skywalking/55045.png)

- SkyWalking APM:  v9.1.0

  ```sh
  wget https://archive.apache.org/dist/skywalking/9.1.0/apache-skywalking-apm-9.1.0.tar.gz 
  ```

- Java Agent: v8.11.0 

  ```sh
  wget https://archive.apache.org/dist/skywalking/java-agent/8.11.0/apache-skywalking-java-agent-8.11.0.tgz    
  ```

  ​             

## 安装 

```sh
[root@localhost ~]# cd /usr/local/skywalking
[root@localhost skywalking]# ls
apache-skywalking-apm-9.1.0.tar.gz  apache-skywalking-java-agent-8.11.0.tgz
[root@localhost skywalking]# tar -zxvf apache-skywalking-apm-9.1.0.tar.gz
```

## 启动

```sh
[root@localhost bin]# cd /usr/local/skywalking/apache-skywalking-apm-bin/bin
[root@localhost bin]# ls
oapService.bat      oapServiceInit.sh     oapServiceNoInit.sh  startup.bat  webappService.bat
oapServiceInit.bat  oapServiceNoInit.bat  oapService.sh        startup.sh   webappService.sh
[root@localhost bin]# ./startup.sh
SkyWalking OAP started successfully!
SkyWalking Web Application started successfully!
[root@localhost bin]#
```

>  启动成功:会启动两个服务，一个是skywalking-oap-server，一个是skywalking-web-ui

![image-20230308201050809](/images/win11/image-20230308201050809.png)

skywalking-oap-server服务启动后会暴露11800 和 12800 两个端口，分别为收集监控数据的端口11800和接受前端请求的端口12800，修改端口可以修改config/applicaiton.yml

```sh
2023-03-08 20:10:48,840 - org.apache.skywalking.oap.server.library.server.http.HTTPServer - 83 [main] INFO  [] - Bind handler GraphQLQueryHandler into http server 0.0.0.0:12800
2023-03-08 20:10:48,850 - org.apache.skywalking.oap.server.library.module.BootstrapFlow - 43 [main] INFO  [] - start the provider none in telemetry module.
2023-03-08 20:10:48,850 - org.apache.skywalking.oap.server.library.module.BootstrapFlow - 43 [main] INFO  [] - start the provider default in core module.
2023-03-08 20:10:48,864 - org.apache.skywalking.oap.server.library.server.grpc.GRPCServer - 131 [main] INFO  [] - Bind handler RemoteServiceHandler into gRPC server 0.0.0.0:11800
```

![image-20230308201444409](/images/win11/image-20230308201444409.png)

### ui

skywalking-web-ui服务会占用 8080 端口， 修改端口可以修改webapp/webapp.yml

![https://note.youdao.com/yws/public/resource/f46cb9250e146defacf3c707ba847246/xmlnote/182F5C0E3CE645FCA7BDDFDD4668F6E8/55058](/images/win11/55058)

访问：http://192.168.135.130:18080/

![image-20230308202955354](/images/skywalking/image-20230308202955354.png)

## 日志

在sky-walking项目下的logs目录

```sh
./webappService.sh: 第 35 行:exec: java: 未找到
```

从这个目录可以看到当前的linux没有安装java

成功启动后的日志：在新创建的文件`skywalking-oap-server.log`

```sh
2023-03-08 20:22:19,897 - com.linecorp.armeria.common.util.SystemInfo - 237 [main] INFO  [] - hostname: localhost.localdomain (from /proc/sys/kernel/hostname)
2023-03-08 20:22:24,699 - com.linecorp.armeria.server.Server - 755 [armeria-boss-http-*:12800] INFO  [] - Serving HTTP at /0:0:0:0:0:0:0:0%0:12800 - http://127.0.0.1:12800/
2023-03-08 20:22:24,701 - org.apache.skywalking.oap.server.core.storage.PersistenceTimer - 58 [main] INFO  [] - persistence timer start
2023-03-08 20:22:24,712 - org.apache.skywalking.oap.server.core.cache.CacheUpdateTimer - 46 [main] INFO  [] - Cache updateServiceInventory timer start
2023-03-08 20:22:27,368 - org.apache.skywalking.oap.server.starter.OAPServerBootstrap - 53 [main] INFO  [] - Version of OAP: 9.1.0-f1f519c
2023-03-08 20:27:24,717 - org.apache.skywalking.oap.server.core.storage.ttl.DataTTLKeeperTimer - 88 [pool-6-thread-1] INFO  [] - Beginning to remove expired metrics from the storage.
2023-03-08 20:27:25,849 - org.apache.skywalking.oap.server.core.storage.ttl.DataTTLKeeperTimer - 91 [pool-6-thread-1] INFO  [] - Beginning to inspect data boundaries.

```

