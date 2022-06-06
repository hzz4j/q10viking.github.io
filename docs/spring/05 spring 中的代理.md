---
typora-root-url: ..\.vuepress\public
---

## ProxyFactory

ThrowsAdvice如何选择方法的？

afterThrowing



## Advice

![image-20220515185359398](/images/spring/image-20220515185359398.png)



advice会形成一条链路，会封装成MethodInterceptor

代理，适配器，责任链

-----------



## ProxyFactoryBean

使用的FactoryBean

这种方式只能针对某一个 Bean。它是一个FactoryBean，所以利用的就是FactoryBean技术，间接的将UserService的代理对 象作为了Bean

```java

	@Bean("beforeAdvice")
	public Advice beforeAdvice(){
		BeforeAdvice beforeAdvice = new BeforeAdvice();
		return beforeAdvice;
	}
	@Bean
	public ProxyFactoryBean userService(){
		ProxyFactoryBean proxyFactoryBean = new ProxyFactoryBean();
		proxyFactoryBean.setTarget(new UserServiceImpl());
		proxyFactoryBean.setInterceptorNames("beforeAdvice");
		return proxyFactoryBean;
	}
```



## BeanNameAutoProxyCreator

原理：他是一个BeanPostProcessor

通过BeanNameAutoProxyCreator可以对批量的Bean进行AOP，并且指定了代理逻辑，指定了一个 InterceptorName，也就是一个Advise，前提条件是这个Advise也得是一个Bean，这样Spring才能 找到的，但是BeanNameAutoProxyCreator的缺点很明显，它只能根据beanName来指定想要代理 的Bean。

```java
	@Bean
	public BeanNameAutoProxyCreator beanNameAutoProxyCreator(){
		BeanNameAutoProxyCreator beanNameAutoProxyCreator = new BeanNameAutoProxyCreator();
		beanNameAutoProxyCreator.setBeanNames("userSe*");
		beanNameAutoProxyCreator.setInterceptorNames("beforeAdvice");
		beanNameAutoProxyCreator.setProxyTargetClass(true);
		return beanNameAutoProxyCreator;
	}
```



## DefaultAdvisorAutoProxyCreator

仍然是一个BeanPostProcessor，在bean初始化后,spring把所有的Advisor拿出来，使用里面的pointcut来进行比较。

简化导入bean

```java
@Import(DefaultAdvisorAutoProxyCreator.class) // 简化bean的导入
public class AppConfig {

	@Bean("beforeAdvice")
	public Advice beforeAdvice(){
		BeforeAdvice beforeAdvice = new BeforeAdvice();
		return beforeAdvice;
	}

	@Bean
	@DependsOn("beforeAdvice")
	public DefaultPointcutAdvisor defaultPointcutAdvisor(BeforeAdvice beforeAdvice){
		NameMatchMethodPointcut nameMatchMethodPointcut = new NameMatchMethodPointcut();
		nameMatchMethodPointcut.addMethodName("test");
		DefaultPointcutAdvisor advisor = new DefaultPointcutAdvisor();
//		advisor.setAdvice(new BeforeAdvice());
		advisor.setAdvice(beforeAdvice);
		advisor.setPointcut(nameMatchMethodPointcut);
		return advisor;
	}
}
```

通过DefaultAdvisorAutoProxyCreator会直接去找所有Advisor类型的Bean，根据Advisor中的 PointCut和Advice信息，确定要代理的Bean以及代理逻辑。 但是，我们发现，通过这种方式，我们得依靠某一个类来实现定义我们的Advisor，或者Advise，或 者Pointcut，那么这个步骤能不能更加简化一点呢？ 对的，通过注解

比如我们能不能只定义一个类，然后通过在类中的方法上通过某些注解，来定义PointCut以及 Advice，可以的，比如：

```java
@Aspect
@Component
public class ZhouyuAspect {
    @Before("execution(public void org.hzz.service.UserService.test())")
    public void before(JoinPoint joinPoint) {
    	System.out.println("before");
	}
}

```

通过上面这个类，我们就直接定义好了所要代理的方法(通过一个表达式)，以及代理逻辑（被 @Before修饰的方法），简单明了，这样对于Spring来说，它要做的就是来解析这些注解了，解析之 后得到对应的Pointcut对象、Advice对象，生成Advisor对象，扔进ProxyFactory中，进而产生对应 的代理对象，具体怎么解析这些注解就是**@EnableAspectJAutoProxy注解**所要做的事情了