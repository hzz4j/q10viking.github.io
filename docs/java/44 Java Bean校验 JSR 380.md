---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---





## 分层验证与JavaBean验证模型

验证框架主要分为两种，即分层验证与JavaBean验证

### 分层验证模型

传统的校验模式，即每一层都添加数据验证。但是其验证逻辑重复性大，会出现冗余代码过多的情况

![image-20230514140219950](/images/java/image-20230514140121762.png)



### Java Bean验证模型

[Hibernate Validator 8.0.0.Final - Jakarta Bean Validation Reference Implementation: Reference Guide (jboss.org)](https://docs.jboss.org/hibernate/stable/validator/reference/en-US/html_single/#preface)

JavaBean验证模式指向接收数据时，将校验逻辑绑定在领域模型中，也就是Java Bean中。将域类与验证代码绑定，验证代码实际上是关于类本身的元数据

> Bean Validation为Java Bean验证定义了相应的元数据模型和API

![application layers2](/images/java/application-layers2.png)



## JSR 380

[The Java Community Process(SM) Program - JSRs: Java Specification Requests - detail JSR# 380 (jcp.org)](https://jcp.org/en/jsr/detail?id=380)

Java EE和Java SE的java bean校验的api规范。

> The technical objective of this work is to provide an object level constraint declaration(约束声明) and validation facility（验证工具） for the Java application developer, as well as a constraint metadata repository and query API

- JSR303: Bean Validation 1.0
- JSR349: Bean Validation 1.1
- JSR380: Bean Validation 2.0



## Bean Validation和Hibernate Validator

1. Bean Validation只是规范
2. Hibernate Validator是实现



> 目前最新Hibernate8.0实现了Bean Validation 3.0

| [Java](https://www.oracle.com/technetwork/java/javase/downloads/index.html) | 11 or 17 |
| ------------------------------------------------------------ | -------- |
| [Jakarta Bean Validation](https://beanvalidation.org/)       | 3.0      |
| [Jakarta EE](https://jakarta.ee/)                            | 10       |

> 由于我机器上是Java8 ，我们采用Hibernate6.2的版本，进行学习，参考版本：[6.2 series - Hibernate Validator](https://hibernate.org/validator/releases/6.2/)

| [Java](https://www.oracle.com/technetwork/java/javase/downloads/index.html) | 8, 11 or 17 |
| ------------------------------------------------------------ | ----------- |
| [Jakarta Bean Validation](https://beanvalidation.org/)       | 2.0         |
| [Java EE](https://www.oracle.com/java/technologies/java-ee-glance.html) | 8           |
| [Jakarta EE](https://jakarta.ee/)                            | 8           |



## Hibernate Validation与Spring Validation

Spring Validation是在Hibernate Validation基础之上的二次封装，以满足Spring环境中更简单，高效的数据验证。

[Java Bean Validation :: Spring Framework](https://docs.spring.io/spring-framework/reference/core/validation/beanvalidation.html)

## 常用约束注解

### 空/非空约束

| 约束      | 说明                                                         |
| --------- | ------------------------------------------------------------ |
| @Null     | 限制只能为null                                               |
| @NotNull  | 限制必须不为NULL                                             |
| @NotEmpty | 验证注解的元素值不为Null且不为空（字符串长度不为0，集合大小不为0） |
| @NotBlack | 验证注解的元素值不为空（不为Null，去除首位空格后长度为0），不同于@NotEmpty，@NotBlank只应用于字符串且在比较时会去除字符串的空格 |



### Boolean值约束

| 约束         | 说明            |
| ------------ | --------------- |
| @AssertFalse | 限制必须为False |
| @AssertTrue  | 限制必须为true  |



### 长度约束

| 约束               | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| @Size(max=3,min=0) | 限制字符长度必须在min到max之间，应用在字符串，List集合等中，不能用于Integer |
| @Leanth            | 限制字符长度必须在min到max之间                               |



### 日期约束

| 约束             | 说明                     |
| ---------------- | ------------------------ |
| @Future          | 限制日期为当前时间之后   |
| @FutureOrPresent | 限制日期为当前时间或之后 |
| @Past            | 限制日期为当前时间之前   |
| @PastOrPresent   | 限制日期为当前时间或之前 |

### 数值约束

| 约束                      | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| @Max(Value)               | 限制必须为一个不大于指定值的数字                             |
| @Min（Value）             | 限制必须为一个不小于指定值的数字                             |
| @DecimalMin(value)        | 限制必须为一个不小于指定值的数字                             |
| @DecimalMax(value)        | 限制必须为一个不小于指定值的数字                             |
| @Digits(integer,fraction) | 限制必须为小数，且整数部分的位数不能超过Integer，小数部分的位数不能超过fraction |
| @Negative                 | 限制必须为负整数                                             |
| @NegativeOrZero(value)    | 限制必须为负整数或零                                         |
| @Positive(value)          | 限制必须为正整数                                             |
| @PositiveOrZero(value)    | 限制必须为正整数或零                                         |



### 其他

| 约束            | 说明                         |
| --------------- | ---------------------------- |
| @Pattern(Value) | 限制必须符合指定的正则表达式 |
| @Email          | 限制必须为email格式          |
| @Valid          | 级联验证                     |



## Java项目使用❤️

[hibernate validator 6.2官网文档](https://docs.jboss.org/hibernate/validator/6.2/reference/en-US/html_single/)

依赖

[Source Code](https://github.com/Q10Viking/learncode/tree/main/validation/hibernate-use/src/main/java/org/hzz/basic)

hiberate validator需要`jakarta.el`依赖是因为，message在定义的时候，可能会使用到表达式，如`必须小于${inclusive == true ? '或等于' : ''}{value}`

```java

<dependency>
    <groupId>org.hibernate.validator</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>6.2.5.Final</version>
</dependency>
    
<dependency>
    <groupId>org.glassfish</groupId>
    <artifactId>jakarta.el</artifactId>
    <version>3.0.3</version>
</dependency>
```

> 定义一个User Java Bean对象

```java
@Data
public class User {
    @NotNull(message = "用户ID不能为空")
    private String userId;
    @NotNull
    private String userName;
}
```



> 测试

```java
public class ValidatorUserDemo {

    // 验证器
    private Validator validator;
    // 待验证的对象
    private User user;
    // 验证结果
    private Set<ConstraintViolation<User>> result;


    @BeforeEach
    public void init(){
        System.out.println("init");
        validator = Validation.buildDefaultValidatorFactory().getValidator();
        user = new User();
    }

    @Test
    public void test(){
        // 验证
       result = validator.validate(user);
    }

    @AfterEach
    public void print(){
        result.forEach(System.out::println);
        System.out.println("-------------------------");
        result.forEach(r->{
            System.out.println(r.getMessage());
        });
    }
}
/**
 * ConstraintViolationImpl{interpolatedMessage='用户ID不能为空', propertyPath=userId, rootBeanClass=class org.hzz.basic.User, messageTemplate='用户ID不能为空'}
 * ConstraintViolationImpl{interpolatedMessage='不能为null', propertyPath=userName, rootBeanClass=class org.hzz.basic.User, messageTemplate='{javax.validation.constraints.NotNull.message}'}
 * -------------------------
 * 用户ID不能为空
 * 不能为null
 */
```

## 国际化

```java
// 这样指定只能是中文
@NotNull(message = "用户ID不能为空")
private String userId;
//-------------------------------------------------------
@NotNull  // message默认的值是"{javax.validation.constraints.NotNull.message}"
private String userName;
```

上面的代码这样第一个只能写定为中文了，而第二我们不指定，默认会使用`{}`包裹的hibernate validation提供的国际化.

```sh
ValidationMessages.properties
ValidationMessages_ar.properties
ValidationMessages_cs.properties
ValidationMessages_da.properties
ValidationMessages_de.properties
ValidationMessages_en.properties
ValidationMessages_es.properties
ValidationMessages_fa.properties
ValidationMessages_fr.properties
ValidationMessages_hu.properties
ValidationMessages_it.properties
ValidationMessages_ja.properties
ValidationMessages_ko.properties
ValidationMessages_mn_MN.properties
ValidationMessages_nl.properties
ValidationMessages_pl.properties
ValidationMessages_pt_BR.properties
ValidationMessages_ro.properties
ValidationMessages_ru.properties
ValidationMessages_sk.properties
ValidationMessages_tr.properties
ValidationMessages_uk.properties
ValidationMessages_zh.properties
ValidationMessages_zh_CN.properties
ValidationMessages_zh_TW.properties
```

> 但是我们要实现我们自定义的国际化内容。

### 实现自定国际化与hibernate validator兼容👍

[Source Code](https://github.com/Q10Viking/learncode/tree/main/validation/hibernate-use/src/main/java/org/hzz/i18n)

> 创建

```java
/**
 * 继承它ResourceBundleMessageInterpolator
 * 是为了使用hirbernate validator提供的默认的国际化,因为他们的文件是ValidationMessages_zh.properties
 * 不像我们自己的文件是user_zh.properties
 * 也就是说我们既能使用我们自己国际化，又能使用hibernate validator提供的默认的国际化
 */
public class MyMessageInterpolator extends ResourceBundleMessageInterpolator {
    private static final String path = "i18n/user";
    // hibernate validator的写法
//    private static final String path = "i18n.user";
    public MyMessageInterpolator(){
        // 指定ResourceBundleLocator
        super(new PlatformResourceBundleLocator(path));
    }

    @Override
    public String interpolate(String messageTemplate, Context context) {
        String result = super.interpolate(messageTemplate, context);
        return result;
    }

    @Override
    public String interpolate(String messageTemplate, Context context, Locale locale) {
        // 这个方法没用到
        return null;
    }
}
```

> User

```java
@Data
public class User {

    @NotNull(message = "{user.id.notnull}")
    private String userId;
    @NotNull
    // 未指定,使用hibernate validator提供的默认的国际化
    // "{javax.validation.constraints.NotNull.message}"
    private String userName;
}
```



> 测试

```java
public class ValidatorUserDemo {

    // 验证器
    private Validator validator;
    // 待验证的对象
    private User user;
    // 验证结果
    private Set<ConstraintViolation<User>> result;


    @BeforeEach
    public void init(){
        // 设置默认的locale
        // 因为Hibernator的ResourceBundleMessageInterpolator默认使用的是Locale.getDefault()
//        Locale.setDefault(Locale.JAPAN);
//        Locale.setDefault(Locale.ENGLISH);
        Locale.setDefault(Locale.CHINESE);

        validator = Validation.byDefaultProvider()
                .configure()
                .messageInterpolator(new MyMessageInterpolator())
                .buildValidatorFactory()
                .getValidator();

        user = new User();
    }

    @Test
    public void test(){
        // 验证
       result = validator.validate(user);
    }

    @AfterEach
    public void print(){
        result.forEach(System.out::println);
        System.out.println("-------------------------");
        result.forEach(r->{
            System.out.println(r.getMessage());
        });
    }
}
/**
 * ConstraintViolationImpl{interpolatedMessage='不得为 null', propertyPath=userName, rootBeanClass=class org.hzz.i18n.User, messageTemplate='{javax.validation.constraints.NotNull.message}'}
 * ConstraintViolationImpl{interpolatedMessage='userID不能为null', propertyPath=userId, rootBeanClass=class org.hzz.i18n.User, messageTemplate='{user.id.notnull}'}
 * -------------------------
 * 不得为 null
 * userID不能为null
 */
```





### 能够兼容的原理

我们的类继承了ResourceBundleMessageInterpolator，在继承类中我们指定了user ResourceBundle的位置。而hibernate validator默认也有个位置，所以就有了两个位置

```java
userResourceBundleLocator--->  i18n.user
defaultResourceBundleLocator---> org.hibernate.validator.ValidationMessages
```

先从用户的指定的ResourceBundle获取，获取不到再从default的获取





### IDEA操作Resouce Bundle

[Resource bundles | IntelliJ IDEA Documentation (jetbrains.com)](https://www.jetbrains.com/help/idea/resource-bundle.html)

![image-20230514165634260](/images/java/image-20230514165634260.png)

效果

![image-20230514165702356](/images/java/image-20230514165702356.png)



安装一个`Resource Bundle Editor`，方便我们快速编辑

![image-20230514165953524](/images/java/image-20230514165953524.png)



> 效果: 没有语言的为默认的

![image-20230514170103501](/images/java/image-20230514170103501.png)

![image-20230514170615440](/images/java/image-20230514170615440.png)



### 中文ISO-8859-1idea显示

[IDEA中properties配置文件的创建及中文乱码问题](https://blog.csdn.net/weixin_41685100/article/details/79292785)

![image-20230514190555571](/images/java/image-20230514190555571.png)



## 值替换研究👍

研究参数是如何设置进去的

```sh
@Size(min = 1, max = 5, message = "用户密码长度必须在{min}和{max}之间")
private String somv = "123456789";
```

为什么最终能够输出：`用户密码长度必须在1和5之间`,为什么能够替换

底层原理是在解析Size这个注解的时候，会存储一个map,里面的值是`<min,1>`，`<max,5>`,在解析message的时候会进行替换。



----------



## 级联验证❤️

[Source Code](https://github.com/Q10Viking/learncode/tree/main/validation/hibernate-use/src/main/java/org/hzz/cascade)

```java
@Data
public class User {
    @NotNull(message = "用户ID不能为空")
    private String userId;
   // -------------级联验证---------------------------
//    @Valid
//    private Address address;

//    @Valid
//    private List<Address> addressList;
    private List< @Valid Address> addressList;
}

@Data
public class Address {
    @NotBlank(message = "省份不能为空")
    private String province;
    @NotBlank(message = "城市不能为空")
    private String city;
}
```

```java
城市不能为空
省份不能为空
用户ID不能为空
```



## 分组验证❤️

[Source Code](https://github.com/Q10Viking/learncode/tree/main/validation/hibernate-use/src/main/java/org/hzz/group)

比如在User中，

- 用户登录的时候是需要userId的，并不需要email.
- 用户注册的时候需要email，而并不需要userId

那么这时候，就使用到了分组验证

```java
@Data
public class User {
    public interface LoginGroup{}
    public interface RegisterGroup{}

    @NotNull(message = "用户ID不能为空", groups = {LoginGroup.class})
    private String userId;

    // 需要验证
    @NotBlank(message = "用户名不能为空",groups = {LoginGroup.class,RegisterGroup.class})
    // 不能写成 因为如果写成下面这样，属于默认组Default.class
    //@NotBlank(message = "用户名不能为空") 
    private String userName;

    @NotBlank(message = "邮箱不能为空", groups = {RegisterGroup.class})
    private String email;
}
```



> 测试

```java
@Test
public void validate() {
    /**
         * 邮箱不能为空
         * 用户名不能为空
         */
    //result = validator.validate(user, User.RegisterGroup.class);

    /**
         * 用户ID不能为空
         * 用户名不能为空
         */
    result = validator.validate(user, User.LoginGroup.class);
}
```



## 组序列❤️

[Source Code](https://github.com/Q10Viking/learncode/tree/main/validation/hibernate-use/src/main/java/org/hzz/order)

> 有一个默认组Hibernate validation提供的

```java
import lombok.Data;

import javax.validation.GroupSequence;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.groups.Default;

@Data
public class User {
    public interface LoginGroup{}
    public interface RegisterGroup{}

    // 组排序,先验证Default.class,再验证LoginGroup.class,最后验证RegisterGroup.class
    // 如果前面的验证失败,后面的验证不会执行
    @GroupSequence({
            Default.class,
            LoginGroup.class,
            RegisterGroup.class
    })
    public interface Group{}

    @NotNull(message = "用户ID不能为空", groups = {LoginGroup.class})
    private String userId;

    // 需要验证 属于默认组
    @NotBlank(message = "用户名不能为空")
    private String userName;

    @NotBlank(message = "邮箱不能为空", groups = {RegisterGroup.class})
    private String email;
}
```







## 参考

[The Java Community Process(SM) Program - JSRs: Java Specification Requests - detail JSR# 380 (jcp.org)](https://jcp.org/en/jsr/detail?id=380)

[Java Bean Validation Basics | Baeldung](https://www.baeldung.com/javax-validation)

[Method Constraints with Bean Validation 2.0 | Baeldung](https://www.baeldung.com/javax-validation-method-constraints)

[这可能是你见过hibernate-validator最全国际化方案（下）-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/972246)

[Bean Validation完结篇：你必须关注的边边角角（约束级联、自定义约束、自定义校验器、国际化失败消息...） - YourBatman - 博客园 (cnblogs.com)](https://www.cnblogs.com/yourbatman/p/11285677.html)