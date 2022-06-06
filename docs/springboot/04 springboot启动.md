### SpringBoot的jar包为什么可以直接运行

maven插件spring-boot-plugin

生成了MANIFEST.MF

包依赖的jar包也打包进去了

在java中没有提供任何标准的方式来加载嵌套jar文件中的jar,所以springboot打包成的jar包中无法被java加载，而MANIFEST.MF中的MAIN-Class:指定了JarLauncher类，spring-boot自定义的类加载器，来加载打包里面的jar包

java -jar是使用Main-Class来作为应用的启动类



## Springboot启动流程

1. 加载一些监听器
2. 发布启动事件
3. 发布一个事件，通过监听器来加载全局配置文件
4. 打印banner
5. 创建容器Serlvet容器





1. spring容器启动
2. 全局配置文件的加载