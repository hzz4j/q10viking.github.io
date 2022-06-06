---
typora-root-url: ..\.vuepress\public
---

1. 将@Before等注解的方法解析成advice 
2. 对注解@Before,@AfterReturing等注解进行排序（方便后面责任链的调用） 
3.  将advice适配成MethodInterceptor拦截器 （使用适配器模式） 
4. 通过责任链的模式依次调用。（使用责任链模式）

D:\learncode\javabasic\src\org\hzz\aop

![image-20220601173346721](/images/java/image-20220601173346721.png)