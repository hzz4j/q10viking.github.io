---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /spring/
typora-root-url: ..\.vuepress\public
---

## 容器ApplicationContext

```java
ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");
UserService userService = (UserService) context.getBean("userService");
userService.test();
```

1. 第一行代码，会构造一个ClassPathXmlApplicationContext对象，ClassPathXmlApplicationContext该如何理解，调用该构造方法除开会实例化得到一个对象，还会做哪些事情？
2. 第二行代码，会调用ClassPathXmlApplicationContext的getBean方法，会得到一个UserService对象，getBean()是如何实现的？返回的UserService对象和我们自己直接new的UserService对象有区别吗？
3. 第三行代码，就是简单的调用UserService的test()方法

但是用ClassPathXmlApplicationContext其实已经过时了，在新版的Spring MVC和Spring Boot的底层主要用的都是**AnnotationConfigApplicationContext**

```java
AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
//ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");
UserService userService = (UserService) context.getBean("userService");
userService.test();
```

1. 可以看到AnnotationConfigApplicationContext的用法和ClassPathXmlApplicationContext是非常类似的，只不过需要传入的是一个class，而不是一个xml文件。

2. 而AppConfig.class和spring.xml一样，表示Spring的配置，比如可以指定扫描路径，可以直接定义Bean，比如：

   1. spring.xml中的内容为：

      ```xml
      <context:component-scan base-package="com.zhouyu"/>
      <bean id="userService" class="com.zhouyu.service.UserService"/>
      ```

   2. AppConfig的内容
   
      ```java
      @ComponentScan("com.zhouyu")
      public class AppConfig {
      
          @Bean
          public UserService userService(){
              return new UserService();
          }
      
      }
      ```
   
   所以spring.xml和AppConfig.class本质上是一样的

目前，我们基本很少直接使用上面这种方式来用Spring，而是使用Spring MVC，或者Spring Boot，但是它们都是基于上面这种方式的，都需要在内部去创建一个ApplicationContext的，只不过：

1. Spring MVC创建的是**XmlWebApplicationContext**，和**ClassPathXmlApplicationContext**类似，都是基于XML配置的
2. Spring Boot创建的是**AnnotationConfigApplicationContext**



## Spring如何创建一个bean

不管是AnnotationConfigApplicationContext还是ClassPathXmlApplicationContext，目前，我们都可以简单的将它们理解为就是用来创建Java对象的，比如调用getBean()就会去创建对象（此处不严谨，getBean可能也不会去创建对象)

在Java语言中，肯定是根据某个类来创建一个对象的

```java
AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
UserService userService = (UserService) context.getBean("userService");
userService.test();
```

当我们调用context.getBean("userService")时，就会去创建一个对象，但是getBean方法内部怎么知道"userService"对应的是UserService类呢？

所以，我们就可以分析出来，在调用AnnotationConfigApplicationContext的构造方法时，也就是第一行代码，会去做一些事情：

1. 解析AppConfig.class，得到扫描路径
2. 遍历扫描路径下的所有Java类，如果发现某个类上存在@Component、@Service等注解，那么Spring就把这个类记录下来，存在一个Map中，比如Map<String, Class>。（**实际上，Spring源码中确实存在类似的这么一个Map，叫做BeanDefinitionMap**）
3. Spring会根据某个规则生成当前类对应的beanName，作为key存入Map，当前类作为value

这样，但调用context.getBean("userService")时，就可以根据"userService"找到UserService类，从而就可以去创建对象了。

----------------



## Bean的生命周期

::: tip

那么Spring到底是如何来创建一个Bean的呢，这个就是Bean创建的生命周期

:::

UserService.class--->无参构造方法（推断构造方法）--->普通对象--->依赖注入(属性赋值)--->Aware接口--->初始化前（@PostConstruct）--->初始化(InitializingBean)--->初始化后(AOP)--->代理对象--->Bean

