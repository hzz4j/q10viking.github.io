---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



[Dockerfile reference | Docker Documentation](https://docs.docker.com/engine/reference/builder/)

[Linux命令大全(手册)](https://www.linuxcool.com/)

[Linux Documentation (die.net)](https://linux.die.net/)



## Dockfile常用指令

::: tip

- RUN命令在 image 文件的构建阶段执行，执行结果都会打包进入 image 文件
- CMD命令则是在容器启动后执行
- 一个 Dockerfile 可以包含多个RUN命令，但是只能有一个CMD命令
- 

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



## CMD

> The main purpose of a CMD is to provide defaults for an executing container.

```dockerfile
CMD ["node", "src/index.js"]
```



## build

```sh
# -t tag标签  . 代表当前目录下的Dockerfile
docker build -t jingmo-hello-docker .
```



## 案例

```dockerfile
# syntax=docker/dockerfile:1
FROM node:12-alpine
RUN apk add --no-cache python2 g++ make
WORKDIR /app
COPY . .
RUN yarn install --production --network-timeout 1000000
CMD ["node", "src/index.js"]
EXPOSE 3000
```





