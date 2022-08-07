---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /mybatis/
typora-root-url: ..\.vuepress\public
---



## 连接池

在实际开发过程中，使用的连接池不使用mybatis自带的连接池，SSM集成时会使用第三方成熟的连接池

   ```xml
<!--数据源
                type 指定连接池
                POOLED  指定使用mybatis的连接池
                UNPOOLED 不使用连接池
                JNDI JNDI连接池 可以在tomcat中使用
            -->
<dataSource type="POOLED">
    <property name="driver" value="${mysql.driver}"/>
    <property name="url" value="${mysql.url}"/>
    <property name="username" value="${mysql.username}"/>
    <property name="password" value="${mysql.password}"/>
</dataSource>
   ```

## 环境

environments管理连接数据库的环境，切换数据库default属性指定id

   ```xml
<environments default="development">
        <!--environment  配置数据库环境  id 指定当前数据库环境的唯一表示，   会被父节点default所设置-->
        <environment id="development">
            <!--事务管理器 类型
              type = JDBC  使用jdbc的事务管理
                     MANAGED  不运用事务
            -->
            <transactionManager type="JDBC"/>
            <!--数据源
                type 指定连接池
                POOLED  指定使用mybatis的连接池
                UNPOOLED 不使用连接池
                JNDI JNDI连接池 可以在tomcat中使用
            -->
            <dataSource type="POOLED">
                <property name="driver" value="${mysql.driver}"/>
                <property name="url" value="${mysql.url}"/>
                <property name="username" value="${mysql.username}"/>
                <property name="password" value="${mysql.password}"/>
            </dataSource>
        </environment>


        <environment id="test">
            <!--事务管理器 类型
              type = JDBC  使用jdbc的事务管理
                     MANAGED  不运用事务
            -->
            <transactionManager type="JDBC"/>
            <!--数据源
                type 指定连接池
                POOLED  指定使用mybatis的连接池
                UNPOOLED 不使用连接池
                JNDI JNDI连接池 可以在tomcat中使用
            -->
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis_test"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>
   ```

### 映射器mappers⭐

```xml
 <!--设置映射器-->
    <mappers>
        <!--4种映射方式
                1.<mapper resource   设置MapperXml 这种方式适用根据statementId进行操作
                2.<mapper class      设置Mapper接口 这种方式适用接口绑定的方式和注解
                3.<mapper url        使用磁盘的绝对路径（基本不用）
                4.<package           根据包设置包下面所有的Mapper接口, 这种方式适用接口绑定的方式和注解
        -->
        <!--<mapper resource="EmpMapper.xml"/>-->
        <!--<mapper class="cn.tulingxueyuan.mapper.EmpMapper"></mapper>-->
        <package name="cn.tulingxueyuan.mapper"/>
    </mappers>
```

## properties

1. 用来**引用外部的资源文件**的
2. 也可以在内部重新定义

```xml
    <!--配置外部属性资源文件  通过${}进行引用-->
    <properties resource="db.properties">
        <!--可以在定义内部的属性  引用方式是一样的-->
        <property name="mysql.username" value="root"/>
    </properties>
   <!-- 引用 -->
    <dataSource type="POOLED">
        <property name="driver" value="${mysql.driver}"/>
        <property name="url" value="${mysql.url}"/>
        <property name="username" value="${mysql.username}"/>
        <property name="password" value="${mysql.password}"/>
    </dataSource>
```



## settings

