---
typora-root-url: images
---

## ProxyFactory

ThrowsAdvice如何选择方法的？

afterThrowing



## Advice

![image-20220515185359398](/image-20220515185359398.png)



advice会形成一条链路，会封装成MethodInterceptor

代理，适配器，责任链

-----------



## ProxyFactoryBean



## BeanNameAutoProxyCreator

原理：他是一个BeanPostProcessor

## DefaultAdvisorAutoProxyCreator

仍然是一个BeanPostProcessor，在bean初始化后,spring把所有的Advisor拿出来，使用里面的pointcut来进行比较。

简化导入bean