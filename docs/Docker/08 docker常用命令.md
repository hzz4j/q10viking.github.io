---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



![https://note.youdao.com/yws/public/resource/42384826563c36cddfa032983505bd0d/xmlnote/8115491FCB464209B8FBAFF17AE99A1B/112214](/images/Docker/112214)

## 搜索镜像

> 可使用 docker search命令搜索存放在 Docker Hub中的镜像。执行该命令后， Docker就会在Docker Hub中搜索含有 java这个关键词的镜像仓库

```
docker search openjdk
```

![image-20230423175931606](/images/Docker/image-20230423175931606.png)

以上列表包含五列，含义如下：

- NAME:镜像仓库名称。

- DESCRIPTION:镜像仓库描述。

- STARS：镜像仓库收藏数，表示该镜像仓库的受欢迎程度，类似于 GitHub的 stars0

- OFFICAL:表示是否为官方仓库，该列标记为[0K]的镜像均由各软件的官方项目组创建和维护。

- AUTOMATED：表示是否是自动构建的镜像仓库

> 和docker-desktop中的搜索一样



![image-20230423175827824](/images/Docker/image-20230423175827824.png)



## 下载镜像

使用命令docker pull命令即可从 Docker Registry上下载镜像，执行该命令后，Docker会从 Docker Hub中的 adoptopenjdk/仓库下载最新版本的 maven-openjdk11镜像。如果要下载指定版本则在java后面加冒号指定版本，例如：

```java
docker pull adoptopenjdk/maven-openjdk11:latest
```

![image-20230423180107601](/images/Docker/image-20230423180107601.png)



## 列出镜像

使用 docker images命令即可列出已下载的镜像

```sh
docker images
```

![image-20230423180259521](/images/Docker/image-20230423180259521.png)

以上列表含义如下

- REPOSITORY：镜像所属仓库名称。

- TAG:镜像标签。默认是 latest,表示最新。

- IMAGE ID：镜像 ID，表示镜像唯一标识。

- CREATED：镜像创建时间。

- SIZE: 镜像大小。

> 对应的docker-desktop

![image-20230423180324265](/images/Docker/image-20230423180324265.png)



## **删除本地镜像**

使用 docker rmi命令即可删除指定镜像，强制删除加 -f           

```sh
docker rmi java              
```

### 删除所有镜像

```sh
   docker rmi $(docker images -q)              
```



## 新建并启动容器❤️

> 需要注意的是，使用 docker run命令创建容器时，会先检查本地是否存在指定镜像。如果本地不存在该名称的镜像， Docker就会自动从 Docker Hub下载镜像并启动一个 Docker容器。

```sh
q10viking@LAPTOP-PJLAUUSP:~$ docker images
REPOSITORY                     TAG       IMAGE ID       CREATED         SIZE
nginx                          latest    605c77e624dd   15 months ago   141MB
adoptopenjdk/maven-openjdk11   latest    6ac0cb3aa787   3 years ago     433MB

docker run -d -p 8899:80 nginx  
```

使用以下docker run命令即可新建并启动一个容器，该命令是最常用的命令，它有很多选项，下面将列举一些常用的选项。

```
-d选项：表示后台运行
-P选项：随机端口映射
-p选项：指定端口映射，有以下四种格式。 
    -- ip:hostPort:containerPort 
    -- ip::containerPort
    -- hostPort:containerPort 
    -- containerPort
--net选项：指定网络模式，该选项有以下可选参数：
    --net=bridge:默认选项，表示连接到默认的网桥。
    --net=host:容器使用宿主机的网络。
    --net=container:NAME-or-ID：告诉 Docker让新建的容器使用已有容器的网络配置。
    --net=none：不配置该容器的网络，用户可自定义网络配置。
```

这样就能启动一个 Nginx容器。

```sh
docker run -d -p 8899:80 nginx
```

![image-20230423181714757](/images/Docker/image-20230423181714757.png)

## 列出容器

```sh
q10viking@LAPTOP-PJLAUUSP:~$ docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS              PORTS                  NAMES
6180a4fd4a11   nginx     "/docker-entrypoint.…"   2 minutes ago   Up About a minute   0.0.0.0:8899->80/tcp   heuristic_newton
```

如需列出所有容器（包括已停止的容器），可使用**-a**参数。该列表包含了7列，含义如下

```
- CONTAINER_ID：表示容器 ID。

- IMAGE:表示镜像名称。

- COMMAND：表示启动容器时运行的命令。

- CREATED：表示容器的创建时间。 

- STATUS：表示容器运行的状态。UP表示运行中， Exited表示已停止。 

- PORTS:表示容器对外的端口号。 

- NAMES:表示容器名称。该名称默认由 Docker自动生成，也可使用 docker run命令的--name选项自行指定。
```

## **停止容器**❤️

使用 docker stop命令，即可停止容器

```sh
docker stop 6180a4fd4a11       
```

其中6180a4fd4a11是容器 ID,当然也可使用 docker stop容器名称来停止指定容器

查看一下,该容器确实已经exit

```sh
 docker ps -a
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS                     PORTS     NAMES
6180a4fd4a11   nginx     "/docker-entrypoint.…"   5 minutes ago   Exited (0) 8 seconds ago             heuristic_newton
```



### **强制停止容器**

可使用 docker kill命令发送 SIGKILL信号来强制停止容器

```sh
 docker kill 6180a4fd4a11         
```

​    

## 启动已停止的容器❤️😘

使用**docker run**命令，即可**新建**并启动一个容器。对于已停止的容器，可使用 **docker start**命令来**启动**

```sh
docker start 6180a4fd4a11
```

`6180a4fd4a11`为容器的id



## 查看容器所有信息

> 目前我比较关心的是容器暴露的端口，这条命令就能看到

```sh
 docker inspect 6180a4fd4a11
```

`6180a4fd4a11`为容器的id

::: details

```json
[
    {
        "Id": "6180a4fd4a11322c621fa57cf38e8e438857c98783861a98199dbbea298a70a8",
        "Created": "2023-04-23T10:16:12.200426698Z",
        "Path": "/docker-entrypoint.sh",
        "Args": [
            "nginx",
            "-g",
            "daemon off;"
        ],
        "State": {
            "Status": "running",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 2049,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2023-04-23T10:24:18.22734657Z",
            "FinishedAt": "2023-04-23T10:21:39.904014119Z"
        },
        "Image": "sha256:605c77e624ddb75e6110f997c58876baa13f8754486b461117934b24a9dc3a85",
        "ResolvConfPath": "/var/lib/docker/containers/6180a4fd4a11322c621fa57cf38e8e438857c98783861a98199dbbea298a70a8/resolv.conf",
        "HostnamePath": "/var/lib/docker/containers/6180a4fd4a11322c621fa57cf38e8e438857c98783861a98199dbbea298a70a8/hostname",
        "HostsPath": "/var/lib/docker/containers/6180a4fd4a11322c621fa57cf38e8e438857c98783861a98199dbbea298a70a8/hosts",
        "LogPath": "/var/lib/docker/containers/6180a4fd4a11322c621fa57cf38e8e438857c98783861a98199dbbea298a70a8/6180a4fd4a11322c621fa57cf38e8e438857c98783861a98199dbbea298a70a8-json.log",
        "Name": "/heuristic_newton",
        "RestartCount": 0,
        "Driver": "overlay2",
        "Platform": "linux",
        "MountLabel": "",
        "ProcessLabel": "",
        "AppArmorProfile": "",
        "ExecIDs": [
            "e47ae842a06154a8f05fd5ef30c2539373b8dbb3a50bec3d485f01e5c98c9e18"
        ],
        "HostConfig": {
            "Binds": null,
            "ContainerIDFile": "",
            "LogConfig": {
                "Type": "json-file",
                "Config": {}
            },
            "NetworkMode": "default",
            "PortBindings": {
                "80/tcp": [
                    {
                        "HostIp": "",
                        "HostPort": "8899"
                    }
                ]
            },
            "RestartPolicy": {
                "Name": "no",
                "MaximumRetryCount": 0
            },
            "AutoRemove": false,
            "VolumeDriver": "",
            "VolumesFrom": null,
            "CapAdd": null,
            "CapDrop": null,
            "CgroupnsMode": "private",
            "Dns": [],
            "DnsOptions": [],
            "DnsSearch": [],
            "ExtraHosts": null,
            "GroupAdd": null,
            "IpcMode": "private",
            "Cgroup": "",
            "Links": null,
            "OomScoreAdj": 0,
            "PidMode": "",
            "Privileged": false,
            "PublishAllPorts": false,
            "ReadonlyRootfs": false,
            "SecurityOpt": null,
            "UTSMode": "",
            "UsernsMode": "",
            "ShmSize": 67108864,
            "Runtime": "runc",
            "ConsoleSize": [
                0,
                0
            ],
            "Isolation": "",
            "CpuShares": 0,
            "Memory": 0,
            "NanoCpus": 0,
            "CgroupParent": "",
            "BlkioWeight": 0,
            "BlkioWeightDevice": [],
            "BlkioDeviceReadBps": null,
            "BlkioDeviceWriteBps": null,
            "BlkioDeviceReadIOps": null,
            "BlkioDeviceWriteIOps": null,
            "CpuPeriod": 0,
            "CpuQuota": 0,
            "CpuRealtimePeriod": 0,
            "CpuRealtimeRuntime": 0,
            "CpusetCpus": "",
            "CpusetMems": "",
            "Devices": [],
            "DeviceCgroupRules": null,
            "DeviceRequests": null,
            "KernelMemory": 0,
            "KernelMemoryTCP": 0,
            "MemoryReservation": 0,
            "MemorySwap": 0,
            "MemorySwappiness": null,
            "OomKillDisable": null,
            "PidsLimit": null,
            "Ulimits": null,
            "CpuCount": 0,
            "CpuPercent": 0,
            "IOMaximumIOps": 0,
            "IOMaximumBandwidth": 0,
            "MaskedPaths": [
                "/proc/asound",
                "/proc/acpi",
                "/proc/kcore",
                "/proc/keys",
                "/proc/latency_stats",
                "/proc/timer_list",
                "/proc/timer_stats",
                "/proc/sched_debug",
                "/proc/scsi",
                "/sys/firmware"
            ],
            "ReadonlyPaths": [
                "/proc/bus",
                "/proc/fs",
                "/proc/irq",
                "/proc/sys",
                "/proc/sysrq-trigger"
            ]
        },
        "GraphDriver": {
            "Data": {
                "LowerDir": "/var/lib/docker/overlay2/331ace729d5ebaccbcdef305d8fa1393ed14781dc909dea12dcfc87c40835b50-init/diff:/var/lib/docker/overlay2/1d0007ebea0ed56039cd65875edc2f1aa88892090087229e219f0dff944afe0d/diff:/var/lib/docker/overlay2/e4031ffb538761c282d7c46a275031bd5a4d9a6e47ca0307adda8f9bf9777c40/diff:/var/lib/docker/overlay2/c3647ff0231fb95c0fe1e5c6742aca6da3bfee33245771029e10dbf0ddb25fea/diff:/var/lib/docker/overlay2/bf4a3025f25a3104ab6849c0bc38a128bd1f1222b9b0b6c2eee713f50d857a6d/diff:/var/lib/docker/overlay2/149dc6745f0e01b56f9a199eb700be2eea51bba6d64f24ac99d9bba6cf290ffb/diff:/var/lib/docker/overlay2/e6a845dfd8008e6c49fe62c59720d733d60268819b2e31fac1a885c1f4875f84/diff",
                "MergedDir": "/var/lib/docker/overlay2/331ace729d5ebaccbcdef305d8fa1393ed14781dc909dea12dcfc87c40835b50/merged",
                "UpperDir": "/var/lib/docker/overlay2/331ace729d5ebaccbcdef305d8fa1393ed14781dc909dea12dcfc87c40835b50/diff",
                "WorkDir": "/var/lib/docker/overlay2/331ace729d5ebaccbcdef305d8fa1393ed14781dc909dea12dcfc87c40835b50/work"
            },
            "Name": "overlay2"
        },
        "Mounts": [],
        "Config": {
            "Hostname": "6180a4fd4a11",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "ExposedPorts": {
                "80/tcp": {}
            },
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "NGINX_VERSION=1.21.5",
                "NJS_VERSION=0.7.1",
                "PKG_RELEASE=1~bullseye"
            ],
            "Cmd": [
                "nginx",
                "-g",
                "daemon off;"
            ],
            "Image": "nginx",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": [
                "/docker-entrypoint.sh"
            ],
            "OnBuild": null,
            "Labels": {
                "desktop.docker.io/wsl-distro": "Ubuntu-18.04",
                "maintainer": "NGINX Docker Maintainers \u003cdocker-maint@nginx.com\u003e"
            },
            "StopSignal": "SIGQUIT"
        },
        "NetworkSettings": {
            "Bridge": "",
            "SandboxID": "9dbca633cba8274f94a4fa0480325342b16c17a4d0563272ff8955e3a5b94cdd",
            "HairpinMode": false,
            "LinkLocalIPv6Address": "",
            "LinkLocalIPv6PrefixLen": 0,
            "Ports": {
                "80/tcp": [
                    {
                        "HostIp": "0.0.0.0",
                        "HostPort": "8899"
                    }
                ]
            },
            "SandboxKey": "/var/run/docker/netns/9dbca633cba8",
            "SecondaryIPAddresses": null,
            "SecondaryIPv6Addresses": null,
            "EndpointID": "81d6d3df352475202446d92154bbbb7cba63df0b3fc1725b4afbb8af6c3b37c9",
            "Gateway": "172.17.0.1",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "IPAddress": "172.17.0.2",
            "IPPrefixLen": 16,
            "IPv6Gateway": "",
            "MacAddress": "02:42:ac:11:00:02",
            "Networks": {
                "bridge": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "NetworkID": "9d7a1e485b121f6688cbe05e77a181212be55f7784b97274b5dfc41ad4b408c9",
                    "EndpointID": "81d6d3df352475202446d92154bbbb7cba63df0b3fc1725b4afbb8af6c3b37c9",
                    "Gateway": "172.17.0.1",
                    "IPAddress": "172.17.0.2",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "MacAddress": "02:42:ac:11:00:02",
                    "DriverOpts": null
                }
            }
        }
    }
]
```

:::

> 使用Docker-desktop观察会比较清晰一点

![image-20230423183317754](/images/Docker/image-20230423183317754.png)



## 查看容器的日志

```sh
docker container logs f0b1c8ab3633
```

![image-20230423183517173](/images/Docker/image-20230423183517173.png)



## 查看容器里的进程

```sh
docker top 6180a4fd4a11
```

```sh
q10viking@LAPTOP-PJLAUUSP:~$ docker top 6180a4fd4a11
UID                 PID                 PPID                C                   STIME               TTY                 TIME                CMD
root                2049                2030                0                   10:24               ?                   00:00:00            nginx: master process nginx -g daemon off;
uuidd               2100                2049                0                   10:24               ?                   00:00:00            nginx: worker process
uuidd               2101                2049                0                   10:24               ?                   00:00:00            nginx: worker process
uuidd               2102                2049                0                   10:24               ?                   00:00:00            nginx: worker process
uuidd               2103                2049                0                   10:24               ?                   00:00:00            nginx: worker process
uuidd               2104                2049                0                   10:24               ?                   00:00:00            nginx: worker process
uuidd               2105                2049                0                   10:24               ?                   00:00:00            nginx: worker process
uuidd               2106                2049                0                   10:24               ?                   00:00:00            nginx: worker process
uuidd               2107                2049                0                   10:24               ?                   00:00:00            nginx: worker process
uuidd               2108                2049                0                   10:24               ?                   00:00:00            nginx: worker process
uuidd               2109                2049                0                   10:24               ?                   00:00:00            nginx: worker process
uuidd               2110                2049                0                   10:24               ?                   00:00:00            nginx: worker process
uuidd               2111                2049                0                   10:24               ?                   00:00:00            nginx: worker process
root                2124                2030                0                   10:29               ?                   00:00:00            /bin/sh
```



## **容器与宿主机相互复制文件**❤️

- **容器与宿主机相互复制文件**

  ```sh
  # docker cp 容器id:要拷贝的文件在容器里面的路径  宿主机的相应路径 
  如：docker cp 7aa5dc458f9d:/etc/nginx/nginx.conf ./
  ```

  ```sh
  q10viking@LAPTOP-PJLAUUSP:~/learndocker$ docker ps
  CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                  NAMES
  6180a4fd4a11   nginx     "/docker-entrypoint.…"   22 minutes ago   Up 14 minutes   0.0.0.0:8899->80/tcp   heuristic_newton
  q10viking@LAPTOP-PJLAUUSP:~/learndocker$ docker cp 6180a4fd4a11:/etc/nginx/nginx.conf ./
  q10viking@LAPTOP-PJLAUUSP:~/learndocker$ ls
  nginx.conf
  ```

- **从宿主机拷文件到容器里面**

  ```sh
  #docker cp 要拷贝的宿主机文件路径 容器id:要拷贝到容器里面对应的路径
  docker cp ./hello.txt 6180a4fd4a11:/tmp
  ```
  
  

---------



## **进入容器**❤️😘

使用docker exec命令用于进入一个正在运行的docker容器。如果docker run命令运行容器的时候，没有使用**-it**参数，就要用这个命令进入容器。一旦进入了容器，就可以在容器的 Shell 执行命令了

```sh
docker exec -it 6180a4fd4a11 /bin/bash  #(有的容器需要把 /bin/bash 换成 sh)   
```







## **容器内安装vim、ping、ifconfig等指令**👍

```sh
容器内安装vim、ping、ifconfig等指令
apt-get update
apt-get install vim           #安装vim
apt-get install iputils-ping  #安装ping
apt-get install net-tools     #安装ifconfig 
```

> 测试，能够容器的ip地址

```sh
root@6180a4fd4a11:/tmp# ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.2  netmask 255.255.0.0  broadcast 172.17.255.255
        ether 02:42:ac:11:00:02  txqueuelen 0  (Ethernet)
        RX packets 6345  bytes 9366371 (8.9 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 3441  bytes 188699 (184.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```



## **删除容器**

使用 docker rm命令即可删除指定容器

```sh
 docker rm 6180a4fd4a11        
```

该命令只能删除**已停止**的容器，如需删除正在运行的容器，可使用**-f**参数

### 强制删除所有容器

```sh
 docker rm -f $(docker ps -a -q)             
```



## 提交到中央仓库



我们制作好了微服务镜像，一般需要发布到镜像仓库供别人使用，我们可以选择自建镜像仓库，也可以直接使用docker官方镜像仓库，这里我们选择docker官方镜像仓库

需要登录认证：

```sh
docker login
```

> 需要特别注意一定要打标签为自己的`用户名/docker名:标签`的格式,因为用户名像路径一样，dockerhub用来找到存储的地方

```sh
q10viking@LAPTOP-PJLAUUSP:~/learndocker/cmak/cmak-3.0.0.6$ docker tag cmak:3.0.0.6 q10viking/cmak:3.0.0.6
q10viking@LAPTOP-PJLAUUSP:~/learndocker/cmak/cmak-3.0.0.6$ docker images
REPOSITORY                TAG       IMAGE ID       CREATED          SIZE
cmak                      3.0.0.6   e88cbd0dfa2d   19 minutes ago   833MB
q10viking/cmak            3.0.0.6   e88cbd0dfa2d   19 minutes ago   833MB
hzz-microservice-server   0.0.1     176bcabc7ced   51 minutes ago   683MB
nginx                     latest    605c77e624dd   15 months ago    141MB
openjdk                   11        5505a9a39df1   16 months ago    659MB
alpine                    latest    c059bfaa849c   17 months ago    5.59MB
java                      8         d23bdf5b1b1b   6 years ago      643MB
q10viking@LAPTOP-PJLAUUSP:~/learndocker/cmak/cmak-3.0.0.6$ docker push q10viking/cmak:3.0.0.6
```

最后可以看到：



## 参数解释👍

| 选项         | 选项简写 | 说明                                                         |
| ------------ | -------- | ------------------------------------------------------------ |
|              | -e       | 设置环境变量                                                 |
| –detach      | -d       | 在后台运行容器，并且打印容器id。                             |
| –interactive | -i       | 即使没有连接，也要保持标准输入保持打开状态，一般与 -t 连用。 |
| –tty         | -t       | 分配一个伪tty，一般与 -i 连用。                              |

