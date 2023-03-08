---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /ElasticStack/
typora-root-url: ..\.vuepress\public
---

## **客户端Kibana安装**

::: tip

ES主流客户端Kibana，es开放9200端口与图形界面客户端交互

[Kibana 7.6.1 | Elastic](https://www.elastic.co/cn/downloads/past-releases/kibana-7-6-1)

:::

1. 下载Kibana放之/usr/es目录中

2. 解压文件：tar -zxvf kibana-7.6.1-linux-x86_64.tar.gz

3. 用户进行授权

   ```sh
   # 文件拥有者
   chown -R hzz /usr/es/kibana-7.6.1-linux-x86_64 
   ```

4. 进入`/usr/es/kibana-7.6.1-linux-x86_64/config`目录

5. 使用vi编辑器：vi kibana.yml

   ```shell
      server.port: 5601
      server.host: "服务器IP"
      elasticsearch.hosts: ["http://IP:9200"]  #这里是elasticsearch的访问地址
   ```

![image-20211112031744988](/images/elasticsearch/image-20211112031744988.png)

##  启动kibana⭐

```sh
cd /usr/es/kibana-7.6.1-linux-x86_64/bin/
# 前台启动
./kibana
# 后台启动
nohup  ./kibana &
```

访问   http://192.168.187.132:5601/            

---------

## 关闭kibana

```sh
# 查看占用端口的pid
lsof -i:5601
# 结束进程
kill -9 pid进程号
```

## kibana启动失败

![image-20210503103502970](/images/elasticsearch/image-20210503103502970.png)

```sh
  log   [02:26:56.524] [warning][savedobjects-service] Unable to connect to Elasticsearch. Error: [resource_already_exists_exception] index [.kibana_2/QMTp-THJSribGdr-3hBTrw] already exists, with { index_uuid="QMTp-THJSribGdr-3hBTrw" & index=".kibana_2" }
  log   [02:26:56.525] [warning][savedobjects-service] Another Kibana instance appears to be migrating the index. Waiting for that migration to complete. If no other Kibana instance is attempting migrations, you can get past this message by deleting index .kibana_2 and restarting Kibana.
```

```sh
curl -XDELETE http://192.168.88.173:9200/.kibana_2
# 重启kibana
```



## 防火墙设置⭐

```sh
# 查看是否开放端口
[root@localhost ~]# firewall-cmd --query-port=5601/tcp
no

# 需要防火墙开启该端口
[root@localhost ~]# firewall-cmd --zone=public --add-port=5601/tcp --permanent
success

# 重新加载防火墙
[root@localhost ~]# firewall-cmd --reload
success
```

