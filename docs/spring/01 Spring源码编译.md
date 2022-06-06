::: tip

:one: [Build From Source (spring/github.com)](https://github.com/spring-projects/spring-framework/wiki/Build-from-Source)  使用的版本是5.3.13

:two: [import-into-idea spring-framework (github.com)](https://github.com/spring-projects/spring-framework/blob/main/import-into-idea.md)

:::

根据官网的介绍

1. 安装好[Gradle](https://gradle.org/install/) 7.3
2. JDK版本是17

按照官网的推荐走，**不要download zip文件**，不然会走很多弯路，各种编译失败的错误

```sh
git clone git@github.com:spring-projects/spring-framework.git
cd spring-framework
```

### Build from the Command Line

To compile, test, and build all jars, distribution zips, and docs use:

```sh
./gradlew build
```

