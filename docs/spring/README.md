::: tip

Spring 源码分析

:one: [spring-framework(github.com)](https://github.com/spring-projects/spring-framework)

:two: [Spring | Home](https://spring.io/)

:::

```
./gradlew build
```



```
 A build scan was not published as you have not authenticated with server 'ge.spring.io'
```

```
Task :spring-core:compileJava FAILED
```

使用正确的JDK版本，按照官网的:one: [spring-framework(github.com)](https://github.com/spring-projects/spring-framework)的推荐，下载openjdk  [Adoptium - Open source, prebuilt OpenJDK binaries](https://adoptium.net/)

```sh
PS C:\Users\11930\Desktop> java -version
openjdk version "17.0.1" 2021-10-19
OpenJDK Runtime Environment Temurin-17.0.1+12 (build 17.0.1+12)
OpenJDK 64-Bit Server VM Temurin-17.0.1+12 (build 17.0.1+12, mixed mode, sharing)
```



## JAVA_HOME

```sh
# standard Windows command prompt
echo %JAVA_HOME%
# Powershell
echo $Env:JAVA_HOME
```

