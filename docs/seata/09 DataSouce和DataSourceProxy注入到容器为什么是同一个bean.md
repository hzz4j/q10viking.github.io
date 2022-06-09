---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /seata/
typora-root-url: ..\.vuepress\public
---



## DataSouce和DataSourceProxy注入到容器为什么是同一个bean

[在线预览](https://www.processon.com/view/link/62a1fbaa0e3e746b9e24d791)

```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(MyApplication.class);
        AnnotationConfigApplicationContext context = (AnnotationConfigApplicationContext)springApplication.run(args);
        Object bean1 = context.getBean("druidDataSource");
        Object bean2 = context.getBean("dataSourceProxy1");
        System.out.println(bean1 == bean2); //  为什么会相等true
    }

    @Bean(name = "druidDataSource")
    @ConfigurationProperties("spring.datasource.druid")
    public DataSource druidDataSource() {
        System.out.println("create druidDataSource");
        DruidDataSource druidDataSource = new DruidDataSource();
        return druidDataSource;
    }

    /**
     * 构造datasource代理对象，替换原来的datasource
     * @param druidDataSource
     * @return
     */
    @Primary
    @Bean("dataSourceProxy1")
    public DataSourceProxy dataSourceProxy(DataSource druidDataSource) {
        System.out.println("create dataSourceProxy");
        DataSourceProxy dataSourceProxy = new DataSourceProxy(druidDataSource);
        return dataSourceProxy;
    }

}
```

![DataSouce和DataSourceProxy注入到容器为什么是同一个bean](/images/seata/DataSouce和DataSourceProxy注入到容器为什么是同一个bean.png)



## Seata为什么这么处理

因为此时经过**SeataDataSourceBeanPostProcessor**这个bean后置处理器的时候已经经过了另外一个bean后置处理器（**SeataAutoDataSourceProxyCreator**）（已经将dataSouce创建了动态代理）

当真正执行的时候在这个代理类中会获得DataSouceProxy来处理代理逻辑，在代理类中的MethodInterceptor生成ConnectionProxy。而不是我们自己定义的bean(DataSourceProxy)

[SpringBoot-Seata集成基础设施(DataSourceProxy)](https://www.processon.com/view/link/62a1fcfe0791293ad1a59975)