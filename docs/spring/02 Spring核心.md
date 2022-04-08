## Bean的生命周期

UserService.class--->无参构造方法（推断构造方法）--->普通对象--->依赖注入(属性赋值)--->初始化前（@PostConstruct）--->初始化(InitializingBean)--->初始化后(AOP)--->代理对象--->Bean



## 对象的创建

1. 无参构造方法
2. 入参方法的参数bean
   1. 先根据类型，再根据名称，找不到则报错
   2. 在构造方法中加上@Autowired,那么spring会选择这个构造方法



## 属性赋值

先根据类型，再根据名字



## AOP

cglib代理对象，继承关系，但是属性target中注入了普通对象的bean

```java
class UserServiceProxy extends UserService{
	private UserService target;
	// ...
}
```

如何判断一个bean是否需要进行aop?

1. 找出所有的切面bean
2. 遍历所有的切面bean的方法，有没有@Before,@After这些方法
3. 如果遍历的方法包含了当前的对象则进行代理
4. 将切面方法缓存起来

****



## 事务

事务的代理逻辑

1. 是否有@Transactional
2. 事务管理器创建一个数据库连接
3. 设置conn.autocommit = false 关闭自动提交
4. 业务执行成功conn.commit(),失败则conn.rollback();



### 事务传播

> Spring事务是否会失效的判断标准：某个加了@Transactional注解的方法被调用时，要判 断到底是不是直接被代理对象调用的，如果是则事务会生效，如果不是则失效

1. **事务失效**的情况：思考方法被调用时是不是代理对象在执行

解决方式：

1. 在另外一个类中写这个事务传播的方法
2. 或者自己注入自己，然后通过这个代理对象执行该方法



### @Configuration的作用

在配置@Bean时，多次调用同一个方法，返回的是同一个对象，如dataSource();

会生成一个代理对象，如AppConfig对象，在代理对象的方法中会从容器中来获取这个对象。