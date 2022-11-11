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





