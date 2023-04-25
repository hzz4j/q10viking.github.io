---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



> 搭建好了k8s，我们来部署一个nginx服务，来初步使用以下k8s



## 部署一个nginx

在k8s-master机器上执行

```sh
# 创建一次deployment部署
kubectl create deployment nginx --image=nginx
# --port是service的虚拟ip对应的端口，系统会随机暴露一个端口
kubectl expose deployment nginx --port=80 --type=NodePort  
```



## 查看

```sh
# 查看Nginx的pod和service信息
kubectl get pod,svc -o wide
[root@k8s-master ~]# kubectl get pod,svc -o wide
NAME                        READY   STATUS    RESTARTS   AGE   IP           NODE        NOMINATED NODE   READINESS GATES
pod/nginx                   1/1     Running   1          10h   10.244.2.5   k8s-node2   <none>           <none>
pod/nginx-f89759699-9c4hm   1/1     Running   0          11m   10.244.1.6   k8s-node1   <none>           <none>

NAME                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE    SELECTOR
service/kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP        10h    <none>
service/nginx        NodePort    10.108.139.46   <none>        80:31448/TCP   9m6s   app=nginx
```

> 上面有两个nginx，pod/nginx是kubenetes自带的，pod/nginx-f89759699-9c4hm 是我们刚刚创建的。
> 可以看到我们的nginx部署到了k8s-node1节点，暴露的端口是31448。
>
> 在dashboard上查看

![image-20230425094011935](/images/Docker/image-20230425094011935.png)



## 访问

虽然nginx的pod部署在了k8s-node1节点对应的ip地址为[http://192.168.135.132:31448/](http://192.168.135.132:31448/)，但是,我们能够从master，k8s-node2上都能访问到。因为kubunetes默认安装了nginx，它有反向代理的功能。

**访问Nginx地址** `http://任意节点的ip:图中Nginx的对外映射端口`

[http://192.168.135.130:31448/](http://192.168.135.130:31448/)

[http://192.168.135.132:31448/](http://192.168.135.132:31448/)

[http://192.168.135.135:31448/](http://192.168.135.135:31448/)



## windows修改hosts文件

> 上面的过程中使用ip来进行访问非常不方便，在windows下修改hosts文件。这里用的软件是SwitchHosts

![image-20230425094911081](/images/Docker/image-20230425094911081.png)

修改之后就能通过域名进行访问了

[http://k8s-master:31448/](http://k8s-master:31448/)

[http://k8s-node1:31448/](http://k8s-node1:31448/)

[http://k8s-node2:31448/](http://k8s-node1:31448/)



## 命令小结

```sh
# 创建一次deployment部署
kubectl create deployment nginx --image=nginx
# --port是service的虚拟ip对应的端口，系统会随机暴露一个端口
kubectl expose deployment nginx --port=80 --type=NodePort
#查看pod和service信息
kubectl get pod,svc -o wide
```

