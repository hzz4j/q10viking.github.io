---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



> 上一章我们搭建好了k8s集群，这里我们搭建k8s-Dashboard，

## 安装

[部署和访问 Kubernetes 仪表板（Dashboard） | Kubernetes](https://kubernetes.io/zh-cn/docs/tasks/access-application-cluster/web-ui-dashboard/)

[GitHub - kubernetes/dashboard: General-purpose web UI for Kubernetes clusters](https://github.com/kubernetes/dashboard)

我在master节点上(`192.168.135.130`)安装,执行下面这条命令进行安装

```sh
 wget https://raw.githubusercontent.com/kubernetes/dashboard/v2.3.1/aio/deploy/recommended.yaml
```



## 修改namespace和NodePort

1. 命名空间默认为 kubernetes-dashboard，将其修改为 kube-system

```sh
sed -i '/namespace/ s/kubernetes-dashboard/kube-system/g' recommended.yaml
```

2. NodePort 方式：为了便于本地访问，修改 yaml 文件，将 service 改为 NodePort 类型，同时端口设置为 31260（大概位于 40 行和 44 行）

   ```sh
   vi recommended.yaml
   ```

   ![image-20230425004016169](/images/Docker/image-20230425004016169.png)

## 创建dashboard pod

```sh
[root@k8s-master ~]# kubectl apply -f recommended.yaml
namespace/kubernetes-dashboard unchanged
serviceaccount/kubernetes-dashboard created
service/kubernetes-dashboard created
secret/kubernetes-dashboard-certs created
secret/kubernetes-dashboard-csrf created
secret/kubernetes-dashboard-key-holder created
configmap/kubernetes-dashboard-settings created
role.rbac.authorization.k8s.io/kubernetes-dashboard created
clusterrole.rbac.authorization.k8s.io/kubernetes-dashboard unchanged
rolebinding.rbac.authorization.k8s.io/kubernetes-dashboard created
clusterrolebinding.rbac.authorization.k8s.io/kubernetes-dashboard configured
deployment.apps/kubernetes-dashboard created
service/dashboard-metrics-scraper created
deployment.apps/dashboard-metrics-scraper created
```

> 查看 dashboard 的 POD 是否正常启动，如果正常说明安装成功

```sh
[root@k8s-master ~]# kubectl get pod --namespace=kube-system -o wide
NAME                                         READY   STATUS    RESTARTS   AGE    IP                NODE         NOMINATED NODE   READINESS GATES
coredns-7ff77c879f-7mb4g                     1/1     Running   0          114m   10.244.0.3        k8s-master   <none>           <none>
coredns-7ff77c879f-86wnp                     1/1     Running   0          114m   10.244.0.2        k8s-master   <none>           <none>
dashboard-metrics-scraper-78f5d9f487-66cwd   1/1     Running   0          111s   10.244.1.4        k8s-node1    <none>           <none>
etcd-k8s-master                              1/1     Running   0          115m   192.168.135.130   k8s-master   <none>           <none>
kube-apiserver-k8s-master                    1/1     Running   0          115m   192.168.135.130   k8s-master   <none>           <none>
kube-controller-manager-k8s-master           1/1     Running   0          115m   192.168.135.130   k8s-master   <none>           <none>
kube-proxy-6mfnx                             1/1     Running   0          83m    192.168.135.132   k8s-node1    <none>           <none>
kube-proxy-pk2hk                             1/1     Running   0          114m   192.168.135.130   k8s-master   <none>           <none>
kube-proxy-sbjwx                             1/1     Running   0          83m    192.168.135.135   k8s-node2    <none>           <none>
kube-scheduler-k8s-master                    1/1     Running   0          115m   192.168.135.130   k8s-master   <none>           <none>
kubernetes-dashboard-5984847f5f-dsg77        1/1     Running   0          111s   10.244.1.3        k8s-node1    <none>           <none>
```

![image-20230425004347896](/images/Docker/image-20230425004347896.png)



## 查看外网暴露端口

> 在上一步（修改namespace和NodePort）的步骤，已经添加了端口

查看外网暴露端口(我们可以看到外网端口是 （31260)

```
[root@k8s-master ~]# kubectl get service --namespace=kube-system
NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                  AGE
dashboard-metrics-scraper   ClusterIP   10.107.7.173    <none>        8000/TCP                 3m1s
kube-dns                    ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP,9153/TCP   116m
kubernetes-dashboard        NodePort    10.106.235.34   <none>        443:31260/TCP            3m1s
```

## 访问❤️

首先知道dashboard运行在哪台机器上

```
[root@k8s-master ~]# kubectl get pod --namespace=kube-system -o wide | grep dashboard
dashboard-metrics-scraper-78f5d9f487-66cwd   1/1     Running   0          8m34s   10.244.1.4        k8s-node1    <none>           <none>
kubernetes-dashboard-5984847f5f-dsg77        1/1     Running   0          8m34s   10.244.1.3        k8s-node1    <none>           <none>
```

查看端口

```sh
[root@k8s-master ~]# kubectl get service --namespace=kube-system
NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                  AGE
dashboard-metrics-scraper   ClusterIP   10.107.7.173    <none>        8000/TCP                 3m1s
kube-dns                    ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP,9153/TCP   116m
kubernetes-dashboard        NodePort    10.106.235.34   <none>        443:31260/TCP            3m1s
```



可以知道运行在k8s-node1上(可以ping以下知道ip地址)，暴露的端口为31260

[https://192.168.135.132:31260/](https://192.168.135.132:31260/)

谷歌浏览器和Edge访问不了，原因是部署UI的镜像中默认自带的证书是一个不可信任的证书，则先用火狐访问：

![image-20230425005742601](/images/Docker/image-20230425005742601.png)

> Dashboard 支持 Kubeconfig 和 Token 两种认证方式，这里选择第一个Token认证方式登录：浏览器中的 Token 先空着，不要往下点，接下来制作 token 

根据官网[dashboard/creating-sample-user.md at master · kubernetes/dashboard · GitHub](https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md)创建用户

创建文件`dashboard-adminuser.yaml`

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kube-system
```

> 执行下面的命令，创建了一个叫 admin-user 的服务账号，并放在 kube-system 命名空间下，并将 cluster-admin 角色绑定到 admin-user 账户，这样 admin-user 账户就有了管理员的权限。默认情况下，kubeadm 创建集群时已经创建了 cluster-admin 角色，直接绑定即可

```sh
[root@k8s-master ~]# kubectl create -f dashboard-adminuser.yaml
serviceaccount/admin-user created
clusterrolebinding.rbac.authorization.k8s.io/admin-user created
```

### 获取token❤️

> 查看 admin-user 账户的 token

```
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')
```

```sh
[root@k8s-master ~]# kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')
Name:         admin-user-token-xpb7p
Namespace:    kube-system
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: admin-user
              kubernetes.io/service-account.uid: f10592aa-d7e9-4b38-a793-9293a4449662

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1025 bytes
namespace:  11 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6IjNJUXpyYXUyQ0hqSFZLUHljMUdkTEJiQkNSUlFMaGx4VE9vVXdscXkwN00ifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLXhwYjdwIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJmMTA1OTJhYS1kN2U5LTRiMzgtYTc5My05MjkzYTQ0NDk2NjIiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZS1zeXN0ZW06YWRtaW4tdXNlciJ9.oUVqZJytdvJV-DDiCisEQfuUdCXIuRWqWFdcmC7rAbnLA16rF63s9p_Q9QUfzn-dA_xDjfAxU30CaanddHNl2YQRX3sBpWxyUCv084IK0a8nXaZf25zEjIFcdBOTOWKzyqulG9Hw5rRGi6Tgav1fm6Xg1G3anH1kBRE76OAULmPrHYNsh5rwXbgSbRG3S4CXhjEMtNAwepVjIDjd3egIJ24r3esWJFPv9-jmveL5LOnsLr3f4GbaobzJY9V_YR-Mq5QAkCdBgjtFOM3tfso7NCyXwBQ2ZXTgSYwH5S4o4H6paj6vIbtW-5qTvY2QD_c7AaIp7dFIWnfpFctPDHdKfQ
```

> 把获取到的 Token 复制到登录界面的 Token 输入框中即可登录 dashboard

![image-20230425011834291](/images/Docker/image-20230425011834291.png)



### 证书问题❤️

> 解决谷歌浏览器和Edge浏览器不能访问的问题，通过生成新的证书永久解决

```sh
# 创建一个用于自签证书的目录
$ mkdir kubernetes-dashboard-key && cd kubernetes-dashboard-key
 
# 生成证书请求的key
$ openssl genrsa -out dashboard.key 2048
 
# 192.168.135.130为master节点的IP地址
$ openssl req -new -out dashboard.csr -key dashboard.key -subj '/CN=192.168.135.130'
 
 
# 生成自签证书
$ openssl x509 -req -in dashboard.csr -signkey dashboard.key -out dashboard.crt

# 删除原有证书
$ kubectl delete secret kubernetes-dashboard-certs -n kube-system

# 创建新证书的secret
$ kubectl create secret generic kubernetes-dashboard-certs --from-file=dashboard.key --from-file=dashboard.crt -n kube-system

# 查找正在运行的pod
$ kubectl get pod -n kube-system

# 删除pod，让k8s自动拉起一个新的pod，相对于重启 
# kubernetes-dashboard-5984847f5f-dsg77为上一步找到的
kubectl delete pod kubernetes-dashboard-5984847f5f-dsg77 -n kube-system
```

> 服务调度到k8s-node2节点上了，访问

![image-20230425012805158](/images/Docker/image-20230425012805158.png)



[https://192.168.135.135:31260](https://192.168.135.135:31260)



![image-20230425013132207](/images/Docker/image-20230425013132207.png)



查看上一步的**获取token**❤️，得到token填入之后，就登录了

![image-20230425013345457](/images/Docker/image-20230425013345457.png)

----------



## 卸载

> 安装kubernetes dashboard 不对。命名空间为默认的kubernetes-dashboard，我想改为kube-system
>
> 所以卸载掉之前的。

[删除kubernetes dashboard - 危杨益 - 博客园 (cnblogs.com)](https://www.cnblogs.com/yy690486439/p/13596947.html)



> 删除pod

```sh
[root@k8s-master ~]# kubectl get pods --all-namespaces | grep "dashboard"
kubernetes-dashboard   dashboard-metrics-scraper-78f5d9f487-spz5t   1/1     Running   0          38m
kubernetes-dashboard   kubernetes-dashboard-6bc5cb8879-2g2ms        1/1     Running   0          38m
[root@k8s-master ~]# kubectl delete deployment kubernetes-dashboard  --namespace=kubernetes-dashboard
deployment.apps "kubernetes-dashboard" deleted
[root@k8s-master ~]# kubectl delete deployment dashboard-metrics-scraper --namespace=kubernetes-dashboard
deployment.apps "dashboard-metrics-scraper" deleted
```

> 删除 service

```sh
[root@k8s-master ~]# kubectl get service -A
NAMESPACE              NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                  AGE
default                kubernetes                  ClusterIP   10.96.0.1       <none>        443/TCP                  98m
kube-system            kube-dns                    ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP,9153/TCP   98m
kubernetes-dashboard   dashboard-metrics-scraper   ClusterIP   10.108.88.100   <none>        8000/TCP                 42m
kubernetes-dashboard   kubernetes-dashboard        NodePort    10.104.55.103   <none>        443:30604/TCP            42m
[root@k8s-master ~]# kubectl delete service kubernetes-dashboard  --namespace=kubernetes-dashboard
service "kubernetes-dashboard" deleted
[root@k8s-master ~]# kubectl delete service dashboard-metrics-scraper  --namespace=kubernetes-dashboard
service "dashboard-metrics-scraper" deleted
```

> 删除账户和密钥

```sh
[root@k8s-master ~]# kubectl delete sa kubernetes-dashboard --namespace=kubernetes-dashboard
serviceaccount "kubernetes-dashboard" deleted
[root@k8s-master ~]# kubectl delete secret kubernetes-dashboard-certs --namespace=kubernetes-dashboard
secret "kubernetes-dashboard-certs" deleted
[root@k8s-master ~]# kubectl delete secret kubernetes-dashboard-key-holder --namespace=kubernetes-dashboard
secret "kubernetes-dashboard-key-holder" deleted
```



## 参考

[K8S 笔记 - 部署 k8s dashboard - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/494374026)

[删除kubernetes dashboard - 危杨益 - 博客园 (cnblogs.com)](https://www.cnblogs.com/yy690486439/p/13596947.html)

[Kubernetes（k8s）安装以及搭建k8s-Dashboard详解 - 掘金 (juejin.cn)](https://juejin.cn/post/7107954026875977764#heading-18)

[dashboard creating-sample-user GitHub](https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md)