---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



[Docker Desktop WSL 2 backend on Windows | Docker Documentation](https://docs.docker.com/desktop/windows/wsl/)

```sh
PS C:\Users\11930> wsl -l -v
  NAME                   STATE           VERSION
* Ubuntu-18.04           Running         2
  docker-desktop-data    Running         2
  golang-centos          Stopped         2
  docker-desktop         Running         2
```

比如说我想在子系统中ubuntu使用docker,那么需要启动Docker-deskop,其实只要启动了Docker-Desktop,在windows也可以使用命令。

