---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Linux/
typora-root-url: ..\.vuepress\public
---



> linux下取代vim的编辑工具。
>
> 接触背景，在编辑k8s资源清单的时候，想要一个强大的编辑器。



## 安装

::: tip

centos7 安装 neovim[Installing Neovim · neovim/neovim Wiki · GitHub](https://github.com/neovim/neovim/wiki/Installing-Neovim)

:::



找到[Releases · neovim/neovim (github.com)](https://github.com/neovim/neovim/releases) 想要的版本，这里我选择`v.0.9.0`,linux下可以直接执行这行命令，下载下来。网速太慢，也可以直接下载tar包，然后上传到服务器

![image-20230425154851037](/images/Docker/image-20230425154851037.png)



```sh
# 赋予执行权限
chmod u+x nvim.appimage
# 执行，看看能不能运行，我电脑没问题，如果不行，也向接下的步骤解压
./nvim.appimage


# 设置为全局
./nvim.appimage --appimage-extract
./squashfs-root/AppRun --version

# Optional: exposing nvim globally.
sudo mv squashfs-root /
# 创建软连接
sudo ln -s /squashfs-root/AppRun /usr/bin/nvim
nvim
```





### 设置

```sh
:set number
```

