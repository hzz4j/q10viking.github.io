---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /mybatis/
typora-root-url: ..\.vuepress\public
---



::: tip

[Mybatis Source Code Analysis](https://github.com/Q10Viking/learncode/tree/main/mybatis/mybatis-3-5.3.x-master)

:::

> 基于springboot来分析mybatis的工作流程

## MyBatis整体架构图

![img](/images/mybatis/1520)

![img](/images/mybatis/1522)

总结下就是分为下面四个步骤：

- 从配置文件（通常是XML文件）得到SessionFactory;
- 从SessionFactory得到SqlSession；
- 通过SqlSession进行CRUD和事务的操作；
- 执行完相关操作之后关闭Session。



## Mybatis的启动

对于MyBatis启动的流程（获取SqlSession的过程）这边简单总结下：

- SqlSessionFactoryBuilder解析配置文件，包括属性配置、别名配置、拦截器配置、环境（数据源和事务管理器）、Mapper配置等；解析完这些配置后会生成一个Configration对象，这个对象中包含了MyBatis需要的所有配置，然后会用这个Configration对象创建一个SqlSessionFactory对象，这个对象中包含了Configration对象；

```java
public SqlSessionFactory build(Configuration config) {
    return new DefaultSqlSessionFactory(config);
}
```



## Mybatis配置文件解析

最重要的类Configuration.

[Link](https://www.processon.com/view/link/642d1c4ff83a045cbc146e41)

<common-progresson-snippet src="https://www.processon.com/view/link/642d1c4ff83a045cbc146e41"/>

springboot中注解方式的接口mapper解析是在创建MapperFactoryBean的实例的时候通过afterPropertiesSet

MapperFactoryBean实现了Springboot-tx的DaoSuport这个抽象类实现了InitializingBean接口。在Bean的生命周期中会调用afterPropertiesSet这个方法。MapperFactoryBean实现了checkDaoConfig，就在这个方法里处理注解mapper的解析。

最后解析成MappedStatement

![image-20230405145003012](/images/mybatis/image-20230405145003012.png)

```java
@Mapper
public interface TestMapper {
    @Select("select * from test")
    List<Test> selectAll();
}
```

![image-20230405145705035](/images/mybatis/image-20230405145705035.png)



## 执行Sql流程

[Link](https://www.processon.com/view/link/642d3962847e3938662d69f6)

<common-progresson-snippet src="https://www.processon.com/view/link/642d3962847e3938662d69f6"/>

```java
testMapper.selectAll()
```

```java
sqlSession.selectList("org.hzz.mapper.TestMapper.selectAll",null);
```



[link](https://www.processon.com/view/link/5efc23966376891e81f2a37e)

<common-progresson-snippet src="https://www.processon.com/view/link/5efc23966376891e81f2a37e"/>