[settings配置解释](https://mybatis.org/mybatis-3/zh/configuration.html#settings)

如数据库字段为`user_name`,java的pojo属性为`userName`或（username也能映射）(将蛇形命名转化为驼峰命名)

```xml
<settings>
	<setting name="mapUnderscoreToCamelCase" value="true" />
</settings>
```

![image-20210803235710738](/images/mybatis/image-20210803235710738.png)

```xml
<!-- 开启延迟加载，所有分步查询都是懒加载 （默认是立即加载）-->
<setting name="lazyLoadingEnabled" value="true"/>
<!--当开启式， 使用pojo中任意属性都会加载延迟查询 ,默认是false
        <setting name="aggressiveLazyLoading" value="false"/>-->
<!--设置对象的哪些方法调用会加载延迟查询   默认：equals,clone,hashCode,toString-->
<setting name="lazyLoadTriggerMethods" value=""/>

<!-- 开启二级缓存 默认是开启的true -->
<setting name="cacheEnabled" value="true" />
```



## 类型别名typeAliases

```xml
    <!--类型别名可为 Java 类型设置一个缩写名字。 它仅用于 XML 配置，意在降低冗余的全限定类名书写-->
    <typeAliases>
        <!--根据包设置包里面所有的类的别名 :会将类的名字作为别名（忽略大小写）
            还可以为包里面的类单独设置个性别名：@Alias   （默认的以类的名字作为别名就会失效）
            除了可以设置自定义的类的别名以为，mybatis还内置很多常见类型的别名
        -->
        <package name="cn.tulingxueyuan.pojo"/>
    </typeAliases>
```

```java
@Alias("EmpAlias")
public class Emp{
    // ...
}
```

官网显示的常见类型别名

![image-20210804001142502](/images/mybatis/image-20210804001142502.png)



## 插件

可以理解为mybatis的拦截器，拦截四大对象，拦截SQL，可以给SQL去加一些公共的功能



## 数据库厂商标识

数据库的跨平台

```xml
<!--

    数据库厂商表示：mybatis提供用于跨数据库平台，用于根据不同的数据库调用不同SQL
    type="DB_VENDOR" 利用数据库的厂商名称来区分
    步骤：
        1.为需要跨越数据库设置不同的厂商名称
        2.编写不同的SQL   databaseId必须等于厂商的value
    -->
    <databaseIdProvider type="DB_VENDOR">
        <property name="MySQL" value="mysql"/>
        <property name="Oracle" value="ora"/>
    </databaseIdProvider>
```

```xml
<select id="SelectEmp"  resultType="emp" databaseId="mysql">
    SELECT id,user_name FROM EMP WHERE id=#{id}
</select>
```



----------



## 整个文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<!--就是DOCTYPE后面对应的根节点-->
<configuration>

    <!--配置外部属性资源文件  通过${}进行引用-->
    <properties resource="db.properties">
        <!--可以在定义内部的属性  引用方式是一样的-->
        <property name="mysql.username" value="root"/>
    </properties>

    <!--mybatis的设置选项  可以改变mybatis运行时行为-->
    <settings>
        <!--是否允许在SQL中使用别名  默认是允许： 当设置别名后会根据SQL的别名和属性名进行映射   （不会去设置该选项）
        <setting name="useColumnLabel" value="true"/>-->
        <!--用于当字段名和属性名自动映射不匹配时 发生的动作
            默认：NONE  什么都不发生，没有映射上就不赋值
                  WARNING 发送一条级别为WARN的日志
                  FAILING 当映射不上直接报错
                  通常不会去设置

        <setting name="autoMappingUnknownColumnBehavior" value="FAILING"/>
        -->
        <!--设置默认执行器
        SIMPLE 就是普通的执行器； 默认
        REUSE 执行器会重用预处理语句（PreparedStatement）；
         BATCH 执行器不仅重用语句还会执行批量更新。
        <setting name="defaultExecutorType" value="REUSE"/>
        -->
        <!--设置查询的超时时间  单位：秒
        <setting name="defaultStatementTimeout" value="1"/>-->

        <!--是否将数据库的蛇形命名映射为驼峰命名
        可以支持 蛇形 xu_shu   到  驼峰xuShu   xushu    的自动映射
        -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>

        <!--当往数据库插入数据某个数据值为null时映射到数据库的类型   ：
        默认：OTHER   mysql是可以识别出OTHER类型的
              NULL   如果是oracle一定要设置成NULL,ORACLE识别不出OTHER类型
              VARCHAR  当属性值为空时为数据库设置一个空字符串
        <setting name="jdbcTypeForNull" value="OTHER"/>-->

        <!--加入mybatis框架中实现了多个日志框架， 可以使用logImpl来设置使用的日志框架
        如果使用了slf4j可以不用设置该配置，因为slf4j本身就是负责选择使用哪种日志实现框架的
        如果没有使用日志门面， 使用了多个日志实现框架， 最好设置你需要使用的日志框架
        <setting name="logImpl" value="SLF4J"/>
        -->
    </settings>

    <!--类型别名可为 Java 类型设置一个缩写名字。 它仅用于 XML 配置，意在降低冗余的全限定类名书写-->
    <typeAliases>
        <!--根据包设置包里面所有的类的别名 :会将类的名字作为别名（忽略大小写）
            还可以为包里面的类单独设置个性别名：@Alias   （默认的以类的名字作为别名就会失效）
            除了可以设置自定义的类的别名以为，mybatis还内置很多常见类型的别名
        -->
        <package name="cn.tulingxueyuan.pojo"/>
    </typeAliases>


   <!--
    插件：可以把它理解成mybatis的拦截器，可以拦截4大对象，可以拦截SQL 给SQL去加一些公共的功能
    <plugins>
        <plugin interceptor="org.mybatis.example.ExamplePlugin">
            <property name="someProperty" value="100"/>
        </plugin>
    </plugins>-->

    <!-- environments 可以多个环境：
        default 默认的数据库环境
     -->
    <environments default="development">
        <!--environment  配置数据库环境  id 指定当前数据库环境的唯一表示，   会被父节点default所设置-->
        <environment id="development">
            <!--事务管理器 类型
              type = JDBC  使用jdbc的事务管理
                     MANAGED  不运用事务
            -->
            <transactionManager type="JDBC"/>
            <!--数据源
                type 指定连接池
                POOLED  指定使用mybatis的连接池
                UNPOOLED 不使用连接池
                JNDI JNDI连接池 可以在tomcat中使用
            -->
            <dataSource type="POOLED">
                <property name="driver" value="${mysql.driver}"/>
                <property name="url" value="${mysql.url}"/>
                <property name="username" value="${mysql.username}"/>
                <property name="password" value="${mysql.password}"/>
            </dataSource>
        </environment>


        <environment id="test">
            <!--事务管理器 类型
              type = JDBC  使用jdbc的事务管理
                     MANAGED  不运用事务
            -->
            <transactionManager type="JDBC"/>
            <!--数据源
                type 指定连接池
                POOLED  指定使用mybatis的连接池
                UNPOOLED 不使用连接池
                JNDI JNDI连接池 可以在tomcat中使用
            -->
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis_test"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>


    <!--

    数据库厂商表示：mybatis提供用于跨数据库平台，用于根据不同的数据库调用不同SQL
    type="DB_VENDOR" 利用数据库的厂商名称来区分
    步骤：
        1.为需要跨越数据库设置不同的厂商名称
        2.编写不同的SQL   databaseId必须登录厂商的value
    -->
    <databaseIdProvider type="DB_VENDOR">
        <property name="MySQL" value="mysql"/>
        <property name="Oracle" value="ora"/>
    </databaseIdProvider>


    <!--设置映射器-->
    <mappers>
        <!--4种映射方式
                1.<mapper resource   设置MapperXml 这种方式适用根据statementId进行操作
                2.<mapper class      设置Mapper接口 这种方式适用接口绑定的方式和注解
                3.<mapper url        使用磁盘的绝对路径（基本不用）
                4.<package           根据包设置包下面所有的Mapper接口, 这种方式适用接口绑定的方式和注解
        -->
        <!--<mapper resource="EmpMapper.xml"/>-->
        <!--<mapper class="cn.tulingxueyuan.mapper.EmpMapper"></mapper>-->
        <package name="cn.tulingxueyuan.mapper"/>
    </mappers>
</configuration>
```

