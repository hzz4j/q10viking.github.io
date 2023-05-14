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

| 约束               | 说明                           |
| ------------------ | ------------------------------ |
| @Size(max=3,min=0) | 限制字符长度必须在min到max之间 |
| @Leanth            | 限制字符长度必须在min到max之间 |



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



## Java项目使用

[hibernate validator 6.2官网文档](https://docs.jboss.org/hibernate/validator/6.2/reference/en-US/html_single/)

依赖

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





### 国际化

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

[这可能是你见过hibernate-validator最全国际化方案（下）-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/972246)

## 参考

[The Java Community Process(SM) Program - JSRs: Java Specification Requests - detail JSR# 380 (jcp.org)](https://jcp.org/en/jsr/detail?id=380)

[Java Bean Validation Basics | Baeldung](https://www.baeldung.com/javax-validation)

[Method Constraints with Bean Validation 2.0 | Baeldung](https://www.baeldung.com/javax-validation-method-constraints)