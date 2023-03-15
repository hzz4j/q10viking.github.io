---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /nacos/
typora-root-url: ..\.vuepress\public
---

## Nacos源码准备

1. 在github上下载1.4.1的nacos版本https://github.com/alibaba/nacos/releases/tag/1.4.1

### 找启动类

1. 在启动脚本中找到启动的类start.sh

   ```sh
   export SERVER="nacos-server"
   JAVA_OPT="${JAVA_OPT} -jar ${BASE_DIR}/target/${SERVER}.jar"
   nohup $JAVA ${JAVA_OPT} nacos.nacos >> ${BASE_DIR}/logs/start.out 2>&1 &
   ```

2. 找到运行的jar包 nacos-server.jar包,

   1. 进行解压

   2. 找到MANIFEST.MF文件

      ```json
      Start-Class: com.alibaba.nacos.Nacos  // 该类为启动类
      ```

### 在IDEA启动nacos

使用单机启动

```
-Dnacos.standalone=true
```

![image-20210819192046777](/images/nacos/image-20210819192046777.png)

### 启动问题

#### 找不到符号`com.alibaba.nacos.consistency.entity`

这个包目录是由`protobuf`在编译时自动生成，您可以通过`mvn compile`来自动生成他们。如果您使用的是IDEA，也可以使用IDEA的protobuf插件。

```sh
mvn compile
```