1. 利用该类的构造方法来实例化得到一个对象（但是如何一个类中有多个构造方法，Spring则会进行选择，这个叫做**推断构造方法**）
2. 得到一个对象后，Spring会判断该对象中是否存在被@Autowired注解了的属性，把这些属性找出来并由Spring进行赋值（**依赖注入**）
3. 依赖注入后，Spring会判断该对象是否实现了BeanNameAware接口、BeanClassLoaderAware接口、BeanFactoryAware接口，如果实现了，就表示当前对象必须实现该接口中所定义的setBeanName()、setBeanClassLoader()、setBeanFactory()方法，那Spring就会调用这些方法并传入相应的参数（**Aware回调**）
4. Aware回调后，Spring会判断该对象中是否存在某个方法被@PostConstruct注解了，如果存在，Spring会调用当前对象的此方法（**初始化前**）
5. 紧接着，Spring会判断该对象是否实现了InitializingBean接口，如果实现了，就表示当前对象必须实现该接口中的afterPropertiesSet()方法，那Spring就会调用当前对象中的`afterPropertiesSet()`方法（**初始化**）
6. 最后，Spring会判断当前对象需不需要进行AOP，如果不需要那么Bean就创建完了，如果需要进行AOP，则会进行动态代理并生成一个代理对象做为Bean（**初始化后**）

通过最后一步，我们可以发现，当Spring根据UserService类来创建一个Bean时：

1. 如果不用进行AOP，那么Bean就是UserService类的构造方法所得到的对象。
2. 如果需要进行AOP，那么Bean就是UserService的代理类所实例化得到的对象，而不是UserService本身所得到的对象。

Bean对象创建出来后：

1. 如果当前Bean是单例Bean，那么会把该Bean对象存入一个Map<String, Object>，Map的key为beanName，value为Bean对象。这样下次getBean时就可以直接从Map中拿到对应的Bean对象了。（实际上，在Spring源码中，这个Map就是**单例池**）
2. 如果当前Bean是原型Bean，那么后续没有其他动作，不会存入一个Map，下次getBean时会再次执行上述创建过程，得到一个新的Bean对象。



## 推断构造方法❤️

> Spring在基于某个类生成Bean的过程中，需要利用该类的构造方法来实例化得到一个对象，但是**如果一个类存在多个构造方法，Spring会使用哪个呢**

Spring的判断逻辑如下：

1. 如果一个类只存在一个构造方法，不管该构造方法是无参构造方法，还是有参构造方法，Spring都会用这个构造方法
2. 如果一个类存在多个构造方法
   1. 这些构造方法中，存在一个无参的构造方法，那么Spring就会用这个无参的构造方法
   2. 这些构造方法中，不存在一个无参的构造方法，那么Spring就会**报错**

Spring的设计思想是这样的：

1. 如果一个类只有一个构造方法，那么没得选择，只能用这个构造方法
2. 如果一个类存在多个构造方法，Spring不知道如何选择，就会看是否有无参的构造方法，因为无参构造方法本身表示了一种默认的意义
3. 不过如果某个构造方法上加了@Autowired注解，那就表示程序员告诉Spring就用这个加了注解的方法，那Spring就会用这个加了@Autowired注解构造方法了

> 需要重视的是，如果Spring选择了一个有参的构造方法，Spring在调用这个有参构造方法时，需要传入参数，那这个参数是怎么来的呢？

Spring会根据入参的类型和入参的名字去Spring中找Bean对象（以单例Bean为例，Spring会从单例池那个Map中去找）：

1. 先根据入参类型找，如果只找到一个，那就直接用来作为入参
2. 如果根据类型找到多个，则再根据入参名字来确定唯一一个
3. 最终如果没有找到，则会报错，无法创建当前Bean对象

> 先类型后名字

确定用哪个构造方法，确定入参的Bean对象，这个过程就叫做**推断构造方法**。
****



