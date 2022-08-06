---
prev:
  text: Back To 目录
  link: /Linux/
typora-root-url: ..\.vuepress\public
---



## 1. 检测是否安装openJDK

```shell
[root@hzz ~]# java -version
java version "1.7.0_79"
OpenJDK Runtime Environment (rhel-2.5.5.4.el6-i386 u79-b14)
OpenJDK Client VM (build 24.79-b02, mixed mode, sharing)
```

1.	查看是否已经安装JDK：rpm -qa | grep -i java

```shell
[root@hzz ~]# rpm -qa | grep openjdk -i
java-1.6.0-openjdk-1.6.0.35-1.13.7.1.el6_6.i686
java-1.7.0-openjdk-1.7.0.79-2.5.5.4.el6.i686
```

## 2. 卸载Centos自带的openJDK

2. 若有则删除：rpm -e --nodeps java-xxx，删除所有相关的java

```shell
#	卸载上面与openjdk相关的软件
rpm -e --nodeps java-1.6.0-openjdk-1.6.0.35-1.13.7.1.el6_6.i686
rpm -e --nodeps java-1.7.0-openjdk-1.7.0.79-2.5.5.4.el6.i686
```



## 3. 安装Java JDK

下载jdk8 [Java Downloads | Oracle](https://www.oracle.com/java/technologies/downloads/#java8)

1193094618@qq.com	忘记密码则发送邮件找回

![image-20211029170316228](/images/linux/image-20211029170316228.png)

### 3.1 上传JDK安装包

```shell
#	用于存放安装包的文件夹
mkdir /usr/java
```

![image-20211029171506808](/images/linux/image-20211029171506808.png)

### 3.2 解压安装包

```shell
tar -zxvf jdk-8u191-linux-x64.tar.gz
```

![image-20210312121318695](/images/linux/image-20210312121318695.png)



## 4. 配置环境变量

```sh
# 文件 /etc/profile  在文件末尾追加
JAVA_HOME=/usr/java/jdk1.8.0_311
CLASSPATH=.:$JAVA_HOME/lib/
PATH=$PATH:$JAVA_HOME/bin
export PATH JAVA_HOME CLASSPATH
```

![image-20211029172249433](/images/linux/image-20211029172249433.png)

## 5. 刷新profile

```shell
source /etc/profile
```

## 6. 验证

```shell
[root@localhost java]# java -version
java version "1.8.0_191"
Java(TM) SE Runtime Environment (build 1.8.0_191-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.191-b12, mixed mode)
```

