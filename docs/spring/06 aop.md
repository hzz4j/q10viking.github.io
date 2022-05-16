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