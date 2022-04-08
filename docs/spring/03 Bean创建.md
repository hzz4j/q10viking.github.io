1. 非懒加载的单例Bean是在Spring启动的时候创建的
2. 懒加载的单例bean是在getBean的时候创建的
3. @Scope("prototype")原型Bean是在每次getBean时都会创建



----------

扫描bean，创建，注入，初始化，BeanPostProcessor(这是针对所有bean的)，在这里可以实现AOP,@Value的实现，扩展点，就是可以对bean做很多的工作，如可以自定义注解，来实现更多的功能。Aware接口