---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /javahelper/
typora-root-url: ..\.vuepress\public
---

[MapStruct – Java bean mappings, the easy way!](https://mapstruct.org/)

::: tip

随着微服务和分布式应用程序迅速占领开发领域，数据完整性和安全性比以往任何时候都更加重要。在这些松散耦合的系统之间，安全的通信渠道和有限的数据传输是最重要的。大多数时候，终端用户或服务不需要访问模型中的全部数据，而只需要访问某些特定的部分。

数据传输对象(Data Transfer Objects, DTO)经常被用于这些应用中。DTO只是持有另一个对象中被请求的信息的对象。通常情况下，这些信息是有限的一部分。例如，在持久化层定义的实体和发往客户端的DTO之间经常会出现相互之间的转换。由于DTO是原始对象的反映，因此这些类之间的映射器在转换过程中扮演着关键角色。

这就是MapStruct解决的问题：手动创建bean映射器非常耗时。 但是该库可以自动生成Bean映射器类

:::

## 依赖配置

```xml
<properties>
    <org.mapstruct.version>1.5.5.Final</org.mapstruct.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>${org.mapstruct.version}</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.1</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
                <annotationProcessorPaths>
                    <path>
                        <groupId>org.mapstruct</groupId>
                        <artifactId>mapstruct-processor</artifactId>
                        <version>${org.mapstruct.version}</version>
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </plugin>
    </plugins>
</build>
```

### 与lombok集成🍎

[MapStruct 与lombok工作](https://mapstruct.org/documentation/stable/reference/html/#lombok)

```xml
<properties>
    <org.mapstruct.version>1.5.5.Final</org.mapstruct.version>
    <org.projectlombok.version>1.18.16</org.projectlombok.version>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>

<dependencies>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>${org.mapstruct.version}</version>
    </dependency>

    <!-- lombok dependency should not end up on classpath -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>${org.projectlombok.version}</version>
        <scope>provided</scope>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.1</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
                <annotationProcessorPaths>
                    <path>
                        <groupId>org.mapstruct</groupId>
                        <artifactId>mapstruct-processor</artifactId>
                        <version>${org.mapstruct.version}</version>
                    </path>
                    <path>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                        <version>${org.projectlombok.version}</version>
                    </path>

                    <!-- additional annotation processor required as of Lombok 1.18.16 -->
                    <path>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok-mapstruct-binding</artifactId>
                        <version>0.2.0</version>
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </plugin>
    </plugins>
</build>
```

## idea插件

[MapStruct Support - IntelliJ IDEs Plugin | Marketplace (jetbrains.com)](https://plugins.jetbrains.com/plugin/10036-mapstruct-support)

## Basic

> 目标将`SimpleSource`转换成`SimpleDestination`

```java
@Data
public class SimpleSource {
    private String name;
    private String description;
}

@Data
public class SimpleDestination {
    private String anotherName;
    private String anotherDescription;
}
```

> 编写一个mapper

```java
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper
public interface SimpleSourceToDestinationMapper {

    @Mappings(
            {
                    @Mapping(source = "name", target = "anotherName"),
                    @Mapping(source = "description", target = "anotherDescription")
            }
    )
    SimpleDestination sourceToDestination(SimpleSource source);
}
```



### 查看生成的中间代码

> `mvn clean install`会生成一个实现类 `SimpleSourceToDestinationMapperImpl`  实现了`SimpleSourceToDestinationMapper`

![image-20230602192326805](/images/javahelper/image-20230602192326805.png)

```java
public class SimpleSourceToDestinationMapperImpl implements SimpleSourceToDestinationMapper {
    public SimpleSourceToDestinationMapperImpl() {
    }

    public SimpleDestination sourceToDestination(SimpleSource source) {
        if (source == null) {
            return null;
        } else {
            SimpleDestination simpleDestination = new SimpleDestination();
            simpleDestination.setAnotherName(source.getName());
            simpleDestination.setAnotherDescription(source.getDescription());
            return simpleDestination;
        }
    }
}
```



### 测试

```java
@Test
public  void test() {
    SimpleSourceToDestinationMapper mapper = Mappers.getMapper(SimpleSourceToDestinationMapper.class);
    SimpleSource simpleSource = new SimpleSource();
    simpleSource.setName("hzz");
    simpleSource.setDescription("Q10Viking learning mapstruct tutorial");

    SimpleDestination simpleDestination = mapper.sourceToDestination(simpleSource);
    assertEquals(simpleSource.getName(), simpleDestination.getAnotherName());
    assertEquals(simpleSource.getDescription(), simpleDestination.getAnotherDescription());
}
```



## 与springboot集成

> mapper可以注册成bean,交给spring管理

```java
@Mapper(componentModel = "spring")
public abstract class CarandCarDTOMapper {
    //  not to make the injected bean private
    // 如： private CarService carService; 因为mapstruct要继承这个类，所以不能private
    @Autowired
    protected CarService carService;

    @Mapping(target = "details", source = "description")
    @Mapping(target = "name", expression = "java(carService.enrichName(carDto.getCarName()))")
    public abstract Car carDtoToCar(CarDto carDto);
}

@Service
public class CarService {
    public String enrichName(String name) {
        return "-:: " + name + " ::-";
    }
}
```

> 测试

```java
@RunWith(SpringRunner.class)
@SpringBootTest
@Slf4j
public class CarAndCarDTOMapperTest {

    @Autowired
    private CarandCarDTOMapper carandCarDTOMapper;

    @Test
    public void test() {
        CarDto carDto = new CarDto();
        carDto.setCarName("大众奔驰");
        carDto.setDescription("不怕奔驰和路虎，就怕大众带字母");

        Car car = carandCarDTOMapper.carDtoToCar(carDto);
        log.info(car.toString());
        assertEquals(car.getName(), "-:: 大众奔驰 ::-");
        assertEquals(car.getDetails(), carDto.getDescription());
    }
}
```



### 中间生成的代码的形式

```java
@Component
public class CarandCarDTOMapperImpl extends CarandCarDTOMapper {
    public CarandCarDTOMapperImpl() {
    }

    public Car carDtoToCar(CarDto carDto) {
        if (carDto == null) {
            return null;
        } else {
            Car car = new Car();
            car.setDetails(carDto.getDescription());
            car.setName(this.carService.enrichName(carDto.getCarName()));
            return car;
        }
    }
}
```



## 参考

[Quick Guide to MapStruct | Baeldung](https://www.baeldung.com/mapstruct)

[MapStruct 1.5.5.Final Reference Guide官方文档](https://mapstruct.org/documentation/stable/reference/html/)

[MapStruct 与lombok工作](https://mapstruct.org/documentation/stable/reference/html/#lombok)