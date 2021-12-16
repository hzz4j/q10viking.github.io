---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /cloudnative/
---



## **Dockerfile常用指令**

::: tip

注意：RUN命令在 image 文件的构建阶段执行，执行结果都会打包进入 image 文件；CMD命令则是在容器启动后执行。另外，一个 Dockerfile 可以包含多个RUN命令，但是只能有一个CMD命令。

注意，指定了CMD命令以后，docker container run命令就不能附加命令了（比如前面的/bin/bash），否则它会覆盖CMD命令。

:::

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



## 构建简单Docker镜像

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



## 构建微服务镜像:smile:

1. 将jar包上传linux服务器/usr/local/docker-app/docker-demo/app/eureka目录，在jar包所在目录创建名为Dockerfile的文件

::: details 效果

```sh
[root@localhost eureka]# pwd
/usr/local/docker-demo/app/eureka
[root@localhost eureka]# ls
microservice-eureka-server-0.0.1-SNAPSHOT.jar
```

:::

2. 在Dockerfile中添加以下内容

```sh
# 基于哪个镜像
From java:8
# 复制文件到容器
ADD microservice-eureka-server-0.0.1-SNAPSHOT.jar /app.jar
# 声明需要暴露的端口
EXPOSE 8761
# 配置容器启动后执行的命令
ENTRYPOINT java ${JAVA_OPTS} -jar /app.jar
```

3. 使用docker build命令构建镜像


```sh
docker build -t microservice-eureka-server:0.0.1 .
```

4, 启动镜像，加-d可在后台启动

```sh
docker run -d -p 8761:8761 microservice-eureka-server:0.0.1
```

使用 -v 可以挂载一个主机上的目录到容器的目录:star:

```
docker run -d -p 8761:8761 -v /log:/container-log microservice-eureka-server:0.0.1
```

加上JVM参数

```sh
# --cap-add=SYS_PTRACE 这个参数是让docker能支持在容器里能执行jdk自带类似jinfo，jmap这些命令，如果不需要在容器里执行这些命令可以不加
docker run -e JAVA_OPTS='-Xms1028M -Xmx1028M -Xmn512M -Xss512K -XX:MetaspaceSize=256M -XX:MaxMetaspaceSize=256M' --cap-add=SYS_PTRACE -d -p 8761:8761 microservice-eureka-server:0.0.1
```

5. 访问http://Docker宿主机IP:8761/，可正常显示Eureka Server首页![image (11)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112160903821.jpg)
