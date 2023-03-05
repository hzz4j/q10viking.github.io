```
npm ERR! gyp ERR! node -v v18.14.2
npm ERR! gyp ERR! node-gyp -v v8.4.1
npm ERR! gyp ERR! not ok
npm ERR! Build failed with error code: 1
```



一般都是nodej版本与node-sass sass-loader不对应的问题，

我电脑上安装的电脑是nodejs v18.14.2,  后来改为v14.17.6

```

```



node-sass下载不下来

```
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! node-sass@4.14.1 postinstall: `node scripts/build.js`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the node-sass@4.14.1 postinstall script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
```

**一般下载不下来的原因大多的是因为默认是从github上去下载node-sass，而国内经常连不上或者网不好**

> Downloading binary from https://github.com/sass/node-sass/releases/download/v4.14.1/win32-ia32-83_binding.node

设置成国内镜像

```
npm config set registry=https://registry.npmmirror.com
```



## 参考

[node16+怎么配置对应的sass环境 - web开发 - 亿速云 (yisu.com)](https://www.yisu.com/zixun/622837.html)
