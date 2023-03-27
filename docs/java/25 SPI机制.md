---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---

## SPI test

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