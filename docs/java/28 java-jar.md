---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



::: tip

得益于SpringBoot的封装，我们可以只通过jar -jar一行命令便启动一个web项目.再也不用操心搭建tomcat等相关web容器。那么，你是否探究过SpringBoot是如何达到这一操作的呢？只有了解了底层实现原理，才能更好的掌握该项技术带来的好处以及性能调优

:::

```sh
java -jar springboot-hello-world.jar hzz q10viking

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::               (v2.7.10)

2023-04-08 18:05:35.555  INFO 26760 --- [           main] org.hzz.Application                      : Starting Application v0.0.1-SNAPSHOT using Java 1.8.0_361 on LAPTOP-PJLAUUSP with PID 26760 (C:\Users\11930\Desktop\jar\springboot-hello-world.jar started by 11930 in C:\Users\11930\Desktop\jar)
2023-04-08 18:05:35.563  INFO 26760 --- [           main] org.hzz.Application                      : No active profile set, falling back to 1 default profile: "default"
2023-04-08 18:05:36.260  INFO 26760 --- [           main] org.hzz.Application                      : Started Application in 1.281 seconds (JVM running for 2.16)

Hello World [hzz, q10viking]
```



## **java -jar做了什么**

先要弄清楚java -jar命令做了什么，在oracle[官网](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html)找到了该命令的描述：

> If the -jar option is specified, its argument is the name of the JAR file containing class and resource files for the application. The startup class must be indicated by the Main-Class manifest header in its source code.
>
> 使用-jar参数时，后面的参数是的jar文件名(本例中是springboot-hello-world.jar)；该jar文件中包含的是class和资源文件；在manifest文件中有Main-Class的定义；Main-Class的源码中指定了整个应用的启动类；(in its source code) 

java -jar会去找jar中的manifest文件，在那里面找到真正的启动类；



### jar包里面的内容



springboot-hello-world.jar 包里面的内容

