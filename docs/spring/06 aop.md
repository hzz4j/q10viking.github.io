## Spring AOP与AspectJ

想用AspectJ的@Before等注解时。Spring得必须支持AspectJ的解析支持。

AnnotationAwareAspectJAutoProxyCreator

Spring会把五个注解解析为对应的Advice类： 

1. @Before：AspectJMethodBeforeAdvice，实际上就是一个MethodBeforeAdvice 
2. @AfterReturning：AspectJAfterReturningAdvice，实际上就是一个AfterReturningAdvice 
3. @AfterThrowing：AspectJAfterThrowingAdvice，实际上就是一个MethodInterceptor 
4. @After：AspectJAfterAdvice，实际上就是一个MethodInterceptor 
5. @Around：AspectJAroundAdvice，实际上就是一个MethodInterceptor



## @Lazy的动态代理

TargetSource



----------

cglib和jdk动态代理的选择

@EnableAspecj targetClass = true

exposeProxy   AopContext 

创建代理，执行代理（链路的创建）

advice通过适配封装为Interceptor

ThrowsAdviceInterceptor

执行



spring aop

解析，执行

-----------

设计模式：

模板方法，责任链，代理，适配器

```java
@Before(value="execution(public void com.zhouyu.service.UserService.test()) && args(a,b)",argNames="a,b")
public void before(String a,String b){
    //....
}
```

```
@Aspect//作用是把当前类标识为一个切面供容器读取
@Component
public class InterfaceLogAspect {
	//全路径是怕有重名的注解
    @Around("@annotation(路径.InterfaceLog)")
    public Object log(ProceedingJoinPoint pjp) throws Exception {
}

```

