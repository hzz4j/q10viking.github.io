---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



## **Docker虚拟化原理**

![https://note.youdao.com/yws/public/resource/42384826563c36cddfa032983505bd0d/xmlnote/6B7FD54F37644A8F82AEB5B048A8F18A/90517](/images/Docker/docker-yuanli.png)

传统虚拟化和容器技术结构比较：传统虚拟化技术是在硬件层面实现虚拟化，增加了系统调用链路的环节，有性能损耗；容器虚拟化技术以共享宿主机Kernel的方式实现，几乎没有性能损耗

docker利用的是宿主机的内核,而不需要Guest OS。因此,当新建一个容器时,docker不需要和虚拟机一样重新加载一个操作系统内核。避免了寻址、加载操作系统内核这些比较费时费资源的过程,当新建一个虚拟机时,虚拟机软件需要加载Guest OS,这个新建过程是分钟级别的。而docker由于直接利用宿主机的操作系统,则省略了这个过程,因此新建一个docker容器只需要几秒钟

![https://note.youdao.com/yws/public/resource/42384826563c36cddfa032983505bd0d/xmlnote/A385072D91A54B5CA8B7B09F126C7983/91325](/images/Docker/91325.png)



## **Docker是如何将机器的资源进行隔离的**

答案是**联合文件系统**，常见的有AUFS、Overlay、devicemapper、BTRFS和ZFS等。

以Overlay2举例说明，Overlay2的架构图如下：

![https://note.youdao.com/yws/public/resource/42384826563c36cddfa032983505bd0d/xmlnote/59FDA5A6F1AB4C6280714BD225DEFC31/90521](/images/Docker/90521.png)

原理：overlayfs在linux主机上只有两层，一个目录在下层，用来保存镜像(docker)，另外一个目录在上层，用来存储容器信息。在overlayfs中，底层的目录叫做lowerdir，顶层的目录称之为upperdir，对外提供统一的文件系统为merged。当需要修改一个文件时，使用**COW(Copy-on-write)**将文件从只读的Lower复制到可写的Upper进行修改，结果也保存在Upper层。在Docker中，底下的只读层就是image，可写层就是Container。



------------

### **写时复制 (CoW) 技术详解**

所有驱动都用到的技术—写时复制，Cow全称copy-on-write，表示只是在需要写时才去复制，这个是**针对已有文件的修改场景**。比如基于一个image启动多个Container，如果每个Container都去分配一个image一样的文件系统，那么将会占用大量的磁盘空间。而CoW技术可以让所有的容器共享image的文件系统，所有数据都从image中读取，只有当要对文件进行写操作时，才从image里把要写的文件复制到自己的文件系统进行修改。所以无论有多少个容器共享一个image，所做的写操作都是对从image中复制到自己的文件系统的副本上进行，并不会修改image的源文件，且多个容器操作同一个文件，会在每个容器的文件系统里生成一个副本，每个容器修改的都是自己的副本，互相隔离，互不影响。使用CoW可以有效的提高磁盘的利用率。**所以容器占用的空间是很少的**



-------------

**查看容器占用磁盘大小指令**

```sh
# 查看所有容器的大小
cd /var/lib/docker/containers  # 进入docker容器存储目录
du -sh *  # 查看所有容器的大小
du -sh <容器完整id>  #查看某一个容器的大小
```



### **用时分配 （allocate-on-demand）**

用时分配是**针对原本没有这个文件的场景**，只有在要新写入一个文件时才分配空间，这样可以提高存储资源的利用率。比如启动一个容器，并不会因为这个容器分配一些磁盘空间，而是当有新文件写入时，才按需分配新空间。



## **docker中的镜像分层技术的原理**

docker使用共享技术减少镜像存储空间，所有镜像层和容器层都保存在宿主机的文件系统**/var/lib/docker/**中，由存储驱动进行管理，尽管存储方式不尽相同，但在所有版本的Docker中都可以**共享镜像层**。在下载镜像时，Docker Daemon会检查镜像中的镜像层与宿主机文件系统中的镜像层进行对比，如果存在则不下载，只下载不存在的镜像层，这样可以非常**节约存储空间**。

​    ![0](/images/Docker/91330.png)



![https://note.youdao.com/yws/public/resource/42384826563c36cddfa032983505bd0d/xmlnote/B511FA5B4C274E0EB87630C53CE3A369/90515](/images/Docker/90515.png)



### **查看容器资源使用情况**

```sh
docker stats  # 返回容器资源的实时使用情况，1秒刷新一次
docker stats --no-stream  # 返回容器当时的资源使用情况
```

```sh
CONTAINER ID   NAME               CPU %     MEM USAGE / LIMIT     MEM %     NET I/O       BLOCK I/O   PIDS
6180a4fd4a11   heuristic_newton   0.00%     9.508MiB / 19.44GiB   0.05%     1.32kB / 0B   0B / 0B     13
```

```sh
[CONTAINER]：以短格式显示容器的 ID。

[CPU %]：CPU 的使用情况。

[MEM USAGE / LIMIT]：当前使用的内存和最大可以使用的内存。

[MEM %]：以百分比的形式显示内存使用情况。

[NET I/O]：网络 I/O 数据。

[BLOCK I/O]：磁盘 I/O 数据。 

[PIDS]：PID 号。
```

> 注意：容器的内存使用最大限制默认可以接近宿主机的物理内存，可以通过"-m"参数限制容器可以使用的最大内存

```sh
docker run -m 500M redis   #限制容器的最大使用内存为500M
```