## AOP

> AOP就是进行动态代理，在创建一个Bean的过程中，Spring在最后一步会去判断当前正在创建的这个Bean是不是需要进行AOP，如果需要则会进行动态代理。

cglib代理对象，继承关系，但是属性target中注入了普通对象的bean

```java
class UserServiceProxy extends UserService{
	private UserService target;
	// ...
}
```

如何判断一个bean是否需要进行aop?

1. 找出所有的切面Bean
2. 遍历切面中的每个方法，看是否写了@Before、@After等注解
3. 如果写了，则判断所对应的Pointcut是否和当前Bean对象的类是否匹配
4. 如果匹配则表示当前Bean对象有匹配的的Pointcut，表示需要进行AOP

利用cglib进行AOP的大致流程：

1. 生成代理类UserServiceProxy，代理类继承UserService

2. 代理类中重写了父类的方法，比如UserService中的test()方法

3. 代理类中还会有一个target属性，该属性的值为被代理对象（也就是通过UserService类推断构造方法实例化出来的对象，进行了依赖注入、初始化等步骤的对象）

4. 代理类中的test()方法被执行时的逻辑如下：

   1. 执行切面逻辑（@Before）
   2. 调用target.test()

   

当我们从Spring容器得到UserService的Bean对象时，拿到的就是UserServiceProxy所生成的对象，也就是代理对象。​UserService代理对象.test()--->执行切面逻辑--->target.test()，注意target对象不是代理对象，而是被代理对象。

****



## 事务

当我们在某个方法上加了@Transactional注解后，就表示该方法在调用时会开启Spring事务，而这个方法所在的类所对应的Bean对象会是该类的代理对象。
​

Spring事务的代理对象执行某个方法时的步骤：

1. 判断当前执行的方法是否存在@Transactional注解
2. 如果存在，则利用事务管理器（TransactionMananger）新建一个数据库连接
3. 修改数据库连接的autocommit为false
4. 执行target.test()，执行程序员所写的业务逻辑代码，也就是执行sql
5. 执行完了之后如果没有出现异常，则提交，否则回滚

### 事务失效

> Spring事务是否会失效的判断标准：**某个加了@Transactional注解的方法被调用时，要判断到底是不是直接被代理对象调用的，如果是则事务会生效，如果不是则失效**

解决方式：

1. 在另外一个类中写这个事务传播的方法
2. 或者自己注入自己，然后通过这个代理对象执行该方法



## @Configuration的作用

在配置@Bean时，多次调用同一个方法，返回的是同一个对象，如dataSource();

会生成一个代理对象，如AppConfig对象，在代理对象的方法中会从容器中来获取这个对象。



## Spring手写源码❤️

