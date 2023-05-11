---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



## 临时目录

```java
public class Test {
    public static void main(String[] args) {
        String path = System.getProperty("java.io.tmpdir");
        System.out.println(path); // C:\Users\11930\AppData\Local\Temp\
    }
}
```

::: tip

springboot在配置日志文件的时候，可以通过el表达式，设置文件的路径

:::

```xml
<!-- el表达式，System.getProperty("java.io.tmpdir")    -->
<!-- 默认是/tmp -->
<property name="LOG_FILE_PATH" value="${LOG_FILE:-${LOG_PATH:-${LOG_TEMP:-${java.io.tmpdir:-/tmp}}}/logs}"/>
<!--应用名称-->
<property name="APP_NAME" value="mall-order"/>
<!--每天记录日志到文件appender-->
<appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
        <fileNamePattern>${LOG_FILE_PATH}/${APP_NAME}-%d{yyyy-MM-dd}.log</fileNamePattern>
        <maxHistory>30</maxHistory>
    </rollingPolicy>
    <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
        <layout class="org.apache.skywalking.apm.toolkit.log.logback.v1.x.TraceIdPatternLogbackLayout">
            <Pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%tid] [%thread] %-5level %logger{36}: %msg%n</Pattern>
        </layout>
    </encoder>
</appender>
```



## 其他参数

| 参数                          | 说明                              |
| ----------------------------- | --------------------------------- |
| java.version                  | Java运行时环境版本                |
| java.vendor                   | Java运行时环境供应商              |
| java.vendor.url               | Java供应商的 URL                  |
| java.home                     | Java安装目录                      |
| java.vm.specification.version | Java虚拟机规范版本                |
| java.vm.specification.vendor  | Java虚拟机规范供应商              |
| java.vm.specification.name    | Java虚拟机规范名称                |
| java.vm.version               | Java虚拟机实现版本                |
| java.vm.vendor                | Java虚拟机实现供应商              |
| java.vm.name                  | Java虚拟机实现名称                |
| java.specification.version    | Java运行时环境规范版本            |
| java.specification.vendor     | Java运行时环境规范供应商          |
| java.specification.name       | Java运行时环境规范名称            |
| java.class.version            | Java类格式版本号                  |
| java.class.path               | Java类路径                        |
| java.library.path             | 加载库时搜索的路径列表            |
| java.io.tmpdir                | 默认的临时文件路径                |
| java.compiler                 | 要使用的 JIT 编译器的名称         |
| java.ext.dirs                 | 一个或多个扩展目录的路径          |
| os.name                       | 操作系统的名称                    |
| os.arch                       | 操作系统的架构                    |
| os.version                    | 操作系统的版本                    |
| file.separator                | 文件分隔符（在 UNIX 系统中是“/”） |
| path.separator                | 路径分隔符（在 UNIX 系统中是“:”） |
| line.separator                | 行分隔符（在 UNIX 系统中是“/n”）  |
| user.name                     | 用户的账户名称                    |
| user.home                     | 用户的主目录                      |
| user.dir                      | 用户的当前工作目录                |



## Rocket中的环境变量

NamesrvConfig这个类在初始化没有获得相应的配置

```java
// MixAll.ROCKETMQ_HOME_PROPERTY = "rocketmq.home.dir"
// MixAll.ROCKETMQ_HOME_ENV = "ROCKETMQ_HOME"
private String rocketmqHome = System.getProperty(MixAll.ROCKETMQ_HOME_PROPERTY, System.getenv(MixAll.ROCKETMQ_HOME_ENV));
```

当没有配置该环境时退出程序`System.exit(-2)`

```java
if (null == namesrvConfig.getRocketmqHome()) {
    System.out.printf("Please set the %s variable in your environment to match the location of the RocketMQ installation%n", MixAll.ROCKETMQ_HOME_ENV);
    System.exit(-2); // Process finished with exit code -2
}
```

