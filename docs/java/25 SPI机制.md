---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---

## SPI

SPI的全名为：Service Provider Interface。在java.util.ServiceLoader

我们系统里抽象的各个模块，往往有很多不同 的实现方案，比如日志模块的方案，xml解析模块、jdbc模块的方案等。面向的对象 的设计里，我们一般推荐模块之间基于接口编程，模块之间不对实现类进行硬编码。

一旦代码里涉及具体的实现类，就违反了可拔插的原则，如果需要替换一种实现， 就需要修改代码。为了实现在模块装配的时候能不在程序里动态指明，这就需要一 种服务发现机制

Java SPI 就是提供这样的一个机制：为某个接口寻找服务实现的机制。有点类似 IOC的思想，就是将装配的控制权移到程序之外，在模块化设计中这个机制尤其重要

Java SPI 的具体约定为:当服务的提供者，提供了服务接口的一种实现之后，在jar包 的META-INF/services/目录里同时创建一个以服务接口命名的文件。该文件里就是 实现该服务接口的具体实现类

而当外部程序装配这个模块的时候，就能通过该jar包META-INF/services/里的配置 文件找到具体的实现类名，并装载实例化，完成模块的注入



##  测试

```java
package org.hzz;

import java.util.ServiceLoader;

public class SpiTest {
    public static void main(String[] args) {
        ServiceLoader<Car> cars = ServiceLoader.load(Car.class);
        for(Car car: cars){
            System.out.println(car.getCarName());
        }
    }
}
/**
 black car
 red car
 */

```



## Car接口

```java
package org.hzz;

public interface Car {
    String getCarName();
}

```



### 实现类

```java
package org.hzz;

public class BlackCar implements Car{
    @Override
    public String getCarName() {
        return "black car";
    }
}

```

```java
package org.hzz;

public class RedCar implements Car{
    @Override
    public String getCarName() {
        return "red car";
    }
}
```



## Java SPI规范

```yaml
# org.hzz.Car 文件
org.hzz.BlackCar
org.hzz.RedCar
```

![image-20230327172156078](/images/java/image-20230327172156078.png)