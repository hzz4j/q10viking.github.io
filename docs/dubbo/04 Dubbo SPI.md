---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Docker/
typora-root-url: ..\.vuepress\public
---



::: tip

Dubbo中的SPI与Java本身的SPI的优势。能够根据指定的参数，加载具体的类。

:::



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

