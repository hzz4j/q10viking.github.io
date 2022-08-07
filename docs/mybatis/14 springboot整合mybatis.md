---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /mybatis/
typora-root-url: ..\.vuepress\public
---

## SpringBoot整合Mybatis

::: tip

[Source Code](https://github.com/Q10Viking/learncode/tree/main/mybatis/_10_springboot_druid_mybatis)

:::

### 引入场景启动器

```xml
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.1.1</version>
        </dependency>
```



### application.yml配置

```yml
mybatis:
  mapper-locations: classpath:org/hzz/mapper/*.xml
  configuration:
    map-underscore-to-camel-case: true
```



### MappScan

```java
@SpringBootApplication
@MapperScan("org.hzz.mapper") // 扫描mapper
public class Application implements CommandLineRunner {
    @Autowired
    private EmpMapper empMapper;

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        Emp emp = empMapper.selectByPrimaryKey(1);
        System.out.println(emp);
    }
}
```



## 补充mybatis-generate插件

1. 这个插件的形式，目前发现有bug，会将数据库中字段user_name，生成为username，导致查询时，sql报错，数据库中没有username字段
2. 生成的mapper有重复sql定义

```xml
 <!-- Mybatis-Generator插件，自动生成代码 -->
            <plugin>
                <groupId>org.mybatis.generator</groupId>
                <artifactId>mybatis-generator-maven-plugin</artifactId>
                <version>1.3.5</version>
                <configuration>
                    <configurationFile>${project.basedir}/src/main/resources/generatorConfig.xml</configurationFile>
                    <verbose>true</verbose>
                    <overwrite>true</overwrite>
                </configuration>
                <dependencies>
                    <!--必須要引入数据库驱动-->
                    <dependency>
                        <groupId>mysql</groupId>
                        <artifactId>mysql-connector-java</artifactId>
                        <!--必须制定版本-->
                        <version>8.0.22</version>
                    </dependency>
                </dependencies>
            </plugin>
```



### 逆向工程配置文件

```xml
<!DOCTYPE generatorConfiguration PUBLIC
        "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>


    <!--如果需要使用 command的方式生成需要配置数据库驱动的jar包路径
    <classPathEntry location="指定数据驱动的磁盘路径"/>-->

    <!--context 生成上下文 配置生成规则
            id 随意写
           targetRuntime 生成策略
                MyBatis3DynamicSql 默认的，会生成 动态生成sql的方式（没有xml)
                MyBatis3 生成通用的查询，可以指定动态where条件
                MyBatis3Simple 只生成简单的CRUD
    -->
    <context id="simple" targetRuntime="MyBatis3Simple">

        
        <commentGenerator>
            <!--设置是否生成注释  true 不生成  注意： 如果不生成注释，下次生成代码就不会进行合并-->
            <property name="suppressAllComments" value="true"/>
        </commentGenerator>
        <!--数据源 -->
        <jdbcConnection driverClass="com.mysql.cj.jdbc.Driver"
                        connectionURL="jdbc:mysql://localhost:3306/springboot_mybatis?serverTimezone=UTC"
                        userId="root"
                        password="root"/>

        <!--pojo
        javaModelGenerator  java实体生成规则(POJO)
            targetPackage 生成到哪个包下
            targetProject 生成到当前文件的哪个相对路径下
        -->
        <javaModelGenerator targetPackage="org.hzz.pojo" targetProject="src/main/java"/>
        <!--mapper xml映射文件
            sqlMapGenerator mapper xml映射文件生成规则
            targetPackage 生成到哪个包下
            targetProject 生成到当前文件的哪个相对路径下
        -->
        <sqlMapGenerator targetPackage="org.hzz.mapper" targetProject="src/main/resources"></sqlMapGenerator>
        <!--mapper接口
            javaClientGenerator mapper mapper接口生成规则
            type 指定生成的方式
                1.使用注解的方式生成
                2.使用接口绑定的方式生成（要配置sqlMapGenerator）
            targetPackage 生成到哪个包下
            targetProject 生成到当前文件的哪个相对路径下-->
        <javaClientGenerator type="XMLMAPPER" targetPackage="org.hzz.mapper" targetProject="src/main/java"/>


        <!--配置哪些表需要进行代码生成
        tableName 表名
        domainObjectName pojo类名
        mapperName 对应mapper接口的类名 和 mapper xml文件名
        -->
        <table tableName="emp" domainObjectName="Emp" mapperName="EmpMapper" />
        <table tableName="dept" domainObjectName="Dept" mapperName="DeptMapper" />
    </context>
</generatorConfiguration>
```



## 自动配置原理

https://www.processon.com/view/link/6123f3e50e3e743b327d3d86

![Springboot整合Mybatis原理](/images/mybatis/Springboot整合Mybatis原理.png)



## 查看druid管理台

```
http://localhost:8080/druid/sql-detail.html?sqlId=1
```

能看到mybatis确实使用了Druid数据源

![image-20220808014543646](/images/mybatis/image-20220808014543646.png)
