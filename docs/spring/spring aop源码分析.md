---
typora-root-url: images
---

## spring AOP源码分析

aspectj  有五种

spring aop 有四种

https://www.processon.com/view/link/6295bdabe401fd2eed189a2f

![Spring AOP源码分析](/Spring AOP源码分析.png)



## 自定义一个Advisor进行判断

看看是如何使用pointcut进行判断的。

代理执行过程





## spring AOP定义

```java
@Aspect
@Component
public class MyAop {

//	@Before("execution(public void org.hzz.aop.UserService.test())")
	@Before("execution(public void UserService.test())")
	public void before(JoinPoint joinPoint){
		System.out.println("----------------before---------------------------");
	}

	@Pointcut("execution(public void UserService.test())")
	public void a(){}

	@After("a()")  // finally
	public void after(JoinPoint joinPoint){
		System.out.println("----------------after---------------------------");
	}
}
```



### 功能点

```java
@Before("execution(public void UserService.test(..)) && args(a,b)",argNames = "a,b")
public void before(String a,String b){
    System.out.println("----------------before---------------------------");
}

@Before("execution(public void UserService.test(..)) && args(a,b)",argNames = "a,b")
public void before(JoinPoint joinPoint,String a,String b){
    System.out.println("----------------before---------------------------");
}
```



## Java代码学习

```java
Class<?> beanClass
Advice.class.isAssignableFrom(beanClass)
```





```java
// Map<Boolean,ArrayList<Instance>>  nacos中服务实例健康
// Map<Object, Boolean>
// 缓存判断处理结果
Map<Object, Boolean> advisedBeans = new ConcurrentHashMap<>(256);

if(Boolean.FALSE.equals(adviseBeans.get(key))){
    // 不在处理
    return ;
}

```

```java
Advice.class Pointcut.class
Advisor.class AopInfrastructureBean.class
```



注解学习

```
AnnotationUtils.findAnnotation(clazz, Aspect.class)
AnnotationUtils.getAnnotation(method, Pointcut.class)
```

反射学习

```java
// 拿到一个类的想要的方法
private static final MethodFilter adviceMethodFilter = ReflectionUtils.USER_DECLARED_METHODS
			.and(method -> (AnnotationUtils.getAnnotation(method, Pointcut.class) == null));

public static final MethodFilter USER_DECLARED_METHODS =
			(method -> !method.isBridge() && !method.isSynthetic());

List<Method> methods = new ArrayList<>();
ReflectionUtils.doWithMethods(aspectClass, methods::add, adviceMethodFilter);
```

反射封装method,成对象Advisor



## FunctionalInterface的链式调用

```java
@FunctionalInterface  // FunctionalInterface的定义还有default方法
	public interface MethodFilter {

		/**
		 * Determine whether the given method matches.
		 * @param method the method to check
		 */
		boolean matches(Method method);

		/**
		 * Create a composite filter based on this filter <em>and</em> the provided filter.
		 * <p>If this filter does not match, the next filter will not be applied.
		 * @param next the next {@code MethodFilter}
		 * @return a composite {@code MethodFilter}
		 * @throws IllegalArgumentException if the MethodFilter argument is {@code null}
		 * @since 5.3.2
		 */
		default MethodFilter and(MethodFilter next) {
			Assert.notNull(next, "Next MethodFilter must not be null");
			return method -> matches(method) && next.matches(method);
		}
	}
```



```java
/**
	 * Action to take on each method.
	 */
	@FunctionalInterface
	public interface MethodCallback {

		/**
		 * Perform an operation using the given method.
		 * @param method the method to operate on
		 */
		void doWith(Method method) throws IllegalArgumentException, IllegalAccessException;
	}
```





仿照AOP排序before after



```java
Comparator thenComparing 方法
default Comparator<T> thenComparing(Comparator<? super T> other) {
        Objects.requireNonNull(other);
        return (Comparator<T> & Serializable) (c1, c2) -> {
            int res = compare(c1, c2);
            return (res != 0) ? res : other.compare(c1, c2);
        };
    }
```

它排序是按照数组的注解在数组中的下标顺序进行排序

```java
Comparator<Method> adviceKindComparator = new ConvertingComparator<>(
				new InstanceComparator<>(
						Around.class, Before.class, After.class, AfterReturning.class, AfterThrowing.class),
				(Converter<Method, Annotation>) method -> {
					AspectJAnnotation<?> ann = AbstractAspectJAdvisorFactory.findAspectJAnnotationOnMethod(method);
					return (ann != null ? ann.getAnnotation() : null);
				});
		Comparator<Method> methodNameComparator = new ConvertingComparator<>(Method::getName);
		adviceMethodComparator = adviceKindComparator.thenComparing(methodNameComparator);
```



```
isInstance
```





## ProxyFactory源码分析

> 测试类： D:\Github\Learn-spring-framework\spring-framework\hzz-demo\src\test\java\org\hzz\aop\AopTest.java

![image-20220515185359398](/image-20220515185359398.png)



## 大概流程

1. 找到容器中的Advisor,解析@Aspect类，生成Advisor
2. 根据被代理类和Advisor构建ProxyFactory,生成代理对象



## Java 方法接收接口类型的好处

定义一个接口

一个类实现它用作正常的处理

灵活的处理匿名类实现它





## ThreadLocal

```
public class NamedThreadLocal<T> extends ThreadLocal<T> {

	private final String name;


	/**
	 * Create a new NamedThreadLocal with the given name.
	 * @param name a descriptive name for this ThreadLocal
	 */
	public NamedThreadLocal(String name) {
		Assert.hasText(name, "Name must not be empty");
		this.name = name;
	}

	@Override
	public String toString() {
		return this.name;
	}

}
```



## Java代码

```
if (advisor instanceof PointcutAdvisor pointcutAdvisor) 
Class<?> throwableParam = method.getParameterTypes()[method.getParameterCount() - 1];
Throwable.class.isAssignableFrom(throwableParam)
isInstance
```



## Java代码适配模式

```java
DefaultAdvisorAdapterRegistry
    
    private final List<AdvisorAdapter> adapters = new ArrayList<>(3);


	/**
	 * Create a new DefaultAdvisorAdapterRegistry, registering well-known adapters.
	 */
	public DefaultAdvisorAdapterRegistry() {
		registerAdvisorAdapter(new MethodBeforeAdviceAdapter());
		registerAdvisorAdapter(new AfterReturningAdviceAdapter());
		registerAdvisorAdapter(new ThrowsAdviceAdapter());
	}

supportsAdvice
```





```java
// ThreadLocal<MethodInvocation> threadlocal;
public Object method2(MethodInvocation mi) throws Throwable {
    MethodInvocation oldInvocation = threadlocal.get(); // 拿出来
    invocation.set(mi);  // 设置新的值
    try {
        return mi.proceed();
    }
    finally {
        threadlocal.set(oldInvocation); // 恢复
    }
}
```

