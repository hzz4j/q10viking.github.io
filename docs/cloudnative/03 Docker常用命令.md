## **搜索镜像**

可使用 docker search命令搜索存放在 Docker Hub中的镜像。执行该命令后， Docker就会在Docker Hub中搜索含有 java这个关键词的镜像仓库。

```sh
docker search java
```

::: details

```sh
[root@localhost docker]# docker search java
NAME                               DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
node                               Node.js is a JavaScript-based platform for s…   10852     [OK]
tomcat                             Apache Tomcat is an open source implementati…   3193      [OK]
openjdk                            OpenJDK is an open-source implementation of …   3058      [OK]
java                               DEPRECATED; use "openjdk" (or other JDK impl…   1976      [OK]
ghost                              Ghost is a free and open source blogging pla…   1451      [OK]
couchdb                            CouchDB is a database that uses JSON for doc…   451       [OK]
jetty                              Jetty provides a Web server and javax.servle…   379       [OK]
groovy                             Apache Groovy is a multi-faceted language fo…   120       [OK]
lwieske/java-8                     Oracle Java 8 Container - Full + Slim - Base…   50                   [OK]
nimmis/java-centos                 This is docker images of CentOS 7 with diffe…   42                   [OK]
fabric8/java-jboss-openjdk8-jdk    Fabric8 Java Base Image (JBoss, OpenJDK 8)      29                   [OK]
timbru31/java-node                 OpenJDK JRE or JDK (8 or 11) with Node.js 12…   19                   [OK]
cloudbees/java-build-tools         Docker image with commonly used tools to bui…   16                   [OK]
fabric8/java-centos-openjdk8-jdk   Fabric8 Java Base Image (CentOS, OpenJDK 8, …   14                   [OK]
frekele/java                       docker run --rm --name java frekele/java        12                   [OK]
blacklabelops/java                 Java Base Images.                               8                    [OK]
fabric8/java-centos-openjdk8-jre   Fabric8 Java Base Image (CentOS, OpenJDK 8, …   4                    [OK]
rightctrl/java                     Oracle Java                                     3                    [OK]
cfje/java-test-applications        Java Test Applications CI Image                 2
jelastic/javaengine                An image of the Java Engine server maintaine…   1
buildo/java8-wkhtmltopdf           Java 8 + wkhtmltopdf                            1                    [OK]
cfje/java-buildpack                Java Buildpack CI Image                         1
cfje/java-resource                 Java Concourse Resource                         1
thingswise/java-docker             Java + dcd                                      0                    [OK]
adorsys/java                       Java Runtime Image                              0                    [OK]
```

:::