```sh
卷 Windows 的文件夹 PATH 列表
卷序列号为 906B-2229
C:.
│ 
├─BOOT-INF
│  │  classpath.idx
│  │  layers.idx
│  │  
│  ├─classes
│  │  │  application.properties
│  │  │  
│  │  └─org
│  │      └─hzz
│  │              Application.class
│  │              
│  └─lib
│          jakarta.annotation-api-1.3.5.jar
│          jul-to-slf4j-1.7.36.jar
│          log4j-api-2.17.2.jar
│          log4j-to-slf4j-2.17.2.jar
│          logback-classic-1.2.11.jar
│          logback-core-1.2.11.jar
│          slf4j-api-1.7.36.jar
│          snakeyaml-1.30.jar
│          spring-aop-5.3.26.jar
│          spring-beans-5.3.26.jar
│          spring-boot-2.7.10.jar
│          spring-boot-autoconfigure-2.7.10.jar
│          spring-boot-jarmode-layertools-2.7.10.jar
│          spring-context-5.3.26.jar
│          spring-core-5.3.26.jar
│          spring-expression-5.3.26.jar
│          spring-jcl-5.3.26.jar
│          
├─META-INF
│  │  MANIFEST.MF
│  │  
│  └─maven
│      └─org.hzz
│          └─_03-springboot-start-up-analysis
│                  pom.properties
│                  pom.xml
│                  
└─org
    └─springframework
        └─boot
            └─loader
                │  ClassPathIndexFile.class
                │  ExecutableArchiveLauncher.class
                │  JarLauncher.class
                │  LaunchedURLClassLoader$DefinePackageCallType.class
                │  LaunchedURLClassLoader$UseFastConnectionExceptionsEnumeration.class
                │  LaunchedURLClassLoader.class
                │  Launcher.class
                │  MainMethodRunner.class
                │  PropertiesLauncher$1.class
                │  PropertiesLauncher$ArchiveEntryFilter.class
                │  PropertiesLauncher$ClassPathArchives.class
                │  PropertiesLauncher$PrefixMatchingArchiveFilter.class
                │  PropertiesLauncher.class
                │  WarLauncher.class
                │  
                ├─archive
                │      Archive$Entry.class
                │      Archive$EntryFilter.class
                │      Archive.class
                │      ExplodedArchive$AbstractIterator.class
                │      ExplodedArchive$ArchiveIterator.class
                │      ExplodedArchive$EntryIterator.class
                │      ExplodedArchive$FileEntry.class
                │      ExplodedArchive$SimpleJarFileArchive.class
                │      ExplodedArchive.class
                │      JarFileArchive$AbstractIterator.class
                │      JarFileArchive$EntryIterator.class
                │      JarFileArchive$JarFileEntry.class
                │      JarFileArchive$NestedArchiveIterator.class
                │      JarFileArchive.class
                │      
                ├─data
                │      RandomAccessData.class
                │      RandomAccessDataFile$1.class
                │      RandomAccessDataFile$DataInputStream.class
                │      RandomAccessDataFile$FileAccess.class
                │      RandomAccessDataFile.class
                │      
                ├─jar
                │      AbstractJarFile$JarFileType.class
                │      AbstractJarFile.class
                │      AsciiBytes.class
                │      Bytes.class
                │      CentralDirectoryEndRecord$1.class
                │      CentralDirectoryEndRecord$Zip64End.class
                │      CentralDirectoryEndRecord$Zip64Locator.class
                │      CentralDirectoryEndRecord.class
                │      CentralDirectoryFileHeader.class
                │      CentralDirectoryParser.class
                │      CentralDirectoryVisitor.class
                │      FileHeader.class
                │      Handler.class
                │      JarEntry.class
                │      JarEntryCertification.class
                │      JarEntryFilter.class
                │      JarFile$1.class
                │      JarFile$JarEntryEnumeration.class
                │      JarFile.class
                │      JarFileEntries$1.class
                │      JarFileEntries$EntryIterator.class
                │      JarFileEntries$Offsets.class
                │      JarFileEntries$Zip64Offsets.class
                │      JarFileEntries$ZipOffsets.class
                │      JarFileEntries.class
                │      JarFileWrapper.class
                │      JarURLConnection$1.class
                │      JarURLConnection$JarEntryName.class
                │      JarURLConnection.class
                │      StringSequence.class
                │      ZipInflaterInputStream.class
                │      
                ├─jarmode
                │      JarMode.class
                │      JarModeLauncher.class
                │      TestJarMode.class
                │      
                └─util
                        SystemPropertyUtils.class
```



### MANIFEST.MF文件

```json
Manifest-Version: 1.0
Spring-Boot-Classpath-Index: BOOT-INF/classpath.idx
Implementation-Title: _03-springboot-start-up-analysis
Implementation-Version: 0.0.1-SNAPSHOT
Spring-Boot-Layers-Index: BOOT-INF/layers.idx
Start-Class: org.hzz.Application
Spring-Boot-Classes: BOOT-INF/classes/
Spring-Boot-Lib: BOOT-INF/lib/
Build-Jdk-Spec: 1.8
Spring-Boot-Version: 2.7.10
Created-By: Maven JAR Plugin 3.2.2
Main-Class: org.springframework.boot.loader.JarLauncher
```

可以看到有Main-Class是org.springframework.boot.loader.JarLauncher ，这个是jar启动的Main函数。

还有一个Start-Class是org.hzz.Application，这个是我们应用自己的Main函数



## 小结



JarLauncher通过加载BOOT-INF/classes目录及BOOT-INF/lib目录下jar文件，实现了fat jar的启动。

SpringBoot通过扩展JarFile、JarURLConnection及URLStreamHandler，实现了jar in jar中资源的加载。

SpringBoot通过扩展URLClassLoader–LauncherURLClassLoader，实现了jar in jar中class文件的加载。

WarLauncher通过加载WEB-INF/classes目录及WEB-INF/lib和WEB-INF/lib-provided目录下的jar文件，实现了war文件的直接启动及web容器中的启动。