[Source Code](https://github.com/Q10Viking/learncode/tree/main/spring/_01-spring-moni)

1. 通过手写模拟，了解Spring的底层源码启动过程 
2. 通过手写模拟，了解BeanDefinition、BeanPostProcessor的概念 
3. 通过手写模拟，了解Spring解析配置类等底层源码工作流程 
4. 通过手写模拟，了解依赖注入，Aware回调等底层源码工作流程 
5. 通过手写模拟，了解Spring AOP的底层源码工作流程

### 扫描

1. 模拟了如何扫描类

   1. 拿到配置中要扫描的包，然后转为相对路径
   2. 使用classloader通过相对路径拿到资源的绝对路径URL
   3. 接着就可以可以通过URL创建一个File,

   ```java
   path = path.replace(".", "/");  //     com/zhouyu/service
   
   ClassLoader classLoader = ZhouyuApplicationContext.class.getClassLoader();
   // file:/D:/Github/learncode/spring/_01-spring-moni/target/classes/com/zhouyu/service
   URL resource = classLoader.getResource(path);
   
   File file = new File(resource.getFile());
   ```

   4. 通过判断这个File是不是目录，来遍历这个目录下的每个class文件，通过classLoader来加载这些class

      ```java
      Class<?> clazz = classLoader.loadClass(absolutePath);
      ```

   5. 判断是否标注了@Componet注解

      ```java
      clazz.isAnnotationPresent(Component.class)
      ```

2. 模拟实现了如何处理BeanPostProcessor，在扫面当中就实例化了

   ```java
   if (BeanPostProcessor.class.isAssignableFrom(clazz)) {
       BeanPostProcessor instance = (BeanPostProcessor) clazz.getConstructor().newInstance();
       beanPostProcessorList.add(instance);
   }
   ```

3. 模拟处理scope原型

   ```java
   if (clazz.isAnnotationPresent(Scope.class)) {
       Scope scopeAnnotation = clazz.getAnnotation(Scope.class);
       String value = scopeAnnotation.value();
       beanDefinition.setScope(value);
   } else {
       beanDefinition.setScope("singleton");
   }
   ```

4. 最后存放到BeanDefinitionMap中

   ```java
   beanDefinitionMap.put(beanName, beanDefinition);
   ```

   

### bean的生命周期

容器在扫描完beanDefinition后就会创建单例bean

```java
if (beanDefinition.getScope().equals("singleton")) {
    Object bean = createBean(beanName, beanDefinition);
    singletonObjects.put(beanName, bean);
}
```

1. 构造函数
2. 依赖注入
3. Aware函数调用
4. 处理BeanPostProcessor#postProcessBeforeInitialization
5. 处理InitializingBean#afterPropertiesSet
6. 处理BeanPostProcessor#postProcessAfterInitialization

::: details

```java
private Object createBean(String beanName, BeanDefinition beanDefinition) {
        Class clazz = beanDefinition.getType();

        Object instance = null;
        try {

            instance = clazz.getConstructor().newInstance();

            for (Field field : clazz.getDeclaredFields()) {
                if (field.isAnnotationPresent(Autowired.class)) {

                    field.setAccessible(true);

                    field.set(instance, getBean(field.getName()));
                }
            }

            if (instance instanceof BeanNameAware) {
                ((BeanNameAware)instance).setBeanName(beanName);
            }

            for (BeanPostProcessor beanPostProcessor : beanPostProcessorList) {
                instance = beanPostProcessor.postProcessBeforeInitialization(instance, beanName);
            }

            if (instance instanceof InitializingBean) {
                ((InitializingBean)instance).afterPropertiesSet();
            }

            for (BeanPostProcessor beanPostProcessor : beanPostProcessorList) {
                instance = beanPostProcessor.postProcessAfterInitialization(instance, beanName);
            }


        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }

        return instance;
    }



    public Object getBean(String beanName) {

        if (!beanDefinitionMap.containsKey(beanName)) {
            throw new NullPointerException();
        }

        BeanDefinition beanDefinition = beanDefinitionMap.get(beanName);

        if (beanDefinition.getScope().equals("singleton")) {
            Object singletonBean = singletonObjects.get(beanName);
            if (singletonBean == null) {
                singletonBean = createBean(beanName, beanDefinition);
                singletonObjects.put(beanName, singletonBean);
            }
            return singletonBean;
        } else {
            // 原型
            Object prototypeBean = createBean(beanName, beanDefinition);
            return prototypeBean;
        }

    }
```

:::

### BeanPostProcessor处理代理

```java
@Component
public class ZhouyuBeanPostProcessor implements BeanPostProcessor {

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) {

        if (beanName.equals("userService")) {
            Object proxyInstance = Proxy.newProxyInstance(ZhouyuBeanPostProcessor.class.getClassLoader(), bean.getClass().getInterfaces(), new InvocationHandler() {
                @Override
                public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                    // 切面
                    System.out.println("切面逻辑");

                    return method.invoke(bean, args);
                }
            });

            return proxyInstance;
        }

        // bean
        return bean;
    }
}

```

