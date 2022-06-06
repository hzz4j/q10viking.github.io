---
typora-root-url: ..\.vuepress\public
---

## Linux

```sh
cd /usr/seata

#上传seata-server-1.4.0.tar.gz
#解压
tar -zxvf seata-server-1.4.0.tar.gz
```

### **指定nacos作为配置中心和注册中心**

```sh
/usr/seata/seata/conf/registry.conf
```

![image-20220604175005250](/images/seata/image-20220604175005250.png)

![image-20220604175313794](/images/seata/image-20220604175313794.png)

## 配置参数同步到Nacos

在seata-server的tar包中没有script文件夹，需要从源码包中将script这个文件夹上传到服务器。

![image-20220604175851317](/images/seata/image-20220604175851317.png)

修改config.txt文件

![image-20220604193540095](/images/seata/image-20220604193540095.png)

## 配置参数同步到Nacos

```sh
cd /usr/seata/seata/script/config-center/nacos
sh nacos-config.sh -h localhost -p 8848 -g SEATA_GROUP -t b0748044-d986-470a-90d4-d463382fdc8b
```

![image-20220604181342524](/images/seata/image-20220604181342524.png)



## 启动Seata-Server

```sh
cd /usr/seata/seata
bin/seata-server.sh
```

![image-20220604193201733](/images/seata/image-20220604193201733.png)



## 使用目前最新的版本依赖

| Spring Cloud Alibaba Version | Sentinel Version | Nacos Version | RocketMQ Version | Dubbo Version | Seata Version |
| ---------------------------- | ---------------- | ------------- | ---------------- | ------------- | ------------- |
| 2021.0.1.0*                  | 1.8.3            | 1.4.2         | 4.9.2            | 2.7.15        | 1.4.2         |

| Spring Cloud Alibaba Version | Spring Cloud Version  | Spring Boot Version |
| ---------------------------- | --------------------- | ------------------- |
| 2021.0.1.0                   | Spring Cloud 2021.0.1 | 2.6.3               |



## 项目代码

D:\learncode\seata\learnSeata\MicroServices



```
SeataAutoDataSourceProxyCreator : Auto proxy of [druidDataSource]
```

```xml
<!-- 在openfegin时使用  -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

```
jdbc:mysql://192.168.187.135:3306/seata_account?useUnicode=true&characterEncoding=utf8&allowMultiQueries=true&useSSL=false&serverTimezone=UTC

jdbc:mysql://192.168.187.135:3306/seata_account?
useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
```

