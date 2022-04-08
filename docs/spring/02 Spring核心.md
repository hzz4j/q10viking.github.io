## Bean的生命周期

UserService.class--->无参构造方法（推断构造方法）--->普通对象--->依赖注入(属性赋值)--->初始化前（@PostConstruct）--->初始化(InitializingBean)--->初始化后(AOP)--->代理对象--->Bean



### 对象的创建

1. 无参构造方法
2. 入参方法的参数bean
   1. 先根据类型，再根据名称，找不到则报错
   2. 在构造方法中加上@Autowired,那么spring会选择这个构造方法



### 属性赋值

先根据类型，再根据名字



### AOP

cglib代理对象，继承关系，但是属性target中注入了普通对象的bean

```java
UserServiceProxy extends UserService{
	private UserService target;
	// ...
}
```

