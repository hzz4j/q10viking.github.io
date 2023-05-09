---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



::: tip

Dubbo中的SPI与Java本身的SPI的优势。能够根据指定的参数，加载具体的类。并且提供了属性注入的功能

[Source Code](https://github.com/Q10Viking/learncode/tree/main/dubbo/dubbo-SPI/spi)

:::

![image-20230509144422461](/images/dubbo/image-20230509144422461.png)



## dubbo SPI案例

```java
// 拿到Protocol接口扩展点加载器
ExtensionLoader<Protocol> extensionLoader = ExtensionLoader.getExtensionLoader(Protocol.class);
// 加载具体的协议实现类
Protocol http = extensionLoader.getExtension("dubbo");
System.out.println(http);
```



### 模拟案例

> 注意接口上要标注`@SPI`注解，表示该接口是一个扩展点

:::: code-group
::: code-group-item Car

```java
@SPI // 1. @SPI标注在接口上，表示该接口是一个扩展点
public interface Car {
    void name();
}
```
:::
::: code-group-item RedCar
```java
public class RedCar implements Car{
    @Override
    public void name() {
        System.out.println("I am a red car");
    }
}
```
:::
::: code-group-item BlackCar
```java
public class BlackCar implements Car{
    @Override
    public void name() {
        System.out.println("I am a black car");
    }
}
```
:::
::::



> 配置

![image-20230509112721385](/images/dubbo/image-20230509112721385.png)

```
red=org.hzz.car.RedCar
black=org.hzz.car.BlacAkCar
```



>  测试

```java
public class SPIMain {
    public static void main(String[] args) {
        ExtensionLoader<Car> extensionLoader = ExtensionLoader.getExtensionLoader(Car.class);
        Car car = extensionLoader.getExtension("black");
        car.name();
    }
}
/**output
 * I am a black car
 */
```





### 自动注入与切面

> Dubbo里面的Wrapper类，通过构造来判断是否是wrapper类

定义一个`CarWrapper`，Dubbo的自动注入体现在，会通过构造方法传入具体的Car的实现类，切面体现在方法被CarWrapper类的方法增强

```java
public class CarWrapper implements Car{
    private Car car;

    public CarWrapper(Car car) {
        this.car = car;
    }

    @Override
    public void name() {
        System.out.println("I am a car wrapper");
        car.name();
    }
}
```



> 配置

```java
red=org.hzz.car.RedCar
black=org.hzz.car.BlackCar
org.hzz.car.CarWrapper
```



> 测试

```java
public class SPIMain {
    public static void main(String[] args) {
        ExtensionLoader<Car> extensionLoader = ExtensionLoader.getExtensionLoader(Car.class);
        Car car = extensionLoader.getExtension("black");
        car.name();
    }
}
/**output
 * I am a car wrapper
 * I am a black car
 */
```



### dubbo如何判断类是一个wrapper

```java

/**
     * test if clazz is a wrapper class
     * <p>
     * which has Constructor with given class type as its only argument
     */
protected boolean isWrapperClass(Class<?> clazz) {
    Constructor<?>[] constructors = clazz.getConstructors();
    for (Constructor<?> constructor : constructors) {
        if (constructor.getParameterTypes().length == 1 && constructor.getParameterTypes()[0] == type) {
            return true;
        }
    }
    return false;
}
```



## 原理

```java
public class DubboLoadingStrategy implements LoadingStrategy {

    @Override
    public String directory() {
        return "META-INF/dubbo/";
    }
```





## URL设计(SPI的依赖注入)

> `org.apache.dubbo.common.URL`



> Car.`@Adaptive`标注在方法上，表示该方法是一个自适应扩展点，会生成一个代理类

:::: code-group
::: code-group-item Car

```java
@SPI // 1. @SPI标注在接口上，表示该接口是一个扩展点
public interface Car {

    @Adaptive // 2. @Adaptive标注在方法上，表示该方法是一个自适应扩展点
    void name(URL url);
}
```

:::
::: code-group-item RedCar

```java
public class RedCar implements Car{
    @Override
    public void name(URL url) {
        System.out.println("I am a red car");
    }
}
```

:::
::: code-group-item BlackCar

```java
public class BlackCar implements Car{
    @Override
    public void name(URL url) {
        System.out.println("I am a black car");
    }
}
```

:::

::: code-group-item CarWrapper

```java
public class BlackCar implements Car{
    @Override
    public void name() {
        System.out.println("I am a black car");
    }
}
```

:::

::::



> 第一个Person，BlackPerson为了依赖注入的时候，指定注入的是什么Car。代理对象Adaptive.

:::: code-group
::: code-group-item BlackPerson

```java
public class BlackPerson implements Person{
    private Car car;    // Adaptive代理类

    public void setCar(Car car){
        this.car = car;
    }
    @Override
    public Car getCar() {
        System.out.println("I am a black person");
        return this.car;
    }
}
```

:::
::: code-group-item Person

```java
@SPI
public interface Person {
    Car getCar();
}
```

:::
::::

> 依赖注入的时候，根据名字和类型，会从Spring容器中获取，获取不到再从SPI中获取，spi会产生一个代理对象Adaptive

![image-20230509131907068](/images/dubbo/image-20230509131907068.png)

Dubbo框架依赖了Spring框架

![image-20230509144904455](/images/dubbo/image-20230509144904455.png)





走SPI和生成一个代理对象赋值给属性Car。下面的代码是`AdaptiveClassCodeGenerator`生成的

```java
package org.hzz.car;
import org.apache.dubbo.rpc.model.ScopeModel;
import org.apache.dubbo.rpc.model.ScopeModelUtil;

public class Car$Adaptive implements org.hzz.car.Car {
    public void name(org.apache.dubbo.common.URL arg0)  {
        
        if (arg0 == null) 
            throw new IllegalArgumentException("url == null");
        
        org.apache.dubbo.common.URL url = arg0;
        
        String extName = url.getParameter("car");
        
        if(extName == null) 
            throw new IllegalStateException("Failed to get extension (org.hzz.car.Car) name from url (" 
                                            + url.toString() + ") use keys([car])");
        
        ScopeModel scopeModel = ScopeModelUtil.getOrDefault(url.getScopeModel(), org.hzz.car.Car.class);
        
        org.hzz.car.Car extension = (org.hzz.car.Car)scopeModel.getExtensionLoader(org.hzz.car.Car.class).getExtension(extName);
        
        extension.name(arg0);
    }
}
```

生成这段代码之后底层通过`javassist`进行编译成class

> `org.apache.dubbo.common.compiler.support.JavassistCompiler#doCompile`

```java

/**
* 参数：
* neighbor：interface org.hzz.car.Car
* classloader: ClassLoader$AppClassLoader
* name: org.hzz.car.Car$Adaptive
* source: 就是上面的生成的字符串代码
*/

@Override
public Class<?> doCompile(Class<?> neighbor, ClassLoader classLoader, String name, String source) throws Throwable {
    CtClassBuilder builder = new CtClassBuilder();
    builder.setClassName(name);

    // process imported classes
    Matcher matcher = IMPORT_PATTERN.matcher(source);
    while (matcher.find()) {
        builder.addImports(matcher.group(1).trim());
    }

    // process extended super class
    matcher = EXTENDS_PATTERN.matcher(source);
    if (matcher.find()) {
        builder.setSuperClassName(matcher.group(1).trim());
    }

    // process implemented interfaces
    matcher = IMPLEMENTS_PATTERN.matcher(source);
    if (matcher.find()) {
        String[] ifaces = matcher.group(1).trim().split("\\,");
        Arrays.stream(ifaces).forEach(i -> builder.addInterface(i.trim()));
    }

    // process constructors, fields, methods
    String body = source.substring(source.indexOf('{') + 1, source.length() - 1);
    String[] methods = METHODS_PATTERN.split(body);
    String className = ClassUtils.getSimpleClassName(name);
    Arrays.stream(methods).map(String::trim).filter(m -> !m.isEmpty()).forEach(method -> {
        if (method.startsWith(className)) {
            builder.addConstructor("public " + method);
        } else if (FIELD_PATTERN.matcher(method).matches()) {
            builder.addField("private " + method);
        } else {
            builder.addMethod("public " + method);
        }
    });

    // compile
    CtClass cls = builder.build(classLoader);

    ClassPool cp = cls.getClassPool();
    if (classLoader == null) {
        classLoader = cp.getClassLoader();
    }
    cp.insertClassPath(new LoaderClassPath(classLoader));
    cp.insertClassPath(new DubboLoaderClassPath());

    try {
        return cp.toClass(cls, neighbor, classLoader, JavassistCompiler.class.getProtectionDomain());
    } catch (Throwable t) {
        if (!(t instanceof CannotCompileException)) {
            return cp.toClass(cls, classLoader, JavassistCompiler.class.getProtectionDomain());
        }
        throw t;
    }
}
```

### 测试

```java
public class SPIMain {
    public static void main(String[] args) {
        ExtensionLoader<Person> extensionLoader = ExtensionLoader.getExtensionLoader(Person.class);
        Person person = extensionLoader.getExtension("black");
        URL url = new URL("dubbo", "localhost", 8080);
        url = url.addParameter("car", "black");
        person.getCar().name(url);
        System.out.println(person.getCar());
    }
}
/**output
 * I am a black person
 * I am a car wrapper
 * I am a black car
 * I am a black person
 * org.hzz.car.Car$Adaptive@180da663
 */
```

