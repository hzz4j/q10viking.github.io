## Bean的生命周期

UserService.class--->无参构造方法--->对象--->依赖注入(属性赋值)--->初始化前（@PostConstruct）--->初始化(InitializingBean)--->初始化后(AOP)--->Bean



### 对象的创建

1. 无参构造方法
2. 入参方法的参数bean