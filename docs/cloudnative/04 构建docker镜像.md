---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /cloudnative/
---



## **Dockerfile常用指令**

| 命令      | 用途                                                         |
| --------- | ------------------------------------------------------------ |
| FROM      | 基础镜像文件                                                 |
| RUN       | 构建镜像阶段执行命令                                         |
| ADD       | 添加文件，从src目录复制文件到容器的dest，其中 src可以是 Dockerfile所在目录的相对路径，也可以是一个 URL,还可以是一个压缩包 |
| COPY      | 拷贝文件，和ADD命令类似，但不支持URL和压缩包                 |
| CMD       | 容器启动后执行命令                                           |
| EXPOSE    | 声明容器在运行时对外提供的服务端口                           |
| WORKDIR   | 指定容器工作路径                                             |
| ENV       | 指定环境变量                                                 |
| ENTRYPINT | 容器入口， ENTRYPOINT和 CMD指令的目的一样，都是指定 Docker容器启动时执行的命令，可多次设置，但只有最后一个有效。 |
| USER      | 该指令用于设置启动镜像时的用户或者 UID,写在该指令后的 RUN、 CMD以及 ENTRYPOINT指令都将使用该用户执行命令。 |
| VOLUME    | 指定挂载点，该指令使容器中的一个目录具有持久化存储的功能，该目录可被容器本身使用，也可共享给其他容器。当容器中的应用有持久化数据的需求时可以在 Dockerfile中使用该指令。格式为： VOLUME["/data"]。 |



## **使用Dockerfile构建Docker镜像**

::: tip

编写一个最简单的Dockerfile，以前文下载的Nginx镜像为例，来编写一个Dockerfile修改该Nginx镜像的首页

:::

1. 新建一个空文件夹docker-demo，在里面再新建文件夹app，在app目录下新建一个名为Dockerfile的文件，在里面增加如下内容：()

   ```sh
   FROM nginx
   RUN echo '<h1>This is Nginx!!!</h1><h2>Q10Viking learning Docker</h2>' > /usr/share/nginx/html/index.html
   ```

   该Dockerfile非常简单，其中的 FROM、 RUN都是 Dockerfile的指令。 FROM指令用于指定基础镜像， RUN指令用于执行命令。

2. 在Dockerfile所在路径执行以下命令构建镜像

   ```sh
   docker build -t nginx:jingmo .
   ```

   其中，-t指定镜像名字，命令最后的点（.）表示Dockerfile文件所在路径

   ::: details

   ```sh
   [root@localhost app]# docker build -t nginx:jingmo .
   Sending build context to Docker daemon  2.048kB
   Step 1/2 : FROM nginx
    ---> f652ca386ed1
   Step 2/2 : RUN echo '<h1>This is Nginx!!!</h1><h2>Q10Viking learning Docker</h2>' > /usr/share/nginx/html/index.html
    ---> Running in 5b9c0d769a73
   Removing intermediate container 5b9c0d769a73
    ---> 9ba9d4212a17
   Successfully built 9ba9d4212a17
   Successfully tagged nginx:jingmo
   ```

   :::

3. 执行以下命令，即可使用该镜像启动一个 Docker容器

   ```sh
   docker run -d -p 92:80 nginx:jingmo
   ```

4. 访问 http://Docker宿主机IP:92/，可看到下图所示界面

   ![image (10)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112160848130.jpg)

